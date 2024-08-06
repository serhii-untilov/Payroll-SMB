import { CalcMethod } from '@repo/openapi';

export function getUnitByCalcMethod(calcMethod: CalcMethod) {
    if (calcMethod === CalcMethod.Wage) {
        return 'hour';
    }
    return 'month';
}
