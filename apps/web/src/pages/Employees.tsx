import { TablePagination } from '@mui/material';
import PageLayout from '../components/layout/PageLayout';

export default function Employees() {
    return (
        <>
            <PageLayout title="Employees"></PageLayout>
            <TablePagination
                count={2000}
                rowsPerPage={10}
                page={1}
                component="div"
                onPageChange={() => {}}
            />
        </>
    );
}
