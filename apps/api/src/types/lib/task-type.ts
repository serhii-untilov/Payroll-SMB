export enum TaskType {
    CreateUser = 'create-user', // Створення користувача
    CreateCompany = 'create-company', // Створення підприємства
    FillDepartmentList = 'fill-department-list', // Заповнення списку підрозділів
    FillPositionList = 'fill-position-list', // Заповнення списку працівників
    PostWorkSheet = 'post-work-sheet', // Заповнення табелю
    PostAccrualDocument = 'post-accrual-document', // Розрахунок разових нарахувань
    SendApplicationFss = 'send-application-fss', // Заявка у ФСС
    PostPaymentFss = 'post-payment-fss', // Виплата по заявкам ФСС
    PostAdvancePayment = 'post-advance-payment', // Виплата авансу
    PostRegularPayment = 'post-regular-payment', // Виплата зарплати
    ClosePayPeriod = 'close-pay-period', // Закриття розрахункового періоду
    SendIncomeTaxReport = 'send-income-tax-report', // Звіт з ПДФО
    HappyBirthday = 'happy-birthday', // Привітати з днем народження
}
