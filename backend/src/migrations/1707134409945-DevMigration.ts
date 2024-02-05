import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigration1707134409945 implements MigrationInterface {
    name = 'DevMigration1707134409945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "pbn_link"`);

        await queryRunner.query(`ALTER TABLE "pbn_link" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "pbn_link" ADD "website" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pbn_link" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "pbn_link" ADD "website" character varying(255) NOT NULL`);
    }

}
