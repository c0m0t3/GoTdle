import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { HomePage } from './pages/HomePage.tsx';
import { StartPage } from './pages/StartPage.tsx';
import { ClassicPage } from './pages/ClassicPage.tsx';


export type RouteConfig = RouteProps & {
  /**
   * Required route path. E.g. /home
   */
  path: string;
  isPrivate?: boolean;
};

export const appRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="/home" replace />,
    index: true
  },
  {
    path: '/home',
    element: <HomePage />
  },
  {
    path: '/start',
    element: <StartPage />
  },
  {
    path: '/classic',
    element: <ClassicPage />
  }
];

export function renderRouteMap({ element, ...restRoute }: RouteConfig) {
  return <Route key={restRoute.path} {...restRoute} element={element} />;
}

export const AppRoutes = () => {
  return <Routes>{appRoutes.map(renderRouteMap)}</Routes>;
};
