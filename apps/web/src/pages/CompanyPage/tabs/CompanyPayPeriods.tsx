import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useCurrentPayPeriod } from '@/hooks/queries/useCurrentPayPeriod';
import { usePayPeriods } from '@/hooks/queries/usePayPeriods';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { companiesSalaryCalculate } from '@/services/api/company.service';
import { payPeriodsClose, payPeriodsOpen } from '@/services/api/payPeriod.service';
import * as utils from '@/utils/invalidateQueries';
import {
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { Company, ResourceType } from '@repo/openapi';
import { dateUTC, monthBegin } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useColumns from '../hooks/useCompanyPeriodsColumns';

type Props = {
    company: Company;
};

export function CompanyPayPeriods({ company }: Props) {
    const companyId = company.id;
    const { locale } = useLocale();
    const { payPeriod, setPayPeriod } = useAppContext();
    const { data: currentPayPeriod, isLoading } = useCurrentPayPeriod({
        companyId,
        relations: false,
        fullFieldList: true,
    });
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const gridRef = useGridApiRef();
    const columns = useColumns(
        locale.dateLocale,
        company?.payPeriod ? dateUTC(new Date(company.payPeriod)) : monthBegin(new Date()),
    );
    const { data: rawData } = usePayPeriods({
        companyId,
        relations: true,
        fullFieldList: true,
    });
    const data = useMemo(() => {
        return rawData
            ?.filter((o) => o.dateFrom.getTime() <= (payPeriod || new Date()).getTime())
            .sort((a, b) => b.dateFrom.getTime() - a.dateFrom.getTime());
    }, [rawData, payPeriod]);

    const onEdit = (_id: number) => {
        navigate('/payroll?tab-index=0&return=true');
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const invalidateQueries = async () => {
        await utils.invalidateQueries(queryClient, [
            ResourceType.Position,
            ResourceType.Company,
            ResourceType.PayPeriod,
            ResourceType.Task,
        ]);
    };

    const onCalculate = async () => {
        await companiesSalaryCalculate(companyId);
        await invalidateQueries();
    };

    const onClose = async () => {
        if (currentPayPeriod) {
            if (currentPayPeriod.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidateQueries();
                return;
            }
            const next = await payPeriodsClose(currentPayPeriod.id, {
                version: currentPayPeriod.version,
            });
            setPayPeriod(next.dateFrom);
            await invalidateQueries();
        }
    };

    const onOpen = async () => {
        if (currentPayPeriod) {
            if (currentPayPeriod.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidateQueries();
                return;
            }
            const prior = await payPeriodsOpen(currentPayPeriod.id, {
                version: currentPayPeriod.version,
            });
            setPayPeriod(prior.dateFrom);
            await invalidateQueries();
        }
    };

    if (isLoading) return <LoadingDisplay />;

    return (
        <>
            <Toolbar
                onCalculate={onCalculate}
                onClose={onClose}
                onOpen={onOpen}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
            />
            <DataGrid
                apiRef={gridRef}
                rows={data || []}
                columns={columns}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    taxes: false,
                }}
                checkboxSelection={false}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                onCellKeyDown={(
                    params: GridCellParams,
                    event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
                ) => {
                    if (event.code === 'Enter') {
                        onEdit(params.row.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEdit(params.row.id)}
            />
        </>
    );
}
