import { MigrationInterface, QueryRunner } from "typeorm";

export class PbnLinks1707135738157 implements MigrationInterface {
    name = 'PbnLinks1707135738157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "text" character varying NOT NULL, "websiteId" uuid, CONSTRAINT "PK_26206fb7186da72fbb9eaa3fac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pbn_link" DROP COLUMN "websiteLinks"`);
        await queryRunner.query(`ALTER TABLE "pbn_link" DROP CONSTRAINT "pbn_link_pkey"`);
        await queryRunner.query(`ALTER TABLE "pbn_link" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "pbn_link" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "pbn_link" ADD CONSTRAINT "PK_088bdbc4395f783fa88ac0bd8dc" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "pbn_link" ALTER COLUMN "website" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_5e859298b6962208437d2bf3d7a" FOREIGN KEY ("websiteId") REFERENCES "pbn_link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_5e859298b6962208437d2bf3d7a"`);
        await queryRunner.query(`ALTER TABLE "pbn_link" ALTER COLUMN "website" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pbn_link" DROP CONSTRAINT "PK_088bdbc4395f783fa88ac0bd8dc"`);
        await queryRunner.query(`ALTER TABLE "pbn_link" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "pbn_link" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pbn_link" ADD CONSTRAINT "pbn_link_pkey" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "pbn_link" ADD "websiteLinks" jsonb NOT NULL`);
        await queryRunner.query(`DROP TABLE "link"`);
    }

}
