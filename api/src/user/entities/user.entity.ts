import { Food } from 'src/food/entities/food.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../enum/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ type: 'float', default: 2100 })
  dailyCalorieLimit: number;

  @Column({ type: 'float', default: 1000 })
  monthlyCostLimit: number;

  @OneToMany(() => Food, (food) => food.user)
  foods: Food[];
}
