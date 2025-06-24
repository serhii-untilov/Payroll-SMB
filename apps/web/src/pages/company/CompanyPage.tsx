import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CreateCompany from './CreateCompany';
import EditCompany from './EditCompany';

const CompanyPage = () => {
    const params = useParams();
    const [companyId, setCompanyId] = useState(Number(params.companyId));
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';

    return (
        <>
            {!!companyId && <EditCompany {...{ companyId, tabIndex, goBack }} />}
            {!companyId && <CreateCompany {...{ setCompanyId }} />}
        </>
    );
};

export default CompanyPage;
