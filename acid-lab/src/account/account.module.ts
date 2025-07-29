import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';

const AccountRepository = TypeOrmModule.forFeature([Account]);

@Module({
  imports: [AccountRepository],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService, AccountRepository],
})
class AccountModule {}

export { AccountModule };
