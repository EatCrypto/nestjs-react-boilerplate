import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  calorie: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'timestamptz' })
  takenAt: Date;

  @ManyToOne(() => User, (user) => user.foods)
  @JoinColumn()
  user: User;
}
