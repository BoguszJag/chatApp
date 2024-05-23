import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';
import App from './pages/App';
import { AuthContextProvider } from './context/AuthProvider';
import ProtectedRoute from './pages/ProtectedRoute';
import { InvitationsContextProvider } from './context/InvitationsProvider';
import { ContactsChatsContextProvider } from './context/ContactsChatsProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <InvitationsContextProvider>
      <ContactsChatsContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/' element={<App />}/>
          </Route>
          <Route path='/login' element={<LoginForm />}/>
          <Route path='/register' element={<RegisterForm />}/>
        </Routes>
      </BrowserRouter>
      </ContactsChatsContextProvider>
      </InvitationsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


