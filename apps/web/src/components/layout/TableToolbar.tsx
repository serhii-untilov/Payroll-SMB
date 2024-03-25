import {
    AddCircleRounded,
    DeleteRounded,
    DownloadRounded,
    HistoryRounded,
    PrintRounded,
    RemoveCircleRounded,
    RestoreFromTrashRounded,
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
    onShowHistory?: Func<any>;
    showHistoryDisabled?: boolean;
    onShowDeleted?: Func<any>;
    showDeletedDisabled?: boolean;

    onRestoreDeleted?: Func<any>;
    restoreDeletedDisabled?: boolean;
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                    {props.onAdd && (
                        <Tooltip placement="top-start" title={t('Add record')}>
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
                        <Tooltip placement="top-start" title={t('Delete selected records')}>
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
                        <Tooltip placement="top-start" title={t('Print')}>
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
                        <Tooltip placement="top-start" title={t('Export')}>
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
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'flex-end',
                    }}
                >
                    {props.onShowHistory && (
                        <Tooltip placement="top-end" title={t('Show history')}>
                            <Box sx={{ color: 'action.disabledBackground' }}>
                                <IconButton
                                    color={props.showHistoryDisabled ? 'inherit' : 'primary'}
                                    disabled={props.showHistoryDisabled}
                                    onClick={props.onShowHistory}
                                >
                                    <HistoryRounded />
                                </IconButton>
                            </Box>
                        </Tooltip>
                    )}

                    {props.onShowDeleted && (
                        <Tooltip placement="top-end" title={t('Show deleted')}>
                            <Box sx={{ color: 'action.disabledBackground' }}>
                                <IconButton
                                    color={props.showDeletedDisabled ? 'inherit' : 'primary'}
                                    disabled={props.showDeletedDisabled}
                                    onClick={props.onShowDeleted}
                                >
                                    <DeleteRounded />
                                </IconButton>
                            </Box>
                        </Tooltip>
                    )}

                    {props.onRestoreDeleted && (
                        <Tooltip placement="top-end" title={t('Restore deleted')}>
                            <Box sx={{ color: 'action.disabledBackground' }}>
                                <IconButton
                                    color={props.restoreDeletedDisabled ? 'inherit' : 'primary'}
                                    disabled={props.restoreDeletedDisabled}
                                    onClick={props.onRestoreDeleted}
                                >
                                    <RestoreFromTrashRounded />
                                </IconButton>
                            </Box>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Stack>
    );
}
