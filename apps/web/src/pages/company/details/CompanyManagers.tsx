import { GridCellParams, GridColDef, GridRowSelectionModel, MuiEvent } from '@mui/x-data-grid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '../../../components/grid/DataGrid';
import { Toolbar } from '../../../components/layout/Toolbar';

type Props = {
    companyId: number | undefined;
};

export function CompanyManagers(_params: Props) {
    const { t } = useTranslation();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const columns: GridColDef[] = [
        {
            field: 'fullName',
            headerName: t('Full Name'),
            type: 'string',
            width: 290,
            sortable: true,
            valueGetter: (params) => {
                return `${params.row.firstName} ${params.row.lastName}`;
            },
        },
        {
            field: 'job',
            headerName: t('Job'),
            type: 'string',
            width: 240,
            sortable: true,
            valueGetter: (_params) => {
                return '';
            },
        },
        {
            field: 'department',
            headerName: t('Department'),
            type: 'string',
            width: 240,
            sortable: true,
            valueGetter: (_params) => {
                return '';
            },
        },
        {
            field: 'taxId',
            headerName: t('Tax ID'),
            type: 'string',
            width: 220,
            sortable: true,
            valueGetter: (_params) => {
                return '';
            },
        },
        {
            field: 'phone',
            headerName: t('Phone'),
            type: 'string',
            width: 160,
            sortable: true,
            valueGetter: (_params) => {
                return '';
            },
        },
        {
            field: 'email',
            headerName: t('Email Address'),
            type: 'string',
            width: 220,
            sortable: true,
            valueGetter: (_params) => {
                return '';
            },
        },
    ];

    const onAddManager = () => {
        console.log('onAdd');
    };

    const onEditManager = (_managerId: number) => {
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
                onAdd={onAddManager}
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
                        onEditManager(params.row.id);
                    }
                }}
                onRowDoubleClick={() => {
                    // onEditManager(params.row.id)
                }}
            />
            {/* <ManagerForm
                open={openForm}
                setOpen={setOpenForm}
                managerId={managerId}
                submitCallback={submitCallback}
            /> */}
        </>
    );
}
