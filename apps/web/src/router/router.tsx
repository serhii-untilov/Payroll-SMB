import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Loading } from '../components/utility/Loading';
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';

export const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) => (
    <Suspense fallback={<Loading />}>
        <Component {...props} />
    </Suspense>
);

export const SignIn = Loadable(lazy(() => import('@/pages/AuthPage/SignIn')));
const SignUp = Loadable(lazy(() => import('@/pages/AuthPage/SignUp')));
const DashboardPage = Loadable(lazy(() => import('@/pages/DashboardPage')));
const Welcome = Loadable(lazy(() => import('@/pages/welcome/Welcome')));
const CompanyPage = Loadable(lazy(() => import('@/pages/CompanyPage')));
const People = Loadable(lazy(() => import('@/pages/people/People')));
const TimeOff = Loadable(lazy(() => import('@/pages/timesheet/TimeOff')));
const TimeSheet = Loadable(lazy(() => import('@/pages/timesheet/TimeSheet')));
const Payroll = Loadable(lazy(() => import('@/pages/payroll/Payroll')));
const Payments = Loadable(lazy(() => import('@/pages/payments/Payments')));
const PaymentForm = Loadable(lazy(() => import('@/pages/PaymentPage/PaymentForm')));
const Reports = Loadable(lazy(() => import('@/pages/reports/Reports')));
const Profile = Loadable(lazy(() => import('@/pages/profile/Profile')));
const Position = Loadable(lazy(() => import('@/pages/PositionPage')));
const AccountantFeatures = Loadable(
    lazy(() => import('@/pages/welcome/details/featuresByRole/AccountantFeatures')),
);
const EmployeeFeatures = Loadable(
    lazy(() => import('@/pages/welcome/details/featuresByRole/EmployeeFeatures')),
);
const AdministratorFeatures = Loadable(
    lazy(() => import('@/pages/welcome/details/featuresByRole/AdministratorFeatures')),
);

const router: RouteObject[] = [
    {
        index: true,
        element: <Welcome />,
    },
    {
        path: 'welcome',
        element: <Welcome />,
    },
    { path: 'accountant-features', element: <AccountantFeatures /> },
    { path: 'employee-features', element: <EmployeeFeatures /> },
    { path: 'administrator-features', element: <AdministratorFeatures /> },
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
            { index: true, element: <DashboardPage /> },
            { path: 'dashboard', element: <DashboardPage /> },
            {
                path: 'company',
                children: [
                    { index: true, element: <CompanyPage /> },
                    { path: ':companyId', element: <CompanyPage /> },
                ],
            },
            {
                path: 'people',
                children: [
                    { index: true, element: <People /> },
                    { path: 'position', element: <Position /> },
                    { path: 'position/:positionId', element: <Position /> },
                ],
            },
            { path: 'time-off', element: <TimeOff /> },
            { path: 'time-sheet', element: <TimeSheet /> },
            { path: 'payroll', element: <Payroll /> },
            {
                path: 'payments',
                children: [
                    { index: true, element: <Payments /> },
                    { path: 'add', element: <PaymentForm /> },
                    { path: ':id', element: <PaymentForm /> },
                ],
            },
            { path: 'reports', element: <Reports /> },
            {
                path: 'profile',
                children: [
                    { index: true, element: <Profile /> },
                    { path: 'company', element: <CompanyPage /> },
                ],
            },
        ],
    },
];

// eslint-disable-next-line react-refresh/only-export-components
export default router;
