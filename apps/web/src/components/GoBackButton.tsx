import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
    const navigate = useNavigate();
    return (
        <IconButton
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => {
                navigate(-1);
            }}
        >
            <ArrowBackIosNewRounded />
        </IconButton>
    );
};

export default GoBackButton;
