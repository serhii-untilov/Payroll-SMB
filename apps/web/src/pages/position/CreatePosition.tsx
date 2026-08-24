import { CompanyEntity as Company, PayPeriod } from '@repo/openapi';
import PositionForm from './PositionForm';

const CreatePosition = ({
    company,
    payPeriod,
    setPositionId,
}: {
    company: Company;
    payPeriod: PayPeriod;
    setPositionId: (id: string) => void;
}) => {
    return <PositionForm {...{ company, payPeriod, goBack: true, setPositionId }} />;
};

export default CreatePosition;
