import { FormInputDropdown } from '@/components/form/FormInputDropdown';
import { useAccountingList } from '@/hooks/queries/useAccounting';
import { useTranslation } from 'react-i18next';
import Error from './utility/Error';
import { Loading } from './utility/Loading';

type Props = {
    control: any;
};

export default function SelectAccounting(props: Props) {
    const { data, isLoading, isError, error } = useAccountingList();
    const { t } = useTranslation();
    return (
        <>
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
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
