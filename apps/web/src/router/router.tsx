import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loading } from '../components/utility/Loading';
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import MainLayout from '../components/layout/MainLayout';

export const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) => (
    <Suspense fallback={<Loading />}>
        <Component {...props} />
    </Suspense>
);

export const SignIn = Loadable(lazy(() => import('../pages/SignIn')));
const SignUp = Loadable(lazy(() => import('../pages/SignUp')));
const Home = Loadable(lazy(() => import('../pages/Home')));
const Greeting = Loadable(lazy(() => import('../pages/Greeting')));
const Companies = Loadable(lazy(() => import('../pages/Companies')));
const Employees = Loadable(lazy(() => import('../pages/Employees')));
const TimeOff = Loadable(lazy(() => import('../pages/TimeOff')));
const TimeSheet = Loadable(lazy(() => import('../pages/TimeSheet')));
const Payroll = Loadable(lazy(() => import('../pages/Payroll')));
const Payments = Loadable(lazy(() => import('../pages/Payments')));
const Reports = Loadable(lazy(() => import('../pages/Reports')));
const Profile = Loadable(lazy(() => import('../pages/Profile')));

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
                <MainLayout />
            </AuthGuard>
        ),
        children: [
            { path: 'home', element: <Home /> },
            { path: 'greeting', element: <Greeting /> },
            { path: 'companies', element: <Companies /> },
            { path: 'employees', element: <Employees /> },
            { path: 'time-off', element: <TimeOff /> },
            { path: 'time-sheet', element: <TimeSheet /> },
            { path: 'payroll', element: <Payroll /> },
            { path: 'payments', element: <Payments /> },
            { path: 'reports', element: <Reports /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
];

// eslint-disable-next-line react-refresh/only-export-components
export default router;
