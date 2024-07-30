export default function useGrid(gridRef: any) {
    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };
    return { onPrint, onExport };
}
