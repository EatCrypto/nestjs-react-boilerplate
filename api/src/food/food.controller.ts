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
import { Roles } from 'src/shared/role.decorator';
import { Role } from 'src/user/enum/role.enum';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @AuthApi()
  @Post()
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto);
  }

  @AuthApi()
  @Get()
  @Roles(Role.User)
  findAll(@AuthUser() user: any) {
    return this.foodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(+id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodService.remove(+id);
  }
}
