import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TaskDescription = ({ description }) => {
    const { t } = useTranslation();

    return <Typography sx={{ color: 'text.primary' }}>{t(description)}</Typography>;
};

export default TaskDescription;
