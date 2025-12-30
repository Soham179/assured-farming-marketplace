// pages/LandingPage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ThemeContext } from '../App';

// Language translations
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
    // Chatbot translations
    chatbotTitle: "Assistant",
    chatbotGreeting: "Hello! I'm AgriBot, your farming assistant. Ask me anything about our platform!",
    chatbotPlaceholder: "Type your question here...",
    chatbotSend: "Send",
    chatbotClose: "Close",
    chatbotClear: "Clear Chat",
    chatbotExamples: "Try asking:",
    chatbotTyping: "AgriBot is typing...",
    // Navigation
    navHome: "Home",
    navFeatures: "Features",
    navAboutUs: "About Us",
    navContactUs: "Contact Us",
    // New sections
    aboutTitle: "About Assured Contract Farming",
    aboutContent: "Assured Contract Farming is a revolutionary platform dedicated to transforming agricultural trade through technology. Our mission is to create strong bonds between farmers and buyers, ensuring fair pricing, transparent transactions, and sustainable farming practices. We believe in empowering farmers with market access and providing buyers with reliable, quality produce.",
    contactTitle: "Get in Touch",
    contactContent: "Have questions or need assistance? Our team is here to help you.",
    contactEmail: "Email us at contact@assuredfarming.in",
    contactPhone: "Call us: +91 98765 43210",
    contactAddress: "Assured Contract Farming Pvt. Ltd., 3rd Floor, Innov8 Business Center, MG Road, Bengaluru, Karnataka – 560001, India",
  },
  mr: {
    title: "शेत ते बाजारपेठे जोडणे",
    subtitle: "शेतकरी आणि खरेदीदार यांच्यातील संपर्क साधणारे प्लॅटफॉर्म, स्थिर बाजारपेठ प्रवेश, पारदर्शक संवाद आणि आश्वासित करारांद्वारे विश्वासार्थ उत्पन्न सुनिश्चित करणे.",
    getStarted: "आजच सुरु करा",
    learnMore: "अधिक जाणून घ्या",
    whyChoose: "आमचे प्लॅटफॉर्म का निवडावे?",
    features: [
      { icon: '📄', title: 'आश्वासित करार', description: 'कायदेशीर बंधनकारक करारांद्वारे तुमचे उत्पन्न सुरक्षित करा.' },
      { icon: '🤝', title: 'किंमत मोलभाव', description: 'न्याय्य आणि पारदर्शक किंमतीसाठी थेट मोलभाव.' },
      { icon: '🌱', title: 'थेट बाजारपेठ प्रवेश', description: 'चांगल्या मूल्यासाठी थेट खरेदीदारांशी संपर्क साधा.' },
      { icon: '🛡️', title: 'सुरक्षित पेमेंट', description: 'सुरक्षित आणि पारदर्शक पेमेंट प्रक्रिया.' },
      { icon: '📉', title: 'बाजारपेठ धोका कमी करा', description: 'पूर्व-सहमत करारांसह किंमत लॉक करा.' },
      { icon: '🖱️', title: 'वापरकर्ता-मैत्रीपूर्ण इंटरफेस', description: 'सर्व तांत्रिक स्तरांसाठी वापरण्यास सोपे प्लॅटफॉर्म.' }
    ],
    howItWorks: "हे कसे काम करते",
    steps: [
      { step: '१', title: 'खाते नोंदणी करा', description: 'शेतकरी किंवा खरेदीदार म्हणून साइन अप करा आणि तुमचे प्रोफाइल पूर्ण करा.' },
      { step: '२', title: 'कनेक्ट करा आणि मोलभाव करा', description: 'उत्पादने सूचीबद्ध करा, ऑफरिंग ब्राउझ करा आणि अटींचा मोलभाव करा.' },
      { step: '३', title: 'सुरक्षित करा आणि वाढवा', description: 'करारावर सही करा आणि दीर्घकालीन भागीदारी तयार करा.' }
    ],
    ctaTitle: "तुमच्या शेती व्यवसायात बदल घडवायला तयार आहात?",
    ctaSubtitle: "आश्वासित करार शेतीचा लाभ घेणाऱ्या हजारो शेतकऱ्यांमध्ये सामील व्हा.",
    startFree: "आजच मोफत सुरु करा",
    existingUser: "अस्तित्वातील वापरकर्ता? लॉगिन करा",
    // Chatbot translations
    chatbotTitle: "सहाय्यक",
    chatbotGreeting: "नमस्कार! मी अग्रीबॉट आहे, तुमचा शेती सहाय्यक. आमच्या प्लॅटफॉर्मबद्दल काहीही विचारा!",
    chatbotPlaceholder: "तुमचा प्रश्न येथे टाइप करा...",
    chatbotSend: "पाठवा",
    chatbotClose: "बंद करा",
    chatbotClear: "चॅट साफ करा",
    chatbotExamples: "विचारण्याचा प्रयत्न करा:",
    chatbotTyping: "अग्रीबॉट टाइप करत आहे...",
    // Navigation
    navHome: "मुख्यपृष्ठ",
    navFeatures: "वैशिष्ट्ये",
    navAboutUs: "आमच्याबद्दल",
    navContactUs: "संपर्क साधा",
    // New sections
    aboutTitle: "अश्युअर्ड कॉन्ट्रॅक्ट फार्मिंग बद्दल",
    aboutContent: "अश्युअर्ड कॉन्ट्रॅक्ट फार्मिंग हे तंत्रज्ञानाद्वारे कृषी व्यापार रूपांतरित करण्यासाठी समर्पित क्रांतिकारक प्लॅटफॉर्म आहे. शेतकरी आणि खरेदीदार यांच्यात मजबूत संबंध निर्माण करणे, न्याय्य किंमत, पारदर्शक व्यवहार आणि शाश्वत शेती पद्धती सुनिश्चित करणे हे आमचे ध्येय आहे. आम्ही शेतकऱ्यांना बाजारपेठ प्रवेश देऊन सक्षम करण्यावर आणि खरेदीदारांना विश्वासार्थ, गुणवत्तापूर्ण उत्पादने पुरवण्यावर विश्वास ठेवतो.",
    contactTitle: "आमच्याशी संपर्क साधा",
    contactContent: "तुम्हाला प्रश्न आहेत किंवा मदतीची आवश्यकता आहे का? आमची टीम तुम्हाला मदत करण्यासाठी तयार आहे.",
    contactEmail: "आम्हाला ईमेल करा: contact@assuredfarming.in",
    contactPhone: "आम्हाला कॉल करा: +९१ ९८७६५ ४३२१०",
    contactAddress: "अश्युअर्ड कॉन्ट्रॅक्ट फार्मिंग प्रायव्हेट लिमिटेड, तिसरा मजला, इन्नोव्ह८ बिझनेस सेंटर, एम.जी. रोड, बेंगळुरू, कर्नाटक – ५६०००१, भारत",
  }
};

