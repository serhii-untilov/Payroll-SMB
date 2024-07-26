import { sub } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const usePayrollCalcDate = (date: Date): string => {
    const { t } = useTranslation();

    return useMemo(() => {
        let hours = '' + date.getHours();
        let minutes = '' + date.getMinutes();
        const month = '' + (date.getMonth() + 1);
        const day = '' + date.getDate();
        const year = date.getFullYear();

        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;

        const d = new Date(date);
        if (d.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
            return `${t('today at')} ${hours}:${minutes} `;
        }
        if (d.setHours(0, 0, 0, 0) === sub(new Date(), { days: 1 }).setHours(0, 0, 0, 0)) {
            return `${t('yesterday at')} ${hours}:${minutes} `;
        }
        return `${day}-${month}-${year} ${t('at')} ${hours}:${minutes} `;
    }, [date, t]);
};

export default usePayrollCalcDate;
