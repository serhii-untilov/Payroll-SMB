import { AppMessage } from '@/types';
import { enqueueSnackbar, VariantType } from 'notistack';
import { FieldErrors } from 'react-hook-form';

export function snackbarInfo(info: AppMessage, variant?: VariantType) {
    const message = info.code || info.message ? `${info.code}\n${info.message}` : 'Unknown message';
    enqueueSnackbar(message, { variant: variant ?? 'info' });
}

export function snackbarError(error: AppMessage) {
    snackbarInfo(error, 'error');
}

export function snackbarWarning(message: AppMessage) {
    snackbarInfo(message, 'warning');
}

export function snackbarFormErrors(t: any, formErrors: FieldErrors) {
    Object.keys(formErrors).forEach((key) => {
        if (formErrors[key]?.message) {
            enqueueSnackbar(t(formErrors[key]?.message), { variant: 'error' });
        }
    });
}
