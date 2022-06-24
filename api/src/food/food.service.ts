import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { DAILY_CALORIE_THRESHOLD, MONTHLY_COST_LIMIT } from 'src/constants';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/enum/role.enum';
import { Between, Repository } from 'typeorm';
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

  async create(userId: number, createFoodDto: CreateFoodDto) {
    await this.validateUserLimit(userId, createFoodDto.takenAt);

    return await this.foodsRepository.save({
      ...createFoodDto,
      user: { id: userId },
    });
  }

  async validateUserLimit(userId: number, isoDate: string) {
    const dateTime = DateTime.fromISO(isoDate);
    const usedCost = await this.getUserMonthlyCost(userId, dateTime);
    const usedCalories = await this.getDayThreshold(userId, dateTime);
    if (usedCalories > DAILY_CALORIE_THRESHOLD) {
      throw new Error(
        `You already used ${usedCalories} calories for the selected date - ${dateTime.toFormat(
          'yyyy/MM/dd',
        )}. Daily threshold limit is ${DAILY_CALORIE_THRESHOLD}!`,
      );
    }

    if (usedCost > MONTHLY_COST_LIMIT) {
      throw new Error(
        `You spent ${usedCost} for the month - ${dateTime.toFormat(
          'yyyy/MM',
        )}. Monthly cost limit is ${MONTHLY_COST_LIMIT}!`,
      );
    }
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

  async getDayThreshold(userId: number, date: DateTime) {
    const { sum } = await this.foodsRepository
      .createQueryBuilder('food')
      .select('SUM(food.calorie) as sum')
      .where({
        user: { id: userId },
        takenAt: Between(date.startOf('day'), date.endOf('day')),
      })
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
    const food = await this.foodsRepository.findOne(id, {
      relations: ['user'],
    });

    await this.validateUserLimit(food.user.id, updateFoodDto.takenAt);
    return await this.foodsRepository.save({
      id,
      ...updateFoodDto,
    });
  }

  async remove(id: number) {
    await this.foodsRepository.delete(id);
  }

  async getUserMonthlyCost(userId: number, date: DateTime) {
    const monthStart = date.startOf('month');
    const monthEnd = date.endOf('month');

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
