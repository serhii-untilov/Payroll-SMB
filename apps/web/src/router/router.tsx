import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { LoadingDisplay } from '../components/utility/LoadingDisplay';
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';

export const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) => (
    <Suspense fallback={<LoadingDisplay />}>
        <Component {...props} />
    </Suspense>
);

export const SignIn = Loadable(lazy(() => import('@/pages/AuthPage/SignIn')));
const SignUp = Loadable(lazy(() => import('@/pages/AuthPage/SignUp')));
const DashboardPage = Loadable(lazy(() => import('@/pages/DashboardPage')));
const Welcome = Loadable(lazy(() => import('@/pages/welcome/Welcome')));
const CompanyPage = Loadable(lazy(() => import('@/pages/CompanyPage')));
const PeoplePage = Loadable(lazy(() => import('@/pages/PeoplePage')));
const TimeOffPage = Loadable(lazy(() => import('@/pages/TimeSheetPage/TimeOffForm')));
const TimeSheetPage = Loadable(lazy(() => import('@/pages/TimeSheetPage/TimeSheetForm')));
const Payroll = Loadable(lazy(() => import('@/pages/payroll/Payroll')));
const PaymentListPage = Loadable(lazy(() => import('@/pages/PaymentListPage')));
const PaymentPage = Loadable(lazy(() => import('@/pages/PaymentPage')));
const ReportsPage = Loadable(lazy(() => import('@/pages/ReportsPage/ReportsForm')));
const UserProfilePage = Loadable(lazy(() => import('@/pages/UserProfilePage')));
const PositionPage = Loadable(lazy(() => import('@/pages/PositionPage')));
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
                    { index: true, element: <PeoplePage /> },
                    { path: 'position', element: <PositionPage /> },
                    { path: 'position/:positionId', element: <PositionPage /> },
                ],
            },
            { path: 'time-off', element: <TimeOffPage /> },
            { path: 'time-sheet', element: <TimeSheetPage /> },
            { path: 'payroll', element: <Payroll /> },
            {
                path: 'payments',
                children: [
                    { index: true, element: <PaymentListPage /> },
                    { path: 'add', element: <PaymentPage /> },
                    { path: ':paymentId', element: <PaymentPage /> },
                ],
            },
            { path: 'reports', element: <ReportsPage /> },
            {
                path: 'profile',
                children: [
                    { index: true, element: <UserProfilePage /> },
                    { path: 'company', element: <CompanyPage /> },
                ],
            },
        ],
    },
];

// eslint-disable-next-line react-refresh/only-export-components
export default router;
