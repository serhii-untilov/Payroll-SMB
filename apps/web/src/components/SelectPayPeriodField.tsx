import { InputLabel } from '@/components/layout/InputLabel';
import SelectPayPeriod from '@/components/SelectPayPeriod';
import { Company } from '@repo/openapi';
import { monthBegin } from '@repo/shared';
import { format } from 'date-fns';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Props = {
    control: any;
    company: Company | undefined;
};

export default function SelectPayPeriodField(props: Props) {
    const { t } = useTranslation();
    return (
        <>
            <InputLabel>{t('Pay Period')}</InputLabel>
            <Controller
                name={'payPeriod'}
                control={props.control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <SelectPayPeriod
                        companyId={props.company?.id}
                        label={''}
                        name="payPeriod"
                        autoComplete="payPeriod"
                        error={!!error}
                        onChange={(event: any) => onChange(new Date(event.target.value))}
                        value={format(value ?? monthBegin(new Date()), 'yyyy-MM-dd')}
                    />
                )}
            />
        </>
    );
}
