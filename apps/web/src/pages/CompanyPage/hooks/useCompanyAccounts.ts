export default function useCompanyAccounts() {
    // TODO

    const onAddAccount = () => {
        console.log('onAdd');
    };

    const onEditAccount = (_accountId: number) => {
        console.log('onEdit');
    };

    return { onAddAccount, onEditAccount };
}
