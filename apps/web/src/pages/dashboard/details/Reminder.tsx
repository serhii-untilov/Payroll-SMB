import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { Loading } from '../../../components/utility/Loading';
import { ReminderEvent } from './ReminderEvent';
import { add } from 'date-fns';

type Props = {
    companyId: number | undefined;
};

// TODO: move to shared library and make interface
export type IEvent = { date: Date; description: string };

const events: IEvent[] = [
    { date: new Date(), description: 'День народження Петренко Ганна' },
    // { date: add(new Date(), { days: 1 }), description: 'Абонплата за користування ПЗ' },
];

export function Reminder(props: Props) {
    const { companyId } = props;

    const { data, isError, isLoading, error } = useQuery<IEvent[], Error>({
        queryKey: ['event', 'list', props],
        queryFn: async () => {
            return events;
        },
        enabled: !!companyId,
    });

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    if (isLoading) {
        return <Loading />;
    }

    return <>{data?.map((event) => <ReminderEvent event={event} />)}</>;
}
