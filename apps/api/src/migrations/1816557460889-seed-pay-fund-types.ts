import { PayFundCalcMethod, PayFundGroup } from '../types';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { PayFundType } from '../resources/pay-fund-types/entities/pay-fund-type.entity';
import { getSystemUserId } from '../utils/lib/getSystemUserId';
import { langPipe } from '../utils/lib/langPipe';

const lang = process.env.LANGUAGE ?? 'uk';
const law = process.env.LAW;
const entity = PayFundType;
const recordList = [
    {
        id: '1',
        law: 'ukraine',
        name: { en: 'ECB on vacation', uk: 'ЄСВ на оплату Відпустки' },
        group: PayFundGroup.Ecb,
        calcMethod: PayFundCalcMethod.EcbVacation,
        sequence: 1,
        description: {
            en: 'Calculation of ECB on vacation.',
            uk: 'Нарахування ЄСВ на оплату Відпустки.',
        },
    },
    {
        id: '2',
        law: 'ukraine',
        name: { en: 'ECB on Salary', uk: 'ЄСВ на Заробітну плату' },
        group: PayFundGroup.Ecb,
        calcMethod: PayFundCalcMethod.EcbSalary,
        sequence: 2,
        description: {
            en: 'Calculation of ECB on wages.',
            uk: 'Нарахування ЄСВ на Заробітну плату.',
        },
    },
    {
        id: '3',
        law: 'ukraine',
        name: { en: 'ECB on commission', uk: 'ЄСВ на оплату за Договором ЦПХ' },
        group: PayFundGroup.Ecb,
        calcMethod: PayFundCalcMethod.EcbCommission,
        sequence: 3,
        description: {
            en: 'Calculation of ECB on commission.',
            uk: 'Нарахування ЄСВ на оплату за Договором ЦПХ.',
        },
    },
    {
        id: '4',
        law: 'ukraine',
        name: {
            en: 'ECB on sick leave by the company',
            uk: 'ЄСВ на оплату Лікарняного за рахунок підприємства',
        },
        group: PayFundGroup.Ecb,
        calcMethod: PayFundCalcMethod.EcbSickByCompany,
        sequence: 4,
        description: {
            en: 'Calculation of ECB for payment of sick leave at the expense of the company.',
            uk: 'Нарахування ЄСВ на оплату Лікарняного за рахунок підприємства.',
        },
    },
    {
        id: '5',
        law: 'ukraine',
        name: {
            en: 'ECB on sick leave by the SIF',
            uk: 'ЄСВ на оплату Лікарняного за рахунок ФСС',
        },
        group: PayFundGroup.Ecb,
        calcMethod: PayFundCalcMethod.EcbSickBySif,
        sequence: 5,
        description: {
            en: 'Calculation of ECB for payment of sick leave at the expense of the SIF.',
            uk: 'Нарахування ЄСВ на оплату Лікарняного за рахунок ФСС.',
        },
    },
    {
        id: '6',
        law: 'ukraine',
        name: {
            en: 'ECB on sick leave by maternity',
            uk: 'ЄСВ на оплату Пологового лікарняного',
        },
        group: PayFundGroup.Ecb,
        calcMethod: PayFundCalcMethod.EcbMaternity,
        sequence: 6,
        description: {
            en: 'Calculation of ECB for payment of sick leave at the expense of the SIF.',
            uk: 'Нарахування ЄСВ на оплату пологового лікарняного.',
        },
    },
    {
        id: '7',
        law: 'ukraine',
        name: {
            en: 'ECB to the minimum wage',
            uk: 'ЄСВ доплата до Мінімальної заробітної плати',
        },
        group: PayFundGroup.Ecb,
        calcMethod: PayFundCalcMethod.EcbMinWage,
        sequence: 99,
        description: {
            en: 'Calculation to the minimum wage.',
            uk: `Нарахування ЄСВ на суму доплати до мінімальної зарплати, якщо оподатковуваний дохід менше суми мінімальної заробітної плати.`,
        },
    },
];

export class Seed1816557460889 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            if (recordList[n].law && recordList[n].law !== law) continue;
            const { law: _, ...record } = recordList[n];
            record['createdUserId'] = userId;
            record['updatedUserId'] = userId;
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, record))
                .orUpdate(
                    ['name', 'group', 'calc_method', 'sequence', 'description', 'updated_user_id'],
                    ['id'],
                )
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
                .where('id = :id and createdUserId = :userId', { id: record.id, userId })
                .execute();
        }
    }
}
