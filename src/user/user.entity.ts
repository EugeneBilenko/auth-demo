import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from 'typeorm';
import { EmailToken } from '../auth/email-token/email-token.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    unique: true,
  })
  email: string;

  @OneToOne(() => EmailToken)
  token: EmailToken;

  constructor(data?: Partial<User>) {
    super();
    Object.assign(this, data);
  }
}
