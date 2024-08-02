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

export const SignIn = Loadable(lazy(() => import('@/pages/auth/sign-in/SignInPage')));
const SignUp = Loadable(lazy(() => import('@/pages/auth/sign-up/SignUpPage')));
const Dashboard = Loadable(lazy(() => import('@/pages/dashboard/DashboardPage')));
const Welcome = Loadable(lazy(() => import('@/pages/welcome/WelcomePage')));
const Company = Loadable(lazy(() => import('@/pages/company/CompanyPage')));
const People = Loadable(lazy(() => import('@/pages/PeoplePage')));
const TimeOff = Loadable(lazy(() => import('@/pages/TimeSheetPage/TimeOffForm')));
const TimeSheet = Loadable(lazy(() => import('@/pages/TimeSheetPage/TimeSheetForm')));
const Payroll = Loadable(lazy(() => import('@/pages/PayrollPage')));
const Payments = Loadable(lazy(() => import('@/pages/payments/PaymentsPage')));
const Payment = Loadable(lazy(() => import('@/pages/payment/PaymentPage')));
const Reports = Loadable(lazy(() => import('@/pages/ReportsPage/ReportsForm')));
const User = Loadable(lazy(() => import('@/pages/user/UserPage')));
const Position = Loadable(lazy(() => import('@/pages/PositionPage')));
const PositionHistory = Loadable(lazy(() => import('@/pages/PositionHistoryPage')));
const FeaturesAccountant = Loadable(
    lazy(() => import('@/pages/welcome/sections/FeaturesAccountant')),
);
const FeaturesEmployee = Loadable(lazy(() => import('@/pages/welcome/sections/FeaturesEmployee')));
const FeaturesAdministrator = Loadable(
    lazy(() => import('@/pages/welcome/sections/FeaturesAdministrator')),
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
    { path: 'accountant-features', element: <FeaturesAccountant /> },
    { path: 'employee-features', element: <FeaturesEmployee /> },
    { path: 'administrator-features', element: <FeaturesAdministrator /> },
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
            { index: true, element: <Dashboard /> },
            { path: 'dashboard', element: <Dashboard /> },
            {
                path: 'company',
                children: [
                    { index: true, element: <Company /> },
                    { path: ':companyId', element: <Company /> },
                ],
            },
            {
                path: 'people',
                children: [
                    { index: true, element: <People /> },
                    { path: 'position', element: <Position /> },
                    { path: 'position/:positionId', element: <Position /> },
                    { path: 'position/:positionId/history', element: <PositionHistory /> },
                ],
            },
            { path: 'time-off', element: <TimeOff /> },
            { path: 'time-sheet', element: <TimeSheet /> },
            { path: 'payroll', element: <Payroll /> },
            {
                path: 'payments',
                children: [
                    { index: true, element: <Payments /> },
                    { path: 'add', element: <Payment /> },
                    { path: ':paymentId', element: <Payment /> },
                ],
            },
            { path: 'reports', element: <Reports /> },
            {
                path: 'profile',
                children: [
                    { index: true, element: <User /> },
                    { path: 'company', element: <Company /> },
                ],
            },
        ],
    },
];

// eslint-disable-next-line react-refresh/only-export-components
export default router;
