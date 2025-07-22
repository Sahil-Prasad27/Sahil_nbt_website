import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewMainPage from './pages/NewMainPage.jsx';
import MainPage from './pages/MainPage'; 
import Login from './auth/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './auth/ProtectedRoute';

import Services from './pages/Services';
import Courses from './pages/Courses';
import Team from './pages/Team';
import Mission from './pages/Mission';
import Contact from './pages/Contact.jsx';
import Overview from './pages/Overview';
import ClientList from './pages/ClientList';
import FaqSection from './pages/FaqSection.jsx';
import Coupons from './pages/Coupons.jsx';
import Testimonial from './pages/Testimonial.jsx';
import AdminImageManager from './pages/AdminImageManager.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<MainPage />} /> 👈 Main landing page */}
        <Route path="/" element={<NewMainPage />} /> {/* 👈 New Main landing page */}
        
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mission"
          element={
            <ProtectedRoute>
              <Mission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientlist"
          element={
            <ProtectedRoute>
              <ClientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faqsection"
          element={
            <ProtectedRoute>
              <FaqSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coupons"
          element={
            <ProtectedRoute>
              <Coupons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/testimonials"
          element={
            <ProtectedRoute>
              <Testimonial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview-images"
          element={
            <ProtectedRoute>
              <AdminImageManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
