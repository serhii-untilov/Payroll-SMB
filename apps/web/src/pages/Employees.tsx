import { TablePagination } from '@mui/material';
import PageLayout from '../components/layout/PageLayout';
import useLocale from '../hooks/useLocale';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function Employees() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <>
            <PageLayout title={t('Employees')}></PageLayout>
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
