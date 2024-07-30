import { FormDateField } from '@/components/form/FormDateField';
import { FormNumberField } from '@/components/form/FormNumberField';
import SequenceField from '@/components/SequenceField';
import { TabLayout } from '@/components/layout/TabLayout';
import Toolbar from '@/components/layout/Toolbar';
import { SelectDepartment } from '@/components/SelectDepartment';
import { SelectJob } from '@/components/SelectJob';
import { SelectPaymentType } from '@/components/SelectPaymentType';
import SelectPerson from '@/components/SelectPerson';
import { SelectWorkNorm } from '@/components/SelectWorkNorm';
import { AddCircleRounded, HistoryRounded } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { Company, PaymentGroup, Position, PositionHistory } from '@repo/openapi';
import { formatDate, maxDate, minDate } from '@repo/shared';
import { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import useJobForm from './JobForm.hooks';
import CardNumberField from '@/components/CardNumberField';

export interface JobFormProps {
    company: Company;
    position?: Position | undefined;
    positionHistory?: PositionHistory | undefined;
    setPositionId?: Dispatch<number> | undefined;
}

export default function JobForm(props: JobFormProps) {
    const { company, position } = props;
    const { t } = useTranslation();
    const { control, isDirty, handleSubmit, onSubmit, onCancel, onClickHistory } =
        useJobForm(props);

    return (
        <>
            <TabLayout>
                <Toolbar
                    onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                />

                <Grid container>
                    <Grid item md={12} lg={10} xl={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <SelectPerson
                                    control={control}
                                    name="personId"
                                    label={t('Full Name')}
                                    autoFocus={!position?.personId}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <CardNumberField control={control} />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <SequenceField
                                    control={control}
                                    rules={{
                                        required: false,
                                        validate: () => {
                                            return true;
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <SelectJob control={control} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectDepartment companyId={company?.id} control={control} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <SelectPaymentType
                                    control={control}
                                    label={t('Payment Form')}
                                    filter={{ groups: [PaymentGroup.Basic] }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectWorkNorm companyId={company.id} control={control} />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormNumberField
                                    control={control}
                                    name="wage"
                                    id="wage"
                                    label={t('Wage')}
                                    step={500}
                                    min={0}
                                    autoFocus={!!position?.personId}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormNumberField
                                    control={control}
                                    name="rate"
                                    id="rate"
                                    label={t('Rate')}
                                    step={0.25}
                                    min={0}
                                    max={2}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormDateField
                                    control={control}
                                    name="dateFrom"
                                    id="dateFrom"
                                    label={t('Date From')}
                                    defaultValue={formatDate(minDate())}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormDateField
                                    control={control}
                                    name="dateTo"
                                    id="dateTo"
                                    label={t('Date To')}
                                    defaultValue={formatDate(maxDate())}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container sx={{ mt: 2 }}>
                    <Grid item md={12} lg={10} xl={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                {position && position?.personId ? (
                                    <Grid item xs={12}>
                                        <Button
                                            startIcon={<HistoryRounded />}
                                            onClick={() => onClickHistory()}
                                        >
                                            {t('Assignments History')}
                                        </Button>
                                    </Grid>
                                ) : null}
                                <Grid item xs={12}>
                                    <Button startIcon={<AddCircleRounded />}>
                                        {t('Add Work Address')}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid item xs={12}>
                                    <Button startIcon={<AddCircleRounded />}>
                                        {t('Add Additional Earning Type')}
                                    </Button>
                                </Grid>
                                {position && position?.personId ? (
                                    <Grid item xs={12}>
                                        <Button startIcon={<AddCircleRounded />}>
                                            {t('Add Additional Deduction Type')}
                                        </Button>
                                    </Grid>
                                ) : null}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </TabLayout>
        </>
    );
}
