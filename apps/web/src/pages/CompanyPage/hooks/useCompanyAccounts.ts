export default function useCompanyAccounts() {
    // TODO

    const onAddAccount = () => {
        console.log('onAdd');
    };

    const onEditAccount = (_accountId: number) => {
        console.log('onEdit');
    };

    const onPrint = () => {
        console.log('onPrint');
    };

    const onExport = () => {
        console.log('onExport');
    };
    return { onAddAccount, onEditAccount, onPrint, onExport };
}
