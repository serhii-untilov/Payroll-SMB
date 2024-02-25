import { useQuery } from 'react-query';
import { Loading } from '../components/utility/Loading';
import { getGreeting } from '../services/greeting.service';
import SignUp from './SignUp';

function Greeting() {
    const {
        data: greeting,
        isError,
        isSuccess,
        isLoading,
        // error,
    } = useQuery<string, Error>('query-greeting', getGreeting);

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
                <h1>{greeting}</h1>
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
