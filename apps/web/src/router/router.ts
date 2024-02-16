import { Suspense, lazy } from 'react';
import Loading from './components/Loading';

const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );

// *  AUTHENTICATION PAGES
const Login = Loadable(lazy(() => import('./pages/authentication/Login')));
const Register = Loadable(
  lazy(() => import('./pages/authentication/Register'))
);

//  * HOME PAGE
const Home = Loadable(lazy(() => import('./pages/home/Home')));