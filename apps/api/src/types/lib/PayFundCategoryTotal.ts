export type PayFundCategoryTotal = {
    employees?: number;
    invalidity?: number;
    maternity?: number;
    government?: number;
};

export const defaultPayFundCategoryTotal: PayFundCategoryTotal = {
    employees: 0,
    invalidity: 0,
    maternity: 0,
    government: 0,
};
