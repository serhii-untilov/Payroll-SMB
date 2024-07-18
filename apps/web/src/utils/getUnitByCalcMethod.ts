export function getUnitByCalcMethod(calcMethod: string) {
    if (calcMethod === CalcMethod.WAGE) {
        return 'hour';
    }
    return 'month';
}
