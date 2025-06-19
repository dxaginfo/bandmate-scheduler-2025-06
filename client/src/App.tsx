import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import BandList from './pages/bands/BandList';
import BandDetail from './pages/bands/BandDetail';
import CreateBand from './pages/bands/CreateBand';
import RehearsalList from './pages/rehearsals/RehearsalList';
import RehearsalDetail from './pages/rehearsals/RehearsalDetail';
import CreateRehearsal from './pages/rehearsals/CreateRehearsal';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Bands */}
        <Route path="/bands" element={<BandList />} />
        <Route path="/bands/create" element={<CreateBand />} />
        <Route path="/bands/:id" element={<BandDetail />} />
        
        {/* Rehearsals */}
        <Route path="/rehearsals" element={<RehearsalList />} />
        <Route path="/rehearsals/create" element={<CreateRehearsal />} />
        <Route path="/rehearsals/:id" element={<RehearsalDetail />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;