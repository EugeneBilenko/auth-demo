import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn, Generated,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('emailToken')
export class EmailToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  token: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  constructor(data?: Partial<EmailToken>) {
    super();
    Object.assign(this, data);
  }
}
