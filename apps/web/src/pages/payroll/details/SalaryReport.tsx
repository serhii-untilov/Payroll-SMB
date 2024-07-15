import { api } from '@/api';
import { DataGrid } from '@/components/grid/DataGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { Loading } from '@/components/utility/Loading';
import useAppContext from '@/hooks/useAppContext';
import { sumFormatter } from '@/utils';
import { Box, Typography } from '@mui/material';
import {
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { PositionBalanceExtendedDto } from '@repo/openapi';
import {
    CalcMethod,
    IFindPositionBalance,
    MAX_SEQUENCE_NUMBER,
    ResourceType,
    getFullName,
    getUnitByCalcMethod,
    maxDate,
} from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function SalaryReport(props: IFindPositionBalance) {
    const { companyId } = props;
    const { t } = useTranslation();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const navigate = useNavigate();
    const { payPeriod } = useAppContext();

    const columns: GridColDef[] = [
        {
            field: 'cardNumber',
            headerName: t('Card Number'),
            type: 'string',
            width: 120,
            sortable: true,
        },
        {
            field: 'position',
            headerName: t('Employee'),
            width: 250,
            // Warning: Failed prop type: MUI: `column.resizable = true` is not a valid prop.
            // Column resizing is not available in the MIT version.
            // resizable: true,
            sortable: true,
            renderCell: (params) => {
                const unit = getUnitByCalcMethod(params.row?.calcMethod || '');
                const unitName = unit === 'month' ? '' : ` / ${t(unit)}`;
                const fullName = getFullName(
                    params.row.lastName,
                    params.row.firstName,
                    params.row.middleName,
                );
                const wage = params.row?.wage;
                const rate = params.row?.rate;
                return (
                    <div style={{ width: '100%' }}>
                        <Typography
                            sx={{ fontSize: '1rem', fontWeight: 'medium' }}
                            color={'primary'}
                        >
                            {fullName}
                        </Typography>
                        <Typography color="textSecondary">{params.row?.jobName || ''}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography
                                color={wage ? 'textSecondary' : 'warning.main'}
                                sx={{ fontSize: '1rem', fontWeight: 'medium' }}
                            >
                                {`${sumFormatter(wage, false)} ${unitName}`}
                            </Typography>
                            {Number(rate) !== 1 && (
                                <Typography sx={{ textAlign: 'right' }} color="warning.main">
                                    {`${t('Rate')}: ${sumFormatter(rate, false)}`}
                                </Typography>
                            )}
                        </Box>
                    </div>
                );
            },
        },
        {
            field: 'hoursWorked',
            headerName: t('Working Time'),
            type: 'number',
            width: 140,
            sortable: true,
            valueGetter: (params) => {
                return Number(params.value) === 0 ? '' : params.value;
            },
            renderCell: (params) => {
                const unit = getUnitByCalcMethod(params.row?.calcMethod || '');
                const planDays = params.row.planDays || 0;
                const planHours = params.row.planHours || 0;
                const factDays = params.row.factDays || 0;
                const factHours = params.row.factHours || 0;
                return (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Plan')}</Typography>
                            <Typography sx={{ textAlign: 'right' }}>
                                {(unit === 'hour' ? planHours.toFixed(2) : planDays) || ''}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Fact')}</Typography>
                            <Typography
                                sx={{ textAlign: 'right' }}
                                color={
                                    factHours > planHours
                                        ? 'error.main'
                                        : factHours < planHours
                                          ? 'warning.main'
                                          : ''
                                }
                            >
                                {unit === 'hour' ? factHours.toFixed(2) : factDays || ''}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: 'compensation',
            headerName: t('Gross Pay'),
            type: 'number',
            width: 180,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.row?.basic);
            },
            renderCell: (params) => {
                const inBalance = params.row?.inBalance || 0;
                const grossPay = params.row?.accruals || 0;
                return (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color={inBalance ? 'warning.main' : 'divider'}>
                                {t('Debt')}
                            </Typography>
                            <Typography
                                sx={{ textAlign: 'right' }}
                                color={inBalance ? 'warning.main' : 'divider'}
                            >
                                {sumFormatter(inBalance, false)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Total')}</Typography>
                            <Typography
                                sx={{ textAlign: 'right', fontSize: '1rem', fontWeight: 'medium' }}
                                color={grossPay ? '' : 'warning.main'}
                            >
                                {sumFormatter(grossPay, false)}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: 'additionalEarnings',
            headerName: t('Additional Earnings'),
            type: 'number',
            width: 230,
            sortable: true,
            renderCell: (params) => {
                const adjustments = params.row?.adjustments;
                const bonus = params.row?.bonuses || 0;
                const otherEarnings = params.row?.other_accruals;
                return (
                    <Box sx={{ width: '100%' }}>
                        {adjustments ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t('Adjustments')}</Typography>
                                <Typography sx={{ textAlign: 'right' }}>
                                    {sumFormatter(adjustments)}
                                </Typography>
                            </Box>
                        ) : null}
                        {bonus ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t('Bonus')}</Typography>
                                <Typography sx={{ textAlign: 'right' }}>
                                    {sumFormatter(bonus)}
                                </Typography>
                            </Box>
                        ) : null}
                        {otherEarnings ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t('Other Earnings')}</Typography>
                                <Typography sx={{ textAlign: 'right' }}>
                                    {sumFormatter(otherEarnings)}
                                </Typography>
                            </Box>
                        ) : null}
                    </Box>
                );
            },
        },
        {
            field: 'deductions',
            headerName: t('Deductions'),
            type: 'number',
            width: 230,
            sortable: true,
            renderCell: (params) => {
                const accruals = params.row?.accruals || 0;
                const incomeTax = params.row?.calcMethodBalance.find(
                    (o) => o.calcMethod === CalcMethod.INCOME_TAX,
                )?.factSum;
                const militaryTax = params.row?.calcMethodBalance.find(
                    (o) => o.calcMethod === CalcMethod.MILITARY_TAX,
                )?.factSum;
                const otherDeductions = params.row?.other_deductions;
                return (
                    <Box sx={{ width: '100%' }}>
                        {incomeTax || accruals ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography
                                    color={!params.row.accruals && !incomeTax ? 'disabled' : ''}
                                >
                                    {t('Income Tax')}
                                </Typography>
                                <Typography
                                    sx={{ textAlign: 'right' }}
                                    color={
                                        params.row.accruals > 0 && incomeTax <= 0
                                            ? 'warning.main'
                                            : !params.row.accruals && !incomeTax
                                              ? 'disabled'
                                              : ''
                                    }
                                >
                                    {sumFormatter(incomeTax)}
                                </Typography>
                            </Box>
                        ) : null}
                        {militaryTax || accruals ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography
                                    color={!params.row.accruals && !militaryTax ? 'disabled' : ''}
                                >
                                    {t('Military Tax')}
                                </Typography>
                                <Typography
                                    sx={{ textAlign: 'right' }}
                                    color={
                                        params.row.accruals > 0 && militaryTax <= 0
                                            ? 'warning.main'
                                            : !params.row.accruals && !militaryTax
                                              ? 'disabled'
                                              : ''
                                    }
                                >
                                    {sumFormatter(militaryTax)}
                                </Typography>
                            </Box>
                        ) : null}
                        {otherDeductions ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t('Other Deductions')}</Typography>
                                <Typography sx={{ textAlign: 'right' }}>
                                    {sumFormatter(otherDeductions)}
                                </Typography>
                            </Box>
                        ) : null}
                    </Box>
                );
            },
        },
        {
            field: 'netPay',
            headerName: t('Net Pay'),
            type: 'number',
            width: 220,
            sortable: true,
            valueGetter: (params) => {
                return params.row?.wage || '';
            },
            renderCell: (params) => {
                const accruals = params.row?.accruals || 0;
                const netPay =
                    (params.row?.inBalance || 0) +
                    (params.row?.accruals || 0) -
                    ((params.row?.deductions || 0) - (params.row?.payments || 0));
                const paid = params.row?.payments || 0;
                const outBalance = params.row?.outBalance || 0;
                return (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color={netPay ? '' : 'divider'}>{t('Net Pay')}</Typography>
                            <Typography
                                sx={{ textAlign: 'right', fontSize: '1rem', fontWeight: 'medium' }}
                                color={netPay ? '' : 'divider'}
                            >
                                {sumFormatter(netPay, false)}
                            </Typography>
                        </Box>
                        {paid || accruals ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color={paid ? '' : 'divider'}>{t('Paid')}</Typography>
                                <Typography
                                    sx={{ textAlign: 'right' }}
                                    color={paid ? '' : 'divider'}
                                >
                                    {sumFormatter(paid, false)}
                                </Typography>
                            </Box>
                        ) : null}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color={outBalance ? '' : 'divider'}>{t('Debt')}</Typography>
                            <Typography
                                sx={{ textAlign: 'right' }}
                                color={
                                    outBalance < 0
                                        ? 'error.main'
                                        : outBalance > 0
                                          ? 'primary.main'
                                          : 'divider'
                                }
                            >
                                {sumFormatter(outBalance, false)}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: 'employerExpenses',
            headerName: t('Employer Expenses'),
            type: 'number',
            width: 200,
            sortable: true,
            renderCell: (params) => {
                const fundECB: number = params.row?.paySumECB || 0;
                const accruals = params.row?.accruals || 0;
                const companyExpensesTotal: number = accruals + fundECB;
                return (
                    <Box sx={{ width: '100%' }}>
                        {fundECB || accruals ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t('Fund ECB')}</Typography>
                                <Typography
                                    sx={{ textAlign: 'right' }}
                                    color={
                                        accruals > 0 && fundECB <= 0
                                            ? 'warning.main'
                                            : !fundECB
                                              ? 'divider'
                                              : ''
                                    }
                                >
                                    {sumFormatter(fundECB, false)}
                                </Typography>
                            </Box>
                        ) : null}
                        {companyExpensesTotal || accruals ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t('Total')}</Typography>
                                <Typography sx={{ textAlign: 'right', fontWeight: 'medium' }}>
                                    {sumFormatter(companyExpensesTotal)}
                                </Typography>
                            </Box>
                        ) : null}
                    </Box>
                );
            },
        },
    ];

    const {
        data: positionList,
        isError: isPositionListError,
        isLoading: isPositionListLoading,
        error: positionListError,
    } = useQuery<PositionBalanceExtendedDto[], Error>({
        queryKey: [ResourceType.POSITION, 'balanceExtended', props],
        queryFn: async () => {
            return (await api.positionsFindBalance(props)).data.sort(
                (a, b) =>
                    (Number(a.cardNumber) || MAX_SEQUENCE_NUMBER) -
                    (Number(b.cardNumber) || MAX_SEQUENCE_NUMBER),
            );
        },
        enabled: !!companyId && !!payPeriod,
    });

    if (isPositionListLoading) {
        return <Loading />;
    }

    if (isPositionListError) {
        return enqueueSnackbar(`${positionListError.name}\n${positionListError.message}`, {
            variant: 'error',
        });
    }

    const onEditPosition = (positionId: number) => {
        navigate(`/people/position/${positionId}?return=true`);
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const getRowStatus = (params: any): string => {
        return params.row?.deletedDate
            ? 'Deleted'
            : params.row?.dateTo < maxDate()
              ? 'Dismissed'
              : !params.row?.personId
                ? 'Vacancy'
                : 'Normal';
    };

    return (
        <>
            <Toolbar
                // onAdd={onAddPosition}
                onPrint={positionList?.length ? onPrint : 'disabled'}
                onExport={positionList?.length ? onExport : 'disabled'}
                // onDelete={rowSelectionModel.length ? onDeletePosition : 'disabled'}
                // onShowDeleted={'disabled'}
                // onRestoreDeleted={'disabled'}
                // onShowHistory={'disabled'}
            />
            <DataGrid
                checkboxSelection={false}
                rowHeight={80}
                getRowStatus={getRowStatus}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    cardNumber: false,
                    department: false,
                    dateFrom: false,
                    dateTo: false,
                    additionalEarnings: false,
                }}
                apiRef={gridRef}
                rows={positionList || []}
                columns={columns}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                onCellKeyDown={(
                    params: GridCellParams,
                    event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
                ) => {
                    if (event.code === 'Enter') {
                        onEditPosition(params.row.positionId);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEditPosition(params.row.positionId)}
            />
        </>
    );
}
