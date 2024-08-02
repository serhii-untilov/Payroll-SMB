import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TaskTitle = ({ title }) => {
    const { t } = useTranslation();

    return <Typography sx={{ fontWeight: 'medium', color: 'text.primary' }}>{t(title)}</Typography>;
};

export default TaskTitle;
