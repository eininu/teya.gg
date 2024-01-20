import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpiredField1705765098448 implements MigrationInterface {
  name = 'AddExpiredField1705765098448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "website" ADD "expiredAt" TIMESTAMP WITH TIME ZONE`,
    );
    // await queryRunner.query(`ALTER TABLE "pbn_link" DROP COLUMN "website"`);
    // await queryRunner.query(`ALTER TABLE "pbn_link" ADD "website" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "pbn_link" DROP COLUMN "website"`);
    // await queryRunner.query(`ALTER TABLE "pbn_link" ADD "website" character varying(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "website" DROP COLUMN "expiredAt"`);
  }
}
