import { PayFundCalcMethod, PayFundGroup } from '@repo/shared';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { PayFundType } from './../resources/pay-fund-types/entities/pay-fund-type.entity';
import { getSystemUserId } from './../utils/getSystemUserId';
import { langPipe } from './../utils/langPipe';

const lang = process.env.LANGUAGE;
const law = process.env.LAW;
const entity = PayFundType;
const recordList = [
    {
        law: 'ukraine',
        name: { en: 'ECB on vacation', uk: 'ЄСВ на оплату Відпустки' },
        group: PayFundGroup.ECB,
        calcMethod: PayFundCalcMethod.ECB_VACATION,
        sequence: 1,
        description: {
            en: 'Calculation of ECB on vacation.',
            uk: 'Нарахування ЄСВ на оплату Відпустки.',
        },
    },
    {
        law: 'ukraine',
        name: { en: 'ECB on Salary', uk: 'ЄСВ на Заробітну плату' },
        group: PayFundGroup.ECB,
        calcMethod: PayFundCalcMethod.ECB_SALARY,
        sequence: 2,
        description: {
            en: 'Calculation of ECB on wages.',
            uk: 'Нарахування ЄСВ на Заробітну плату.',
        },
    },
    {
        law: 'ukraine',
        name: { en: 'ECB on commission', uk: 'ЄСВ на оплату за Договором ЦПХ' },
        group: PayFundGroup.ECB,
        calcMethod: PayFundCalcMethod.ECB_COMMISSION,
        sequence: 3,
        description: {
            en: 'Calculation of ECB on commission.',
            uk: 'Нарахування ЄСВ на оплату за Договором ЦПХ.',
        },
    },
    {
        law: 'ukraine',
        name: {
            en: 'ECB on sick leave by the company',
            uk: 'ЄСВ на оплату Лікарняного за рахунок підприємства',
        },
        group: PayFundGroup.ECB,
        calcMethod: PayFundCalcMethod.ECB_SICK_BY_COMPANY,
        sequence: 4,
        description: {
            en: 'Calculation of ECB for payment of sick leave at the expense of the company.',
            uk: 'Нарахування ЄСВ на оплату Лікарняного за рахунок підприємства.',
        },
    },
    {
        law: 'ukraine',
        name: {
            en: 'ECB on sick leave by the SIF',
            uk: 'ЄСВ на оплату Лікарняного за рахунок ФСС',
        },
        group: PayFundGroup.ECB,
        calcMethod: PayFundCalcMethod.ECB_SICK_BY_SIF,
        sequence: 5,
        description: {
            en: 'Calculation of ECB for payment of sick leave at the expense of the SIF.',
            uk: 'Нарахування ЄСВ на оплату Лікарняного за рахунок ФСС.',
        },
    },
    {
        law: 'ukraine',
        name: {
            en: 'ECB on sick leave by maternity',
            uk: 'ЄСВ на оплату Пологового лікарняного',
        },
        group: PayFundGroup.ECB,
        calcMethod: PayFundCalcMethod.ECB_MATERNITY,
        sequence: 6,
        description: {
            en: 'Calculation of ECB for payment of sick leave at the expense of the SIF.',
            uk: 'Нарахування ЄСВ на оплату пологового лікарняного.',
        },
    },
    {
        law: 'ukraine',
        name: {
            en: 'ECB to the minimum wage',
            uk: 'ЄСВ доплата до Мінімальної заробітної плати',
        },
        group: PayFundGroup.ECB,
        calcMethod: PayFundCalcMethod.ECB_MIN_WAGE,
        sequence: 99,
        description: {
            en: 'Calculation to the minimum wage.',
            uk: 'Нарахування ЄСВ на суму доплати до мінімальної зарплати, якщо оподатковуваний дохід менше суми мінімальної заробітної плати.',
        },
    },
];

export class Seed1716557460889 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            if (recordList[n].law && recordList[n].law !== law) continue;
            const record = {
                ...recordList[n],
                createdUserId: userId,
                updatedUserId: userId,
            };
            delete record.law;
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, record))
                // .orUpdate(['name'], ['id'])
                .execute();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            if (recordList[n]?.law && recordList[n]?.law !== law) continue;
            const record = langPipe(lang, recordList[n]);
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('name = :name and createdUserId = :userId', {
                    name: record.name,
                    userId,
                })
                .execute();
        }
    }
}
