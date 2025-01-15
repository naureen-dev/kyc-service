import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { kyc_status } from '../enums/user.enum';
import { Transform } from 'class-transformer';

@Entity()
export class Kyc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  documentPath: string;

  @Column({ type: 'enum', enum: kyc_status, default: kyc_status.PENDING })
  status: kyc_status;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.kycs)
  user: User;
}
