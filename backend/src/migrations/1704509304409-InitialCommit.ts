import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCommit1704509304409 implements MigrationInterface {
    name = 'InitialCommit1704509304409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "last_commit_date" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_4ac5019c0540d5dd7fae1ab5e53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "website" ("id" SERIAL NOT NULL, "domainName" character varying NOT NULL, "isDomainRoskomnadzorBanned" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_979e53e64186ccd315cf09b3b14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blocked_domain" ("id" SERIAL NOT NULL, "domainName" text, CONSTRAINT "PK_0be486e3580fc34a89c7223488f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blocked_domain"`);
        await queryRunner.query(`DROP TABLE "website"`);
        await queryRunner.query(`DROP TABLE "last_commit_date"`);
    }

}
