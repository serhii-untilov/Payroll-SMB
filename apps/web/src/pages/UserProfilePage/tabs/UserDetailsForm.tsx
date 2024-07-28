import EmailField from '@/components/EmailField';
import FirstNameField from '@/components/FirstNameField';
import LastNameField from '@/components/LastNameField';
import Toolbar from '@/components/layout/Toolbar';
import SelectLanguage from '@/components/SelectLanguage';
import useLocale from '@/hooks/useLocale';
import { Grid } from '@mui/material';
import { User } from '@repo/openapi';
import { useEffect } from 'react';
import useUserDetailsForm from '../hooks/useUserDetailsForm';

type UserDetailsFormProps = {
    user: User;
};

export default function UserDetailsForm({ user }: UserDetailsFormProps) {
    const { locale } = useLocale();
    const { control, isDirty, handleSubmit, onSubmit, onCancel } = useUserDetailsForm(user);

    useEffect(() => {}, [locale]);

    return (
        <>
            <Toolbar
                onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                onCancel={isDirty ? onCancel : 'disabled'}
            />
            <Grid container component="form" noValidate spacing={2}>
                <Grid container item xs={12} sm={7} md={6} lg={4} spacing={2}>
                    <Grid item xs={12}>
                        <FirstNameField control={control} />
                    </Grid>
                    <Grid item xs={12}>
                        <LastNameField control={control} />
                    </Grid>
                    <Grid item xs={12}>
                        <EmailField control={control} />
                    </Grid>
                    <Grid item xs={12}>
                        <SelectLanguage control={control} />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
