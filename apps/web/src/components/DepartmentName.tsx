import { useTranslation } from 'react-i18next';
import { FormTextField } from './form/FormTextField';
import { OutlinedInputProps } from '@mui/material';

type DepartmentNameProps = OutlinedInputProps & {
    control: any;
    name?: string;
    id?: string;
    label?: string;
};

export default function DepartmentName(props: DepartmentNameProps) {
    const { control, name, id, label, ...other } = props;
    const { t } = useTranslation();
    return (
        <FormTextField
            control={control}
            autoComplete="department-name"
            name={name ?? 'name'}
            id={id ?? 'name'}
            label={label && t('Name')}
            type="text"
            {...other}
        />
    );
}
