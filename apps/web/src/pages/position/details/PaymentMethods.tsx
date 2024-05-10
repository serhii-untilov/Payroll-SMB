import { AddCircleRounded } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
    personId: number | null;
};

export function PaymentMethods(props: Props) {
    const { t } = useTranslation();
    const paymentMethods = [];
    return (
        <>
            {!!props.personId && (
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {t('Payment Method')}
                        </Typography>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, asperiores
                        voluptates. Nesciunt qui repellendus magnam debitis accusamus minus
                        doloremque iure. Autem quisquam officiis tenetur. Perferendis corrupti ab
                        odio explicabo. Praesentium!
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton aria-label="Add to Payment methods">
                            <AddCircleRounded />
                        </IconButton>
                    </CardActions>
                </Card>
            )}
        </>
    );
}
