import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { user_role } from '../enums/user.enum';
import { Kyc } from './kyc.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: user_role, default: user_role.USER })
  role: user_role;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Kyc, (kyc) => kyc.user)
  kycs: Kyc[];
}
