import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
} from '@mui/x-data-grid';
import { ICompanyManager } from '@repo/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '../../../components/grid/DataGrid';
import { Toolbar } from '../../../components/layout/Toolbar';

type Props = {
    companyId: number | undefined;
};

export function CompanyManagers(params: Props) {
    const { companyId } = params;
    const { t } = useTranslation();
    const [openForm, setOpenForm] = useState(false);
    const [managerId, setManagerId] = useState<number | null>(null);
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const columns: GridColDef[] = [
        // { field: 'id', headerName: t('ID'), type: 'number', width: 70 },
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
            valueGetter: (params) => {
                return '';
            },
        },
        {
            field: 'department',
            headerName: t('Department'),
            type: 'string',
            width: 240,
            sortable: true,
            valueGetter: (params) => {
                return '';
            },
        },
        {
            field: 'taxId',
            headerName: t('Tax ID'),
            type: 'string',
            width: 220,
            sortable: true,
            valueGetter: (params) => {
                return '';
            },
        },
        {
            field: 'phone',
            headerName: t('Phone'),
            type: 'string',
            width: 160,
            sortable: true,
            valueGetter: (params) => {
                return '';
            },
        },
        {
            field: 'email',
            headerName: t('Email Address'),
            type: 'string',
            width: 220,
            sortable: true,
            valueGetter: (params) => {
                return '';
            },
        },
    ];

    const onAddManager = () => {
        console.log('onAdd');
    };

    const onEditManager = (managerId: number) => {
        console.log('onEdit');
    };

    const submitCallback = (data: ICompanyManager) => {
        console.log('submitCallback');
    };

    const onDeleteManager = async () => {
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
                    details: GridCallbackDetails,
                ) => {
                    if (event.code === 'Enter') {
                        onEditManager(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    event: MuiEvent,
                    details: GridCallbackDetails,
                ) => {
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
