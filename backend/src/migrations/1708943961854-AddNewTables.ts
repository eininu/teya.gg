import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewTables1708943961854 implements MigrationInterface {
    name = 'AddNewTables1708943961854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monitoring" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "comment" character varying, "expiredAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_22a9f9562020245a98bd2c4fb3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monitoring_tags_tag" ("monitoringId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_40f63ef1aa8c7c89a0fb617d301" PRIMARY KEY ("monitoringId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_843fd1c6cd86c5b0ad48d0164e" ON "monitoring_tags_tag" ("monitoringId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf8e72dfd0d779c696a92db5b1" ON "monitoring_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "monitoring_tags_tag" ADD CONSTRAINT "FK_843fd1c6cd86c5b0ad48d0164ea" FOREIGN KEY ("monitoringId") REFERENCES "monitoring"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "monitoring_tags_tag" ADD CONSTRAINT "FK_cf8e72dfd0d779c696a92db5b1a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monitoring_tags_tag" DROP CONSTRAINT "FK_cf8e72dfd0d779c696a92db5b1a"`);
        await queryRunner.query(`ALTER TABLE "monitoring_tags_tag" DROP CONSTRAINT "FK_843fd1c6cd86c5b0ad48d0164ea"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf8e72dfd0d779c696a92db5b1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_843fd1c6cd86c5b0ad48d0164e"`);
        await queryRunner.query(`DROP TABLE "monitoring_tags_tag"`);
        await queryRunner.query(`DROP TABLE "monitoring"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