// Chatbot knowledge base with both languages
const chatbotKnowledge = {
  en: {
    "what is the assured contract farming system?": "It is an online platform that connects farmers and buyers through secure contracts, ensuring stable market access, transparent pricing, and assured payments.",
    "how does this platform help farmers?": "It provides guaranteed buyers, fair price negotiation, reduced market risk, and assured income through contract-based farming.",
    "how does this platform help buyers?": "Buyers get direct access to farmers, quality products, price transparency, and reliable supply through contracts.",
    "who can use this website?": "Farmers and buyers involved in agricultural trade can use this platform.",
    "is registration free?": "Yes, registration on the platform is completely free.",
    "is my data secure?": "Yes, user data is securely stored and access is protected through authentication.",
    "can i use this system on mobile?": "Yes, the system is responsive and can be accessed on mobile devices.",
    "what are the main features?": "Product listing, negotiation, contract management, quantity tracking, and secure payments.",
    "how does this system reduce market risk?": "It ensures fixed buyers and agreed prices through contracts before production or sale.",
    "what makes this system different?": "It removes middlemen, provides transparency, and ensures assured market access.",
    "how can a farmer register?": "A farmer can register by providing basic details and creating a farmer account.",
    "how to add a new product?": "Farmers can add products from their dashboard by entering product details and quantity.",
    "how to update product quantity?": "Farmers can increase or modify available quantity through the product management section.",
    "can a farmer edit product price?": "Yes, farmers can update product prices before contract approval.",
    "what happens during negotiation?": "The farmer receives a negotiation request and can accept, reject, or counter the offer.",
    "how to track contracts?": "Farmers can view all active and completed contracts from their dashboard.",
    "how does payment work?": "Payments are processed securely after successful contract confirmation.",
    "how can a buyer register?": "Buyers can register by creating a buyer account with required details.",
    "how to search for products?": "Buyers can browse or search products using filters like category and availability.",
    "can a buyer negotiate price?": "Yes, buyers can initiate price negotiation with farmers.",
    "how does negotiation work?": "Buyers send offers, farmers respond, and both agree on final terms.",
    "how to create a contract?": "After successful negotiation, buyers can create a contract from the product page.",
    "what is a contract?": "A contract is a digital agreement between farmer and buyer defining price, quantity, and terms.",
    "how is quantity managed?": "Quantity is managed dynamically and updated after contract confirmation.",
    "what if payment fails?": "The contract remains pending until payment is successful.",
    "how does chatbot help?": "The chatbot provides instant answers to commonly asked project-related questions.",
    "hello": "Hello! How can I help you with our farming platform today?",
    "hi": "Hi there! I'm here to assist you with any questions about our contract farming system.",
    "help": "I can help you with information about registration, features, contracts, payments, and more. Just ask your question!",
    "thanks": "You're welcome! Is there anything else I can help you with?",
    "thank you": "You're welcome! Feel free to ask if you have more questions."
  },
  mr: {
    "आश्वासित करार शेती प्रणाली काय आहे?": "ही एक ऑनलाइन प्लॅटफॉर्म आहे जी शेतकरी आणि खरेदीदारांना सुरक्षित करारांद्वारे जोडते, स्थिर बाजारपेठ प्रवेश, पारदर्शक किंमत आणि आश्वासित पेमेंट सुनिश्चित करते.",
    "हे प्लॅटफॉर्म शेतकऱ्यांना कसे मदत करते?": "हे हमीदार खरेदीदार, न्याय्य किंमत मोलभाव, कमी बाजार धोका आणि करार-आधारित शेतीद्वारे आश्वासित उत्पन्न प्रदान करते.",
    "हे प्लॅटफॉर्म खरेदीदारांना कसे मदत करते?": "खरेदीदारांना शेतकऱ्यांकडे थेट प्रवेश, गुणवत्तापूर्ण उत्पादने, किंमत पारदर्शकता आणि करारांद्वारे विश्वासार्थ पुरवठा मिळतो.",
    "ही वेबसाइट कोण वापरू शकतो?": "कृषी व्यापारात सहभागी शेतकरी आणि खरेदीदार हे प्लॅटफॉर्म वापरू शकतात.",
    "नोंदणी मोफत आहे का?": "होय, प्लॅटफॉर्मवर नोंदणी पूर्णपणे मोफत आहे.",
    "माझा डेटा सुरक्षित आहे का?": "होय, वापरकर्ता डेटा सुरक्षितपणे संग्रहित केला जातो आणि प्रवेश प्रमाणीकरणाद्वारे संरक्षित केला जातो.",
    "मी मोबाइलवर ही प्रणाली वापरू शकतो का?": "होय, ही प्रणाली प्रतिसाद देणारी आहे आणि मोबाइल उपकरणांवर प्रवेश करता येते.",
    "मुख्य वैशिष्ट्ये काय आहेत?": "उत्पादन सूची, मोलभाव, करार व्यवस्थापन, प्रमाण ट्रॅकिंग आणि सुरक्षित पेमेंट.",
    "ही प्रणाली बाजार धोका कसा कमी करते?": "उत्पादन किंवा विक्रीपूर्वी कराराद्वारे निश्चित खरेदीदार आणि सहमत किंमत सुनिश्चित करते.",
    "ही प्रणाली वेगळी कशी आहे?": "ती मध्यस्थ काढून टाकते, पारदर्शकता प्रदान करते आणि आश्वासित बाजार प्रवेश सुनिश्चित करते.",
    "शेतकरी कसा नोंदणी करू शकतो?": "शेतकरी मूलभूत तपशील प्रदान करून आणि शेतकरी खाते तयार करून नोंदणी करू शकतो.",
    "नवीन उत्पादन कसे जोडावे?": "शेतकरी उत्पादन तपशील आणि प्रमाण प्रविष्ट करून त्यांच्या डॅशबोर्डवरून उत्पादने जोडू शकतात.",
    "उत्पादन प्रमाण कसे अपडेट करावे?": "शेतकरी उत्पादन व्यवस्थापन विभागाद्वारे उपलब्ध प्रमाण वाढवू किंवा सुधारू शकतात.",
    "शेतकरी उत्पादनाची किंमत संपादित करू शकतो का?": "होय, शेतकरी करार मंजुरीपूर्वी उत्पादन किंमती अपडेट करू शकतात.",
    "मोलभावादरम्यान काय होते?": "शेतकऱ्याला मोलभाव विनंती प्राप्त होते आणि तो ऑफर स्वीकारू, नकार देऊ किंवा प्रतिवाद करू शकतो.",
    "करार कसे ट्रॅक करावे?": "शेतकरी त्यांच्या डॅशबोर्डवरून सर्व सक्रिय आणि पूर्ण झालेले करार पाहू शकतात.",
    "पेमेंट कसे कार्य करते?": "यशस्वी करार पुष्टीकरणानंतर पेमेंट सुरक्षितपणे प्रक्रिया केली जातात.",
    "खरेदीदार कसा नोंदणी करू शकतो?": "खरेदीदार आवश्यक तपशिलांसह खरेदीदार खाते तयार करून नोंदणी करू शकतात.",
    "उत्पादने कशी शोधावी?": "खरेदीदार श्रेणी आणि उपलब्धता सारख्या फिल्टरचा वापर करून उत्पादने ब्राउझ किंवा शोधू शकतात.",
    "खरेदीदार किंमतीचा मोलभाव करू शकतो का?": "होय, खरेदीदार शेतकऱ्यांबरोबर किंमत मोलभाव सुरू करू शकतात.",
    "मोलभाव कसा कार्य करतो?": "खरेदीदार ऑफर पाठवतात, शेतकरी प्रतिसाद देतात आणि दोघेही अंतिम अटींवर सहमत होतात.",
    "करार कसा तयार करावा?": "यशस्वी मोलभावानंतर, खरेदीदार उत्पादन पृष्ठावरून करार तयार करू शकतात.",
    "करार म्हणजे काय?": "करार हा शेतकरी आणि खरेदीदार यांच्यातील डिजिटल करार आहे जो किंमत, प्रमाण आणि अटी परिभाषित करतो.",
    "प्रमाण कसे व्यवस्थापित केले जाते?": "प्रमाण डायनॅमिकली व्यवस्थापित केले जाते आणि करार पुष्टीकरणानंतर अपडेट केले जाते.",
    "पेमेंट अयशस्वी झाल्यास काय?": "पेमेंट यशस्वी होईपर्यंत करार प्रलंबित राहतो.",
    "चॅटबॉट कसा मदत करतो?": "चॅटबॉट सामान्यतः विचारलेल्या प्रकल्प-संबंधित प्रश्नांची त्वरित उत्तरे प्रदान करतो.",
    "नमस्कार": "नमस्कार! आज मी तुम्हाला आमच्या शेती प्लॅटफॉर्मबद्दल कशी मदत करू शकतो?",
    "हॅलो": "हॅलो! मी तुमच्या आमच्या करार शेती प्रणालीबद्दलच्या कोणत्याही प्रश्नांसाठी उपलब्ध आहे.",
    "मदत": "मी तुम्हाला नोंदणी, वैशिष्ट्ये, करार, पेमेंट आणि अधिक माहितीबद्दल मदत करू शकतो. फक्त तुमचा प्रश्न विचारा!",
    "धन्यवाद": "तुमचे स्वागत आहे! मी तुम्हाला आणखी कशी मदत करू शकतो?",
    "आभार": "तुमचे स्वागत आहे! तुमच्याकडे आणखी प्रश्न असल्यास विचारण्यास मोकळ्या मनाने."
  }
};

