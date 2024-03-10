import { useQuery } from 'react-query';
import { CompanyDetailsProps } from './CompanyDetails';
import { ICompany, IDepartment } from '@repo/shared';
import { getDepartmentList } from '../../services/department.service';
import { Loading } from '../../components/utility/Loading';
import { enqueueSnackbar } from 'notistack';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { FormDate } from '../../components/data/Date';
import { useTranslation } from 'react-i18next';
import { TableToolbar } from '../../components/layout/TableToolbar';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DepartmentForm from './DepartmentForm';
import { useState } from 'react';

export function CompanyDepartments(params: CompanyDetailsProps) {
    const { companyId } = params;
    const { t } = useTranslation();
    const [openForm, setOpenForm] = useState(false);

    const columns: GridColDef[] = [
        // { field: 'id', headerName: t('ID'), type: 'number', width: 70 },
        {
            field: 'name',
            headerName: t('Name'),
            type: 'string',
            width: 600,
            sortable: true,
        },
        { field: 'dateFrom', headerName: t('Date From'), type: 'date', width: 130, sortable: true },
        { field: 'dateTo', headerName: t('Date To'), type: 'date', width: 130, sortable: true },
        {
            field: 'parent.name',
            headerName: t('Parent Department'),
            type: 'string',
            width: 600,
            sortable: true,
        },
    ];

    const {
        data: departmentList,
        isError: isDepartmentListError,
        isLoading: isDepartmentListLoading,
        error: departmentListError,
    } = useQuery<IDepartment[], Error>('departmentList', async () => {
        return getDepartmentList(companyId);
    });

    if (isDepartmentListLoading) {
        return <Loading />;
    }

    if (isDepartmentListError) {
        return enqueueSnackbar(`${departmentListError.name}\n${departmentListError.message}`, {
            variant: 'error',
        });
    }

    const onAddDepartment = () => {
        setOpenForm(true);
    };

    const onDeleteDepartment = () => {
        console.log('onDeleteDepartment');
    };

    return (
        <>
            <TableToolbar
                onAdd={onAddDepartment}
                onDelete={onDeleteDepartment}
                deleteDisabled={true}
            />
            {/* <TableContainer
                component={Paper}
                sx={{
                    width: '100%',
                    flex: 1,
                }}
            >
                <Table sx={{ width: '100%', flex: 1 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Name')}</TableCell>
                            <TableCell align="right">{t('Date From')}</TableCell>
                            <TableCell align="right">{t('Date To')}</TableCell>
                            <TableCell align="right">{t('Parent Department')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            // minWidth: 650,
                            width: '100%',
                            bgcolor: 'red',
                            color: 'red',
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                        }}
                    >
                        {departmentList?.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">
                                    <FormDate date={row.dateFrom} />
                                </TableCell>
                                <TableCell align="right">
                                    <FormDate date={row.dateTo} />
                                </TableCell>
                                <TableCell align="right">
                                    {row?.parentDepartment?.name || ''}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
            <DataGrid
                // sx={{
                //     '.MuiDataGrid-columnSeparator': {
                //         // display: 'none',
                //         color: 'black',
                //     },
                //     '&.MuiDataGrid-root': {
                //         // border: 'none',
                //         color: 'black',
                //     },
                // }}
                rows={departmentList || []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
            <DepartmentForm open={openForm} setOpen={setOpenForm} departmentId={null} />
        </>
    );
}
