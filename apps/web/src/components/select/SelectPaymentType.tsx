import { snackbarError } from '@/utils/snackbar';
import { FindAllPaymentTypeDto, PaymentType, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';
import { FormAutocomplete } from '../form/FormAutocomplete';
import { paymentTypesFindAll } from '@/services/paymentType.service';

type Props = {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
    filter?: FindAllPaymentTypeDto;
    autoFocus?: boolean;
    disabled?: boolean;
    sx?: any;
};

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
        queryKey: [ResourceType.PaymentType, { companyId, ...(filter ?? {}) }],
        queryFn: async () => {
            return companyId ? (await paymentTypesFindAll(filter ?? {})) ?? [] : [];
        },
        enabled: !!companyId,
    });

    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
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
