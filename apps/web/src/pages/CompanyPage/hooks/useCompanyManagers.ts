export default function useCompanyManagers() {
    // TODO

    const onAddManager = () => {
        console.log('onAdd');
    };

    const onEditManager = (_managerId: number) => {
        console.log('onEdit');
    };

    const onPrint = () => {
        console.log('onPrint');
    };

    const onExport = () => {
        console.log('onExport');
    };

    return { onAddManager, onEditManager, onPrint, onExport };
}
