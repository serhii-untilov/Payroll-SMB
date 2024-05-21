import { Box, Typography } from '@mui/material';
import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import {
    IFindPositionBalance,
    IPosition,
    getFullName,
    getUnitByCalcMethod,
    maxDate,
} from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { numericFormatter } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '../../../components/grid/DataGrid';
import { Toolbar } from '../../../components/layout/Toolbar';
import { Loading } from '../../../components/utility/Loading';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { deletePosition, getPositionsBalance } from '../../../services/position.service';

export function SalaryReport(props: IFindPositionBalance) {
    const { companyId } = props;
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const navigate = useNavigate();
    const { payPeriod } = useAppContext();
    const { locale } = useLocale();

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
            resizable: true,
            sortable: true,
            renderCell: (params) => {
                const unit = getUnitByCalcMethod(params.row.paymentType?.calcMethod || '');
                const unitName = unit === 'month' ? '' : ` / ${t(unit)}`;
                const fullName = getFullName(
                    params.row.lastName,
                    params.row.firstName,
                    params.row.middleName,
                );
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
                                color="textSecondary"
                                sx={{ fontSize: '1rem', fontWeight: 'medium' }}
                            >
                                {params.row?.wage
                                    ? `${numericFormatter(params.row?.wage?.toFixed(2), { thousandSeparator: ' ' })} ${unitName}`
                                    : ''}
                            </Typography>
                            {Number(params.row?.rate) !== 1 && (
                                <Typography sx={{ textAlign: 'right' }} color="warning.main">
                                    {params.row?.rate || ''}
                                </Typography>
                            )}
                        </Box>
                    </div>
                );
            },
        },
        {
            field: 'hoursWorked',
            headerName: t('Hours Worked'),
            type: 'number',
            width: 160,
            sortable: true,
            valueGetter: (params) => {
                return Number(params.value) === 0 ? '' : params.value;
            },
            renderCell: (params) => {
                const planHours = 168;
                const factHours = 168;
                return (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Plan')}</Typography>
                            <Typography sx={{ textAlign: 'right' }}>
                                {planHours.toFixed(2) || ''}
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
                                {factHours.toFixed(2) || ''}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: 'compensation',
            headerName: t('Compensation'),
            type: 'number',
            width: 180,
            sortable: true,
            valueGetter: (params) => {
                const compensation = params.row?.basic || 0;
                return compensation
                    ? numericFormatter(compensation.toFixed(2), {
                          thousandSeparator: ' ',
                      })
                    : '';
            },
            renderCell: (params) => {
                const inBalance = params.row?.inBalance || 0;
                const wage = params.row?.wage || 0;
                const compensation = params.row?.basic || 0;
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
                                {numericFormatter(inBalance.toFixed(2), {
                                    thousandSeparator: ' ',
                                })}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Compensation')}</Typography>
                            <Typography
                                sx={{ textAlign: 'right' }}
                                color={wage === compensation ? 'text.primary' : 'warning.main'}
                            >
                                {compensation
                                    ? numericFormatter(compensation.toFixed(2), {
                                          thousandSeparator: ' ',
                                      })
                                    : ''}
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
                const bonus = params.row?.bonus || 0;
                const otherEarnings = params.row?.other_accruals;
                return (
                    <Box sx={{ width: '100%' }}>
                        {adjustments ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t('Adjustments')}</Typography>
                                <Typography sx={{ textAlign: 'right' }}>
                                    {adjustments
                                        ? numericFormatter(adjustments.toFixed(2), {
                                              thousandSeparator: ' ',
                                          })
                                        : ''}
                                </Typography>
                            </Box>
                        ) : null}
                        {bonus ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t('Bonus')}</Typography>
                                <Typography sx={{ textAlign: 'right' }}>
                                    {bonus
                                        ? numericFormatter(bonus.toFixed(2), {
                                              thousandSeparator: ' ',
                                          })
                                        : ''}
                                </Typography>
                            </Box>
                        ) : null}
                        {otherEarnings ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t('Other Earnings')}</Typography>
                                <Typography sx={{ textAlign: 'right' }}>
                                    {otherEarnings
                                        ? numericFormatter(otherEarnings.toFixed(2), {
                                              thousandSeparator: ' ',
                                          })
                                        : ''}
                                </Typography>
                            </Box>
                        ) : null}
                    </Box>
                );
            },
        },
        {
            field: 'deductions',
            headerName: t('Taxes & Deductions'),
            type: 'number',
            width: 230,
            sortable: true,
            renderCell: (params) => {
                const incomeTax = params.row?.taxes;
                const militaryTax: number = 0;
                const otherDeductions = params.row?.other_deductions;
                return (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Income Tax')}</Typography>
                            <Typography sx={{ textAlign: 'right' }}>
                                {incomeTax
                                    ? numericFormatter(incomeTax.toFixed(2), {
                                          thousandSeparator: ' ',
                                      })
                                    : ''}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Military Tax')}</Typography>
                            <Typography sx={{ textAlign: 'right' }}>
                                {militaryTax
                                    ? numericFormatter(militaryTax.toFixed(2), {
                                          thousandSeparator: ' ',
                                      })
                                    : ''}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Other Deductions')}</Typography>
                            <Typography sx={{ textAlign: 'right' }}>
                                {otherDeductions
                                    ? numericFormatter(otherDeductions.toFixed(2), {
                                          thousandSeparator: ' ',
                                      })
                                    : ''}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: 'grossPay',
            headerName: t('Gross Pay'),
            type: 'number',
            width: 240,
            sortable: true,
            valueGetter: (params) => {
                return params.row?.wage || '';
            },
            renderCell: (params) => {
                const grossPay =
                    (params.row?.inBalance || 0) +
                    (params.row?.accruals || 0) -
                    ((params.row?.deductions || 0) - (params.row?.payments || 0));
                const paid = params.row?.payments || 0;
                const outBalance = params.row?.outBalance || 0;
                return (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Gross Pay')}</Typography>
                            <Typography
                                sx={{ textAlign: 'right', fontSize: '1rem', fontWeight: 'medium' }}
                            >
                                {grossPay
                                    ? numericFormatter(grossPay.toFixed(2), {
                                          thousandSeparator: ' ',
                                      })
                                    : ''}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color={paid ? '' : 'divider'}>{t('Paid')}</Typography>
                            <Typography sx={{ textAlign: 'right' }} color={paid ? '' : 'divider'}>
                                {numericFormatter(paid.toFixed(2), {
                                    thousandSeparator: ' ',
                                })}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Debt')}</Typography>
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
                                {outBalance
                                    ? numericFormatter(outBalance.toFixed(2), {
                                          thousandSeparator: ' ',
                                      })
                                    : ''}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: 'companyExpenses',
            headerName: t('Company Expenses'),
            type: 'number',
            width: 240,
            sortable: true,
            renderCell: (params) => {
                const fundUSC: number = 0;
                const accruals = params.row?.accruals || 0;
                const companyExpensesTotal: number = accruals + fundUSC;
                return (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Fund USC')}</Typography>
                            <Typography
                                sx={{ textAlign: 'right' }}
                                color={
                                    accruals > 0 && fundUSC <= 0
                                        ? 'error.main'
                                        : !fundUSC
                                          ? 'divider'
                                          : ''
                                }
                            >
                                {numericFormatter(fundUSC.toFixed(2), {
                                    thousandSeparator: ' ',
                                })}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{t('Total')}</Typography>
                            <Typography sx={{ textAlign: 'right' }}>
                                {companyExpensesTotal
                                    ? numericFormatter(companyExpensesTotal.toFixed(2), {
                                          thousandSeparator: ' ',
                                      })
                                    : ''}
                            </Typography>
                        </Box>
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
    } = useQuery<IPosition[], Error>({
        queryKey: ['position', 'list', props],
        queryFn: async () => {
            return (await getPositionsBalance(props)).sort((a, b) =>
                (Number(a.cardNumber) || 2147483647) < (Number(b.cardNumber) || 2147483647)
                    ? -1
                    : (Number(a.cardNumber) || 2147483647) > (Number(b.cardNumber) || 2147483647)
                      ? 1
                      : 0,
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

    const onAddPosition = () => {
        navigate('/people/position/');
    };

    const onEditPosition = (positionId: number) => {
        navigate(`/people/position/${positionId}`);
    };

    const submitCallback = (data: IPosition) => {
        queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
    };

    const onDeletePosition = async () => {
        for (const id of rowSelectionModel) {
            await deletePosition(+id);
        }
        queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const onShowHistory = () => {
        console.log('onShowHistory');
    };

    const onShowDeleted = () => {
        console.log('onShowDeleted');
    };

    const onRestoreDeleted = () => {
        console.log('onRestoreDeleted');
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
                    details: GridCallbackDetails,
                ) => {
                    if (event.code === 'Enter') {
                        onEditPosition(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    event: MuiEvent,
                    details: GridCallbackDetails,
                ) => onEditPosition(params.row.id)}
            />
        </>
    );
}
