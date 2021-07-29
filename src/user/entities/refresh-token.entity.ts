import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('refreshToken')
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  constructor(data?: Partial<RefreshToken>) {
    super();
    Object.assign(this, data);
  }
}
