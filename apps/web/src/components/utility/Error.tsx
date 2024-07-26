import { snackbarError } from '@/utils/snackbar';
import { AxiosError } from 'axios';

type Props = {
    error: unknown;
};

export default function Error({ error }: Props) {
    const e = error as AxiosError;
    snackbarError(`${e.code}\n${e.message}`);
    return null;
}
