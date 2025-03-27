import { Navigate, type RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/neural-network" replace></Navigate>,
  },
  {
    lazy: () => import('../pages/Layout/Layout'),
    children: [
      {
        path: '/neural-network',
        lazy: () => import('../pages/NeuralNetwork/NeuralNetwork'),
        handle: {
          title: 'neural network',
        },
      },
    ],
  },
];
