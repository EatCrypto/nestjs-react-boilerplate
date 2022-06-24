import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AdminCreateFoodDto {
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsNotEmpty()
  @Expose()
  calorie: number;

  @IsNotEmpty()
  @Expose()
  price: number;

  @IsNotEmpty()
  @Expose()
  userId: number;
}
