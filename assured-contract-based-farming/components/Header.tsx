// components/Header.tsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from './icons';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../App';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  return (
    <header style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      padding: '1rem 2rem',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <Leaf style={{ 
            width: '2rem', 
            height: '2rem', 
            color: '#fbbf24' 
          }} />
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: 0
          }}>
            Assured Contract Farming
          </h1>
        </div>
        
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Dark Mode Toggle */}
          <ThemeToggle />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#fbbf24';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'white';
              }}
            >
              Login
            </button>
          </div>
          
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#fbbf24',
              border: 'none',
              color: '#1f2937',
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = '#f59e0b';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = '#fbbf24';
            }}
          >
            Register
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;