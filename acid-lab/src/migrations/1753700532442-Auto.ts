import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1753700532442 implements MigrationInterface {
    name = 'Auto1753700532442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_id" uuid NOT NULL, "to_id" uuid NOT NULL, "amount" numeric(12,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a8e3da15ab8f2ce353e7f58f67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT 0.00`);
        await queryRunner.query(`DROP TABLE "movements"`);
    }

}
