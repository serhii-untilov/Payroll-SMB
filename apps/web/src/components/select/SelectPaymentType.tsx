import { FormAutocomplete } from '@/components/form/FormAutocomplete';
import { getPaymentTypeList } from '@/services/paymentType.service';
import { IPaymentType, IPaymentTypeFilter } from '@repo/shared';
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
    } = useQuery<IPaymentType[], Error>({
        queryKey: ['paymentType', 'list', { companyId, ...filter }],
        queryFn: async () => {
            return companyId ? await getPaymentTypeList(filter) : [];
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
