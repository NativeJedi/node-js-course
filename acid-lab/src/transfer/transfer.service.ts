import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateTransferDto } from './dto/transfer.dto';
import { Transfer } from './entities/transfer.entity';
import { DataSource } from 'typeorm';
import { Account } from '../account/entities/account.entity';

@Injectable()
export class TransferService {
  constructor(private readonly dataSource: DataSource) {}

  create(dto: CreateTransferDto) {
    const { from_id, to_id, amount } = dto;

    return this.dataSource.transaction(async (manager) => {
      const fromAccount = await manager.findOneOrFail(Account, {
        where: { id: from_id },
        lock: { mode: 'pessimistic_write' }, // This is needed to lock Account for writing and receive consistent data
      });

      const toAccount = await manager.findOneOrFail(Account, {
        where: { id: to_id },
        lock: { mode: 'pessimistic_write' }, // This is needed to lock Account for writing and receive consistent data
      });

      const fromBalance = Number(fromAccount.balance) - Number(amount);
      const toBalance = Number(toAccount.balance) + Number(amount);

      if (fromBalance < 0) {
        throw new UnprocessableEntityException('Insufficient funds');
      }

      fromAccount.balance = fromBalance.toFixed(2);
      toAccount.balance = toBalance.toFixed(2);

      await manager.save(fromAccount);
      await manager.save(toAccount);

      const transfer = manager.create(Transfer, {
        amount,
        fromAccount,
        toAccount,
      });

      return await manager.save(transfer);
    });
  }
}
