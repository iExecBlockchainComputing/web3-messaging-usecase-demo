import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const testRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'white', 
        color: 'black',
        minHeight: '100vh'
      }}>
        <h1>Test Router Working!</h1>
        <p>If you can see this, the router is working correctly.</p>
      </div>
    ),
  },
], {
  basename: '/web3messaging',
});

export function TestRouter() {
  console.log('TestRouter: Rendering test router');
  return <RouterProvider router={testRouter} />;
} 