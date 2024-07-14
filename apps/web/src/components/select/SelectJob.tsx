import { FormAutocomplete } from '@/components/form/FormAutocomplete';
import { getJobList } from '@/services/job.service';
import { IJob } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

interface Props {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectJob({ companyId, control, label, id, name }: Props) {
    const { data: jobList } = useJobList();
        isError: isJobListError,
        error: jobListError,
    } = useQuery<IJob[], Error>({
        queryKey: ['job', 'list', { companyId }],
        queryFn: async () => {
            return companyId ? await getJobList() : [];
        },
        enabled: !!companyId,
    });

    if (isJobListError) {
        return enqueueSnackbar(`${jobListError.name}\n${jobListError.message}`, {
            variant: 'error',
        });
    }

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
