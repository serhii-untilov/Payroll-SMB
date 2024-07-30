import DateFrom from '@/components/DateFrom';
import DateTo from '@/components/DateTo';
import DepartmentName from '@/components/DepartmentName';
import { Button } from '@/components/layout/Button';
import { SelectDepartment } from '@/components/SelectDepartment';
import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Company, Department } from '@repo/openapi';
import { Dispatch, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import useDepartmentForm from './DepartmentForm.hooks';

export interface DepartmentFormProps {
    company: Company;
    open: boolean;
    setOpen: Dispatch<boolean>;
    department?: Department;
    setDepartmentId?: Dispatch<number>;
}

export default function DepartmentForm(props: DepartmentFormProps) {
    const { t } = useTranslation();
    const { control, handleSubmit, onSubmit, onCancel } = useDepartmentForm(props);

    return (
        <Fragment>
            <Dialog disableRestoreFocus open={props.open} onClose={async () => onCancel}>
                <DialogTitle>{t('Department')}</DialogTitle>
                <DialogContent>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <DepartmentName
                                control={control}
                                autoFocus
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateFrom control={control} />
                        </Grid>

                        <Grid item xs={6}>
                            <DateTo control={control} />
                        </Grid>

                        <Grid item xs={12}>
                            <SelectDepartment companyId={props.company.id} control={control} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mr: 2, pt: 0 }}>
                    <Button onClick={handleSubmit(onSubmit)}>{t('Update')}</Button>
                    <Button color="secondary" onClick={onCancel}>
                        {t('Cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
