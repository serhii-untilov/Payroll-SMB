import { usePaymentTypes } from '@/hooks/queries/usePaymentTypes';
import { FindAllPaymentTypeDto } from '@repo/openapi';
import { FormAutocomplete } from './form/FormAutocomplete';
import ErrorDisplay from './utility/ErrorDisplay';
import { useTranslation } from 'react-i18next';

type SelectPaymentTypeProps = {
    control: any;
    label?: string;
    id?: string;
    name?: string;
    filter?: FindAllPaymentTypeDto;
    autoFocus?: boolean;
    disabled?: boolean;
    sx?: any;
};

export function SelectPaymentType(props: SelectPaymentTypeProps) {
    const { control, label, id, name, filter, autoFocus, disabled } = props;
    const { data, isError, error } = usePaymentTypes(filter);
    const { t } = useTranslation();

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <FormAutocomplete
                    disabled={disabled}
                    autoFocus={autoFocus}
                    valueType={'number'}
                    control={control}
                    label={label ?? t('Type of Payment')}
                    name={name ?? 'paymentTypeId'}
                    id={id ?? name ?? ''}
                    autoComplete="paymentType"
                    options={
                        data?.map((o) => {
                            return { label: o.name, value: o.id };
                        }) ?? []
                    }
                />
            )}
        </>
    );
}