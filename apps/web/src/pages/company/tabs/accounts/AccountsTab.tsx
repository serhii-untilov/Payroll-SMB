import { Company } from '@repo/openapi';
import AccountsList from './AccountList';

type AccountsTabProps = {
    company: Company;
};

export default function AccountsTab(props: AccountsTabProps) {
    // TODO
    const accounts = [];

    return <AccountsList company={props.company} accounts={accounts} />;
}
