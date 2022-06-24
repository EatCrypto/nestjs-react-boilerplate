import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { DAILY_CALORIE_THRESHOLD, MONTHLY_COST_LIMIT } from 'src/constants';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enum/role.enum';
import { Between, Repository } from 'typeorm';
import { AdminCreateFoodDto } from './dto/admin-create-food.dto';
import { CreateFoodDto } from './dto/create-food.dto';
import { GetDailyThresholdDto } from './dto/get-daily-threshold.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private foodsRepository: Repository<Food>,
  ) {}

  async create(user: User, createFoodDto: CreateFoodDto) {
    const usedCost = await this.getUserMonthlyCost(user.id);
    const usedCalories = await this.getDayThreshold(
      user,
      DateTime.fromISO(createFoodDto.takenAt),
    );
    if (usedCalories > DAILY_CALORIE_THRESHOLD) {
      throw new Error(
        `You already used ${usedCalories} calories for the selected date. Daily threshold limit is ${DAILY_CALORIE_THRESHOLD}!`,
      );
    }

    if (usedCost > MONTHLY_COST_LIMIT) {
      throw new Error(
        `You spent ${usedCost} for the month. Monthly cost limit is ${MONTHLY_COST_LIMIT}!`,
      );
    }

    return await this.foodsRepository.save({ ...createFoodDto, user });
  }

  async adminCreate(adminCreateFoodDto: AdminCreateFoodDto) {
    const sum = await this.getUserMonthlyCost(adminCreateFoodDto.userId);

    if (sum > MONTHLY_COST_LIMIT) {
      throw new Error('Reached monthly cost limit!');
    }

    return await this.foodsRepository.save({
      ...adminCreateFoodDto,
      user: { id: adminCreateFoodDto.userId },
    });
  }

  async findAll(user: User) {
    return await this.foodsRepository.find({
      where: {
        user: user.role === Role.Admin ? undefined : user,
      },
      order: {
        takenAt: 'DESC',
      },
    });
  }

  async getDayThreshold(user: User, date: DateTime) {
    const { sum } = await this.foodsRepository
      .createQueryBuilder('food')
      .select('SUM(food.calorie) as sum')
      .where({ user, takenAt: Between(date.startOf('day'), date.endOf('day')) })
      .getRawOne<{ sum: number }>();

    return sum;
  }

  async getDailyThreshold(user: User) {
    const result = await this.foodsRepository
      .createQueryBuilder('food')
      .select(
        `
        SUM(food.calorie) as sum,
        to_char(food.takenAt, 'YYYY-MM-DD') as date
      `,
      )
      .where({ user })
      .groupBy('date')
      .getRawMany<GetDailyThresholdDto>();

    return result;
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    return await this.foodsRepository.save({
      id,
      ...updateFoodDto,
    });
  }

  async remove(id: number) {
    await this.foodsRepository.delete(id);
  }

  async getUserMonthlyCost(userId: number) {
    const monthStart = DateTime.now().startOf('month');
    const monthEnd = DateTime.now().endOf('month');

    const { sum } = await this.foodsRepository
      .createQueryBuilder('food')
      .select('SUM(food.price)', 'sum')
      .where({
        takenAt: Between(monthStart, monthEnd),
        user: { id: userId },
      })
      .getRawOne<{ sum: number }>();

    return sum;
  }
}
