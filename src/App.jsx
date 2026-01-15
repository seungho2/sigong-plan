import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

import Admin from './components/Admin';

function App() {
  const isAdmin = window.location.pathname === '/admin';

  return (
    <LanguageProvider>
      {isAdmin ? (
        <Admin />
      ) : (
        <div className="App">
          <Header />
          <main>
            <Hero />
            <About />
            <Services />
            <Gallery />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </LanguageProvider>
  );
}

export default App;
