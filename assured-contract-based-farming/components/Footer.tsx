// components/Footer.tsx
import React, { useContext } from 'react';
import { Leaf } from './icons';
import { ThemeContext } from '../App';

const Footer: React.FC = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <footer style={{
      background: isDark ? '#111827' : '#14532d',
      color: 'white',
      padding: '3rem 2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Brand Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Leaf style={{ 
                width: '2rem', 
                height: '2rem', 
                color: '#fbbf24' 
              }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Assured Contract Farming
              </h3>
            </div>
            <p style={{
              color: '#d1d5db',
              lineHeight: 1.6,
              margin: 0
            }}>
              Connecting fields to markets, seamlessly and securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a 
                  href="#"
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#fbbf24';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                  }}
                >
                  About Us
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a 
                  href="#features"
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#fbbf24';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                  }}
                >
                  Features
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a 
                  href="mailto:contact@assuredfarming.in"
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#fbbf24';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                  }}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Updated */}
          <div>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Contact
            </h4>
            <div style={{
              color: '#d1d5db',
              lineHeight: 1.6
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: '#fbbf24' }}>📍 Address:</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                  Assured Contract Farming Pvt. Ltd.<br />
                  3rd Floor, Innov8 Business Center<br />
                  MG Road, Bengaluru<br />
                  Karnataka – 560001, India
                </p>
              </div>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#fbbf24' }}>📞 Phone:</strong>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  +91 98765 43210
                </p>
              </div>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#fbbf24' }}>📧 Email:</strong>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  contact@assuredfarming.in
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '2rem',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} Assured Contract Farming System. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;