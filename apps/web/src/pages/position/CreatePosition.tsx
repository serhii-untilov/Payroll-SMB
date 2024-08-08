import PositionForm from './PositionForm';

const CreatePosition = ({ company, payPeriod, setPositionId }) => {
    return <PositionForm {...{ company, payPeriod, goBack: true, setPositionId }} />;
};

export default CreatePosition;
