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
import { ChatContextProvider } from './context/ChatProvider';
import { SocketContextProvider } from './context/SocketProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <SocketContextProvider>
    <AuthContextProvider>
      <InvitationsContextProvider>
      <ContactsChatsContextProvider>
      <ChatContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/' element={<App />}/>
          </Route>
          <Route path='/login' element={<LoginForm />}/>
          <Route path='/register' element={<RegisterForm />}/>
        </Routes>
      </BrowserRouter>
      </ChatContextProvider>
      </ContactsChatsContextProvider>
      </InvitationsContextProvider>
    </AuthContextProvider>
    </SocketContextProvider>
  // </React.StrictMode>
);


