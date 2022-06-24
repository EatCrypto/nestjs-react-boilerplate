import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { AuthApi } from 'src/auth/auth.decorator';
import { AuthUser } from 'src/shared/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Roles } from 'src/shared/role.decorator';
import { Role } from 'src/user/enum/role.enum';
import { AdminCreateFoodDto } from './dto/admin-create-food.dto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @AuthApi()
  @Post()
  async create(@AuthUser() user: User, @Body() createFoodDto: CreateFoodDto) {
    return await this.foodService.create(user, createFoodDto);
  }

  @AuthApi()
  @Roles(Role.Admin)
  @Post('admin')
  async adminCreate(@Body() adminCreateFoodDto: AdminCreateFoodDto) {
    return await this.foodService.adminCreate(adminCreateFoodDto);
  }

  @AuthApi()
  @Get()
  async findAll(@AuthUser() user: User) {
    return await this.foodService.findAll(user);
  }

  @AuthApi()
  @Get('daily-threshold')
  async getDailyThreshold(@AuthUser() user: User) {
    return await this.foodService.getDailyThreshold(user);
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
}
