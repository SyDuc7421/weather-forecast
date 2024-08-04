import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedEntity1722749595557 implements MigrationInterface {
    name = 'AddedEntity1722749595557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subcribe"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "subcribe" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subcribe"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "subcribe" boolean NOT NULL DEFAULT false`);
    }

}
