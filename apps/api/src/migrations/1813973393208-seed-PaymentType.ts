import { PaymentGroup, CalcMethod, PaymentPart } from '@/types';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { PaymentType } from './../resources/payment-types/entities/payment-type.entity';
import { getSystemUserId } from '../utils/lib/getSystemUserId';
import { langPipe } from '../utils/lib/langPipe';

const lang = process.env.LANGUAGE || 'uk';
const law = process.env.LAW;
const entity = PaymentType;
const recordList = [
    {
        name: { en: 'Salary', uk: 'Місячний оклад' },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.BASIC,
        calcMethod: CalcMethod.SALARY,
        description: {
            en: `Salaries are fixed amounts of money paid to employees regularly, usually weekly, biweekly, or monthly, according to the worked days regardless of the number of hours worked.`,
            uk: `Оплата за місячним окладом - фіксована грошова сума, яка виплачується працівникам регулярно, щомісяця, відповідно до відпрацьованих днів незалежно від кількості відпрацьованих годин.`,
        },
    },
    {
        name: { en: 'Wage', uk: 'Погодинний тариф' },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.BASIC,
        calcMethod: CalcMethod.WAGE,
        description: {
            en: `Wages are typically paid on an hourly basis and are directly tied to the number of hours worked.`,
            uk: `Оплата за погодинним тарифом нараховується на відпрацьовані години.`,
        },
    },
    {
        name: { en: 'Allowance', uk: 'Надбавка' },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.ADJUSTMENTS,
        calcMethod: CalcMethod.ALLOWANCE,
        description: {
            en: `Salary allowance - is an amount of money paid to an employee in addition to their regular salary or wages regularly.`,
            uk: `Надбавка - грошова сума, яка виплачується працівнику на додаток до оплати за окладом чи тарифом.`,
        },
    },
    {
        name: { en: 'Bonus', uk: 'Премія' },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.BONUSES,
        calcMethod: CalcMethod.BONUS,
        description: {
            en: `A bonus is a sum of money paid to an employee based on work results to encourage high productivity, depending on the efficiency of the employee's or team's work.`,
            uk: `Премія - це грошова сума, яка виплачується працівнику за результатами роботи для заохочення до високої продуктивності, залежить від ефективності роботи працівника або колективу.`,
        },
    },
    {
        name: { en: 'Paid Vacation', uk: 'Відпустка оплачувана' },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.VACATIONS,
        calcMethod: CalcMethod.PAID_VACATION,
        description: {
            en: `Paid vacation is a benefit provided by an employer where employees receive their regular pay while taking time off from work for vacation purposes. During paid vacation time, employees are compensated for the hours or days they would typically work if they were not on vacation.`,
            uk: `Оплачувана відпустка – це допомога, яку надає роботодавець, коли працівники отримують свою звичайну заробітну плату, беручи час з роботи у зв’язку з відпусткою. Під час оплачуваної відпустки працівники отримують компенсацію за години або дні, які вони зазвичай працювали б, якби не були у відпустці.`,
        },
    },
    {
        name: { en: 'Unpaid leave', uk: 'Відпустка неоплачувана, з ініціативи працівника' },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.VACATIONS,
        calcMethod: CalcMethod.UNPAID_LEAVE,
        description: {
            en: `Unpaid leave refers to a situation where an employee takes time off from work without receiving pay for the duration of the absence. During unpaid leave, employees are not compensated for the hours or days they are not working.`,
            uk: `Відпустка без збереження заробітної плати з ініціативи працівника означає ситуацію, коли працівник бере відпустку з роботи без отримання оплати за весь час відсутності. Під час відпустки без збереження заробітної плати працівнику не виплачується компенсація за години або дні, коли він не працював.`,
        },
    },
    {
        law: 'ukraine',
        name: {
            en: 'Paid sick, from the employer',
            uk: 'Оплачуваний лікарняний, від роботодавця',
        },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.SICKS,
        calcMethod: CalcMethod.PAID_SICK_BY_COMPANY,
        description: {
            en: `"Paid sick leave, from the employer" refers to a situation where an employee is absent from work due to illness or injury and continues to receive their regular pay from the employer during the period of absence.`,
            uk: `Оплачуваний лікарняний, від роботодавця - у разі коли працівник відсутній на роботі через хворобу або травму та продовжує отримувати свою звичайну зарплату від роботодавця протягом періоду відсутності.`,
        },
    },
    {
        law: 'ukraine',
        name: {
            en: 'Paid sick, from the SIF',
            uk: 'Оплачуваний лікарняний, з ФСС',
        },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.SICKS,
        calcMethod: CalcMethod.PAID_SICK_PAID_BY_SIF,
        description: {
            en: `"Paid sick leave, from the SIF" refers to a situation where an employee is absent from work due to illness or injury and continues to receive their regular pay from the SIF during the period of absence.`,
            uk: `Оплачуваний лікарняний, з ФСС - у разі коли працівник відсутній на роботі через хворобу або травму та продовжує отримувати свою звичайну зарплату з ФСС протягом періоду відсутності.`,
        },
    },
    {
        law: 'ukraine',
        name: { en: 'Unconfirmed sick', uk: 'Непідтверджений лікарняний' },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.SICKS,
        calcMethod: CalcMethod.UNCONFIRMED_SICK,
        description: {
            en: `Unconfirmed sick leave - in the case when the employee is absent from work due to illness or injury, but has not yet provided the employer with the appropriate document. The employee is not paid a salary during the period of absence until the document is presented to the employer.`,
            uk: `Непідтверджений лікарняний - у випадку, коли працівник відсутній на роботі через хворобу або травму, але ще не надав роботодавцю лікарняний лист. Заробітна плата за час відсутності працівнику не нараховується до пред'явлення роботодавцю лікарняного листа.`,
        },
    },
    {
        law: 'ukraine',
        name: { en: 'Income indexation', uk: 'Індексація доходу' },
        paymentPart: PaymentPart.ACCRUALS,
        paymentGroup: PaymentGroup.REFUNDS,
        calcMethod: CalcMethod.INCOME_INDEXATION,
        description: {
            en: `Indexation of the monetary income of the population is a mechanism established by laws and other regulatory legal acts to increase the monetary income of the population, which makes it possible to partially or fully compensate for the increase in the price of consumer goods and services.`,
            uk: `Індексація грошових доходів населення - це встановлений законами та іншими нормативно-правовими актами механізм підвищення грошових доходів населення, що дає можливість частково або повністю відшкодовувати подорожчання споживчих товарів і послуг.`,
        },
    },
    {
        name: { en: 'Income Tax', uk: 'ПДФО' },
        paymentPart: PaymentPart.DEDUCTIONS,
        paymentGroup: PaymentGroup.TAXES,
        calcMethod: CalcMethod.INCOME_TAX,
        description: {
            en: `Income tax - the tax that individuals pay on the income they earn from their employment or other sources of income. It is a tax levied by the government on the earnings of individuals, including wages, salaries, bonuses, commissions, tips, and other forms of compensation.`,
            uk: `Податок на доходи фізичних осіб - податок, який фізичні особи сплачують на дохід, що вони отримують від своєї роботи або інших джерел доходу. Це податок, що стягується державою з доходів фізичних осіб, включаючи заробітну плату, зарплату, премії, комісійні, чайові та інші форми компенсації.`,
        },
    },
    {
        law: 'ukraine',
        name: { en: 'Military Tax', uk: 'Військовий збір' },
        paymentPart: PaymentPart.DEDUCTIONS,
        paymentGroup: PaymentGroup.TAXES,
        calcMethod: CalcMethod.MILITARY_TAX,
        description: {
            en: `Military tax - the tax that individuals pay on the income they earn from their employment. It is a tax levied by the government on the earnings of individuals, including wages, salaries, bonuses, commissions, tips, and other forms of compensation.`,
            uk: `Податок на доходи фізичних осіб - податок, який фізичні особи сплачують на дохід, що вони отримують від своєї роботи або інших джерел доходу. Це податок, що стягується державою з доходів фізичних осіб, включаючи заробітну плату, зарплату, премії, комісійні, чайові та інші форми компенсації.`,
        },
    },
    {
        law: 'ukraine',
        name: { en: 'Advance payment', uk: 'Виплата авансу' },
        paymentPart: PaymentPart.DEDUCTIONS,
        paymentGroup: PaymentGroup.PAYMENTS,
        calcMethod: CalcMethod.ADVANCE_PAYMENT,
        description: {
            en: `Advanced payment - an employee is paid for work they have not yet completed or for a period that has not yet ended.`,
            uk: `Аванс - працівник отримує плату за роботу, яку він ще не виконав, або за період, який ще не закінчився.`,
        },
    },
    {
        name: { en: 'Regular payment', uk: 'Виплата заробітної плати' },
        paymentPart: PaymentPart.DEDUCTIONS,
        paymentGroup: PaymentGroup.PAYMENTS,
        calcMethod: CalcMethod.REGULAR_PAYMENT,
        description: {
            en: `Regular payment refers to the standard, recurring compensation that an employee receives for their work regularly, typically according to a predetermined schedule. It encompasses wages, salaries, bonuses, commissions, or other forms of compensation after deducting taxes.`,
            uk: `Виплата заробітної плати стосується стандартної періодичної винагороди, яку працівник регулярно отримує за свою роботу, як правило, згідно з заздалегідь визначеним графіком. Вона охоплює заробітну плату, бонуси, комісійні або інші форми компенсації після вирахування податків.`,
        },
    },
];

export class Seed1813973393208 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            if (recordList[n].law && recordList[n].law !== law) continue;
            const record = { ...recordList[n], createdUserId: userId, updatedUserId: userId };
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
                .where('name = :name and createdUserId = :userId', { name: record.name, userId })
                .execute();
        }
    }
}
