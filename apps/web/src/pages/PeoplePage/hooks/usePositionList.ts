import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { positionsRemove } from '@/services/api/position.service';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { ResourceType } from '@repo/openapi';
import { maxDate } from '@repo/shared';
import { useNavigate } from 'react-router-dom';

export default function usePositionList(rowSelectionModel: GridRowSelectionModel) {
    const invalidateQueries = useInvalidateQueries();
    const navigate = useNavigate();

    const onAddPosition = () => navigate('/people/position/?tab-index=0&return=true');

    const onEditPosition = (positionId: number) =>
        navigate(`/people/position/${positionId}?return=true`);

    const onDeletePosition = async () => {
        for (const id of rowSelectionModel) {
            await positionsRemove(+id);
        }
        await invalidateQueries([ResourceType.Position]);
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

    return { getRowStatus, onAddPosition, onEditPosition, onDeletePosition };
}
