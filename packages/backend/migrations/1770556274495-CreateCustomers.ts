import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomers1770556274495 implements MigrationInterface {
  name = 'CreateCustomers1770556274495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "full_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone_number" character varying(50) NOT NULL, "national_id" character varying(100), "internal_notes" text, CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bf14b22e55d577d5834fcf886b" ON "customers" ("full_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8536b8b85c06969f84f0c098b0" ON "customers" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8536b8b85c06969f84f0c098b0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bf14b22e55d577d5834fcf886b"`,
    );
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
