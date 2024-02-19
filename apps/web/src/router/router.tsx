import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
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

const routes: RouteObject[] = [
    {
        path: 'auth',
        children: [
            {
                path: 'sign-in',
                element: (
                    <GuestGuard>
                        <SignIn />
                    </GuestGuard>
                ),
            },
            {
                path: 'sign-up',
                element: (
                    <GuestGuard>
                        <SignUp />
                    </GuestGuard>
                ),
            },
        ],
    },
    {
        path: '*',
        element: (
            <AuthGuard>
                <MainLayout />
            </AuthGuard>
        ),
        children: [
            {
                index: true,
                element: (
                    <AuthGuard>
                        <Home />
                    </AuthGuard>
                ),
            },
        ],
    },
];

// eslint-disable-next-line react-refresh/only-export-components
export default routes;
