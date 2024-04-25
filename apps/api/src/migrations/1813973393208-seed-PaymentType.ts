import { getAdminId } from '../utils/getAdminId';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { langPipe } from '../utils/langPipe';
import { PaymentType } from 'src/resources/payment-types/entities/payment-type.entity';
import { PaymentGroup, PaymentMethod } from '@repo/shared';

const lang = process.env.LANGUAGE;
const entity = PaymentType;
const recordList = [
    {
        name: { en: 'Salary', uk: 'Оклад' },
        paymentGroup: PaymentGroup.BASIC,
        paymentMethod: PaymentMethod.SALARY,
        description: {
            en: 'Salaries are fixed amounts of money paid to employees regularly, usually weekly, biweekly, or monthly, according to the worked days regardless of the number of hours worked.',
            uk: 'Оклад - фіксована грошова сума, яка виплачується працівникам регулярно, щомісяця, відповідно до відпрацьованих днів незалежно від кількості відпрацьованих годин.',
        },
    },
    {
        name: { en: 'Wage', uk: 'Тариф' },
        paymentGroup: PaymentGroup.BASIC,
        paymentMethod: PaymentMethod.SALARY,
        description: {
            en: 'Wages are typically paid on an hourly basis and are directly tied to the number of hours worked.',
            uk: `Тариф, як правило, виплачується на погодинній основі та безпосередньо прив'язаний до кількості відпрацьованих годин.`,
        },
    },
    {
        name: { en: 'Allowance', uk: 'Надбавка' },
        paymentGroup: PaymentGroup.ADJUSTMENTS,
        paymentMethod: PaymentMethod.ALLOWANCE,
        description: {
            en: 'Salary allowance - is an amount of money paid to an employee in addition to their regular salary or wages regularly.',
            uk: `Надбавка - грошова сума, яка виплачується працівнику на додаток до оплати за окладом чи тарифом.`,
        },
    },
    {
        name: { en: 'Bonus', uk: 'Премія' },
        paymentGroup: PaymentGroup.BONUSES,
        paymentMethod: PaymentMethod.BONUS,
        description: {
            en: `A bonus is a sum of money paid to an employee based on work results to encourage high productivity, depending on the efficiency of the employee's or team's work.`,
            uk: `Премія - це грошова сума, яка виплачується працівнику за результатами роботи для заохочення до високої продуктивності, залежить від ефективності роботи працівника або колективу.`,
        },
    },
    {
        name: { en: 'Paid Vacation', uk: 'Відпустка оплачувана' },
        paymentGroup: PaymentGroup.VACATIONS,
        paymentMethod: PaymentMethod.PAID_VACATION,
        description: {
            en: `Paid vacation is a benefit provided by an employer where employees receive their regular pay while taking time off from work for vacation purposes. During paid vacation time, employees are compensated for the hours or days they would typically work if they were not on vacation.`,
            uk: `Оплачувана відпустка – це допомога, яку надає роботодавець, коли працівники отримують свою звичайну заробітну плату, беручи час з роботи у зв’язку з відпусткою. Під час оплачуваної відпустки працівники отримують компенсацію за години або дні, які вони зазвичай працювали б, якби не були у відпустці.`,
        },
    },
    {
        name: { en: 'Unpaid leave', uk: 'Відпустка неоплачувана, з ініціативи працівника' },
        paymentGroup: PaymentGroup.VACATIONS,
        paymentMethod: PaymentMethod.UNPAID_LEAVE,
        description: {
            en: `Unpaid leave refers to a situation where an employee takes time off from work without receiving pay for the duration of the absence. During unpaid leave, employees are not compensated for the hours or days they are not working.`,
            uk: `Відпустка без збереження заробітної плати з ініціативи працівника означає ситуацію, коли працівник бере відпустку з роботи без отримання оплати за весь час відсутності. Під час відпустки без збереження заробітної плати працівнику не виплачується компенсація за години або дні, коли він не працював.`,
        },
    },
    {
        name: {
            en: 'Paid sick, from the employer',
            uk: 'Оплачуваний лікарняний, від роботодавця',
        },
        paymentGroup: PaymentGroup.SICKS,
        paymentMethod: PaymentMethod.PAID_SICK_BY_COMPANY,
        description: {
            en: `"Paid sick leave, from the employer" refers to a situation where an employee is absent from work due to illness or injury and continues to receive their regular pay from the employer during the period of absence.`,
            uk: `Оплачуваний лікарняний, від роботодавця - у разі коли працівник відсутній на роботі через хворобу або травму та продовжує отримувати свою звичайну зарплату від роботодавця протягом періоду відсутності.`,
        },
    },
    {
        name: {
            en: 'Paid sick, from the SIF',
            uk: 'Оплачуваний лікарняний, з ФСС',
        },
        paymentGroup: PaymentGroup.SICKS,
        paymentMethod: PaymentMethod.PAID_SICK_BY_COMPANY,
        description: {
            en: `"Paid sick leave, from the SIF" refers to a situation where an employee is absent from work due to illness or injury and continues to receive their regular pay from the SIF during the period of absence.`,
            uk: `Оплачуваний лікарняний, з ФСС - у разі коли працівник відсутній на роботі через хворобу або травму та продовжує отримувати свою звичайну зарплату з ФСС протягом періоду відсутності.`,
        },
    },
    {
        name: { en: 'Unconfirmed sick', uk: 'Непідтверджений лікарняний' },
        paymentGroup: PaymentGroup.VACATIONS,
        paymentMethod: PaymentMethod.UNPAID_LEAVE,
        description: {
            en: `Unconfirmed sick leave - in the case when the employee is absent from work due to illness or injury, but has not yet provided the employer with the appropriate document. The employee is not paid a salary during the period of absence until the document is presented to the employer.`,
            uk: `Непідтверджений лікарняний - у випадку, коли працівник відсутній на роботі через хворобу або травму, але ще не надав роботодавцю лікарняний лист. Заробітна плата за час відсутності працівнику не нараховується до пред'явлення роботодавцю лікарняного листа.`,
        },
    },
];

export class Seed1713973393208 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const user_id = await getAdminId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = { ...recordList[n], createdUserId: user_id, updatedUserId: user_id };
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
        for (let n = 0; n < recordList.length; n++) {
            const record = langPipe(lang, recordList[n]);
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('name = :name', { name: record.name })
                .execute();
        }
    }
}
