import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CreateAccountDto } from './dto/account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';

@Injectable()
class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  create(dto: CreateAccountDto) {
    const account = this.accountRepository.create(dto);

    return this.accountRepository.save(account);
  }

  async updateBalance(id: Account['id'], balance: Account['balance']) {
    await this.accountRepository.update(id, { balance });

    return this.accountRepository.findOneByOrFail({ id });
  }

  async findAccounts(ids: Array<Account['id']>) {
    const accounts = await this.accountRepository.findBy({
      id: In(ids),
    });

    const foundIds = accounts.map((account) => account.id);

    const missingIds = ids.filter((id) => !foundIds.includes(id));

    if (missingIds.length) {
      throw new NotFoundException(`Missing accounts: ${missingIds.join(', ')}`);
    }

    return accounts;
  }
}

export { AccountService };
