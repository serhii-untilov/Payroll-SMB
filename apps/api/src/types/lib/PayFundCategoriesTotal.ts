export type PayFundCategoriesTotal = {
    employees?: number;
    invalidity?: number;
    maternity?: number;
    government?: number;
};

export const defaultPayFundCategoriesTotal: PayFundCategoriesTotal = {
    employees: 0,
    invalidity: 0,
    maternity: 0,
    government: 0,
};
