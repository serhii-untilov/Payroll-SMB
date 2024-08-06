import { Position } from '@repo/openapi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function usePositionName(position: Position | undefined) {
    const { t } = useTranslation();
    return useMemo(() => {
        const positionName = position
            ? position?.personId
                ? position?.person?.fullName || ''
                : t('Vacancy')
            : t('New Position');
        const jobName = (position?.history?.[0]?.job?.name || '').toLocaleLowerCase();
        return `${positionName}` + (jobName ? `, ${jobName}` : '');
    }, [position, t]);
}
