import { positionsRemove } from '@/services/api/position.service';
import { invalidateQueries } from '@/utils/invalidateQueries';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { ResourceType } from '@repo/openapi';
import { maxDate } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function usePositionList(gridRef: any, rowSelectionModel: GridRowSelectionModel) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const onAddPosition = () => navigate('/people/position/?tab-index=0&return=true');

    const onEditPosition = (positionId: number) =>
        navigate(`/people/position/${positionId}?return=true`);

    const onPrint = () => gridRef.current.exportDataAsPrint();

    const onExport = () => gridRef.current.exportDataAsCsv();

    const onDeletePosition = async () => {
        for (const id of rowSelectionModel) {
            await positionsRemove(+id);
        }
        await invalidateQueries(queryClient, [ResourceType.Position]);
    };

    const getRowStatus = (params: any) => {
        return params.row?.deletedDate
            ? 'Deleted'
            : params.row?.dateTo < maxDate()
              ? 'Dismissed'
              : !params.row?.personId
                ? 'Vacancy'
                : 'Normal';
    };

    return { getRowStatus, onAddPosition, onEditPosition, onDeletePosition, onPrint, onExport };
}
