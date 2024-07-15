import { api } from '@/api';
import { FormAutocomplete } from '@/components/form/FormAutocomplete';
import { PaymentType } from '@repo/openapi';
import { IPaymentTypeFilter, ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

interface Props {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
    filter?: IPaymentTypeFilter;
    autoFocus?: boolean;
    disabled?: boolean;
    sx?: any;
}

export function SelectPaymentType({
    companyId,
    control,
    label,
    id,
    name,
    filter,
    autoFocus,
    disabled,
    // sx,
}: Props) {
    const {
        data: paymentTypeList,
        isError: isPaymentTypeListError,
        error: paymentTypeListError,
    } = useQuery<PaymentType[], Error>({
        queryKey: [ResourceType.PAYMENT_TYPE, { companyId, ...(filter ?? {}) }],
        queryFn: async () => {
            const response = companyId
                ? (await api.paymentTypesFindAll(filter ?? {})).data ?? []
                : [];
            return response.sort((a: PaymentType, b: PaymentType) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
        enabled: !!companyId,
    });

    if (isPaymentTypeListError) {
        return enqueueSnackbar(`${paymentTypeListError.name}\n${paymentTypeListError.message}`, {
            variant: 'error',
        });
    }

    return (
        <FormAutocomplete
            disabled={disabled}
            autoFocus={autoFocus}
            valueType={'number'}
            control={control}
            label={label || ''}
            name={name || id || ''}
            id={id || name || ''}
            autoComplete="paymentType"
            options={
                paymentTypeList?.map((o) => {
                    return { label: o.name, value: o.id };
                }) ?? []
            }
        />
    );
}
