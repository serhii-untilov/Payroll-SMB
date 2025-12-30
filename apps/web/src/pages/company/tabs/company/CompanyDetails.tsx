import CompanyNameField from '@/components/CompanyNameField';
import Toolbar from '@/components/layout/Toolbar';
import SelectAccounting from '@/components/SelectAccounting';
import SelectLaw from '@/components/SelectLaw';
import SelectPayPeriodField from '@/components/SelectPayPeriodField';
import TaxIdField from '@/components/TaxIdField';
import { selectCompany } from '@/store/slices/companySlice';
import { useAppSelector } from '@/store/store.hooks';
import { Grid } from '@mui/material';
import { Company } from '@repo/openapi';
import useCompanyDetails from './CompanyDetails.hooks';

export type CompanyDetailsProps = {
    company?: Company | undefined;
    setCompanyId?: (companyId: string | null | undefined) => void;
};

export default function CompanyDetails(props: CompanyDetailsProps) {
    const currentCompany = useAppSelector(selectCompany);
    const { control, isDirty, handleSubmit, onSubmit, onCancel } = useCompanyDetails(props);

    return (
        <>
            <Toolbar
                onSave={isDirty || !currentCompany ? handleSubmit(onSubmit) : 'disabled'}
                onCancel={isDirty || !currentCompany ? onCancel : 'disabled'}
            />
            <Grid
                container
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                spacing={2}
                sx={{ mb: 1 }}
            >
                <Grid container item xs={12} sm={12} md={8} lg={6} spacing={2}>
                    <Grid item xs={12}>
                        <CompanyNameField control={control} />
                    </Grid>
                    <Grid item xs={12} sm={8} md={6}>
                        <SelectLaw control={control} />
                    </Grid>
                    <Grid item xs={12} sm={8} md={6}>
                        <TaxIdField control={control} />
                    </Grid>
                    <Grid item xs={12} sm={8} md={6}>
                        <SelectAccounting control={control} />
                    </Grid>
                    <Grid item xs={12} sm={8} md={6}>
                        <SelectPayPeriodField control={control} company={props.company} />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
