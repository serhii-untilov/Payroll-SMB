import PositionForm from './PositionForm';

interface CreatePositionProps {
    setPositionId: (number) => void;
}

export default function CreatePosition(props: CreatePositionProps) {
    return <PositionForm goBack={true} setPositionId={props.setPositionId} />;
}
