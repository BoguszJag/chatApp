import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, createBrowserRouter, Route, Router, RouterProvider, Routes } from 'react-router-dom';
import RegisterForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';
import App from './pages/App';
import { AuthContextProvider } from './context/AuthProvider';
import ProtectedRoute from './pages/ProtectedRoute';
import { InvitationsContextProvider } from './context/InvitationsProvider';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     errorElement: <h1>Something went wrong</h1>
//   },
//   {
//     path: '/login',
//     element: <LoginForm />,
//     errorElement: <h1>Something went wrong</h1>
//     },
//   {
//     path: '/register',
//     element: <RegisterForm />,
//     errorElement: <h1>Something went wrong</h1>
//   }
// ]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <InvitationsContextProvider>
      {/* <RouterProvider router={router} /> */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/' element={<App />}/>
          </Route>
          <Route path='/login' element={<LoginForm />}/>
          <Route path='/register' element={<RegisterForm />}/>
        </Routes>
      </BrowserRouter>
      </InvitationsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


