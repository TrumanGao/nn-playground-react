import { Navigate, type RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/neural-network" replace></Navigate> },
  {
    lazy: () => import('../pages/NeuralNetwork/Layout'),
    children: [
      {
        path: '/neural-network',
        lazy: () =>
          import('../pages/NeuralNetwork/NeuralNetwork/NeuralNetwork'),
        handle: { title: 'neural network' },
      },
    ],
  },
  {
    path: '*',
    lazy: () => import('../pages/BoundaryPage/BoundaryPage'),
    handle: { title: '404' },
  },
];
