import { enqueueSnackbar } from 'notistack';
import { FieldErrors } from 'react-hook-form';

export function snackbarError(message: string) {
    enqueueSnackbar(message, { variant: 'error' });
}

export function snackbarWarning(message: string) {
    enqueueSnackbar(message, { variant: 'warning' });
}

export function snackbarInfo(message: string) {
    enqueueSnackbar(message, { variant: 'info' });
}

export function snackbarFormErrors(t: any, formErrors: FieldErrors) {
    Object.keys(formErrors).forEach((key) => {
        if (formErrors[key]?.message) {
            enqueueSnackbar(t(formErrors[key]?.message), { variant: 'error' });
        }
    });
}
