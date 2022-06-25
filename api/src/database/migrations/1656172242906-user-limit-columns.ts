import {MigrationInterface, QueryRunner} from "typeorm";

export class userLimitColumns1656172242906 implements MigrationInterface {
    name = 'userLimitColumns1656172242906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "dailyCalorieLimit" double precision NOT NULL DEFAULT '2100'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "monthlyCostLimit" double precision NOT NULL DEFAULT '1000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "monthlyCostLimit"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dailyCalorieLimit"`);
    }

}
