import {
    AddCircleRounded,
    CheckCircleRounded,
    DeleteRounded,
    DownloadRounded,
    HistoryRounded,
    OfflinePinRounded,
    PrintRounded,
    RemoveCircleRounded,
    RestoreFromTrashRounded,
    UnpublishedRounded,
} from '@mui/icons-material';
import { Box, IconButton, Stack, StackProps } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from './Tooltip';

type Func<T> = (value: T) => void;

export interface Props extends StackProps {
    onAdd?: Func<any> | 'disabled' | undefined;
    onSave?: Func<any> | 'disabled' | undefined;
    onSaveAndClose?: Func<any> | 'disabled' | undefined;
    onRestore?: Func<any> | 'disabled' | undefined;
    onDelete?: Func<any> | 'disabled' | undefined;
    onPrint?: Func<any> | 'disabled' | undefined;
    onExport?: Func<any> | 'disabled' | undefined;
    onShowHistory?: Func<any> | 'disabled' | undefined;
    onShowDeleted?: Func<any> | 'disabled' | undefined;
    onRestoreDeleted?: Func<any> | 'disabled' | undefined;
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
        <Stack
            direction="row"
            spacing={1}
            aria-label="Table toolbar button group"
            // mt={1}
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
                    <ToolbarItem item={props?.onAdd} title={t('Add')}>
                        <AddCircleRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onSave} title={t('Save')}>
                        <CheckCircleRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onSaveAndClose} title={t('Save and Close')}>
                        <OfflinePinRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onRestore} title={t('Restore')}>
                        <UnpublishedRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onDelete} title={t('Delete')} color={'error'}>
                        <RemoveCircleRounded />
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
                    <ToolbarItem item={props?.onShowHistory} title={t('Show history')}>
                        <HistoryRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onShowDeleted} title={t('Show deleted')}>
                        <DeleteRounded />
                    </ToolbarItem>

                    <ToolbarItem item={props?.onRestoreDeleted} title={t('Restore deleted')}>
                        <RestoreFromTrashRounded />
                    </ToolbarItem>
                </Box>
            </Box>
        </Stack>
    );
}
