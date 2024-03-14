import {
    AddOutlined,
    CheckBoxOutlineBlank,
    Checklist,
    DeleteOutlined,
    RefreshOutlined,
} from '@mui/icons-material';
import { Button, ButtonGroup, IconButton, Stack, StackProps } from '@mui/material';
import { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';

type Func<T> = (value: T) => void;

export interface TableToolbarProps extends StackProps {
    onAdd?: Func<any>;
    addDisabled?: boolean;
    onDelete?: Func<any>;
    deleteDisabled?: boolean;
    onCheckboxSelection?: Func<any>;
    checkboxSelectionDisabled?: boolean;
}

export function TableToolbar(props: TableToolbarProps) {
    const { t } = useTranslation();
    return (
        <Stack
            direction="row"
            spacing={1}
            aria-label="Table toolbar button group"
            mt={1}
            // {...props}
        >
            {props.onAdd && (
                <IconButton
                    color={props.addDisabled ? 'inherit' : 'primary'}
                    disabled={props.addDisabled}
                    onClick={props.onAdd}
                >
                    <AddOutlined />
                </IconButton>
            )}
            {props.onCheckboxSelection && (
                <IconButton
                    color={props.checkboxSelectionDisabled ? 'inherit' : 'primary'}
                    disabled={props.checkboxSelectionDisabled}
                    onClick={props.onCheckboxSelection}
                >
                    <Checklist />
                </IconButton>
            )}
            {props.onDelete && (
                <IconButton
                    color={props.deleteDisabled ? 'inherit' : 'primary'}
                    disabled={props.deleteDisabled}
                    onClick={props.onDelete}
                >
                    <DeleteOutlined />
                </IconButton>
            )}
        </Stack>
    );
}
