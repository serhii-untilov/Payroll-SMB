import './App.css';
import { getGreeting } from './services/greeting.service';
import { useQuery } from 'react-query';

function App() {
    const { isLoading, isError, data, error } = useQuery<string, Error>(
        'query-greeting',
        getGreeting,
        {
            enabled: true,
            retry: 2,
        },
    );

    if (isError) {
        return (
            <>
                `Error ${error.message}\n${error.stack}`
            </>
        );
    }

    if (isLoading) {
        return <>...</>;
    }

    return (
        <>
            <h1>{data}</h1>
        </>
    );
}

export default App;
