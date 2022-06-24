import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateFoodDto {
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
  takenAt: string;
}
