import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  type: string; // 'card' | 'upi' | 'wallet'

  @Column()
  label: string; // e.g. "Visa ending 4242"

  @Column({ default: false })
  isDefault: boolean;
}
