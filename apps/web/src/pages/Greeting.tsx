import { useQuery } from 'react-query';
import SignUp from './SignUp';
import { getGreeting } from '../services/greeting.service';
import { AxiosResponse } from 'axios';
import { Loading } from '../components/utility/Loading';

function Greeting() {
    const {
        data: response,
        isError,
        isSuccess,
        isLoading,
        // error,
    } = useQuery<AxiosResponse, Error>('query-greeting', getGreeting);

    // const [toast, contextHolder] = notification.useNotification();

    if (isError) {
        // toast['error']({
        //     key: 'query-greeting',
        //     message: error.name,
        //     description: error.message,
        // });
    }

    if (isSuccess) {
        return (
            <>
                <h1>{response.data}</h1>
                <SignUp />
                {/* <Button type="primary">Button</Button> */}
            </>
        );
    }

    return (
        <>
            {/* {contextHolder} */}
            {isLoading && <Loading />}
        </>
    );
}

export default Greeting;
