import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 8, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => Restaurant, (r) => r.menuItems)
  restaurant: Restaurant;
}
