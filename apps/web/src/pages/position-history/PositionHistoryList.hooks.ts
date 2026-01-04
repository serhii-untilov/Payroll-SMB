import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PositionHistoryListProps } from './PositionHistoryList';
import usePositionName from '@/hooks/usePositionName';

export default function usePositionHistoryList(props: PositionHistoryListProps) {
    const { t } = useTranslation();

    const pageTitle = usePositionName(props.position);

    // TODO
    const onAdd = useCallback(async () => console.log('onAdd'), []);
    const onEdit = useCallback((_id: string) => console.log('onEdit'), []);
    const onDelete = useCallback(async () => console.log('onDelete'), []);

    const getRowStatus = useCallback((_params: any) => 'Normal', []);

    const columns = useMemo(
        () => [
            {
                field: 'dateFrom',
                headerName: t('Date From'),
                type: 'string',
                width: 200,
                sortable: true,
            },
            {
                field: 'dateTo',
                headerName: t('Date To'),
                type: 'string',
                width: 200,
                sortable: true,
            },

            {
                field: 'job',
                headerName: t('Job'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params: any) => params?.row?.job?.name || '',
            },
            {
                field: 'department',
                headerName: t('Department'),
                type: 'string',
                width: 300,
                sortable: true,
                valueGetter: (params: any) => params?.row?.department?.name || '',
            },
            {
                field: 'workTimeNorm',
                headerName: t('Work Norm'),
                type: 'string',
                width: 250,
                sortable: true,
                valueGetter: (params: any) => params?.row?.workTimeNorm?.name || '',
            },
            {
                field: 'paymentType',
                headerName: t('Payment Form'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params: any) => params?.row?.paymentType?.name || '',
            },
            {
                field: 'wage',
                headerName: t('Wage'),
                type: 'number',
                width: 130,
                sortable: true,
            },
            {
                field: 'rate',
                headerName: t('Rate'),
                type: 'number',
                width: 130,
                sortable: true,
            },
        ],
        [t],
    );

    return { pageTitle, columns, onAdd, onEdit, onDelete, getRowStatus };
}
