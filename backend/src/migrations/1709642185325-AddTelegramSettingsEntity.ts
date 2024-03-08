import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTelegramSettingsEntity1709642185325 implements MigrationInterface {
    name = 'AddTelegramSettingsEntity1709642185325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "telegram-settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "chatId" integer NOT NULL, CONSTRAINT "PK_801315e8d96fcae5f8615fd74d2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "telegram-settings"`);
    }

}
