import {
    AddCircleRounded,
    DownloadRounded,
    PrintRounded,
    RemoveCircleRounded,
} from '@mui/icons-material';
import { Box, IconButton, Stack, StackProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';

type Func<T> = (value: T) => void;

export interface TableToolbarProps extends StackProps {
    onAdd?: Func<any>;
    addDisabled?: boolean;
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
            mx={1}
            // {...props}
        >
            {props.onAdd && (
                <Tooltip placement="top" title={t('Add record')}>
                    <Box sx={{ color: 'action.disabledBackground' }}>
                        <IconButton
                            color={props.addDisabled ? 'inherit' : 'primary'}
                            disabled={props.addDisabled}
                            onClick={props.onAdd}
                        >
                            <AddCircleRounded />
                        </IconButton>
                    </Box>
                </Tooltip>
            )}
            {props.onDelete && (
                <Tooltip placement="top" title={t('Delete selected records')}>
                    <Box sx={{ color: 'action.disabledBackground' }}>
                        <IconButton
                            color={props.deleteDisabled ? 'inherit' : 'error'}
                            disabled={props.deleteDisabled}
                            onClick={props.onDelete}
                        >
                            <RemoveCircleRounded />
                        </IconButton>
                    </Box>
                </Tooltip>
            )}
            {props.onPrint && (
                <Tooltip placement="top" title={t('Print')}>
                    <Box sx={{ color: 'action.disabledBackground' }}>
                        <IconButton
                            color={props.printDisabled ? 'inherit' : 'primary'}
                            disabled={props.printDisabled}
                            onClick={props.onPrint}
                        >
                            <PrintRounded />
                        </IconButton>
                    </Box>
                </Tooltip>
            )}
            {props.onExport && (
                <Tooltip placement="top" title={t('Export')}>
                    <Box sx={{ color: 'action.disabledBackground' }}>
                        <IconButton
                            color={props.exportDisabled ? 'inherit' : 'primary'}
                            disabled={props.exportDisabled}
                            onClick={props.onExport}
                        >
                            <DownloadRounded />
                        </IconButton>
                    </Box>
                </Tooltip>
            )}
        </Stack>
    );
}
