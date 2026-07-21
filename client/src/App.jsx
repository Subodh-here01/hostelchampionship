import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveBanner from './components/LiveBanner';
import IntroLoader from './components/IntroLoader';

// Guards
import AdminRoute from './guards/AdminRoute';

// Pages
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Schedule from './pages/Schedule';
import Gallery from './pages/Gallery';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminMatches from './pages/AdminMatches';
import AdminTeams from './pages/AdminTeams';
import AdminGallery from './pages/AdminGallery';
import Rules from './pages/Rules';
import ScoringConsole from './pages/ScoringConsole';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <AuthProvider>
      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Header Navigation */}
          <Navbar />

          {/* Pulsing Live Streams Banner */}
          <LiveBanner />

          {/* Main viewports */}
          <main className="flex-grow">
            <Routes>
              {/* Public Viewports */}
              <Route path="/" element={<Home />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/rules" element={<Rules />} />
              
              {/* Security Sign-in */}
              <Route path="/admin" element={<AdminLogin />} />

              {/* Protected Admin Consoles */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/matches"
                element={
                  <AdminRoute>
                    <AdminMatches />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/teams"
                element={
                  <AdminRoute>
                    <AdminTeams />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/gallery"
                element={
                  <AdminRoute>
                    <AdminGallery />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/scoring/:id"
                element={
                  <AdminRoute>
                    <ScoringConsole />
                  </AdminRoute>
                }
              />

              {/* Catch All Redirect */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Footer Council signature */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
