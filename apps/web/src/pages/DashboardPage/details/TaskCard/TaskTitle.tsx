import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type TaskTitleProps = {
    title: string;
};

export default function TaskTitle({ title }: TaskTitleProps) {
    const { t } = useTranslation();

    return <Typography sx={{ fontWeight: 'medium', color: 'text.primary' }}>{t(title)}</Typography>;
}
