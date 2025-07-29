import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Account } from './entities/account.entity';

@Controller('account')
class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create account' })
  @ApiResponse({ status: 201, description: 'Account created', type: Account })
  create(@Body() dto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 201, description: 'Account created' })
  update(@Param('id') id: string, @Body() { balance }: UpdateAccountDto) {
    return this.accountService.updateBalance(id, balance);
  }
}

export { AccountController };
