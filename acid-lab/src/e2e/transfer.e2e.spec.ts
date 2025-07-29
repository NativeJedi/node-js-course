import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { Transfer } from '../transfer/entities/transfer.entity';
import { Account } from '../account/entities/account.entity';

const initTestApp = async (): Promise<[INestApplication, DataSource]> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  const dataSource = moduleFixture.get(DataSource);

  return [app, dataSource];
};

const clearTables = async (dataSource: DataSource, entities: any[]) => {
  const promises = entities.map(async (entity) => {
    await dataSource.createQueryBuilder().delete().from(entity).execute();
  });

  await Promise.all(promises);
};

describe('TransferController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    [app, dataSource] = await initTestApp();
    await clearTables(dataSource, [Transfer, Account]);
  });

  afterEach(async () => {
    await clearTables(dataSource, [Transfer, Account]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fail transfer due to insufficient funds and leave both tables empty', async () => {
    const accountRepo = dataSource.getRepository(Account);

    // Create an account only with 50
    const account = accountRepo.create({
      balance: '50.00',
    });
    const savedFrom = await accountRepo.save(account);
    const savedTo = await accountRepo.save(
      accountRepo.create({ balance: '0.00' }),
    );

    // Create a transfer of amount 100 might throw an error
    const response = await request(app.getHttpServer()).post('/transfer').send({
      from_id: savedFrom.id,
      to_id: savedTo.id,
      amount: '100.00',
    });

    expect(response.status).toBe(422);

    // Check that tables are empty
    const transfers = await dataSource.getRepository(Transfer).find();
    const accounts = await accountRepo.find();

    expect(transfers).toHaveLength(0);
    expect(accounts).toHaveLength(2);
  });
});
