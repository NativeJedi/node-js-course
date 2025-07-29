import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1753704724492 implements MigrationInterface {
    name = 'Auto1753704724492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT 0.00`);
    }

}
