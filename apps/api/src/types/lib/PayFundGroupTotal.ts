export type PayFundGroupTotal = {
    ECB?: number;
    custom?: number;
};

export const defaultPayFundGroupsTotal: PayFundGroupTotal = {
    ECB: 0,
    custom: 0,
};
