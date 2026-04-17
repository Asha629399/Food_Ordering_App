import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role, Country } from '../common/enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'text' })
  role: Role;

  @Column({ type: 'text' })
  country: Country;

  @Column()
  name: string;
}