// Custom Navigation Component - WITH AUTH BUTTONS BACK
const NavigationBar: React.FC<{ 
  isDark: boolean; 
  language: 'en' | 'mr'; 
  onNavClick: (section: string) => void;
  t: any;
}> = ({ isDark, language, onNavClick, t }) => {
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
        {/* Logo - Changed Symbol */}
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
            {/* Changed from 🌾 to a contract/safe symbol */}
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

        {/* Auth Buttons - BACK TO TOP RIGHT CORNER */}
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
            {language === 'en' ? 'Login' : 'लॉगिन'}
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
            {language === 'en' ? 'Register' : 'नोंदणी करा'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Chatbot Component - Changed to round shape with only assistant name below
const Chatbot: React.FC<{ isDark: boolean; language: 'en' | 'mr'; t: any }> = ({ isDark, language, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: t.chatbotGreeting, isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getResponse = (question: string): string => {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Check for exact matches
    if (chatbotKnowledge[language][normalizedQuestion]) {
      return chatbotKnowledge[language][normalizedQuestion];
    }

    // Check for partial matches
    for (const key in chatbotKnowledge[language]) {
      if (normalizedQuestion.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(normalizedQuestion)) {
        return chatbotKnowledge[language][key];
      }
    }

    // Default responses
    const defaultResponses = {
      en: "I'm here to help with questions about our contract farming platform. Could you please rephrase your question or ask about: registration, features, contracts, payments, or how the platform works?",
      mr: "मी आमच्या करार शेती प्लॅटफॉर्मबद्दलच्या प्रश्नांसाठी येथे आहे. कृपया तुमचा प्रश्न पुन्हा तयार करा किंवा विचारा: नोंदणी, वैशिष्ट्ये, करार, पेमेंट किंवा प्लॅटफॉर्म कसा कार्य करतो?"
    };
    
    return defaultResponses[language];
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getResponse(inputText);
      const botMessage = { text: response, isUser: false };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([{ text: t.chatbotGreeting, isUser: false }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exampleQuestions = language === 'en' ? [
    "What is the Assured Contract Farming System?",
    "How does this platform help farmers?",
    "Is registration free?"
  ] : [
    "आश्वासित करार शेती प्रणाली काय आहे?",
    "हे प्लॅटफॉर्म शेतकऱ्यांना कसे मदत करते?",
    "नोंदणी मोफत आहे का?"
  ];

  return (
    <>
      {/* Chatbot Toggle Button - Changed to round shape with name below */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 25px rgba(22, 163, 74, 0.4)',
            transition: 'all 0.3s ease',
            color: 'white',
            fontSize: '1.8rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(22, 163, 74, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(22, 163, 74, 0.4)';
          }}
        >
          {/* Changed to a simple chat icon */}
          💬
        </button>
        <span style={{
          fontSize: '0.85rem',
          fontWeight: '600',
          color: isDark ? '#f9fafb' : '#1f2937',
          background: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          padding: '2px 8px',
          borderRadius: '10px',
          backdropFilter: 'blur(5px)'
        }}>
          {t.chatbotTitle}
        </span>
      </div>

      {/* Chatbot Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '120px',
          right: '30px',
          zIndex: 1001,
          width: '380px',
          maxWidth: '90vw',
          height: '600px',
          maxHeight: '80vh',
          background: isDark ? '#1f2937' : 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
        }}>
          {/* Chat Header */}
          <div style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            padding: '1.2rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{
                background: 'white',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
                fontSize: '1.2rem'
              }}>
                🤖
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                  {t.chatbotTitle}
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>
                  {language === 'en' ? 'Assured Contract Farming' : 'अश्युअर्ड कॉन्ट्रॅक्ट फार्मिंग'} • {language === 'en' ? '24/7 Support' : '२४/७ आधार'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            padding: '1.2rem',
            overflowY: 'auto',
            background: isDark ? '#111827' : '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <div style={{
                  background: msg.isUser 
                    ? 'linear-gradient(135deg, #16a34a, #15803d)'
                    : (isDark ? '#374151' : 'white'),
                  color: msg.isUser ? 'white' : (isDark ? '#f9fafb' : '#1f2937'),
                  padding: '0.8rem 1.2rem',
                  borderRadius: msg.isUser 
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  lineHeight: 1.5,
                  fontSize: '0.95rem'
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginTop: '0.3rem',
                  paddingLeft: msg.isUser ? '0' : '0.5rem',
                  paddingRight: msg.isUser ? '0.5rem' : '0',
                  textAlign: msg.isUser ? 'right' : 'left'
                }}>
                  {msg.isUser ? (language === 'en' ? 'You' : 'तुम्ही') : t.chatbotTitle}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: isDark ? '#374151' : 'white',
                padding: '0.8rem 1.2rem',
                borderRadius: '18px 18px 18px 4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#16a34a',
                  animation: 'pulse 1.5s infinite'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#16a34a',
                  animation: 'pulse 1.5s infinite 0.2s'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#16a34a',
                  animation: 'pulse 1.5s infinite 0.4s'
                }}></div>
                <span style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.9rem',
                  color: isDark ? '#d1d5db' : '#6b7280'
                }}>
                  {t.chatbotTyping}
                </span>
              </div>
            )}

            {/* Example Questions */}
            {messages.length <= 1 && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{
                  fontSize: '0.9rem',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginBottom: '0.8rem',
                  textAlign: 'center'
                }}>
                  {t.chatbotExamples}
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}>
                  {exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(question);
                        setTimeout(() => handleSend(), 100);
                      }}
                      style={{
                        background: isDark ? '#374151' : 'white',
                        border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        padding: '0.8rem',
                        color: isDark ? '#f9fafb' : '#1f2937',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = isDark ? '#4b5563' : '#f3f4f6';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = isDark ? '#374151' : 'white';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>💡</span>
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{
            padding: '1.2rem',
            borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            background: isDark ? '#1f2937' : 'white',
            display: 'flex',
            gap: '0.8rem'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.chatbotPlaceholder}
                style={{
                  width: '100%',
                  padding: '0.9rem 3rem 0.9rem 1rem',
                  borderRadius: '25px',
                  border: `2px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  background: isDark ? '#111827' : '#f9fafb',
                  color: isDark ? '#f9fafb' : '#1f2937',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16a34a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? '#374151' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={handleClearChat}
                style={{
                  position: 'absolute',
                  right: '45px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(-50%) rotate(180deg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280';
                  e.currentTarget.style.transform = 'translateY(-50%) rotate(0deg)';
                }}
                title={t.chatbotClear}
              >
                🗑️
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              style={{
                background: inputText.trim() 
                  ? 'linear-gradient(135deg, #16a34a, #15803d)'
                  : (isDark ? '#374151' : '#e5e7eb'),
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                color: inputText.trim() ? 'white' : (isDark ? '#6b7280' : '#9ca3af'),
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (inputText.trim()) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(22, 163, 74, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (inputText.trim()) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {inputText.trim() ? '➤' : '✎'}
            </button>
          </div>

          {/* Chatbot Footer */}
          <div style={{
            padding: '0.8rem 1.2rem',
            background: isDark ? '#111827' : '#f9fafb',
            borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            fontSize: '0.75rem',
            color: isDark ? '#9ca3af' : '#6b7280',
            textAlign: 'center'
          }}>
            {language === 'en' 
              ? 'Assistant • Assured Contract Farming • Instant Support'
              : 'सहाय्यक • अश्युअर्ड कॉन्ट्रॅक्ट फार्मिंग • तत्काळ आधार'}
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { width: 0; opacity: 0; }
          to { width: 20px; opacity: 1; }
        }
      `}</style>
    </>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentBg, setCurrentBg] = useState(0);
  const { isDark } = useContext(ThemeContext);
  const [language, setLanguage] = useState<'en' | 'mr'>('en');

  const t = translations[language];

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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
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
      fontFamily: language === 'mr' ? 'Arial, "Noto Sans Devanagari", sans-serif' : 'Arial, sans-serif',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#1f2937',
      transition: 'all 0.3s ease',
      position: 'relative',
      scrollBehavior: 'smooth'
    }}>
      {/* Custom Navigation Bar - WITH AUTH BUTTONS */}
      <NavigationBar 
        isDark={isDark} 
        language={language} 
        onNavClick={scrollToSection}
        t={t}
      />
      
      {/* Language Switcher Button */}
      <button
        onClick={toggleLanguage}
        style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          zIndex: 1000,
          background: isDark ? '#374151' : '#ffffff',
          border: `2px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
          borderRadius: '50px',
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          color: isDark ? '#f9fafb' : '#1f2937',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>{language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
        {language === 'en' ? 'मराठी' : 'English'}
      </button>

      {/* Chatbot Component */}
      <Chatbot isDark={isDark} language={language} t={t} />

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

        {/* Hero Content - Changed buttons to "Starting Today" and "Learn More" */}
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
            {t.title.includes('Connecting') ? (
              <>
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
              </>
            ) : (
              <>
                शेत{' '}
                <span style={{
                  background: 'linear-gradient(45deg, #16a34a, #fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none'
                }}>
                  ते बाजारपेठे
                </span>{' '}
                जोडणे
              </>
            )}
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

          {/* Changed to "Starting Today" and "Learn More" buttons */}
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
              {t.getStarted} {/* This is now "Starting Today" */}
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
                {language === 'en' ? 'Our Mission' : 'आमचे ध्येय'}
              </h3>
              <p style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
                {language === 'en' ? 'To bridge the gap between farmers and buyers through technology and trust' : 'तंत्रज्ञान आणि विश्वासाद्वारे शेतकरी आणि खरेदीदार यांच्यातील अंतर दूर करणे'}
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
                {language === 'en' ? 'Our Vision' : 'आमची दृष्टी'}
              </h3>
              <p style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>
                {language === 'en' ? 'A world where every farmer gets fair value and every buyer gets quality produce' : 'एक असे जग जिथे प्रत्येक शेतकऱ्याला न्याय्य मूल्य मिळेल आणि प्रत्येक खरेदीदाराला गुणवत्तापूर्ण उत्पादने मिळतील'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section - REMOVED ADDRESS */}
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

      {/* Removed the CTA section and Footer as per requirement */}
    </div>
  );
};
export default LandingPage;