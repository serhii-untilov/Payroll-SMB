import CompanyNameField from '@/components/CompanyNameField';
import Toolbar from '@/components/layout/Toolbar';
import SelectAccounting from '@/components/SelectAccounting';
import SelectLaw from '@/components/SelectLaw';
import SelectPayPeriodField from '@/components/SelectPayPeriodField';
import TaxIdField from '@/components/TaxIdField';
import useAppContext from '@/hooks/context/useAppContext';
import useDefaultAccountingId from '@/hooks/useDefaultAccountingId';
import useDefaultLawId from '@/hooks/useDefaultLawId';
import { Grid } from '@mui/material';
import { Company } from '@repo/openapi';
import useForm from './CompanyDetails.hooks';

type CompanyDetailsProps = {
    company?: Company | undefined;
    setCompanyId?: (companyId: number) => void;
};

export default function CompanyDetails(props: CompanyDetailsProps) {
    const { company: currentCompany } = useAppContext();
    const defaultLawId = useDefaultLawId();
    const defaultAccountingId = useDefaultAccountingId();
    const { control, isDirty, handleSubmit, onSubmit, onCancel } = useForm({
        company: props.company,
        defaultLawId,
        defaultAccountingId,
        setCompanyId: props.setCompanyId,
    });

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
