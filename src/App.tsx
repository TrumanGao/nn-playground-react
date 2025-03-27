import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import './App.less';

function App() {
  return (
    <div id="app">
      <RouterProvider router={createBrowserRouter(routes)}></RouterProvider>
    </div>
  );
}

export default App;
