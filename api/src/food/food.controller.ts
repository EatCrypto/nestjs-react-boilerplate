import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { AuthApi } from 'src/auth/auth.decorator';
import { AuthUser } from 'src/shared/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Roles } from 'src/shared/role.decorator';
import { Role } from 'src/user/enum/role.enum';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @AuthApi()
  @Post()
  async create(@AuthUser() user: User, @Body() input: CreateFoodDto) {
    if (user.role === Role.Admin || user.id === input.userId) {
      return await this.foodService.create(input);
    }
    throw new Error('Permission denied!');
  }

  @AuthApi()
  @Get('user/:id/list')
  async list(@AuthUser() user: User, @Param('id') id: string) {
    if (user.role === Role.Admin || user.id === +id) {
      return await this.foodService.list(+id);
    }
    throw new Error('Permission denied!');
  }

  @AuthApi()
  @Get('user/:id')
  async findUserFoods(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    if (user.role === Role.Admin || user.id === +id) {
      return await this.foodService.findAll(+id, start, end);
    }
    throw new Error('Permission not allowed!');
  }

  @AuthApi()
  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return await this.foodService.update(+id, updateFoodDto);
  }

  @AuthApi()
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.foodService.remove(+id);
  }

  @AuthApi()
  @Roles(Role.Admin)
  @Get('report/entries-per-week')
  async entriesReportPerWeek() {
    return await this.foodService.entriesReportPerWeek();
  }

  @AuthApi()
  @Roles(Role.Admin)
  @Get('report/average-entries-added-per-user')
  async averageEntriesAddedPerUser() {
    return await this.foodService.averageEntriesAddedPerUser();
  }
}
