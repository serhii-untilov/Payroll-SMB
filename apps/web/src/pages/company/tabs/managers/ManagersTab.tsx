import { Company } from '@repo/openapi';
import ManagersList from './ManagerList';

type ManagersTabProps = {
    company: Company;
};

export default function ManagersTab(props: ManagersTabProps) {
    // TODO
    const managers = [];

    return <ManagersList company={props.company} managers={managers} />;
}
