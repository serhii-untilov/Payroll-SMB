import { FormInputDropdown } from '@/components/form/FormInputDropdown';
import { useAccountingList } from '@/hooks/queries/useAccounting';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from './utility/ErrorDisplay';
import { LoadingDisplay } from './utility/LoadingDisplay';

type Props = {
    control: any;
};

export default function SelectAccounting(props: Props) {
    const { data, isLoading, isError, error } = useAccountingList();
    const { t } = useTranslation();
    return (
        <>
            {isLoading && <LoadingDisplay />}
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
