import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity('movements')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'to_id' })
  toAccount: Account;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_id' })
  fromAccount: Account;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  amount: string;

  @CreateDateColumn()
  createdAt: Date;
}
