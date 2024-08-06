import { FormInputDropdown } from '@/components/form/FormInputDropdown';
import { useGetAccountingList } from '@/hooks/queries/useAccounting';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from './ErrorDisplay';

type Props = {
    control: any;
};

export default function SelectAccounting(props: Props) {
    const { data, isError, error } = useGetAccountingList();
    const { t } = useTranslation();
    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <FormInputDropdown
                    control={props.control}
                    label={t('Accounting')}
                    name="accountingId"
                    autoComplete="accountingId"
                    type="number"
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
