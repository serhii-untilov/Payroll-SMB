import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PositionFormProps } from './PositionForm';
import { TabComponent } from '@/components/layout/TabsContainer';
import JobTab from './tabs/job/JobTab';
import PersonTab from './tabs/person/PersonTab';
import useLocale from '@/hooks/context/useLocale';
import usePositionName from '@/hooks/usePositionName';

const usePositionForm = (props: PositionFormProps) => {
    const { position } = props;
    const { t } = useTranslation();
    const { locale } = useLocale();

    useEffect(() => {}, [props, locale]);

    const pageTitle = usePositionName(position);

    const tabs = useMemo<TabComponent[]>(
        () => [
            { label: t('Job & Pay'), tab: <JobTab {...props} /> },
            {
                label: t('Personal'),
                disabled: !position?.personId,
                tab: position?.personId && <PersonTab personId={position.personId} />,
            },
            { label: t('Time Off') },
            { label: t('Documents') },
            { label: t('Notes') },
        ],
        [props, t, position],
    );

    return { pageTitle, tabs };
};

export default usePositionForm;
