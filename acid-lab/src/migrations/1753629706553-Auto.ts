import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1753629706553 implements MigrationInterface {
    name = 'Auto1753629706553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "balance" numeric(12,2) NOT NULL DEFAULT '0.00', CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "accounts"`);
    }

}
