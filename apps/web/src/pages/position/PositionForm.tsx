import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import { AvatarBox } from '@/components/utility/AvatarBox';
import { Company, Position, PositionHistory } from '@repo/openapi';
import usePositionForm from './PositionForm.hooks';

export interface PositionFormProps {
    company: Company;
    position?: Position;
    positionHistory?: PositionHistory;
    tabIndex?: string | null;
    goBack?: boolean;
    setPositionId?: (number) => void;
}

const PositionForm = (props: PositionFormProps) => {
    const { tabIndex, goBack } = props;
    const { pageTitle, tabs } = usePositionForm(props);

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{pageTitle}</PageTitle>
            <AvatarBox />
            <TabsContainer id="position-form-tabs" tabIndex={tabIndex} tabs={tabs} />
        </PageLayout>
    );
};

export default PositionForm;
