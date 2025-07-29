import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transfer } from '../../transfer/entities/transfer.entity';

@Entity('accounts')
@Check('CHK_balance_positive', '"balance" >= 0')
class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: '0.00',
  })
  balance: string;

  @OneToMany(() => Transfer, (transfer) => transfer.fromAccount)
  sentTransfers: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.toAccount)
  receivedTransfers: Transfer[];
}

export { Account };
