import { FormAutocomplete } from '@/components/form/FormAutocomplete';
import { paymentTypesFindAll } from '@/services/paymentType.service';
import { snackbarError } from '@/utils';
import { FindAllPaymentTypeDto, PaymentType } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

interface Props {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
    filter?: FindAllPaymentTypeDto;
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
    const { data, isError, error } = useQuery<PaymentType[], Error>({
        queryKey: [ResourceType.PAYMENT_TYPE, { companyId, ...(filter ?? {}) }],
        queryFn: async () => {
            return companyId ? (await paymentTypesFindAll(filter ?? {})) ?? [] : [];
        },
        enabled: !!companyId,
    });

    if (isError) {
        return snackbarError(`${error.name}\n${error.message}`);
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
                data?.map((o) => {
                    return { label: o.name, value: o.id };
                }) ?? []
            }
        />
    );
}
