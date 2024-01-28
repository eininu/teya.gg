import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldToWebsite1706019934897 implements MigrationInterface {
    name = 'AddNewFieldToWebsite1706019934897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "website" ADD "isAcmaBanned" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "website" ADD "isPlHazardBanned" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "website" DROP COLUMN "isPlHazardBanned"`);
        await queryRunner.query(`ALTER TABLE "website" DROP COLUMN "isAcmaBanned"`);
    }

}
