import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { positionsRemove } from '@/services/api/position.service';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { PayPeriod, PositionHistory, ResourceType } from '@repo/openapi';
import { date2view, maxDate } from '@repo/shared';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PositionListTabProps } from './PositionsTab';
import { useCallback, useMemo } from 'react';

type Props = PositionListTabProps & {
    payPeriod: PayPeriod;
    rowSelectionModel: GridRowSelectionModel;
};

const usePositionsTab = (props: Props) => {
    const { payPeriod } = props;
    const invalidateQueries = useInvalidateQueries();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onAddPosition = () => navigate('/people/position/?tab-index=0&return=true');

    const onEditPosition = (positionId: number) =>
        navigate(`/people/position/${positionId}?return=true`);

    const onDeletePosition = async () => {
        for (const id of props.rowSelectionModel) {
            await positionsRemove(+id);
        }
        await invalidateQueries([ResourceType.Position]);
    };

    const getRowStatus = (params: any) => {
        return params.row?.deletedDate
            ? 'Deleted'
            : params.row?.dateTo < maxDate()
              ? 'Dismissed'
              : !params.row?.personId
                ? 'Vacancy'
                : 'Normal';
    };

    const findFn = useCallback(
        (positionHistory: PositionHistory) =>
            positionHistory.dateFrom.getTime() <= props.payPeriod.dateTo.getTime() &&
            positionHistory.dateTo.getTime() >= props.payPeriod.dateFrom.getTime(),
        [props],
    );

    const columns = useMemo(
        () => [
            {
                field: 'cardNumber',
                headerName: t('Card Number'),
                type: 'string',
                width: 100,
                sortable: true,
            },
            {
                field: 'name',
                headerName: t('Position'),
                type: 'string',
                width: 250,
                // Warning: Failed prop type: MUI: `column.resizable = true` is not a valid prop.
                // Column resizing is not available in the MIT version.
                // resizable: true,
                sortable: true,
                valueGetter: (params) => {
                    return params.row?.personId ? params.row?.person?.fullName || '' : t('Vacancy');
                },
            },
            {
                field: 'job',
                headerName: t('Job'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return params.row?.history?.findLast((o) => findFn(o))?.job?.name || '';
                },
            },
            {
                field: 'department',
                headerName: t('Department'),
                type: 'string',
                width: 300,
                sortable: true,
                valueGetter: (params) => {
                    return props.payPeriod
                        ? params.row?.history?.findLast((o) => findFn(o))?.department?.name || ''
                        : '';
                },
            },
            {
                field: 'workNorm',
                headerName: t('Work Norm'),
                type: 'string',
                width: 250,
                sortable: true,
                valueGetter: (params) => {
                    return props.payPeriod
                        ? params.row?.history?.findLast((o) => findFn(o))?.workNorm?.name || ''
                        : '';
                },
            },
            {
                field: 'paymentType',
                headerName: t('Payment Form'),
                type: 'string',
                width: 190,
                sortable: true,
                valueGetter: (params) => {
                    return payPeriod
                        ? params.row?.history?.findLast((o) => findFn(o))?.paymentType?.name || ''
                        : '';
                },
            },
            {
                field: 'wage',
                headerName: t('Wage'),
                type: 'number',
                width: 110,
                sortable: true,
                valueGetter: (params) => {
                    const wage = payPeriod
                        ? params.row?.history?.findLast((o) => findFn(o))?.wage || ''
                        : '';
                    return Number(wage) === 0 ? '' : wage;
                },
            },
            {
                field: 'rate',
                headerName: t('Rate'),
                type: 'number',
                width: 80,
                sortable: true,
                valueGetter: (params) => {
                    return payPeriod
                        ? params.row?.history?.findLast((o) => findFn(o))?.rate || ''
                        : '';
                },
            },
            {
                field: 'dateFrom',
                headerName: t('Date From'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return date2view(params.value);
                },
            },
            {
                field: 'dateTo',
                headerName: t('Date To'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return date2view(params.value);
                },
            },
        ],
        [t, props, findFn, payPeriod],
    );

    return { columns, getRowStatus, onAddPosition, onEditPosition, onDeletePosition };
};

export default usePositionsTab;
