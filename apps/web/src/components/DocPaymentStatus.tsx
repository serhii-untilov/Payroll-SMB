import { InputLabel, OutlinedInput } from '@mui/material';
import { PaymentStatus } from '@repo/openapi';
import { useTranslation } from 'react-i18next';

interface DocPaymentStatusProps {
    disabled?: boolean;
    control: any;
    status: PaymentStatus;
}

export default function DocPaymentStatus(props: DocPaymentStatusProps) {
    const { t } = useTranslation();
    return (
        <>
            <InputLabel>{t('Status')}</InputLabel>
            <OutlinedInput
                disabled={props.disabled}
                size="small"
                fullWidth
                name="status"
                value={t(props.status)}
                type="text"
                sx={{ fontWeight: 'bold' }}
            />
        </>
    );
}
