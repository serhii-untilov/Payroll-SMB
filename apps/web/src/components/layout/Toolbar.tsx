import {
    AddCircleRounded,
    CheckCircleRounded,
    DeleteRounded,
    DeleteSweepRounded,
    DownloadRounded,
    HistoryRounded,
    OfflinePinRounded,
    PrintRounded,
    RedoRounded,
    RestoreFromTrashRounded,
    UndoRounded,
} from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, IconButton, Stack, StackProps } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';

type Func<T> = (value: T) => void;

export interface Props extends StackProps {
    onAdd?: Func<any> | 'disabled' | undefined;
    onSave?: Func<any> | 'disabled' | undefined;
    onCancel?: Func<any> | 'disabled' | undefined;
    onSaveAndClose?: Func<any> | 'disabled' | undefined;
    onClose?: Func<any> | 'disabled' | undefined;
    onOpen?: Func<any> | 'disabled' | undefined;
    onPrint?: Func<any> | 'disabled' | undefined;
    onExport?: Func<any> | 'disabled' | undefined;
    onDelete?: Func<any> | 'disabled' | undefined;
    onShowDeleted?: Func<any> | 'disabled' | undefined;
    onRestoreDeleted?: Func<any> | 'disabled' | undefined;
    onShowHistory?: Func<any> | 'disabled' | undefined;
}

interface ToolbarItemProps extends PropsWithChildren {
    item?: Func<any> | 'disabled' | undefined;
    title?: string;
    color?: any;
}

function ToolbarItem({ item, title, color, children }: ToolbarItemProps) {
    return item ? (
        <Tooltip placement="top-start" title={title}>
            <Box sx={{ color: 'action.disabledBackground' }}>
                <IconButton
                    color={item === 'disabled' ? 'inherit' : color || 'primary'}
                    disabled={item === 'disabled'}
                    onClick={typeof item === 'function' ? item : () => {}}
                >
                    {children}
                </IconButton>
            </Box>
        </Tooltip>
    ) : null;
}

export function Toolbar(props: Props) {
    const { t } = useTranslation();

    return (
        <Stack direction="row" spacing={1} aria-label="Table toolbar button group" my={1}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                    <ToolbarItem item={props?.onAdd} title={t('Add')} color={'success'}>
                        <AddCircleRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onSave} title={t('Save')} color={'success'}>
                        <CheckCircleRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onSaveAndClose} title={t('Save and Close')}>
                        <OfflinePinRounded />
                    </ToolbarItem>

                    <ToolbarItem
                        item={props?.onCancel}
                        title={t('Cancel changes')}
                        color={'warning'}
                    >
                        <CancelIcon />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onClose} title={t('Close')} color={'success'}>
                        <RedoRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onOpen} title={t('Open')} color={'warning'}>
                        <UndoRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onPrint} title={t('Print')}>
                        <PrintRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onExport} title={t('Export')}>
                        <DownloadRounded />
                    </ToolbarItem>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'flex-end',
                    }}
                >
                    <ToolbarItem item={props?.onDelete} title={t('Delete')} color={'error'}>
                        <DeleteRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onShowDeleted} title={t('Show deleted')}>
                        <DeleteSweepRounded />
                    </ToolbarItem>

                    <ToolbarItem
                        item={props?.onRestoreDeleted}
                        title={t('Restore deleted')}
                        color={'warning'}
                    >
                        <RestoreFromTrashRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onShowHistory} title={t('Show history')}>
                        <HistoryRounded />
                    </ToolbarItem>
                </Box>
            </Box>
        </Stack>
    );
}
