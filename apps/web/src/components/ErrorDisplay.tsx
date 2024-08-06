import { AppMessage } from '@/types';
import { snackbarError } from '@/utils/snackbar';

type ErrorProps = {
    error: AppMessage;
};

export default function ErrorDisplay({ error }: ErrorProps) {
    snackbarError(error);
    return null;
}
