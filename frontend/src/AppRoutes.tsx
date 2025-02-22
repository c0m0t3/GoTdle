import {
  Navigate,
  Route,
  RouteProps,
  Routes,
  useLocation,
} from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { ClassicPage } from './pages/ClassicPage.tsx';
import { QuoteModePage } from './pages/QuoteModePage.tsx';
import { ImageModePage } from './pages/ImageModePage.tsx';
import { ScoreboardPage } from './pages/ScoreboardPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { useAuth } from './providers/AuthProvider.tsx';

export type RouteConfig = RouteProps & {
  path: string;
  isPrivate?: boolean;
  adminRequired?: boolean;
};

export const appRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="/home" replace />,
    index: true,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/classic',
    element: <ClassicPage />,
    isPrivate: true,
  },
  {
    path: '/quote',
    element: <QuoteModePage />,
    isPrivate: true,
  },
  {
    path: '/image',
    element: <ImageModePage />,
    isPrivate: true,
  },
  {
    path: '/scoreboard',
    element: <ScoreboardPage />,
    isPrivate: true,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    isPrivate: true,
  },
  {
    path: '/admin/dashboard',
    element: <AdminPage />,
    isPrivate: true,
    adminRequired: true,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
];

const renderRouteMap = ({
  isPrivate,
  adminRequired,
  element,
  ...restRoute
}: RouteConfig) => {
  const authRequiredElement = isPrivate ? (
    <AuthRequired adminRequired={adminRequired}>{element}</AuthRequired>
  ) : (
    element
  );
  return (
    <Route key={restRoute.path} {...restRoute} element={authRequiredElement} />
  );
};

export const AppRoutes = () => {
  return <Routes>{appRoutes.map(renderRouteMap)}</Routes>;
};

const AuthRequired = ({
  children,
  adminRequired = false,
}: {
  children: React.ReactNode;
  adminRequired?: boolean;
}) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const loginPage = '/auth/login';
  const homePage = '/home';
  const { pathname, search } = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={`${loginPage}?redirect=${pathname}${search}`} />;
  }
  if (adminRequired && !isAdmin) {
    return <Navigate to={`${homePage}?redirect=${pathname}${search}`} />;
  }

  return <>{children}</>;
};
