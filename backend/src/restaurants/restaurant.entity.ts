import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { Country } from '../common/enums';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cuisine: string;

  @Column({ type: 'text' })
  country: Country;

  @Column()
  address: string;

  @OneToMany(() => MenuItem, (item) => item.restaurant, { eager: true })
  menuItems: MenuItem[];
}
