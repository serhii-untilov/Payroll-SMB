import { useCallback } from 'react';

export default function useGrid(gridRef: any) {
    const onPrint = useCallback(() => {
        gridRef.current.exportDataAsPrint();
    }, [gridRef]);

    const onExport = useCallback(() => {
        gridRef.current.exportDataAsCsv();
    }, [gridRef]);
    return { onPrint, onExport };
}
