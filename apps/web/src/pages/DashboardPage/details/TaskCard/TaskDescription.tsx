import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type TaskDescriptionProps = {
    description: string;
};

const TaskDescription = ({ description }: TaskDescriptionProps) => {
    const { t } = useTranslation();

    return <Typography sx={{ color: 'text.primary' }}>{t(description)}</Typography>;
};

export default TaskDescription;
