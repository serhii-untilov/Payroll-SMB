export default function useCompanyManagers() {
    // TODO

    const onAddManager = () => {
        console.log('onAdd');
    };

    const onEditManager = (_managerId: number) => {
        console.log('onEdit');
    };

    return { onAddManager, onEditManager };
}
