import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedEntity1722736211183 implements MigrationInterface {
    name = 'AddedEntity1722736211183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "subcribe" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subcribe"`);
    }

}
