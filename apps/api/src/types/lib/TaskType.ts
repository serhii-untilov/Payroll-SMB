export enum TaskType {
    CREATE_USER = 'create-user', // Створення користувача
    CREATE_COMPANY = 'create-company', // Створення підприємства
    FILL_DEPARTMENT_LIST = 'fill-department-list', // Заповнення списку підрозділів
    FILL_POSITION_LIST = 'fill-position-list', // Заповнення списку працівників
    POST_WORK_SHEET = 'post-work-sheet', // Заповнення табелю
    POST_ACCRUAL_DOCUMENT = 'post-accrual-document', // Розрахунок разових нарахувань
    SEND_APPLICATION_FSS = 'send-application-fss', // Заявка у ФСС
    POST_PAYMENT_FSS = 'post-payment-fss', // Виплата по заявкам ФСС
    POST_ADVANCE_PAYMENT = 'post-advance-payment', // Виплата авансу
    POST_REGULAR_PAYMENT = 'post-regular-payment', // Виплата зарплати
    CLOSE_PAY_PERIOD = 'close-pay-period', // Закриття розрахункового періоду
    SEND_INCOME_TAX_REPORT = 'send-income-tax-report', // Звіт з ПДФО
    HAPPY_BIRTHDAY = 'happy-birthday', // Привітати з днем народження
}
