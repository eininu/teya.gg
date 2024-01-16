import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPbnLinks1705441820483 implements MigrationInterface {
  name = 'AddPbnLinks1705441820483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "pbn_link" (
        id SERIAL PRIMARY KEY,
        "website" VARCHAR(255) NOT NULL,
        "websiteLinks" JSONB NOT NULL
      );
    `);

    await queryRunner.query(`
    INSERT INTO "pbn_link" ("website", "websiteLinks") VALUES
    ('example1.com', '{"/": ["some text for example1 with <a href=\\"https://test.com/\\">anchor</a> here"], "/smth": ["some text for example1 with <a href=\\"https://test.com/\\">anchor</a> here"]}'),
    ('example2.com', '{"/": ["some text for example2 with <a href=\\"https://test2.com/\\">anchor</a> here"], "/smth": ["some text for example2 with <a href=\\"https://test2.com/\\">anchor</a> here"]}');
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "pbn_link" WHERE "website" IN ('example1.com', 'example2.com');
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "pbn_link";
    `);
  }
}
