import { Button } from '@/components/layout/Button';
import TextField from '@/components/layout/TextField';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { personsCreate } from '@/services/api/person.service';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
} from '@mui/material';
import { CreatePersonDto, ResourceType } from '@repo/openapi';
import { useTranslation } from 'react-i18next';

interface CreatePersonFormProps {
    open: boolean;
    handleClose: () => void;
    onChange: (personId: number) => void;
    dialogValue: CreatePersonDto;
    setDialogValue: (value: CreatePersonDto) => void;
}

export default function CreatePerson(props: CreatePersonFormProps) {
    const { open, handleClose, onChange, dialogValue, setDialogValue } = props;
    const { t } = useTranslation();
    const invalidateQueries = useInvalidateQueries();

    return (
        <Dialog open={open} onClose={() => handleClose()} disableRestoreFocus>
            <form
                onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const person = await personsCreate(dialogValue);
                    onChange(person.id);
                    await invalidateQueries([ResourceType.Person]);
                    handleClose();
                }}
            >
                <DialogTitle>{t('Add a new person')}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2, pt: 0 }}>
                        {t('Employee not yet registered? Please add.')}
                    </DialogContentText>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label={t('Last Name')}
                                value={dialogValue.lastName}
                                onChange={(value) =>
                                    setDialogValue({ ...dialogValue, lastName: value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label={t('First Name')}
                                value={dialogValue.firstName}
                                onChange={(value) =>
                                    setDialogValue({ ...dialogValue, firstName: value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label={t('Middle Name')}
                                value={dialogValue.middleName}
                                onChange={(value) =>
                                    setDialogValue({ ...dialogValue, middleName: value })
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label={t('Tax ID')}
                                value={dialogValue.taxId}
                                onChange={(value) =>
                                    setDialogValue({ ...dialogValue, taxId: value })
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label={t('Birth Date')}
                                value={dialogValue.birthday}
                                onChange={(value) =>
                                    setDialogValue({ ...dialogValue, birthday: new Date(value) })
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label={t('Sex')}
                                value={dialogValue.sex}
                                onChange={(value) => setDialogValue({ ...dialogValue, sex: value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mr: 2, pt: 0 }}>
                    <Button type="submit">{t('Add')}</Button>
                    <Button color="secondary" onClick={() => handleClose()}>
                        {t('Cancel')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
