import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { DAILY_CALORIE_THRESHOLD, MONTHLY_COST_LIMIT } from 'src/constants';
import { User } from 'src/user/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { AverageEntriesAddedPerUserDto } from './dto/average-entries-added-per-user.dto';
import { CreateFoodDto } from './dto/create-food.dto';
import { EntriesReportPerWeekDto } from './dto/entries-report-per-week.dto';
import { GetDailyThresholdDto } from './dto/get-daily-threshold.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private foodsRepository: Repository<Food>,
  ) {}

  async create(input: CreateFoodDto) {
    const { userId, ...restInput } = input;
    await this.validateUserLimit(
      userId,
      restInput.takenAt,
      restInput.calorie,
      restInput.price,
    );

    return await this.foodsRepository.save({
      ...restInput,
      user: { id: userId },
    });
  }

  async validateUserLimit(
    userId: number,
    isoDate: string,
    calorie: number,
    price: number,
  ) {
    const dateTime = DateTime.fromISO(isoDate);
    const usedCost = await this.getUserMonthlyCost(userId, dateTime);
    const usedCalories = await this.getDayThreshold(userId, dateTime);
    if (usedCalories + calorie > DAILY_CALORIE_THRESHOLD) {
      throw new Error(
        `You already used ${usedCalories} calories for the selected date - ${dateTime.toFormat(
          'yyyy/MM/dd',
        )}. Daily threshold limit is ${DAILY_CALORIE_THRESHOLD}!`,
      );
    }

    if (usedCost + price > MONTHLY_COST_LIMIT) {
      throw new Error(
        `You spent ${usedCost} for the month - ${dateTime.toFormat(
          'yyyy/MM',
        )}. Monthly cost limit is ${MONTHLY_COST_LIMIT}!`,
      );
    }
  }

  async list(userId: number) {
    const result = await this.foodsRepository
      .createQueryBuilder('food')
      .select('food.name')
      .where({ user: { id: userId } })
      .distinctOn(['food.name'])
      .orderBy('food.name', 'ASC')
      .getMany();

    return result.map((row) => row.name);
  }

  async findAll(userId: number, start: string, end: string) {
    let query = this.foodsRepository
      .createQueryBuilder('food')
      .where({ user: { id: userId } });

    if (start && end) {
      query = query.andWhere({
        takenAt: Between(
          DateTime.fromISO(start).startOf('day'),
          DateTime.fromISO(end).endOf('day'),
        ),
      });
    }
    query = query.orderBy('food.takenAt', 'DESC');

    return await query.getMany();
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

    await this.validateUserLimit(
      food.user.id,
      updateFoodDto.takenAt,
      updateFoodDto.calorie,
      updateFoodDto.price,
    );
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

  async entriesReportPerWeek(): Promise<EntriesReportPerWeekDto> {
    const oneWeekAgoStart = DateTime.now().minus({ days: 7 }).startOf('day');

    const lastWeekEntries = await this.foodsRepository.count({
      where: {
        takenAt: Between(oneWeekAgoStart, DateTime.now()),
      },
    });

    const priorToLastWeekEntries = await this.foodsRepository.count({
      where: {
        takenAt: Between(
          oneWeekAgoStart.minus({ days: 7 }),
          oneWeekAgoStart.minus({ second: 1 }),
        ),
      },
    });

    return { lastWeekEntries, priorToLastWeekEntries };
  }

  async averageEntriesAddedPerUser(): Promise<AverageEntriesAddedPerUserDto> {
    const result: { avg: number; userId: number }[] = await this.foodsRepository
      .createQueryBuilder('food')
      .select(
        `
        AVG(food.calorie) as avg,
        food.userId
      `,
      )
      .groupBy('food.userId')
      .getRawMany();

    const response: AverageEntriesAddedPerUserDto = {};

    for (const record of result) {
      response[record.userId] = record.avg;
    }

    return response;
  }
}
