// pages/LandingPage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

// English translations only
const translations = {
  en: {
    title: "Connecting Fields to Markets",
    subtitle: "A platform connecting farmers and buyers, ensuring stable market access, transparent communication, and reliable income through assured contracts.",
    getStarted: "Starting Today",
    learnMore: "Learn More",
    whyChoose: "Why Choose Our Platform?",
    features: [
      { icon: '📄', title: 'Assured Contracts', description: 'Secure your income with legally binding contracts.' },
      { icon: '🤝', title: 'Price Negotiation', description: 'Direct negotiations for fair and transparent pricing.' },
      { icon: '🌱', title: 'Direct Market Access', description: 'Connect directly with buyers for better value.' },
      { icon: '🛡️', title: 'Secure Payments', description: 'Safe and transparent payment processing.' },
      { icon: '📉', title: 'Reduce Market Risk', description: 'Lock in prices with pre-agreed contracts.' },
      { icon: '🖱️', title: 'User-Friendly Interface', description: 'Easy to use platform for all technical levels.' }
    ],
    howItWorks: "How It Works",
    steps: [
      { step: '1', title: 'Register Account', description: 'Sign up as farmer or buyer and complete your profile.' },
      { step: '2', title: 'Connect & Negotiate', description: 'List produce, browse offerings, and negotiate terms.' },
      { step: '3', title: 'Secure & Grow', description: 'Sign contracts and build long-term partnerships.' }
    ],
    ctaTitle: "Ready to Transform Your Farming Business?",
    ctaSubtitle: "Join thousands of farmers and buyers benefiting from assured contract farming.",
    startFree: "Start Free Today",
    existingUser: "Existing User? Login",
    // Navigation
    navHome: "Home",
    navFeatures: "Features",
    navAboutUs: "About Us",
    navContactUs: "Contact Us",
    // About section
    aboutTitle: "About Assured Contract Farming",
    aboutContent: "Assured Contract Farming is a revolutionary platform dedicated to transforming agricultural trade through technology. Our mission is to create strong bonds between farmers and buyers, ensuring fair pricing, transparent transactions, and sustainable farming practices. We believe in empowering farmers with market access and providing buyers with reliable, quality produce.",
    contactTitle: "Get in Touch",
    contactContent: "Have questions or need assistance? Our team is here to help you.",
    contactEmail: "Email us at contact@assuredfarming.in",
    contactPhone: "Call us: +91 98765 43210",
  }
};

