import {MigrationInterface, QueryRunner} from "typeorm";

export class replaceCreatedAt1656091858485 implements MigrationInterface {
    name = 'replaceCreatedAt1656091858485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food" RENAME COLUMN "createdAt" TO "takenAt"`);
        await queryRunner.query(`ALTER TABLE "food" ALTER COLUMN "takenAt" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food" ALTER COLUMN "takenAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "food" RENAME COLUMN "takenAt" TO "createdAt"`);
    }

}
