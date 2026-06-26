import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGenderToProducts1000000000002 implements MigrationInterface {
  name = 'AddGenderToProducts1000000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE products
      ADD COLUMN gender ENUM('hombre', 'mujer') NULL DEFAULT NULL
      AFTER status;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE products DROP COLUMN gender`);
  }
}
