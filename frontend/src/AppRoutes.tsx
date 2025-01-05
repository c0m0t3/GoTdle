import { Navigate, Route, RouteProps, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { StartPage } from './pages/StartPage.tsx';
import { ClassicPage } from './pages/ClassicPage.tsx';
import { QuoteModePage } from './pages/QuoteModePage.tsx';
import { ImageModePage } from './pages/ImageModePage.tsx';
import { ScoreboardPage } from './pages/ScoreboardPage.tsx';

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
    path: '/quote',
    element: <QuoteModePage />
  },
  {
    path: '/image',
    element: <ImageModePage />
  },
  {
    path: '/start',
    element: <StartPage />
  },
  {
    path: '/classic',
    element: <ClassicPage />
  },
  {
    path: '/scoreboard',
    element: <ScoreboardPage />
  }


];

export function renderRouteMap({ element, ...restRoute }: RouteConfig) {
  return <Route key={restRoute.path} {...restRoute} element={element} />;
}

export const AppRoutes = () => {
  return <Routes>{appRoutes.map(renderRouteMap)}</Routes>;
};
