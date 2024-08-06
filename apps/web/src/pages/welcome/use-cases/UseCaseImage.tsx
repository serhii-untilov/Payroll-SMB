import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

const UseCaseImage = ({ image }) => {
    return (
        <Box
            id="use-case__image"
            component="img"
            sx={{
                backgroundColor: grey[50],
                flex: 3,
                width: '100%',
                height: 'auto',
                mx: ['auto'],
                border: 1,
                borderColor: 'grey.100',
                borderRadius: 2,
                p: 2,
                minHeight: 0,
                maxWidth: 400,
                objectFit: 'contain',
            }}
            alt="Use case image"
            src={image}
        />
    );
};

export default UseCaseImage;
