// pages/FarmerDashboard.tsx - COMPLETE UPDATED VERSION WITH ALL FIXES
// ✅ ACCEPT/REJECT BUTTONS WORKING
// ✅ MARK AS COMPLETE FUNCTIONALITY ADDED
// ✅ FULL CONTRACT LIFECYCLE SUPPORT

import React, { useState, useEffect, useContext } from 'react';
import { 
  LogOut, FileText, Package, DollarSign, 
  Calendar, Bell, Plus, Trash2, X, Check, 
  RefreshCw, AlertCircle, MessageSquare,
  Info, User, Clock, ArrowUpDown, Globe,
  CheckCircle, XCircle, Eye, Edit, Sprout
} from 'lucide-react';
import { AuthContext } from '../App';
import api from '../api';

// Add this after the imports
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get headers
const getHeaders = (includeJson: boolean = true) => {
  const headers: HeadersInit = {};
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Marathi translations
const marathiTranslations = {
  'Welcome back': 'पुन्हा स्वागत आहे',
  'Loading your dashboard...': 'तुमचे डॅशबोर्ड लोड होत आहे...',
  'Refresh': 'रिफ्रेश',
  'Logout': 'लॉगआउट',
  'Overview': 'अवलोकन',
  'Contracts': 'करार',
  'Products': 'उत्पादने',
  'Payments': 'पेमेंट',
  'Negotiations': 'चर्चा',
  'Create Contract': 'करार तयार करा',
  'Add Product': 'उत्पादन जोडा',
  'View Negotiations': 'चर्चा पहा',
  'Active Contracts': 'सक्रिय करार',
  'Total Products': 'एकूण उत्पादने',
  'Pending Payments': 'प्रलंबित पेमेंट',
  'Pending Negotiations': 'प्रलंबित चर्चा',
  'price': 'किंमत',
  'contract': 'करार',
  'Recent Contracts': 'अलीकडील करार',
  'Notifications': 'सूचना',
  'Clear all': 'सर्व क्लिअर करा',
  'No notifications': 'कोणत्याही सूचना नाहीत',
  'Contract Management': 'करार व्यवस्थापन',
  'New Contract': 'नवीन करार',
  'Contract ID': 'करार आयडी',
  'Crop': 'पीक',
  'Buyer': 'खरेदीदार',
  'Quantity': 'प्रमाण',
  'Price': 'किंमत',
  'Delivery Date': 'वितरण तारीख',
  'Status': 'स्थिती',
  'Actions': 'क्रिया',
  'No contracts found': 'कोणतेही करार सापडले नाहीत',
  'Create your first contract to get started': 'सुरुवात करण्यासाठी तुमचा पहिला करार तयार करा',
  'Product Management': 'उत्पादन व्यवस्थापन',
  'Add New Product': 'नवीन उत्पादन जोडा',
  'Product Name': 'उत्पादनाचे नाव',
  'Description': 'वर्णन',
  'Quantity (kg)': 'प्रमाण (किलो)',
  'Price (₹ per kg)': 'किंमत (₹ प्रति किलो)',
  'Available': 'उपलब्ध',
  'Created': 'तयार केले',
  'Create Contract for this Product': 'या उत्पादनासाठी करार तयार करा',
  'No products found': 'कोणतीही उत्पादने सापडली नाहीत',
  'Add your first product to start selling': 'विक्री सुरू करण्यासाठी तुमचे पहिले उत्पादन जोडा',
  'Payment History': 'पेमेंट इतिहास',
  'Total Revenue': 'एकूण उत्पन्न',
  'Payment ID': 'पेमेंट आयडी',
  'Amount': 'रक्कम',
  'Payment Date': 'पेमेंट तारीख',
  'Method': 'पद्धत',
  'No payment records': 'पेमेंट रेकॉर्ड नाहीत',
  'Payments will appear here once contracts are completed': 'करार पूर्ण झाल्यावर पेमेंट्स येथे दिसतील',
  'Negotiations & Contract Requests': 'चर्चा आणि करार विनंत्या',
  'Review and respond to price negotiations and contract requests from buyers': 'खरेदीदारांकडून मिळालेल्या किंमत चर्चा आणि करार विनंत्यांचे परीक्षण करा आणि प्रतिसाद द्या',
  'Pending': 'प्रलंबित',
  'Countered': 'प्रतिक्रिया दिली',
  'Price Negotiations from Buyers': 'खरेदीदारांकडून किमतीची चर्चा',
  'Category': 'श्रेणी',
  'Your Listed Price': 'तुमची सूचीबद्ध किंमत',
  'Buyer\'s Offer': 'खरेदीदाराचा ऑफर',
  'Your Counter Offer': 'तुमचा प्रतिऑफर',
  'Enter your counter price': 'तुमची प्रतिकिंमत प्रविष्ट करा',
  'Accept Offer': 'ऑफर स्वीकारा',
  'Reject': 'नकार द्या',
  'Make Counter Offer': 'प्रतिऑफर द्या',
  'You accepted this offer': 'तुम्ही हा ऑफर स्वीकारला',
  'You rejected this offer': 'तुम्ही हा ऑफर नाकारला',
  'Counter offer sent': 'प्रतिऑफर पाठवला',
  'Contract Requests from Buyers': 'खरेदीदारांकडून करार विनंत्या',
  'From': 'कडून',
  'Delivery': 'वितरण',
  'Quantity Requested': 'विनंती केलेले प्रमाण',
  'Proposed Price': 'सुचविलेली किंमत',
  'Accept Request': 'विनंती स्वीकारा',
  'Contract request accepted': 'करार विनंती स्वीकारली',
  'Contract request rejected': 'करार विनंती नाकारली',
  'Working in Offline Mode': 'ऑफलाइन मोडमध्ये कार्यरत',
  'Checking...': 'तपासत आहे...',
  'Connected': 'कनेक्टेड',
  'Offline Mode': 'ऑफलाइन मोड',
  'Check that your backend server is running': 'तुमचा बॅकएंड सर्व्हर चालू आहे की नाही ते तपासा',
  'Failed to load dashboard data. Please try refreshing.': 'डॅशबोर्ड डेटा लोड करण्यात अयशस्वी. कृपया रिफ्रेश करण्याचा प्रयत्न करा.',
  'Quick Actions': 'त्वरित क्रिया',
  'Recent Activity': 'अलीकडील क्रिया',
  'Buyer Name': 'खरेदीदाराचे नाव',
  'Farmer ID': 'शेतकऱ्याचा आयडी',
  'kg': 'किलो',
  'Are you sure you want to cancel this contract?': 'तुम्हाला हा करार रद्द करायचा आहे का?',
  'Are you sure you want to delete this product?': 'तुम्हाला हे उत्पादन डिलीट करायचा आहे का?',
  'Please fill all fields': 'कृपया सर्व फील्ड भरा',
  'Please enter a valid counter price': 'कृपया वैध प्रतिकिंमत प्रविष्ट करा',
  'Sending...': 'पाठवत आहे...',
  'Processing...': 'प्रोसेसिंग...',
  'Send': 'पाठवा',
  'Cancel': 'रद्द करा',
  'No price negotiations': 'किंमत चर्चा नाहीत',
  'Buyers will appear here when they want to negotiate prices': 'खरेदीदार किंमत चर्चा करू इच्छित असल्यास येथे दिसतील',
  'Check Again': 'पुन्हा तपासा',
  'View Products': 'उत्पादने पहा',
  'No contract requests': 'करार विनंत्या नाहीत',
  'Buyers will send contract requests for your products': 'खरेदीदार तुमच्या उत्पादनांसाठी करार विनंत्या पाठवतील',
  'Counter Price (₹ per kg)': 'प्रतिकिंमत (₹ प्रति किलो)',
  'Counter Quantity (kg)': 'प्रतिप्रमाण (किलो)',
  'Counter Delivery Date': 'प्रतिवितरण तारीख',
  'Message to Buyer': 'खरेदीदाराला संदेश',
  'Optional message explaining your counter offer': 'तुमच्या प्रतिऑफरचे स्पष्टीकरण देणारा वैकल्पिक संदेश',
  'Send Counter Offer': 'प्रतिऑफर पाठवा',
  'Language': 'भाषा',
  'Marathi': 'मराठी',
  'English': 'इंग्रजी',
  'Select a product': 'उत्पादन निवडा',
  'Select category': 'श्रेणी निवडा',
  'Contract Requests': 'करार विनंत्या',
  'New Request': 'नवीन विनंती',
  'Message': 'संदेश',
  'Accept': 'स्वीकारा',
  'Counter': 'प्रतिऑफर',
  'View Details': 'तपशील पहा',
  'Edit': 'संपादित करा',
  'Delete': 'हटवा',
  'Are you sure you want to delete this contract request?': 'तुम्हाला ही करार विनंती हटवायची आहे का?',
  'Contract request deleted successfully': 'करार विनंती यशस्वीरित्या हटवली',
  'Failed to delete contract request': 'करार विनंती हटवण्यात अयशस्वी',
  'Mark as Completed': 'पूर्ण म्हणून चिन्हांकित करा',
  'Cancel Contract': 'करार रद्द करा',
  'Accept Contract': 'करार स्वीकारा',
  'Reject Contract': 'करार नाकारा',
  'Request ID': 'विनंती आयडी',
  'Close': 'बंद करा',
  'Submit': 'सबमिट करा',
  'Accepted': 'स्वीकारले',
  'Rejected': 'नाकारले',
  'Contract Request Details': 'करार विनंती तपशील',
  'Completed': 'पूर्ण',
  'Active': 'सक्रिय',
  'Complete': 'पूर्ण करा',
  'Mark contract as completed': 'करार पूर्ण म्हणून चिन्हांकित करा',
  'Are you sure you want to mark this contract as completed? Payment process will start after completion.': 'तुम्हाला हा करार पूर्ण म्हणून चिन्हांकित करायचा आहे का? करार पूर्ण झाल्यानंतर पेमेंट प्रक्रिया सुरू होईल.'
};

// Types
interface User {
  userId: number;
  name: string | null;
  email: string | null;
  role: string | null;
  status: string;
}

interface Product {
  productId: number;
  name: string | null;
  description: string | null;
  category: string | null;
  quantity: number | null;
  price: number | null;
  farmer: User | null;
  buyer: User | null;
  createdAt: string | null;
}

interface Contract {
  contractId: number;
  product: Product;
  buyer: User;
  farmer: User;
  quantity: number;
  price: number;
  crop: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  createdAt: string | null;
}

interface Payment {
  paymentId: number;
  contract: Contract;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success';
  time: string;
}

interface Negotiation {
  negotiationId: number;
  product: Product;
  buyer: User;
  farmer: User;
  buyerPrice: number;
  farmerPrice: number | null;
  status: 'PENDING' | 'COUNTERED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  type: 'PRICE_NEGOTIATION' | 'CONTRACT_REQUEST';
  createdAt: string;
  updatedAt: string;
  message?: string;
}

interface ContractRequest {
  requestId: number;
  buyer: User;
  product: Product;
  quantity: number;
  proposedPrice: number;
  deliveryDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED' | 'COMPLETED';
  message: string | null;
  createdAt: string;
  cropName?: string;
  productName?: string;
  productId?: number;
}

const FarmerDashboard: React.FC = () => {
  const { userRole, logout } = useContext(AuthContext);
  
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'products' | 'payments' | 'negotiations'>('overview');
  const [showContractModal, setShowContractModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  
  // Data States
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'Welcome to your dashboard! Start by adding products and creating contracts.',
      type: 'info',
      time: 'Just now'
    }
  ]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [farmerEmail, setFarmerEmail] = useState<string>('');

  // Negotiations State
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [contractRequests, setContractRequests] = useState<ContractRequest[]>([]);
  
  // Negotiation counter state
  const [showNegotiationCounterModal, setShowNegotiationCounterModal] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [negotiationCounterPrice, setNegotiationCounterPrice] = useState('');
  const [isProcessingNegotiation, setIsProcessingNegotiation] = useState<number | null>(null);

  // Counter offer state for contract requests
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [counterData, setCounterData] = useState({
    counterPrice: '',
    counterQuantity: '',
    counterDeliveryDate: '',
    counterMessage: ''
  });

  // New Contract Form State
  const [newContract, setNewContract] = useState({
    buyerEmail: '',
    productId: '',
    quantity: '',
    price: '',
    deliveryDate: '',
    crop: ''
  });

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    price: ''
  });

  // Translation function
  const t = (key: string): string => {
    if (language === 'mr' && marathiTranslations[key]) {
      return marathiTranslations[key];
    }
    return key;
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      setConnectionStatus('checking');
      const isConnected = await api.testConnection();
      if (isConnected) {
        setConnectionStatus('connected');
        console.log('✅ Backend connection successful');
      } else {
        setConnectionStatus('disconnected');
        console.warn('⚠️ Backend connection failed');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('❌ Backend connection error:', error);
    }
  };

  // ✅ Contract request handlers - USING EXISTING CONTRACT SYSTEM
  const handleAcceptContractRequest = async (contractId: number) => {
    setIsProcessingNegotiation(contractId);
    
    try {
      console.log('✅ Accepting contract request (activating contract):', contractId);
      
      // Use the contract API to activate (accept) the contract
      await api.contracts.activateContract(contractId);
      
      // Update local state - update contract status
      setContracts(prev => prev.map(contract => 
        contract.contractId === contractId 
          ? { ...contract, status: 'ACTIVE' }
          : contract
      ));
      
      // Also update contractRequests state
      setContractRequests(prev => prev.map(req => 
        req.requestId === contractId 
          ? { ...req, status: 'ACCEPTED' }
          : req
      ));
      
      alert(language === 'mr'
        ? '✅ करार स्वीकारला! खरेदीदाराला सूचित केले आहे.'
        : '✅ Contract accepted! The buyer has been notified.');
      
    } catch (error: any) {
      console.error('❌ Error accepting contract:', error);
      alert(language === 'mr'
        ? `करार स्वीकारण्यात अयशस्वी: ${error.message || 'अज्ञात त्रुटी'}`
        : `Failed to accept contract: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessingNegotiation(null);
    }
  };

  // ✅ Contract request reject handler - USING EXISTING CONTRACT SYSTEM
  const handleRejectContractRequest = async (contractId: number) => {
    setIsProcessingNegotiation(contractId);
    
    try {
      console.log('❌ Rejecting contract request (cancelling contract):', contractId);
      
      // Use the contract API to cancel (reject) the contract
      await api.contracts.cancelContract(contractId);
      
      // Update local state
      setContracts(prev => prev.map(contract => 
        contract.contractId === contractId 
          ? { ...contract, status: 'CANCELLED' }
          : contract
      ));
      
      // Also update contractRequests state
      setContractRequests(prev => prev.map(req => 
        req.requestId === contractId 
          ? { ...req, status: 'REJECTED' }
          : req
      ));
      
      alert(language === 'mr'
        ? '❌ करार नाकारला. खरेदीदाराला सूचित केले आहे.'
        : '❌ Contract rejected. The buyer has been notified.');
      
    } catch (error: any) {
      console.error('❌ Error rejecting contract:', error);
      alert(language === 'mr'
        ? `करार नाकरण्यात अयशस्वी: ${error.message || 'अज्ञात त्रुटी'}`
        : `Failed to reject contract: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessingNegotiation(null);
    }
  };

  // ✅ NEW: Handle Mark as Completed
  const handleMarkAsCompleted = async (contractId: number) => {
    if (window.confirm(t('Are you sure you want to mark this contract as completed? Payment process will start after completion.'))) {
      setIsProcessingNegotiation(contractId);
      
      try {
        console.log('✅ Marking contract as completed:', contractId);
        
        // Use the contract API to mark as completed
        await api.contracts.completeContract(contractId);
        
        // Update local state - update contract status
        setContracts(prev => prev.map(contract => 
          contract.contractId === contractId 
            ? { ...contract, status: 'COMPLETED' }
            : contract
        ));
        
        // Also update contractRequests state if it exists there
        setContractRequests(prev => prev.map(req => 
          req.requestId === contractId 
            ? { ...req, status: 'COMPLETED' }
            : req
        ));
        
        alert(language === 'mr'
          ? '✅ करार पूर्ण म्हणून चिन्हांकित केला! पेमेंट प्रक्रिया सुरू होईल.'
          : '✅ Contract marked as completed! Payment process will start.');
        
      } catch (error: any) {
        console.error('❌ Error marking contract as completed:', error);
        alert(language === 'mr'
          ? `करार पूर्ण चिन्हांकित करण्यात अयशस्वी: ${error.message || 'अज्ञात त्रुटी'}`
          : `Failed to mark contract as completed: ${error.message || 'Unknown error'}`);
      } finally {
        setIsProcessingNegotiation(null);
      }
    }
  };

  // ✅ Handle Delete Contract Request - USING CONTRACT DELETE
  const handleDeleteContractRequest = async (contractId: number) => {
    if (window.confirm(t('Are you sure you want to delete this contract request?'))) {
      setIsProcessingNegotiation(contractId);
      
      try {
        console.log('🗑️ Deleting contract:', contractId);
        
        // Use contract delete endpoint
        await api.contracts.deleteContract(contractId);
        
        // Remove from local state
        setContractRequests(prev => prev.filter(req => req.requestId !== contractId));
        setContracts(prev => prev.filter(contract => contract.contractId !== contractId));
        
        alert(t('Contract request deleted successfully'));
        
      } catch (error: any) {
        console.error('❌ Error deleting contract:', error);
        alert(`${t('Failed to delete contract request')}: ${error.message || 'Unknown error'}`);
      } finally {
        setIsProcessingNegotiation(null);
      }
    }
  };

  // Initialize counter modal for contract requests
  const handleInitiateCounter = (contractId: number) => {
    const request = contractRequests.find(r => r.requestId === contractId);
    if (request) {
      setSelectedRequestId(contractId);
      setCounterData({
        counterPrice: request.proposedPrice.toString(),
        counterQuantity: request.quantity.toString(),
        counterDeliveryDate: request.deliveryDate,
        counterMessage: language === 'mr'
          ? `तुमच्या स्वारस्याबद्दल धन्यवाद. मी ${request.cropName || request.product?.name} सुधारित किंमतीत देऊ शकतो.`
          : `Thank you for your interest. I can offer ${request.cropName || request.product?.name} at a revised price.`
      });
      setShowCounterModal(true);
    }
  };

  // ✅ Counter contract request - CREATES NEW CONTRACT
  const handleCounterContractRequest = async (contractId: number) => {
    if (!counterData.counterPrice || isNaN(parseFloat(counterData.counterPrice))) {
      alert(language === 'mr'
        ? 'कृपया वैध प्रतिकिंमत प्रविष्ट करा'
        : 'Please enter a valid counter price');
      return;
    }

    setIsProcessingNegotiation(contractId);
    
    try {
      console.log('💰 Creating counter offer contract:', contractId);
      
      // Find the original contract request
      const originalRequest = contractRequests.find(r => r.requestId === contractId);
      if (!originalRequest) {
        throw new Error('Original request not found');
      }
      
      // Create a new contract with counter offer
      const counterPriceValue = parseFloat(counterData.counterPrice);
      const counterQuantityValue = parseFloat(counterData.counterQuantity) || originalRequest.quantity;
      
      const newContractData = {
        farmerEmail: farmerEmail,
        buyerEmail: originalRequest.buyer?.email || '',
        productId: originalRequest.product?.productId || originalRequest.productId || 0,
        quantity: counterQuantityValue,
        price: counterPriceValue,
        deliveryDate: counterData.counterDeliveryDate || originalRequest.deliveryDate,
        crop: originalRequest.cropName || originalRequest.product?.name
      };
      
      console.log('Creating counter offer contract:', newContractData);
      
      // Create new contract
      await api.contracts.createContract(newContractData);
      
      // Cancel the original contract (request)
      await api.contracts.cancelContract(contractId);
      
      // Update local state
      setContractRequests(prev => prev.map(req => 
        req.requestId === contractId 
          ? { ...req, status: 'COUNTERED' }
          : req
      ));
      
      // Refresh data
      await fetchContractRequests();
      
      // Reset modal
      setShowCounterModal(false);
      setSelectedRequestId(null);
      setCounterData({
        counterPrice: '',
        counterQuantity: '',
        counterDeliveryDate: '',
        counterMessage: ''
      });
      
      alert(language === 'mr'
        ? `✅ प्रतिऑफर पाठवला!\n\nकिंमत: ₹${counterPriceValue}/किलो\n\nखरेदीदार तुमच्या प्रतिऑफरचे परीक्षण करेल.`
        : `✅ Counter offer sent!\n\nPrice: ₹${counterPriceValue}/kg\n\nThe buyer will review your counter offer.`);
      
    } catch (error: any) {
      console.error('❌ Error creating counter offer:', error);
      alert(language === 'mr'
        ? `प्रतिऑफर पाठवण्यात अयशस्वी: ${error.message || 'अज्ञात त्रुटी'}`
        : `Failed to send counter offer: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessingNegotiation(null);
    }
  };

  // Negotiation handlers
  const handleAcceptNegotiation = async (negotiationId: number) => {
    setIsProcessingNegotiation(negotiationId);
    
    try {
      console.log('✅ Accepting negotiation:', negotiationId);
      
      await api.negotiations.accept(negotiationId);
      
      // Update local state
      setNegotiations(prev => prev.map(neg => 
        neg.negotiationId === negotiationId 
          ? { ...neg, status: 'ACCEPTED' }
          : neg
      ));
      
      // Refresh negotiations to get updated data
      await fetchNegotiations();
      
      alert(language === 'mr'
        ? '✅ चर्चा स्वीकारली! खरेदीदाराला सूचित केले आहे.'
        : '✅ Negotiation accepted! Buyer has been notified.');
      
    } catch (error: any) {
      console.error('❌ Error accepting negotiation:', error);
      alert(language === 'mr'
        ? `चर्चा स्वीकारण्यात अयशस्वी: ${error.message || 'अज्ञात त्रुटी'}`
        : `Failed to accept negotiation: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessingNegotiation(null);
    }
  };

  const handleRejectNegotiation = async (negotiationId: number) => {
    setIsProcessingNegotiation(negotiationId);
    
    try {
      console.log('❌ Rejecting negotiation:', negotiationId);
      
      await api.negotiations.reject(negotiationId);
      
      // Update local state
      setNegotiations(prev => prev.map(neg => 
        neg.negotiationId === negotiationId 
          ? { ...neg, status: 'REJECTED' }
          : neg
      ));
      
      // Refresh negotiations to get updated data
      await fetchNegotiations();
      
      alert(language === 'mr'
        ? '❌ चर्चा नाकारली. खरेदीदाराला सूचित केले आहे.'
        : '❌ Negotiation rejected. Buyer has been notified.');
      
    } catch (error: any) {
      console.error('❌ Error rejecting negotiation:', error);
      alert(language === 'mr'
        ? `चर्चा नाकरण्यात अयशस्वी: ${error.message || 'अज्ञात त्रुटी'}`
        : `Failed to reject negotiation: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessingNegotiation(null);
    }
  };

  // Open negotiation counter modal
  const handleOpenNegotiationCounter = (negotiation: Negotiation) => {
    setSelectedNegotiation(negotiation);
    setNegotiationCounterPrice(negotiation.buyerPrice.toString());
    setShowNegotiationCounterModal(true);
  };

  // Handle counter negotiation with API call
  const handleCounterNegotiation = async () => {
    if (!selectedNegotiation || !negotiationCounterPrice || isNaN(parseFloat(negotiationCounterPrice))) {
      alert(language === 'mr'
        ? 'कृपया वैध प्रतिकिंमत प्रविष्ट करा'
        : 'Please enter a valid counter price');
      return;
    }

    setIsProcessingNegotiation(selectedNegotiation.negotiationId);

    try {
      console.log('💰 Countering negotiation:', selectedNegotiation.negotiationId);
      
      const counterPriceValue = parseFloat(negotiationCounterPrice);
      
      await api.negotiations.counterByFarmer(selectedNegotiation.negotiationId, counterPriceValue);
      
      // Update local state
      setNegotiations(prev => prev.map(neg => 
        neg.negotiationId === selectedNegotiation.negotiationId 
          ? { 
              ...neg, 
              status: 'COUNTERED',
              farmerPrice: counterPriceValue
            }
          : neg
      ));
      
      // Refresh negotiations to get updated data
      await fetchNegotiations();
      
      // Reset modal
      setShowNegotiationCounterModal(false);
      setSelectedNegotiation(null);
      setNegotiationCounterPrice('');
      
      alert(language === 'mr'
        ? `✅ प्रतिऑफर पाठवला!\n\nकिंमत: ₹${counterPriceValue}/किलो\n\nखरेदीदार तुमच्या प्रतिऑफरचे परीक्षण करेल.`
        : `✅ Counter offer sent!\n\nPrice: ₹${counterPriceValue}/kg\n\nThe buyer will review your counter offer.`);
      
    } catch (error: any) {
      console.error('❌ Error countering negotiation:', error);
      alert(language === 'mr'
        ? `प्रतिऑफर पाठवण्यात अयशस्वी: ${error.message || 'अज्ञात त्रुटी'}`
        : `Failed to send counter offer: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessingNegotiation(null);
    }
  };

  // Emergency fix for email extraction
  useEffect(() => {
    console.log('=== EMERGENCY EMAIL CHECK ===');
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.email) {
          console.log('✅ Extracted email from JWT token:', payload.email);
          setFarmerEmail(payload.email);
          localStorage.setItem('farmerEmail', payload.email);
          
          setCurrentUser({
            userId: payload.userId || 0,
            name: payload.name || '',
            email: payload.email,
            role: payload.role || 'FARMER',
            status: 'ACTIVE'
          });
          return;
        }
      } catch (e) {
        console.log('Could not extract email from token');
      }
    }
    
    // Check all possible locations for email
    const emailSources = [
      { key: 'currentUser', type: 'json' },
      { key: 'farmerEmail', type: 'string' },
      { key: 'loginEmail', type: 'string' },
      { key: 'userEmail', type: 'string' },
      { key: 'email', type: 'string' }
    ];
    
    emailSources.forEach(source => {
      const value = localStorage.getItem(source.key);
      if (value) {
        console.log(`Found in ${source.key}:`, value);
        
        if (source.type === 'json') {
          try {
            const parsed = JSON.parse(value);
            if (parsed.email) {
              console.log('✅ Extracted email from JSON:', parsed.email);
              setFarmerEmail(parsed.email);
              setCurrentUser(parsed);
            }
          } catch (error) {
            console.log(`Could not parse ${source.key} as JSON`);
          }
        } else if (value.includes('@')) {
          console.log('✅ Using string as email:', value);
          setFarmerEmail(value);
        }
      }
    });
    
    // If still no email, check other localStorage items
    if (!farmerEmail) {
      console.log('Checking all localStorage items:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key || '');
        if (value && value.includes('@')) {
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
          const match = value.match(emailRegex);
          if (match) {
            console.log('✅ Found email in', key, ':', match[0]);
            setFarmerEmail(match[0]);
            break;
          }
        }
      }
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('=== LOADING USER DATA ===');
        
        // Test connection first
        await testBackendConnection();
        
        // First, try to get email from the emergency check above
        if (farmerEmail) {
          console.log('✅ Email already set from emergency check:', farmerEmail);
          await fetchDashboardData();
          return;
        }
        
        // If not, try localStorage
        const userDataStr = localStorage.getItem('currentUser');
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            console.log('Found user in localStorage:', userData);
            
            if (userData.email) {
              setCurrentUser(userData);
              setFarmerEmail(userData.email);
              console.log('✅ Set email from localStorage:', userData.email);
              await fetchDashboardData();
              return;
            }
          } catch (parseError) {
            console.error('Error parsing userData:', parseError);
          }
        }
        
        // Try backup email storage
        const backupEmail = localStorage.getItem('farmerEmail') || 
                           localStorage.getItem('loginEmail');
        
        if (backupEmail) {
          console.log('✅ Using backup email:', backupEmail);
          setFarmerEmail(backupEmail);
          
          setCurrentUser({
            userId: 0,
            name: '',
            email: backupEmail,
            role: 'FARMER',
            status: 'ACTIVE'
          });
          
          await fetchDashboardData();
          return;
        }
        
        // No email found
        console.error('❌ No email found anywhere!');
        setError('No farmer email found. Please login again.');
        setLoading(false);
        
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data. Please login again.');
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [farmerEmail]);

  // Fetch data when farmerEmail changes
  useEffect(() => {
    if (farmerEmail && !loading) {
      console.log('📧 Email changed, fetching data:', farmerEmail);
      fetchDashboardData();
    }
  }, [farmerEmail]);

  // API Calls
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);
      
      console.log('=== FETCHING DASHBOARD DATA ===');
      console.log('Current farmerEmail:', farmerEmail);
      
      if (!farmerEmail) {
        const emailFromStorage = localStorage.getItem('farmerEmail') || 
                                localStorage.getItem('loginEmail');
        
        if (emailFromStorage) {
          console.log('⚠️ Using email from storage:', emailFromStorage);
          setFarmerEmail(emailFromStorage);
        } else {
          setError('No farmer email found. Please login again.');
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }
      
      console.log('✅ Fetching data for farmer:', farmerEmail);
      
      // Fetch data sequentially
      await fetchContracts();
      await fetchProducts();
      await fetchPayments();
      await fetchNegotiations();
      await fetchContractRequests(); // This now fetches PENDING contracts
      
      // Check for new notifications
      await checkForNotifications();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchContracts = async () => {
    try {
      console.log('Fetching contracts for farmer:', farmerEmail);
      let contractsData;
      
      try {
        contractsData = await api.contracts.getContractsByFarmer(farmerEmail);
        console.log('Farmer contracts data:', contractsData);
      } catch (endpointError) {
        console.warn('Farmer endpoint failed, trying all contracts:', endpointError);
        contractsData = await api.contracts.getAllContracts();
        if (Array.isArray(contractsData)) {
          contractsData = contractsData.filter((contract: any) => 
            contract.farmer?.email === farmerEmail
          );
        }
      }
      
      if (Array.isArray(contractsData)) {
        setContracts(contractsData);
      } else {
        console.warn('Invalid contracts data format:', contractsData);
        setContracts([]);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setContracts([]);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products for farmer:', farmerEmail);
      let productsData;
      
      try {
        productsData = await api.products.getAllProducts();
        console.log('All products data:', productsData);
        
        if (Array.isArray(productsData)) {
          const farmerProducts = productsData.filter((product: any) => 
            product.farmer?.email === farmerEmail
          );
          setProducts(farmerProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchPayments = async () => {
    try {
      console.log('Fetching payments...');
      const paymentsData = await api.payments.getAllPayments();
      console.log('All payments data:', paymentsData);
      
      if (Array.isArray(paymentsData)) {
        const farmerContractIds = contracts.map(contract => contract.contractId);
        const farmerPayments = paymentsData.filter((payment: any) => 
          farmerContractIds.includes(payment.contract?.contractId)
        );
        setPayments(farmerPayments);
      } else {
        console.warn('Invalid payments data format:', paymentsData);
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  };

  // Fetch negotiations for farmer
  const fetchNegotiations = async () => {
    try {
      console.log('🔄 Fetching negotiations for farmer:', farmerEmail);
      
      if (!farmerEmail || !farmerEmail.includes('@')) {
        console.error('❌ Invalid farmer email:', farmerEmail);
        setNegotiations([]);
        return;
      }
      
      let negotiationsData;
      
      try {
        console.log('📡 Calling api.negotiations.getByFarmer()...');
        negotiationsData = await api.negotiations.getByFarmer(farmerEmail);
        console.log('✅ API Response:', negotiationsData);
        
        if (negotiationsData && negotiationsData.length > 0) {
          console.log(`✅ Loaded ${negotiationsData.length} real negotiations`);
        } else {
          console.log('ℹ️ No negotiations found in API response');
        }
      } catch (error: any) {
        console.error('❌ API call failed:', error.message);
        negotiationsData = [];
      }
      
      if (Array.isArray(negotiationsData)) {
        setNegotiations(negotiationsData);
      } else {
        console.warn('Invalid negotiations data format:', negotiationsData);
        setNegotiations([]);
      }
    } catch (error) {
      console.error('❌ Error in fetchNegotiations:', error);
      setNegotiations([]);
    }
  };

  // ✅ Fetch contract requests for farmer - USING PENDING CONTRACTS
  const fetchContractRequests = async () => {
    try {
      console.log('🔄 Fetching PENDING contracts as contract requests for farmer:', farmerEmail);
      
      if (!farmerEmail || !farmerEmail.includes('@')) {
        console.error('❌ Invalid farmer email:', farmerEmail);
        setContractRequests([]);
        return;
      }
      
      // Get all contracts for this farmer
      let contractsData;
      try {
        console.log('📡 Calling api.contracts.getContractsByFarmer()...');
        contractsData = await api.contracts.getContractsByFarmer(farmerEmail);
        console.log('✅ All contracts for farmer:', contractsData);
      } catch (error: any) {
        console.error('❌ Error fetching contracts:', error.message);
        contractsData = [];
      }
      
      if (Array.isArray(contractsData)) {
        // Filter only PENDING contracts (these are the "requests")
        const pendingContracts = contractsData.filter((contract: any) => 
          contract.status === 'PENDING'
        );
        
        console.log(`✅ Found ${pendingContracts.length} PENDING contracts (contract requests)`);
        
        // Convert to ContractRequest format for the UI with proper status type
        const formattedRequests: ContractRequest[] = pendingContracts.map((contract: any) => {
          const cropName = contract.crop || 
                          contract.product?.name || 
                          contract.product?.category || 
                          'Crop';
          
          return {
            requestId: contract.contractId, // Use contract ID as request ID
            buyer: contract.buyer,
            product: contract.product,
            quantity: contract.quantity,
            proposedPrice: contract.price,
            deliveryDate: contract.endDate || contract.deliveryDate,
            status: 'PENDING',
            message: `Contract request for ${cropName}`,
            createdAt: contract.createdAt || new Date().toISOString(),
            cropName: cropName,
            productName: cropName,
            productId: contract.product?.productId
          };
        });
        
        setContractRequests(formattedRequests);
        
      } else {
        console.log('ℹ️ No contracts found for farmer');
        setContractRequests([]);
      }
    } catch (error) {
      console.error('❌ Error in fetchContractRequests:', error);
      setContractRequests([]);
    }
  };

  // Check for notifications
  const checkForNotifications = async () => {
    try {
      const recentRequests = contractRequests.filter(req => {
        const createdDate = new Date(req.createdAt);
        const now = new Date();
        const diffHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
        return diffHours < 24;
      });
      
      recentRequests.forEach(req => {
        if (!notifications.find(n => n.message.includes(`contract request from ${req.buyer?.name}`))) {
          const cropName = req.cropName || req.product?.name || 'product';
          setNotifications(prev => [{
            id: prev.length + 1,
            message: language === 'mr'
              ? `📝 नवीन करार विनंती ${req.buyer?.name || 'खरेदीदार'} कडून ${cropName} साठी`
              : `📝 New contract request from ${req.buyer?.name || 'buyer'} for ${cropName}`,
            type: 'info',
            time: 'Just now'
          }, ...prev]);
        }
      });
    } catch (error) {
      console.log('Error checking notifications:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    await testBackendConnection();
    await fetchDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('farmerEmail');
    localStorage.removeItem('loginEmail');
    window.location.href = '/login';
  };

  const handleAddContract = async () => {
    if (!newContract.buyerEmail || !newContract.productId || !newContract.quantity || !newContract.price || !newContract.deliveryDate) {
      alert(t('Please fill all fields'));
      return;
    }

    try {
      const contractData = {
        farmerEmail: farmerEmail,
        buyerEmail: newContract.buyerEmail,
        productId: parseInt(newContract.productId),
        quantity: parseFloat(newContract.quantity),
        price: parseFloat(newContract.price),
        deliveryDate: newContract.deliveryDate,
        crop: newContract.crop || 'General Crop'
      };

      console.log('Creating contract:', contractData);
      const newContractResponse = await api.contracts.createContract(contractData);
      console.log('Contract created:', newContractResponse);

      await fetchContracts();
      await fetchContractRequests(); // Refresh contract requests too
      
      setShowContractModal(false);
      setNewContract({ buyerEmail: '', productId: '', quantity: '', price: '', deliveryDate: '', crop: '' });
      
      setNotifications(prev => [{
        id: prev.length + 1,
        message: language === 'mr'
          ? `${newContract.buyerEmail} सोबत नवीन करार तयार केला`
          : `New contract created with ${newContract.buyerEmail}`,
        type: 'success',
        time: 'Just now'
      }, ...prev]);

    } catch (error: any) {
      console.error('Error creating contract:', error);
      alert(language === 'mr'
        ? `करार तयार करण्यात अयशस्वी: ${error.message || 'अज्ञात त्रुटी'}`
        : `Failed to create contract: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm(t('Are you sure you want to delete this product?'))) {
      try {
        await api.products.deleteProduct(id);
        await fetchProducts();
        
        setNotifications(prev => [{
          id: prev.length + 1,
          message: language === 'mr' ? 'उत्पादन यशस्वीरित्या हटवले' : 'Product deleted successfully',
          type: 'success',
          time: 'Just now'
        }, ...prev]);
      } catch (error: any) {
        console.error('Error deleting product:', error);
        alert(language === 'mr'
          ? `उत्पादन हटवण्यात अयशस्वी: ${error.message || 'अज्ञात त्रुटी'}`
          : `Failed to delete product: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleAddProduct = async () => {
    console.log('=== STARTING ADD PRODUCT ===');
    console.log('Form data:', newProduct);

    if (!newProduct.name || !newProduct.category || !newProduct.quantity || !newProduct.price) {
      alert(t('Please fill all required fields'));
      return;
    }

    const getFarmerEmail = (): string => {
      if (farmerEmail && farmerEmail.includes('@')) {
        return farmerEmail;
      }
      
      const localStorageKeys = ['farmerEmail', 'loginEmail', 'userEmail', 'email', 'user', 'currentUser'];
      for (const key of localStorageKeys) {
        const value = localStorage.getItem(key);
        if (value && value.includes('@')) {
          if (value.includes('{')) {
            try {
              const parsed = JSON.parse(value);
              if (parsed.email) {
                return parsed.email;
              }
            } catch (e) {
              // Not JSON, using as string
            }
          }
          return value;
        }
      }
      
      if (currentUser && currentUser.email) {
        return currentUser.email;
      }
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.email || payload.sub) {
            return payload.email || payload.sub;
          }
        } catch (e) {
          console.log('Could not extract email from token:', e);
        }
      }
      
      return '';
    };

    const emailToUse = getFarmerEmail();
    
    if (!emailToUse || !emailToUse.includes('@')) {
      alert(language === 'mr'
        ? `❌ त्रुटी: वैध शेतकरी ईमेल सापडत नाही.`
        : `❌ Error: Cannot find valid farmer email.`);
      return;
    }

    const productData = {
      name: newProduct.name,
      description: newProduct.description || '',
      category: newProduct.category,
      quantity: parseFloat(newProduct.quantity),
      price: parseFloat(newProduct.price),
      farmerEmail: emailToUse
    };

    console.log('🛠️ Creating product with data:', productData);

    try {
      console.log('📤 Sending API request...');
      const newProductResponse = await api.products.createProduct(productData);
      console.log('✅ Product created successfully:', newProductResponse);

      await fetchProducts();
      
      setShowProductModal(false);
      setNewProduct({ name: '', description: '', category: '', quantity: '', price: '' });
      
      setNotifications(prev => [{
        id: prev.length + 1,
        message: language === 'mr'
          ? `"${newProduct.name}" नवीन उत्पादन यशस्वीरित्या जोडले`
          : `New product "${newProduct.name}" added successfully`,
        type: 'success',
        time: 'Just now'
      }, ...prev]);

    } catch (error: any) {
      console.error('❌ Error creating product:', error);
      alert(language === 'mr'
        ? `उत्पादन जोडण्यात अयशस्वी: ${error.message || 'API त्रुटी'}`
        : `Failed to add product: ${error.message || 'API error'}`);
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNegotiationStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'COUNTERED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('Not set');
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return t('Not set');
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return language === 'mr' ? 'आत्ताच' : 'Just now';
    if (diffMins < 60) return language === 'mr' ? `${diffMins} मिनिटांपूर्वी` : `${diffMins}m ago`;
    if (diffHours < 24) return language === 'mr' ? `${diffHours} तासांपूर्वी` : `${diffHours}h ago`;
    if (diffDays < 7) return language === 'mr' ? `${diffDays} दिवसांपूर्वी` : `${diffDays}d ago`;
    return formatDate(dateString);
  };

  // Calculate Stats
  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const activeContracts = contracts.filter(c => c.status === 'ACTIVE').length;
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
  const totalProducts = products.length;
  const pendingNegotiations = negotiations.filter(n => n.status === 'PENDING').length;
  const pendingContractRequests = contractRequests.filter(r => r.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('Loading your dashboard...')}</p>
          {farmerEmail && (
            <p className="text-sm text-gray-500 mt-2">{t('Loading data for:')} {farmerEmail}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-700">🌾 {t('Farmer Dashboard')}</h1>
            <p className="text-sm text-gray-600">
              {language === 'mr' ? 'पुन्हा स्वागत आहे' : 'Welcome back'}{currentUser?.name ? `, ${currentUser.name}` : ''}!
              {farmerEmail && (
                <span className="text-xs text-gray-500 block mt-1">
                  {t('Farmer ID')}: {farmerEmail}
                  {contracts.length > 0 && ` • ${contracts.length} ${t('contracts')}`}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <Globe size={16} />
              <span className="text-sm font-medium">{language === 'en' ? 'मराठी' : 'English'}</span>
            </button>
            
            {/* Connection Status */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
              connectionStatus === 'disconnected' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'disconnected' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}></div>
              {connectionStatus === 'connected' ? t('Connected') : 
               connectionStatus === 'disconnected' ? t('Offline Mode') : t('Checking...')}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? t('Refreshing...') : t('Refresh')}
            </button>
            
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell size={24} className="text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              {t('Logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: t('Overview'), icon: FileText },
              { id: 'contracts', label: t('Contracts'), icon: FileText },
              { id: 'products', label: t('Products'), icon: Package },
              { id: 'payments', label: t('Payments'), icon: DollarSign },
              { id: 'negotiations', label: t('Negotiations'), icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-green-600'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {tab.id === 'contracts' && contracts.length > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {contracts.length}
                    </span>
                  )}
                  {tab.id === 'negotiations' && (pendingNegotiations + pendingContractRequests) > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {pendingNegotiations + pendingContractRequests}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('Active Contracts')}</p>
                    <h3 className="text-3xl font-bold text-green-700">{activeContracts}</h3>
                  </div>
                  <FileText className="text-green-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('Total Products')}</p>
                    <h3 className="text-3xl font-bold text-blue-700">{totalProducts}</h3>
                  </div>
                  <Package className="text-blue-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('Pending Payments')}</p>
                    <h3 className="text-3xl font-bold text-yellow-700">
                      {formatPrice(pendingPayments)}
                    </h3>
                  </div>
                  <DollarSign className="text-yellow-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('Pending Negotiations')}</p>
                    <h3 className="text-3xl font-bold text-orange-700">{pendingNegotiations + pendingContractRequests}</h3>
                    <p className="text-xs text-orange-600 mt-1">
                      {pendingNegotiations} {t('price')} • {pendingContractRequests} {t('contract')}
                    </p>
                  </div>
                  <MessageSquare className="text-orange-500" size={40} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t('Quick Actions')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowContractModal(true)}
                  className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-200 transition"
                >
                  <Plus className="text-green-600" size={24} />
                  <span className="font-semibold text-green-700">{t('Create Contract')}</span>
                </button>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-blue-200 transition"
                >
                  <Plus className="text-blue-600" size={24} />
                  <span className="font-semibold text-blue-700">{t('Add Product')}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('negotiations')}
                  className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-2 border-orange-200 transition relative"
                >
                  <MessageSquare className="text-orange-600" size={24} />
                  <span className="font-semibold text-orange-700">{t('View Negotiations')}</span>
                  {(pendingNegotiations + pendingContractRequests) > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                      {pendingNegotiations + pendingContractRequests}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Recent Activity & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('Recent Contracts')}</h2>
                <div className="space-y-3">
                  {contracts.slice(0, 4).map(contract => (
                    <div key={contract.contractId} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <span className="text-green-700">{contract.crop}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(contract.status)}`}>
                              {contract.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {t('Buyer')}: {contract.buyer?.name || contract.buyer?.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(contract.price)} • {contract.quantity} {t('kg')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{formatDate(contract.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {contracts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>{t('No contracts found')}</p>
                      <button
                        onClick={() => setShowContractModal(true)}
                        className="mt-2 text-green-600 hover:text-green-700 font-medium"
                      >
                        {t('Create your first contract to get started')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{t('Notifications')}</h2>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    {t('Clear all')}
                  </button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${
                          notification.type === 'success' ? 'border-green-200 bg-green-50' :
                          notification.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                          'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>{t('No notifications')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t('Contract Management')}</h2>
              <button
                onClick={() => setShowContractModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={18} />
                {t('New Contract')}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Contract ID')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Crop')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Buyer')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Quantity')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Price')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Delivery Date')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {contracts.map(contract => (
                      <tr key={contract.contractId} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">#{contract.contractId}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-green-700">{contract.crop}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{contract.buyer?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{contract.buyer?.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{contract.quantity} {t('kg')}</td>
                        <td className="py-3 px-4">{formatPrice(contract.price)}</td>
                        <td className="py-3 px-4">{formatDate(contract.endDate)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                            {contract.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contracts.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">{t('No contracts found')}</h3>
                    <p className="text-gray-500 mb-4">{t('Create your first contract to get started')}</p>
                    <button
                      onClick={() => setShowContractModal(true)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      {t('Create Contract')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t('Product Management')}</h2>
              <button
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={18} />
                {t('Add New Product')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.productId} className="bg-white rounded-xl shadow-lg p-6 border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product.productId)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('Quantity')}</p>
                      <p className="font-medium">{product.quantity} {t('kg')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('Price')}</p>
                      <p className="font-medium">{formatPrice(product.price)}/{t('kg')}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {t('Created')}: {formatDate(product.createdAt)}
                    </span>
                    <button
                      onClick={() => {
                        setNewContract(prev => ({
                          ...prev,
                          productId: product.productId.toString(),
                          crop: product.name || '',
                          price: product.price?.toString() || ''
                        }));
                        setShowContractModal(true);
                      }}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                    >
                      {t('Create Contract')}
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">{t('No products found')}</h3>
                  <p className="text-gray-500 mb-4">{t('Add your first product to start selling')}</p>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {t('Add Product')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('Total Revenue')}</h2>
              <p className="text-4xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
              <p className="text-gray-600 mt-2">
                {payments.filter(p => p.status === 'COMPLETED').length} {t('completed payments')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">{t('Payment History')}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Payment ID')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Contract')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Amount')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Payment Date')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Method')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map(payment => (
                      <tr key={payment.paymentId} className="hover:bg-gray-50">
                        <td className="py-3 px-4">#{payment.paymentId}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">Contract #{payment.contract?.contractId}</p>
                            <p className="text-sm text-gray-500">{payment.contract?.crop}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{formatPrice(payment.amount)}</td>
                        <td className="py-3 px-4">{formatDate(payment.paymentDate)}</td>
                        <td className="py-3 px-4">{payment.paymentMethod}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">{t('No payment records')}</h3>
                    <p className="text-gray-500">{t('Payments will appear here once contracts are completed')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ✅ COMPLETE: Negotiations Tab with ALL FUNCTIONALITY */}
        {activeTab === 'negotiations' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('Negotiations & Contract Requests')}</h2>
              <p className="text-gray-600">{t('Review and respond to price negotiations and contract requests from buyers')}</p>
            </div>

            {/* Contract Requests Section - WITH COMPLETE FUNCTIONALITY */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-orange-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{t('Contract Requests from Buyers')}</h3>
                    <p className="text-gray-600 text-sm">
                      {contractRequests.filter(r => r.status === 'PENDING').length} {t('Pending')} • 
                      {contractRequests.filter(r => r.status === 'ACCEPTED').length} {t('Active')} • 
                      {contractRequests.filter(r => r.status === 'COMPLETED').length} {t('Completed')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Contract ID')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Crop')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('From')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Quantity Requested')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Proposed Price')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Delivery')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Status')}</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">{t('Actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {contractRequests.map(request => (
                      <tr key={request.requestId} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">#{request.requestId}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Sprout className="text-green-600" size={16} />
                            <span className="font-medium text-green-700">
                              {request.cropName || request.product?.name || 'Crop'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{request.buyer?.name || 'Unknown Buyer'}</p>
                            <p className="text-sm text-gray-500">{request.buyer?.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{request.quantity} {t('kg')}</td>
                        <td className="py-3 px-4">{formatPrice(request.proposedPrice)}/{t('kg')}</td>
                        <td className="py-3 px-4">{formatDate(request.deliveryDate)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                            request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            request.status === 'COUNTERED' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 flex-wrap">
                            {/* ✅ Show Accept/Reject buttons for PENDING status */}
                            {request.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleAcceptContractRequest(request.requestId)}
                                  disabled={isProcessingNegotiation === request.requestId}
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm disabled:opacity-50 flex items-center gap-1"
                                >
                                  {isProcessingNegotiation === request.requestId ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                  {isProcessingNegotiation === request.requestId ? t('Processing...') : t('Accept')}
                                </button>
                                <button
                                  onClick={() => handleRejectContractRequest(request.requestId)}
                                  disabled={isProcessingNegotiation === request.requestId}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50 flex items-center gap-1"
                                >
                                  {isProcessingNegotiation === request.requestId ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <X className="w-3 h-3" />
                                  )}
                                  {isProcessingNegotiation === request.requestId ? t('Processing...') : t('Reject')}
                                </button>
                                <button
                                  onClick={() => handleInitiateCounter(request.requestId)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  {t('Counter')}
                                </button>
                              </>
                            )}
                            
                            {/* ✅ Show "Mark as Complete" button for ACCEPTED contracts */}
                            {request.status === 'ACCEPTED' && (
                              <button
                                onClick={() => handleMarkAsCompleted(request.requestId)}
                                disabled={isProcessingNegotiation === request.requestId}
                                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm disabled:opacity-50 flex items-center gap-1"
                              >
                                {isProcessingNegotiation === request.requestId ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                {isProcessingNegotiation === request.requestId ? t('Processing...') : t('Mark as Completed')}
                              </button>
                            )}
                            
                            {/* Show status badges */}
                            {request.status === 'ACCEPTED' && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                {t('Active')}
                              </span>
                            )}
                            
                            {request.status === 'REJECTED' && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                {t('Rejected')}
                              </span>
                            )}
                            
                            {request.status === 'COUNTERED' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded flex items-center gap-1">
                                <ArrowUpDown className="w-3 h-3" />
                                {t('Countered')}
                              </span>
                            )}
                            
                            {request.status === 'COMPLETED' && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                {t('Completed')}
                              </span>
                            )}
                            
                            {/* Delete button for all statuses */}
                            <button
                              onClick={() => handleDeleteContractRequest(request.requestId)}
                              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              {t('Delete')}
                            </button>
                            
                            {/* View Details button */}
                            <button
                              onClick={() => {
                                alert(`${t('Contract Request Details')}:\n\n` +
                                      `${t('Contract ID')}: #${request.requestId}\n` +
                                      `${t('Crop')}: ${request.cropName || request.product?.name}\n` +
                                      `${t('From')}: ${request.buyer?.name || request.buyer?.email}\n` +
                                      `${t('Quantity')}: ${request.quantity} kg\n` +
                                      `${t('Proposed Price')}: ${formatPrice(request.proposedPrice)}/kg\n` +
                                      `${t('Delivery Date')}: ${formatDate(request.deliveryDate)}\n` +
                                      `${t('Status')}: ${request.status}\n` +
                                      `${t('Message')}: ${request.message || t('No message')}`);
                              }}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              {t('View')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contractRequests.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">{t('No contract requests')}</h3>
                    <p className="text-gray-500">{t('Buyers will send contract requests for your products')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price Negotiations Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-purple-50">
                <h3 className="text-xl font-bold text-gray-800">{t('Price Negotiations from Buyers')}</h3>
                <p className="text-gray-600 text-sm">
                  {negotiations.filter(n => n.status === 'PENDING').length} {t('Pending')} • 
                  {negotiations.filter(n => n.status === 'COUNTERED').length} {t('Countered')}
                </p>
              </div>
              <div className="p-6">
                {negotiations.length > 0 ? (
                  <div className="space-y-4">
                    {negotiations.map(negotiation => (
                      <div key={negotiation.negotiationId} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium flex items-center gap-2 mb-2">
                              <span className="text-green-700">{negotiation.product?.name}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getNegotiationStatusColor(negotiation.status)}`}>
                                {negotiation.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">{t('Your Listed Price')}</p>
                                <p className="font-medium">{formatPrice(negotiation.farmerPrice)}/{t('kg')}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">{t("Buyer's Offer")}</p>
                                <p className="font-medium">{formatPrice(negotiation.buyerPrice)}/{t('kg')}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">{t('From')}</p>
                                <p className="font-medium">{negotiation.buyer?.name || 'Unknown'}</p>
                              </div>
                            </div>
                            {negotiation.message && (
                              <p className="text-gray-600 text-sm mt-2">"{negotiation.message}"</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {negotiation.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleAcceptNegotiation(negotiation.negotiationId)}
                                  disabled={isProcessingNegotiation === negotiation.negotiationId}
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm disabled:opacity-50"
                                >
                                  {isProcessingNegotiation === negotiation.negotiationId ? t('Processing...') : t('Accept Offer')}
                                </button>
                                <button
                                  onClick={() => handleRejectNegotiation(negotiation.negotiationId)}
                                  disabled={isProcessingNegotiation === negotiation.negotiationId}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50"
                                >
                                  {isProcessingNegotiation === negotiation.negotiationId ? t('Processing...') : t('Reject')}
                                </button>
                                <button
                                  onClick={() => handleOpenNegotiationCounter(negotiation)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                  {t('Counter')}
                                </button>
                              </>
                            )}
                            {negotiation.status === 'ACCEPTED' && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                                ✅ {t('You accepted this offer')}
                              </span>
                            )}
                            {negotiation.status === 'REJECTED' && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded">
                                ❌ {t('You rejected this offer')}
                              </span>
                            )}
                            {negotiation.status === 'COUNTERED' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                                💰 {t('Counter offer sent')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">{t('No price negotiations')}</h3>
                    <p className="text-gray-500">{t('Buyers will appear here when they want to negotiate prices')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Negotiation Counter Offer Modal */}
        {showNegotiationCounterModal && selectedNegotiation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">{t('Make Counter Offer')}</h3>
                <button
                  onClick={() => setShowNegotiationCounterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Enter Counter Price')} (₹ per kg) *
                  </label>
                  <input
                    type="number"
                    value={negotiationCounterPrice}
                    onChange={(e) => setNegotiationCounterPrice(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder={t('Enter your counter price')}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {t('Buyer\'s Offer')}: {formatPrice(selectedNegotiation.buyerPrice)}/{t('kg')}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="text-blue-500 mt-0.5" size={16} />
                    <p className="text-sm text-blue-700">
                      {language === 'mr' 
                        ? 'तुमचा प्रतिऑफर पाठवल्यानंतर, खरेदीदार त्याचे परीक्षण करेल आणि स्वीकारू किंवा नाकारू शकेल.'
                        : 'Your counter offer will be sent to the buyer for review. They can accept or reject it.'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNegotiationCounterModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleCounterNegotiation}
                  disabled={isProcessingNegotiation === selectedNegotiation.negotiationId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessingNegotiation === selectedNegotiation.negotiationId ? t('Processing...') : t('Submit')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Counter Offer Modal for Contract Requests */}
        {showCounterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">{t('Send Counter Offer')}</h3>
                <button
                  onClick={() => setShowCounterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Counter Price (₹ per kg)')}
                  </label>
                  <input
                    type="number"
                    value={counterData.counterPrice}
                    onChange={(e) => setCounterData({...counterData, counterPrice: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder={t('Enter your counter price')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Counter Quantity (kg)')}
                  </label>
                  <input
                    type="number"
                    value={counterData.counterQuantity}
                    onChange={(e) => setCounterData({...counterData, counterQuantity: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Counter Delivery Date')}
                  </label>
                  <input
                    type="date"
                    value={counterData.counterDeliveryDate}
                    onChange={(e) => setCounterData({...counterData, counterDeliveryDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Message to Buyer')}
                  </label>
                  <textarea
                    value={counterData.counterMessage}
                    onChange={(e) => setCounterData({...counterData, counterMessage: e.target.value})}
                    className="w-full p-2 border rounded-lg h-32"
                    placeholder={t('Optional message explaining your counter offer')}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCounterModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={() => selectedRequestId && handleCounterContractRequest(selectedRequestId)}
                  disabled={isProcessingNegotiation === selectedRequestId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessingNegotiation === selectedRequestId ? t('Processing...') : t('Send Counter Offer')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Contract Modal */}
        {showContractModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">{t('Create New Contract')}</h3>
                <button
                  onClick={() => setShowContractModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Buyer Email')} *
                  </label>
                  <input
                    type="email"
                    value={newContract.buyerEmail}
                    onChange={(e) => setNewContract({...newContract, buyerEmail: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="buyer@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Product')} *
                  </label>
                  <select
                    value={newContract.productId}
                    onChange={(e) => setNewContract({...newContract, productId: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">{t('Select a product')}</option>
                    {products.map(product => (
                      <option key={product.productId} value={product.productId}>
                        {product.name} - {product.quantity}kg @ {formatPrice(product.price)}/kg
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Crop')}
                  </label>
                  <input
                    type="text"
                    value={newContract.crop}
                    onChange={(e) => setNewContract({...newContract, crop: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Tomato, Wheat, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Quantity (kg)')} *
                    </label>
                    <input
                      type="number"
                      value={newContract.quantity}
                      onChange={(e) => setNewContract({...newContract, quantity: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Price (₹ per kg)')} *
                    </label>
                    <input
                      type="number"
                      value={newContract.price}
                      onChange={(e) => setNewContract({...newContract, price: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Delivery Date')} *
                  </label>
                  <input
                    type="date"
                    value={newContract.deliveryDate}
                    onChange={(e) => setNewContract({...newContract, deliveryDate: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowContractModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleAddContract}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {t('Create Contract')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">{t('Add New Product')}</h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Product Name')} *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Tomato, Wheat, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Description')}
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Product description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Category')} *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">{t('Select category')}</option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Grain">Grain</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Quantity (kg)')} *
                    </label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Price (₹ per kg)')} *
                    </label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('Add Product')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerDashboard;