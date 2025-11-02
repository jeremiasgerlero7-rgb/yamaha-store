import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Home from './pages/Home';
import Models from './pages/Models';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import Quote from './pages/Quote';
import QuoteInfo from './pages/QuoteInfo';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import FloatingLegalButton from './components/FloatingLegalButton';
import FAQPanel from './components/FAQPanel'; 
import Profile from './pages/Profile';

function App() {
  console.log('Origen actual:', window.location.origin);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalSection, setLegalSection] = useState(null);

  const handleOpenLegal = (section) => {
    setLegalSection(section);
    setIsLegalOpen(true);
  };

  return (
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Toaster position="top-right" />
          <div className="min-h-screen flex flex-col">
            <Navbar 
              isFAQOpen={isFAQOpen} 
              setIsFAQOpen={setIsFAQOpen} 
            />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/models" element={<Models />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cotizar/:id" element={<Quote />} />
                <Route path="/quoteinfo" element={<QuoteInfo />} />
                <Route path="/profile" element={<Profile />} />
                <Route 
                  path="/users" 
                  element={
                    <ProtectedRoute>
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer 
              onOpenFAQ={() => setIsFAQOpen(true)}
              onOpenLegal={handleOpenLegal}
            />
            <FloatingLegalButton 
              isOpen={isLegalOpen}
              onClose={() => setIsLegalOpen(false)}
              activeSection={legalSection}
              onSectionChange={setLegalSection}
            />

            <FAQPanel isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;