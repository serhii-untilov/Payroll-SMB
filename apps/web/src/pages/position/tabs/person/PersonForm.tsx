import EmailField from '@/components/EmailField';
import FirstNameField from '@/components/FirstNameField';
import { FormDateField } from '@/components/form/FormDateField';
import LastNameField from '@/components/LastNameField';
import { TabLayout } from '@/components/layout/TabLayout';
import Toolbar from '@/components/layout/Toolbar';
import MiddleNameField from '@/components/MiddleNameField';
import PhoneField from '@/components/PhoneField';
import { SelectGender } from '@/components/SelectGender';
import TaxIdField from '@/components/TaxIdField';
import { AddCircleRounded } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import usePersonForm from './PersonForm.hooks';

const PersonForm = ({ person }) => {
    const { t } = useTranslation();
    const { control, isDirty, handleSubmit, onSubmit, onCancel } = usePersonForm({ person });

    return (
        <>
            <TabLayout>
                <Toolbar
                    onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                    onPrint={'disabled'}
                    onExport={'disabled'}
                />

                <Grid container md={12} lg={10} xl={8} spacing={2}>
                    <Grid item xs={12} md={4}>
                        <LastNameField control={control} autoFocus />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FirstNameField control={control} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <MiddleNameField control={control} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <TaxIdField control={control} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormDateField control={control} name="birthDate" id="birthDate" label={t('Birth Date')} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <SelectGender control={control} name="gender" id="gender" label={t('Sex')} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <PhoneField control={control} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <EmailField control={control} />
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }} md={12} lg={10} xl={8} spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Grid item xs={12}>
                            <Button startIcon={<AddCircleRounded />}>{t('Add Payment Method')}</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button startIcon={<AddCircleRounded />}>{t('Add Tax Exemption')}</Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid item xs={12}>
                            <Button startIcon={<AddCircleRounded />}>{t('Add Home Address')}</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </TabLayout>
        </>
    );
};

export default PersonForm;
