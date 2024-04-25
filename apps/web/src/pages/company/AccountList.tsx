import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
} from '@mui/x-data-grid';
import { ICompanyAccount } from '@repo/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { DataGrid } from '../../components/grid/DataGrid';
import { Toolbar } from '../../components/layout/Toolbar';
import { CompanyDetailsProps } from './CompanyDetails';

export function AccountList(params: CompanyDetailsProps) {
    const { companyId } = params;
    const { t } = useTranslation();
    const [openForm, setOpenForm] = useState(false);
    const [accountId, setAccountId] = useState<number | null>(null);
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const columns: GridColDef[] = [
        {
            field: 'accountNumber',
            headerName: t('Account Number'),
            type: 'string',
            width: 240,
            sortable: true,
        },
        {
            field: 'bank',
            headerName: t('Bank'),
            type: 'string',
            width: 240,
            sortable: true,
            valueGetter: (params) => {
                return params.row.bank.name;
            },
        },
        {
            field: 'currency',
            headerName: t('Currency'),
            type: 'string',
            width: 160,
            sortable: true,
            valueGetter: (params) => {
                return params.row.currency.code;
            },
        },
        {
            field: 'description',
            headerName: t('Description'),
            type: 'string',
            width: 160,
            sortable: true,
        },
    ];

    const onAddAccount = () => {
        console.log('onAdd');
    };

    const onEditAccount = (accountId: number) => {
        console.log('onEdit');
    };

    const submitCallback = (data: ICompanyAccount) => {
        console.log('submitCallback');
    };

    const onDeleteAccount = async () => {
        console.log('onDelete');
    };

    const onPrint = () => {
        console.log('onPrint');
    };

    const onExport = () => {
        console.log('onExport');
    };

    return (
        <>
            <Toolbar
                onAdd={onAddAccount}
                onDelete={'disabled'}
                onPrint={onPrint}
                onExport={onExport}
                onShowHistory={'disabled'}
                onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
            />
            <DataGrid
                rows={[]}
                columns={columns}
                checkboxSelection={true}
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
                        onEditAccount(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    event: MuiEvent,
                    details: GridCallbackDetails,
                ) => {
                    // onEditAccount(params.row.id)
                }}
            />
            {/* <AccountForm
                open={openForm}
                setOpen={setOpenForm}
                accountId={accountId}
                submitCallback={submitCallback}
            /> */}
        </>
    );
}
