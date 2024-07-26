import { AppError } from '@/types';
import { snackbarError } from '@/utils/snackbar';

type ErrorProps = {
    error: AppError;
};

export default function Error({ error }: ErrorProps) {
    const { code, message } = error;
    snackbarError(code || message ? `${code ?? ''}\n${message ?? ''}` : 'Unknown error.');
    return null;
}
