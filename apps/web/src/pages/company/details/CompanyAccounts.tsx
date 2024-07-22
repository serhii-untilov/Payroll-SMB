import { DataGrid, Toolbar } from '@/components';
import { GridCellParams, GridColDef, GridRowSelectionModel, MuiEvent } from '@mui/x-data-grid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    companyId: number | undefined;
};

export function CompanyAccounts(_params: Props) {
    const { t } = useTranslation();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const columns: GridColDef[] = [
        {
            field: 'accountNumber',
            headerName: t('Account Number'),
            type: 'string',
            width: 280,
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

    const onEditAccount = (_accountId: number) => {
        console.log('onEdit');
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
                ) => {
                    if (event.code === 'Enter') {
                        onEditAccount(params.row.id);
                    }
                }}
                onRowDoubleClick={() => {
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
