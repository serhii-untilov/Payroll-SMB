import { useQuery } from 'react-query';
// import { Button, notification } from 'antd';
import Register from './Register';
import { getGreeting } from '../services/greeting.service';
import { AxiosResponse } from 'axios';

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
                <Register />
                {/* <Button type="primary">Button</Button> */}
            </>
        );
    }

    return (
        <>
            {/* {contextHolder} */}
            {isLoading && <div>Loading...</div>}
        </>
    );
}

export default Greeting;
