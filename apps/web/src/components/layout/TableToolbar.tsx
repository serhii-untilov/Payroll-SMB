import {
    AddOutlined,
    CheckBoxOutlineBlank,
    Checklist,
    DeleteOutlined,
    FileDownloadOutlined,
    PrintOutlined,
    RefreshOutlined,
} from '@mui/icons-material';
import { Button, ButtonGroup, IconButton, Stack, StackProps } from '@mui/material';
import { GridToolbarExport } from '@mui/x-data-grid';
import { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';

type Func<T> = (value: T) => void;

export interface TableToolbarProps extends StackProps {
    onAdd?: Func<any>;
    addDisabled?: boolean;
    onCheckboxSelection?: Func<any>;
    checkboxSelectionDisabled?: boolean;
    onDelete?: Func<any>;
    deleteDisabled?: boolean;
    onPrint?: Func<any>;
    printDisabled?: boolean;
    onExport?: Func<any>;
    exportDisabled?: boolean;
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
                <Tooltip placement="top" title="Add record">
                    <IconButton
                        color={props.addDisabled ? 'inherit' : 'primary'}
                        disabled={props.addDisabled}
                        onClick={props.onAdd}
                    >
                        <AddOutlined />
                    </IconButton>
                </Tooltip>
            )}
            {props.onCheckboxSelection && (
                <Tooltip placement="top" title="Checkbox selection mode">
                    <IconButton
                        color={props.checkboxSelectionDisabled ? 'inherit' : 'primary'}
                        disabled={props.checkboxSelectionDisabled}
                        onClick={props.onCheckboxSelection}
                    >
                        <Checklist />
                    </IconButton>
                </Tooltip>
            )}
            {props.onDelete && (
                <Tooltip placement="top" title="Delete selected records">
                    <IconButton
                        color={props.deleteDisabled ? 'inherit' : 'primary'}
                        disabled={props.deleteDisabled}
                        onClick={props.onDelete}
                    >
                        <DeleteOutlined />
                    </IconButton>
                </Tooltip>
            )}
            {props.onPrint && (
                <Tooltip placement="top" title="Print records">
                    <IconButton
                        color={props.printDisabled ? 'inherit' : 'primary'}
                        disabled={props.printDisabled}
                        onClick={props.onPrint}
                    >
                        <PrintOutlined />
                    </IconButton>
                </Tooltip>
            )}
            {props.onExport && (
                <Tooltip placement="top" title="Export records">
                    <IconButton
                        color={props.exportDisabled ? 'inherit' : 'primary'}
                        disabled={props.exportDisabled}
                        onClick={props.onExport}
                    >
                        <FileDownloadOutlined />
                    </IconButton>
                </Tooltip>
            )}
        </Stack>
    );
}
