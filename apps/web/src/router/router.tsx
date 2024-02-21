import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loading } from '../components/utility/Loading';
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';

export const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) => (
    <Suspense fallback={<Loading />}>
        <Component {...props} />
    </Suspense>
);

export const SignIn = Loadable(lazy(() => import('../pages/SignIn')));
const SignUp = Loadable(lazy(() => import('../pages/SignUp')));
const Home = Loadable(lazy(() => import('../pages/Home')));
const Employees = Loadable(lazy(() => import('../pages/Employees')));
const Greeting = Loadable(lazy(() => import('../pages/Greeting')));
const Payroll = Loadable(lazy(() => import('../pages/Payroll')));
const Profile = Loadable(lazy(() => import('../pages/Profile')));
const Companies = Loadable(lazy(() => import('../pages/Companies')));

const router: RouteObject[] = [
    {
        path: 'signin',
        element: (
            <GuestGuard>
                <SignIn />
            </GuestGuard>
        ),
    },
    {
        path: 'signup',
        element: (
            <GuestGuard>
                <SignUp />
            </GuestGuard>
        ),
    },
    {
        path: '*',
        element: (
            <AuthGuard>
                <Home />
            </AuthGuard>
        ),
        children: [
            { path: 'employees', element: <Employees /> },
            { path: 'payroll', element: <Payroll /> },
            { path: 'greeting', element: <Greeting /> },
            { path: 'companies', element: <Companies /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
];

// eslint-disable-next-line react-refresh/only-export-components
export default router;
