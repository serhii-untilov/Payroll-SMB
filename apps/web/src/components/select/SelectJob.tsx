import { FormAutocomplete } from '@/components/form/FormAutocomplete';
import { useJobList } from '@/hooks/useJobList';

type Props = {
    control: any;
    label?: string;
    id?: string;
    name?: string;
};

export function SelectJob({ control, label, id, name }: Props) {
    const { data: jobList } = useJobList();

    return (
        <FormAutocomplete
            valueType={'number'}
            control={control}
            label={label || ''}
            name={name || id || ''}
            id={id || name || ''}
            autoComplete="job"
            options={
                jobList?.map((o) => {
                    return { label: o.name, value: o.id };
                }) ?? []
            }
        />
    );
}