// Custom Navigation Component
const NavigationBar: React.FC<{ 
  isDark: boolean; 
  onNavClick: (section: string) => void;
  t: any;
}> = ({ isDark, onNavClick, t }) => {
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    onNavClick(section);
  };

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'features', label: t.navFeatures },
    { id: 'about', label: t.navAboutUs },
    { id: 'contact', label: t.navContactUs },
  ];

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`,
      padding: '1rem 2rem',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer'
        }} onClick={() => handleNavClick('home')}>
          <div style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
          }}>
            🤝
          </div>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #16a34a, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Assured Contract Farming
          </span>
        </div>

        {/* Navigation Items */}
        <nav style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '50px',
                color: activeSection === item.id 
                  ? (isDark ? '#fbbf24' : '#16a34a')
                  : (isDark ? '#d1d5db' : '#4b5563'),
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.color = isDark ? '#fbbf24' : '#16a34a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.color = isDark ? '#d1d5db' : '#4b5563';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {item.label}
              {activeSection === item.id && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #16a34a, #fbbf24)',
                  borderRadius: '2px',
                  animation: 'slideIn 0.3s ease'
                }} />
              )}
            </button>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleLoginClick}
            style={{
              background: 'transparent',
              border: `2px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
              padding: '0.6rem 1.5rem',
              borderRadius: '50px',
              color: isDark ? '#d1d5db' : '#4b5563',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = isDark ? '#374151' : '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Login
          </button>
          <button 
            onClick={handleRegisterClick}
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '50px',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(22, 163, 74, 0.3)';
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);
  const { isDark } = useContext(ThemeContext);

  const t = translations.en;

  // Background images
  const backgroundImages = [
    'https://images.tractorgyan.com/uploads/26301/627dd337a3b74_contract-farming1.jpg',
    'https://images.pexels.com/photos/1443867/pexels-photo-1443867.jpeg',
    'https://plus.unsplash.com/premium_photo-1661900547591-80ee79e20d1c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleStartingTodayClick = () => {
    navigate('/register');
  };

  const handleLearnMoreClick = () => {
    scrollToSection('features');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#1f2937',
      transition: 'all 0.3s ease',
      position: 'relative',
      scrollBehavior: 'smooth'
    }}>
      {/* Custom Navigation Bar */}
      <NavigationBar 
        isDark={isDark} 
        onNavClick={scrollToSection}
        t={t}
      />

      {/* Hero Section with Background Image - Home Section */}
      <section id="home" style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url(${backgroundImages[currentBg]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 1s ease-in-out',
        paddingTop: '80px'
      }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1
        }} />

        {/* Hero Content */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          zIndex: 2,
          padding: '2rem',
          maxWidth: '800px',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
          }}>
            Connecting{' '}
            <span style={{
              background: 'linear-gradient(45deg, #16a34a, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none'
            }}>
              Fields to Markets
            </span>
          </h1>
          
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '3rem',
            opacity: 0.95,
            lineHeight: 1.6,
            textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
            fontWeight: '500'
          }}>
            {t.subtitle}
          </p>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <button 
              onClick={handleStartingTodayClick}
              style={{
                background: 'linear-gradient(145deg, #16a34a, #15803d)',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(22, 163, 74, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(22, 163, 74, 0.3)';
              }}
            >
              {t.getStarted}
            </button>
            
            <button 
              onClick={handleLearnMoreClick}
              style={{
                background: 'transparent',
                border: '3px solid white',
                color: 'white',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#16a34a';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {t.learnMore}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: '5rem 2rem',
        background: isDark ? '#111827' : '#f8fafc',
        transition: 'all 0.3s ease',
        scrollMarginTop: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '3rem',
            marginBottom: '3rem',
            color: isDark ? '#f9fafb' : '#1a202c'
          }}>
            {t.whyChoose}
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '0 1rem'
          }}>
            {t.features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  background: isDark ? '#374151' : '#ffffff',
                  borderRadius: '15px',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  color: isDark ? '#f9fafb' : '#1f2937',
                  border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  filter: 'grayscale(0.3)'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: isDark ? '#d1d5db' : '#718096', 
                  lineHeight: 1.6,
                  fontSize: '1rem'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{
        padding: '5rem 2rem',
        background: isDark ? '#1f2937' : 'white',
        color: isDark ? '#f9fafb' : '#1f2937',
        transition: 'all 0.3s ease',
        scrollMarginTop: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '3rem',
            marginBottom: '3rem',
            color: isDark ? '#f9fafb' : '#1a202c'
          }}>
            {t.howItWorks}
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {t.steps.map((step, index) => (
              <div 
                key={index}
                style={{
                  background: isDark ? '#374151' : '#ffffff',
                  borderRadius: '15px',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  color: isDark ? '#f9fafb' : '#1f2937',
                  border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #16a34a, #15803d)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: '0 auto 1rem',
                  boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
                }}>
                  {step.step}
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}>
                  {step.title}
                </h3>
                <p style={{ 
                  color: isDark ? '#d1d5db' : '#718096', 
                  lineHeight: 1.6 
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" style={{
        padding: '5rem 2rem',
        background: isDark ? '#111827' : '#f8fafc',
        transition: 'all 0.3s ease',
        scrollMarginTop: '80px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '3rem',
            marginBottom: '2rem',
            color: isDark ? '#f9fafb' : '#1a202c'
          }}>
            {t.aboutTitle}
          </h2>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.8,
            color: isDark ? '#d1d5db' : '#4b5563',
            marginBottom: '3rem'
          }}>
            {t.aboutContent}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: isDark ? '#374151' : '#ffffff',
              padding: '2rem',
              borderRadius: '15px',
              flex: 1,
              minWidth: '250px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: isDark ? '#f9fafb' : '#1a202c' }}>
                Our Mission
              </h3>
              <p style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
                To bridge the gap between farmers and buyers through technology and trust
              </p>
            </div>
            <div style={{
              background: isDark ? '#374151' : '#ffffff',
              padding: '2rem',
              borderRadius: '15px',
              flex: 1,
              minWidth: '250px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: isDark ? '#f9fafb' : '#1a202c' }}>
                Our Vision
              </h3>
              <p style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
                A world where every farmer gets fair value and every buyer gets quality produce
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" style={{
        padding: '5rem 2rem',
        background: isDark ? '#1f2937' : 'white',
        color: isDark ? '#f9fafb' : '#1f2937',
        transition: 'all 0.3s ease',
        scrollMarginTop: '80px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '3rem',
            marginBottom: '2rem',
            color: isDark ? '#f9fafb' : '#1a202c'
          }}>
            {t.contactTitle}
          </h2>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.8,
            color: isDark ? '#d1d5db' : '#4b5563',
            marginBottom: '3rem'
          }}>
            {t.contactContent}
          </p>
          <div style={{
            background: isDark ? '#374151' : '#f9fafb',
            padding: '3rem',
            borderRadius: '20px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.2rem', color: isDark ? '#d1d5db' : '#4b5563', marginBottom: '0.5rem' }}>
                {t.contactEmail}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '1.2rem', color: isDark ? '#d1d5db' : '#4b5563' }}>
                {t.contactPhone}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;