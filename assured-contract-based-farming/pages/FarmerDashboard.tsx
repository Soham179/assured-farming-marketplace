// pages/FarmerDashboard.tsx - COMPLETE CODE
// ✅ FIXED: Python backend connection for price prediction
// ✅ FIXED: All existing functionality preserved
// ✅ REMOVED: Marathi language support
// ✅ FIXED: TypeScript errors with translations

import React, { useState, useEffect, useContext } from 'react';
import { 
  LogOut, FileText, Package, DollarSign, 
  Calendar, Bell, Plus, Trash2, X, Check, 
  RefreshCw, AlertCircle, MessageSquare,
  Info, User, Clock, ArrowUpDown, Sprout,
  TrendingUp, BarChart3, Search, Calculator,
  Wifi, WifiOff, Cloud, Database, CheckCircle, XCircle, Eye, Edit
} from 'lucide-react';
import { AuthContext } from '../App';
import api from '../api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// API URLs
const API_BASE_URL = 'http://localhost:8080/api';
const PYTHON_ML_BACKEND_URL = 'http://localhost:5000';

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

// English only translations
const translations = {
  'Welcome back': 'Welcome back',
  'Loading your dashboard...': 'Loading your dashboard...',
  'Refresh': 'Refresh',
  'Logout': 'Logout',
  'Overview': 'Overview',
  'Contracts': 'Contracts',
  'Products': 'Products',
  'Payments': 'Payments',
  'Negotiations': 'Negotiations',
  'Create Contract': 'Create Contract',
  'Add Product': 'Add Product',
  'View Negotiations': 'View Negotiations',
  'Active Contracts': 'Active Contracts',
  'Total Products': 'Total Products',
  'Pending Payments': 'Pending Payments',
  'Pending Negotiations': 'Pending Negotiations',
  'price': 'price',
  'contract': 'contract',
  'Recent Contracts': 'Recent Contracts',
  'Notifications': 'Notifications',
  'Clear all': 'Clear all',
  'No notifications': 'No notifications',
  'Contract Management': 'Contract Management',
  'New Contract': 'New Contract',
  'Contract ID': 'Contract ID',
  'Crop': 'Crop',
  'Buyer': 'Buyer',
  'Quantity': 'Quantity',
  'Price': 'Price',
  'Delivery Date': 'Delivery Date',
  'Status': 'Status',
  'Actions': 'Actions',
  'No contracts found': 'No contracts found',
  'Create your first contract to get started': 'Create your first contract to get started',
  'Product Management': 'Product Management',
  'Add New Product': 'Add New Product',
  'Product Name': 'Product Name',
  'Description': 'Description',
  'Quantity (kg)': 'Quantity (kg)',
  'Price (₹ per kg)': 'Price (₹ per kg)',
  'Available': 'Available',
  'Created': 'Created',
  'Create Contract for this Product': 'Create Contract for this Product',
  'No products found': 'No products found',
  'Add your first product to start selling': 'Add your first product to start selling',
  'Payment History': 'Payment History',
  'Total Revenue': 'Total Revenue',
  'Payment ID': 'Payment ID',
  'Amount': 'Amount',
  'Payment Date': 'Payment Date',
  'Method': 'Method',
  'No payment records': 'No payment records',
  'Payments will appear here once contracts are completed': 'Payments will appear here once contracts are completed',
  'Negotiations & Contract Requests': 'Negotiations & Contract Requests',
  'Review and respond to price negotiations and contract requests from buyers': 'Review and respond to price negotiations and contract requests from buyers',
  'Pending': 'Pending',
  'Countered': 'Countered',
  'Price Negotiations from Buyers': 'Price Negotiations from Buyers',
  'Category': 'Category',
  'Your Listed Price': 'Your Listed Price',
  'Buyer\'s Offer': 'Buyer\'s Offer',
  'Your Counter Offer': 'Your Counter Offer',
  'Enter your counter price': 'Enter your counter price',
  'Accept Offer': 'Accept Offer',
  'Reject': 'Reject',
  'Make Counter Offer': 'Make Counter Offer',
  'You accepted this offer': 'You accepted this offer',
  'You rejected this offer': 'You rejected this offer',
  'Counter offer sent': 'Counter offer sent',
  'Contract Requests from Buyers': 'Contract Requests from Buyers',
  'From': 'From',
  'Delivery': 'Delivery',
  'Quantity Requested': 'Quantity Requested',
  'Proposed Price': 'Proposed Price',
  'Accept Request': 'Accept Request',
  'Contract request accepted': 'Contract request accepted',
  'Contract request rejected': 'Contract request rejected',
  'Working in Offline Mode': 'Working in Offline Mode',
  'Checking...': 'Checking...',
  'Connected': 'Connected',
  'Offline Mode': 'Offline Mode',
  'Check that your backend server is running': 'Check that your backend server is running',
  'Failed to load dashboard data. Please try refreshing.': 'Failed to load dashboard data. Please try refreshing.',
  'Quick Actions': 'Quick Actions',
  'Recent Activity': 'Recent Activity',
  'Buyer Name': 'Buyer Name',
  'Farmer ID': 'Farmer ID',
  'kg': 'kg',
  'Are you sure you want to cancel this contract?': 'Are you sure you want to cancel this contract?',
  'Are you sure you want to delete this product?': 'Are you sure you want to delete this product?',
  'Please fill all fields': 'Please fill all fields',
  'Please enter a valid counter price': 'Please enter a valid counter price',
  'Sending...': 'Sending...',
  'Processing...': 'Processing...',
  'Send': 'Send',
  'Cancel': 'Cancel',
  'No price negotiations': 'No price negotiations',
  'Buyers will appear here when they want to negotiate prices': 'Buyers will appear here when they want to negotiate prices',
  'Check Again': 'Check Again',
  'View Products': 'View Products',
  'No contract requests': 'No contract requests',
  'Buyers will send contract requests for your products': 'Buyers will send contract requests for your products',
  'Counter Price (₹ per kg)': 'Counter Price (₹ per kg)',
  'Counter Quantity (kg)': 'Counter Quantity (kg)',
  'Counter Delivery Date': 'Counter Delivery Date',
  'Message to Buyer': 'Message to Buyer',
  'Optional message explaining your counter offer': 'Optional message explaining your counter offer',
  'Send Counter Offer': 'Send Counter Offer',
  'Select a product': 'Select a product',
  'Select category': 'Select category',
  'Contract Requests': 'Contract Requests',
  'New Request': 'New Request',
  'Message': 'Message',
  'Accept': 'Accept',
  'Counter': 'Counter',
  'View Details': 'View Details',
  'Edit': 'Edit',
  'Delete': 'Delete',
  'Are you sure you want to delete this contract request?': 'Are you sure you want to delete this contract request?',
  'Contract request deleted successfully': 'Contract request deleted successfully',
  'Failed to delete contract request': 'Failed to delete contract request',
  'Mark as Completed': 'Mark as Completed',
  'Cancel Contract': 'Cancel Contract',
  'Accept Contract': 'Accept Contract',
  'Reject Contract': 'Reject Contract',
  'Request ID': 'Request ID',
  'Close': 'Close',
  'Submit': 'Submit',
  'Accepted': 'Accepted',
  'Rejected': 'Rejected',
  'Contract Request Details': 'Contract Request Details',
  'Completed': 'Completed',
  'Active': 'Active',
  'Complete': 'Complete',
  'Mark contract as completed': 'Mark contract as completed',
  'Are you sure you want to mark this contract as completed? Payment process will start after completion.': 'Are you sure you want to mark this contract as completed? Payment process will start after completion.',
  'Price Prediction': 'Price Prediction',
  'Predict Crop Prices': 'Predict Crop Prices',
  'Get price predictions for your crops based on historical data': 'Get price predictions for your crops based on historical data',
  'Crop Name': 'Crop Name',
  'Year': 'Year',
  'Month': 'Month',
  'Predict Price': 'Predict Price',
  'Predicted Wholesale Price Index (WPI)': 'Predicted Wholesale Price Index (WPI)',
  'Predicted Price per kg (₹)': 'Predicted Price per kg (₹)',
  'Historical Price Trends': 'Historical Price Trends',
  'Loading prediction...': 'Loading prediction...',
  'Price prediction is currently unavailable': 'Price prediction is currently unavailable',
  'Try again later': 'Try again later',
  'Enter crop details for prediction': 'Enter crop details for prediction',
  'Select Crop': 'Select Crop',
  'Select Month': 'Select Month',
  'Prediction Results': 'Prediction Results',
  'Historical Data': 'Historical Data',
  'Price Trends for': 'Price Trends for',
  'Price (₹/kg)': 'Price (₹/kg)',
  'Month-Year': 'Month-Year',
  'No prediction data available': 'No prediction data available',
  'Generate prediction to see historical trends': 'Generate prediction to see historical trends',
  'Prediction Analysis': 'Prediction Analysis',
  'Best time to sell': 'Best time to sell',
  'Market Trend': 'Market Trend',
  'Average Price': 'Average Price',
  'Recommended Actions': 'Recommended Actions',
  'View Detailed Analysis': 'View Detailed Analysis',
  'Crop Type': 'Crop Type',
  'Prediction Confidence': 'Prediction Confidence',
  'High Confidence': 'High Confidence',
  'Medium Confidence': 'Medium Confidence',
  'Moderate Confidence': 'Moderate Confidence',
  'Low Confidence': 'Low Confidence',
  'Weather Impact': 'Weather Impact',
  'Market Demand': 'Market Demand',
  'Seasonal Factors': 'Seasonal Factors',
  'Generate Report': 'Generate Report',
  'Export Data': 'Export Data',
  'Enter crop name manually': 'Enter crop name manually',
  'Backend Connection': 'Backend Connection',
  'Java Backend (8080)': 'Java Backend (8080)',
  'Python ML Backend (5000)': 'Python ML Backend (5000)',
  'Connected successfully': 'Connected successfully',
  'Not connected': 'Not connected',
  'Click to test connection': 'Click to test connection',
  'Checking backend connections...': 'Checking backend connections...',
  'Both backends connected': 'Both backends connected',
  'Backend Status': 'Backend Status',
  'Test Connections': 'Test Connections',
  'Connection Test': 'Connection Test',
  'Backend Servers': 'Backend Servers',
  'Price Prediction Backend': 'Price Prediction Backend',
  'Main Application Backend': 'Main Application Backend',
  'Testing Java backend...': 'Testing Java backend...',
  'Testing Python ML backend...': 'Testing Python ML backend...',
  'Java backend connected successfully': 'Java backend connected successfully',
  'Python ML backend connected successfully': 'Python ML backend connected successfully',
  'Java backend connection failed': 'Java backend connection failed',
  'Python ML backend connection failed': 'Python ML backend connection failed',
  'Make sure Python backend is running on port 5000': 'Make sure Python backend is running on port 5000',
  'Make sure Java backend is running on port 8080': 'Make sure Java backend is running on port 8080',
  'Crop Suggestions': 'Crop Suggestions',
  'Available Crops': 'Available Crops',
  'Select from available crops': 'Select from available crops',
  'Popular Crops': 'Popular Crops',
  'Tomato': 'Tomato',
  'Potato': 'Potato',
  'Onion': 'Onion',
  'Wheat': 'Wheat',
  'Rice': 'Rice',
  'Corn': 'Corn',
  'Sugarcane': 'Sugarcane',
  'Cotton': 'Cotton',
  'Soybean': 'Soybean',
  'Chickpea': 'Chickpea',
  'Lentil': 'Lentil',
  'Millet': 'Millet',
  'Sorghum': 'Sorghum',
  'Pigeon Pea': 'Pigeon Pea',
  'Groundnut': 'Groundnut',
  'Sunflower': 'Sunflower',
  'Mustard': 'Mustard',
  'Sesame': 'Sesame',
  'Vegetable': 'Vegetable',
  'Fruit': 'Fruit',
  'Grain': 'Grain',
  'Dairy': 'Dairy',
  'Poultry': 'Poultry',
  'Other': 'Other'
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

// Price Prediction Types
interface PricePrediction {
  wpi: number;
  price_per_kg: number;
  confidence: 'high' | 'medium' | 'low';
  best_time_to_sell: string;
  market_trend: 'up' | 'down' | 'stable';
  historical_data: {
    month: string;
    price: number;
  }[];
  factors: {
    weather_impact: string;
    market_demand: string;
    seasonal_factors: string;
  };
}

interface PredictionForm {
  cropName: string;
  year: string;
  month: string;
}

// Connection status interface
interface BackendConnection {
  java: boolean;
  python: boolean;
  checking: boolean;
}

const FarmerDashboard: React.FC = () => {
  const { userRole, logout } = useContext(AuthContext);
  
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'products' | 'payments' | 'negotiations' | 'prediction'>('overview');
  const [showContractModal, setShowContractModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  // Price Prediction State
  const [predictionForm, setPredictionForm] = useState<PredictionForm>({
    cropName: '',
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0')
  });
  const [predictionResult, setPredictionResult] = useState<PricePrediction | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  
  // Backend Connection State
  const [backendConnections, setBackendConnections] = useState<BackendConnection>({
    java: false,
    python: false,
    checking: false
  });
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);
  const [cropSuggestions, setCropSuggestions] = useState<string[]>([
    'Tomato', 'Potato', 'Onion', 'Wheat', 'Rice', 'Corn', 
    'Sugarcane', 'Cotton', 'Soybean', 'Chickpea', 'Lentil'
  ]);

  // Translation function (now always returns English key or default)
  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    return translation || key;
  };

  // Get translated product name (now just returns the name)
  const getTranslatedProductName = (product: Product | null): string => {
    if (!product || !product.name) return 'Product';
    return product.name;
  };

  // Get translated category (now just returns the category)
  const getTranslatedCategory = (category: string | null): string => {
    if (!category) return 'Category';
    return category;
  };

  // Function to determine confidence level based on price value
  const getConfidenceLevel = (pricePerKg: number): 'high' | 'medium' | 'low' => {
    if (!pricePerKg) return 'low';
    if (pricePerKg > 100) return 'high';
    if (pricePerKg > 30) return 'medium';
    return 'low';
  };

  // Test backend connections
  const testBackendConnections = async () => {
    setBackendConnections(prev => ({ ...prev, checking: true }));
    
    try {
      console.log('🔗 Testing backend connections...');
      
      // Test Java backend (port 8080)
      console.log('Testing Java backend on port 8080...');
      let javaConnected = false;
      try {
        const javaResponse = await fetch(`${API_BASE_URL}/ping`);
        javaConnected = javaResponse.ok;
        console.log('Java backend:', javaConnected ? '✅ Connected' : '❌ Failed');
      } catch (e) {
        console.log('Java backend: ❌ Connection failed');
      }
      
      // Test Python ML backend (port 5000)
      console.log('Testing Python ML backend on port 5000...');
      let pythonConnected = false;
      let pythonCrops: string[] = [];
      
      try {
        const pythonResponse = await fetch(`${PYTHON_ML_BACKEND_URL}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (pythonResponse.ok) {
          pythonConnected = true;
          console.log('Python backend: ✅ Connected');
          
          // Try to get available crops
          try {
            const cropsResponse = await fetch(`${PYTHON_ML_BACKEND_URL}/available-crops`);
            if (cropsResponse.ok) {
              const cropsData = await cropsResponse.json();
              if (cropsData.success && cropsData.crops && Array.isArray(cropsData.crops)) {
                pythonCrops = cropsData.crops;
                console.log('Got crops from Python backend:', pythonCrops);
              }
            }
          } catch (cropsError) {
            console.log('Could not fetch crops from Python backend');
          }
        } else {
          console.log('Python backend: ❌ Not responding properly');
        }
      } catch (pythonError) {
        console.log('Python backend: ❌ Connection failed');
      }
      
      setBackendConnections({
        java: javaConnected,
        python: pythonConnected,
        checking: false
      });
      
      // Update available crops
      if (pythonCrops.length > 0) {
        setAvailableCrops(pythonCrops);
        setCropSuggestions(pythonCrops.slice(0, 10)); // Show first 10 as suggestions
      }
      
      // Show notifications based on connection status
      if (!javaConnected || !pythonConnected) {
        const errorMessage = `Connection error: ${!javaConnected ? 'Java backend' : ''} ${!javaConnected && !pythonConnected ? 'and' : ''} ${!pythonConnected ? 'Python ML backend' : ''} not connected`;
        setNotifications(prev => [{
          id: prev.length + 1,
          message: errorMessage,
          type: 'warning',
          time: 'Just now'
        }, ...prev]);
      } else {
        setNotifications(prev => [{
          id: prev.length + 1,
          message: '✅ Both backends connected successfully',
          type: 'success',
          time: 'Just now'
        }, ...prev]);
      }
      
      return { javaConnected, pythonConnected };
      
    } catch (error) {
      console.error('Error testing backend connections:', error);
      setBackendConnections({
        java: false,
        python: false,
        checking: false
      });
      return { javaConnected: false, pythonConnected: false };
    }
  };

  // Fetch price prediction
  const fetchPricePrediction = async () => {
    if (!predictionForm.cropName || !predictionForm.year || !predictionForm.month) {
      setPredictionError(t('Please fill all fields'));
      return;
    }

    setPredicting(true);
    setPredictionError(null);
    
    try {
      console.log('🔮 Making price prediction:', predictionForm);
      
      // First check if Python backend is connected
      if (!backendConnections.python) {
        const connections = await testBackendConnections();
        if (!connections.pythonConnected) {
          setPredictionError('Python ML backend is not connected. Please start the Python backend server (port 5000).');
          setPredicting(false);
          return;
        }
      }

      // Prepare the data for prediction - match your Python backend format
      const requestData = {
        crop_name: predictionForm.cropName,
        year: parseInt(predictionForm.year),
        month: parseInt(predictionForm.month),
        Rainfall: 100,
        Temperature: 25,
        Season: 2,
        Prev_Month_WPI: 100
      };

      console.log('📤 Sending to Python backend:', requestData);
      
      // Use the correct endpoint for your Python backend
      const response = await fetch(`${PYTHON_ML_BACKEND_URL}/predict-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Prediction API error:', errorText);
        throw new Error(`Prediction failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Prediction response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Prediction failed');
      }
      
      // Determine confidence based on price value
      const confidence = getConfidenceLevel(result.price_per_kg || 0);
      
      // Format the response to match our interface
      const formattedPrediction: PricePrediction = {
        wpi: result.wpi || 0,
        price_per_kg: result.price_per_kg || 0,
        confidence: confidence,
        best_time_to_sell: result.best_time_to_sell || `${predictionForm.month}-${predictionForm.year}`,
        market_trend: result.market_trend || 'stable',
        historical_data: result.historical_data || [],
        factors: result.factors || {
          weather_impact: 'Normal weather conditions',
          market_demand: 'Average market demand',
          seasonal_factors: 'Seasonal growth period'
        }
      };
      
      setPredictionResult(formattedPrediction);
      
      // Add success notification
      setNotifications(prev => [{
        id: prev.length + 1,
        message: `✅ Price prediction generated for ${predictionForm.cropName}`,
        type: 'success',
        time: 'Just now'
      }, ...prev]);
      
    } catch (error: any) {
      console.error('❌ Price prediction error:', error);
      
      // Provide helpful error messages
      let errorMsg = error.message || 'Unknown error';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMsg = 'Cannot connect to Python ML backend. Please ensure the server is running.';
      } else if (error.message.includes('404')) {
        errorMsg = 'Prediction endpoint not found. Please check Python backend.';
      }
      
      setPredictionError(errorMsg);
      
      // Add error notification
      setNotifications(prev => [{
        id: prev.length + 1,
        message: `❌ Price prediction failed for ${predictionForm.cropName}`,
        type: 'warning',
        time: 'Just now'
      }, ...prev]);
    } finally {
      setPredicting(false);
    }
  };

  // Get available crops from Python backend
  const fetchAvailableCrops = async () => {
    try {
      console.log('🌱 Fetching available crops from Python backend...');
      
      const response = await fetch(`${PYTHON_ML_BACKEND_URL}/available-crops`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.crops && Array.isArray(data.crops)) {
          setAvailableCrops(data.crops);
          setCropSuggestions(data.crops.slice(0, 10));
          console.log('✅ Available crops:', data.crops);
          return data.crops;
        }
      }
    } catch (error) {
      console.log('Could not fetch crops from Python backend, using defaults');
    }
    
    // Fallback to default crops
    const defaultCrops = [
      "Bajra", "Carrot", "Corn", "Cotton", "Jowar",
      "Masoor", "Moong", "Onion", "Orange", "Rice",
      "Soyabean", "Sugarcane", "Sunflower", "SweetPotato",
      "Tomato", "Urad", "Wheat"
    ];
    
    setAvailableCrops(defaultCrops);
    setCropSuggestions(defaultCrops.slice(0, 10));
    return defaultCrops;
  };

  // Contract request handlers
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
      
      alert('✅ Contract accepted! The buyer has been notified.');
      
    } catch (error: any) {
      console.error('❌ Error accepting contract:', error);
      alert(`Failed to accept contract: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessingNegotiation(null);
    }
  };

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
      
      alert('❌ Contract rejected. The buyer has been notified.');
      
    } catch (error: any) {
      console.error('❌ Error rejecting contract:', error);
      alert(`Failed to reject contract: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessingNegotiation(null);
    }
  };

  // Handle Mark as Completed
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
        
        alert('✅ Contract marked as completed! Payment process will start.');
        
      } catch (error: any) {
        console.error('❌ Error marking contract as completed:', error);
        alert(`Failed to mark contract as completed: ${error.message || 'Unknown error'}`);
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
        counterMessage: `Thank you for your interest. I can offer ${request.cropName || request.product?.name} at a revised price.`
      });
      setShowCounterModal(true);
    }
  };

  // Counter contract request - CREATES NEW CONTRACT
  const handleCounterContractRequest = async (contractId: number) => {
    if (!counterData.counterPrice || isNaN(parseFloat(counterData.counterPrice))) {
      alert('Please enter a valid counter price');
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
      
      alert(`✅ Counter offer sent!\n\nPrice: ₹${counterPriceValue}/kg\n\nThe buyer will review your counter offer.`);
      
    } catch (error: any) {
      console.error('❌ Error creating counter offer:', error);
      alert(`Failed to send counter offer: ${error.message || 'Unknown error'}`);
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
      
      alert('✅ Negotiation accepted! Buyer has been notified.');
      
    } catch (error: any) {
      console.error('❌ Error accepting negotiation:', error);
      alert(`Failed to accept negotiation: ${error.message || 'Unknown error'}`);
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
      
      alert('❌ Negotiation rejected. Buyer has been notified.');
      
    } catch (error: any) {
      console.error('❌ Error rejecting negotiation:', error);
      alert(`Failed to reject negotiation: ${error.message || 'Unknown error'}`);
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
      alert('Please enter a valid counter price');
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
      
      alert(`✅ Counter offer sent!\n\nPrice: ₹${counterPriceValue}/kg\n\nThe buyer will review your counter offer.`);
      
    } catch (error: any) {
      console.error('❌ Error countering negotiation:', error);
      alert(`Failed to send counter offer: ${error.message || 'Unknown error'}`);
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
        
        // First, try to get email from the emergency check above
        if (farmerEmail) {
          console.log('✅ Email already set from emergency check:', farmerEmail);
          
          // Test backend connections
          await testBackendConnections();
          
          // Fetch available crops if Python backend is connected
          if (backendConnections.python) {
            await fetchAvailableCrops();
          }
          
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
              
              // Test backend connections
              await testBackendConnections();
              
              // Fetch available crops if Python backend is connected
              if (backendConnections.python) {
                await fetchAvailableCrops();
              }
              
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
          
          // Test backend connections
          await testBackendConnections();
          
          // Fetch available crops if Python backend is connected
          if (backendConnections.python) {
            await fetchAvailableCrops();
          }
          
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
  }, []);

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
      await fetchContractRequests();
      
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
        
        if (negotiationsData && Array.isArray(negotiationsData) && negotiationsData.length > 0) {
          console.log(`✅ Loaded ${negotiationsData.length} real negotiations`);
        } else {
          console.log('ℹ️ No negotiations found in API response');
          negotiationsData = [];
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

  // Fetch contract requests for farmer
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
            requestId: contract.contractId,
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
            message: `📝 New contract request from ${req.buyer?.name || 'buyer'} for ${cropName}`,
            type: 'info',
            time: 'Just now'
          }, ...prev]);
        }
      });
    } catch (error) {
      console.log('Error checking notifications:', error);
    }
  };

  // Handle Refresh Function
  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    
    // Test backend connections
    await testBackendConnections();
    
    // Fetch available crops if Python backend is connected
    if (backendConnections.python) {
      await fetchAvailableCrops();
    }
    
    // Fetch dashboard data
    await fetchDashboardData();
  };

  // Handle Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('farmerEmail');
    localStorage.removeItem('loginEmail');
    window.location.href = '/login';
  };

  // Handle Add Contract Function
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
        message: `New contract created with ${newContract.buyerEmail}`,
        type: 'success',
        time: 'Just now'
      }, ...prev]);

    } catch (error: any) {
      console.error('Error creating contract:', error);
      alert(`Failed to create contract: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle Delete Product Function
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm(t('Are you sure you want to delete this product?'))) {
      try {
        await api.products.deleteProduct(id);
        await fetchProducts();
        
        setNotifications(prev => [{
          id: prev.length + 1,
          message: 'Product deleted successfully',
          type: 'success',
          time: 'Just now'
        }, ...prev]);
      } catch (error: any) {
        console.error('Error deleting product:', error);
        alert(`Failed to delete product: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Handle Add Product Function
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
      alert(`❌ Error: Cannot find valid farmer email.`);
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
        message: `New product "${newProduct.name}" added successfully`,
        type: 'success',
        time: 'Just now'
      }, ...prev]);

    } catch (error: any) {
      console.error('❌ Error creating product:', error);
      alert(`Failed to add product: ${error.message || 'API error'}`);
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

  // Format Date Function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
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

  // Format Price Function
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Not set';
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

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  // Price prediction chart configuration
  const getPredictionChartData = () => {
    if (!predictionResult || !predictionResult.historical_data || predictionResult.historical_data.length === 0) {
      return null;
    }

    return {
      labels: predictionResult.historical_data.map(d => d.month),
      datasets: [
        {
          label: 'Price (₹/kg)',
          data: predictionResult.historical_data.map(d => d.price),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Historical Price Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (₹/kg)'
        }
      }
    }
  };

  // Calculate Stats
  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const activeContracts = contracts.filter(c => c.status === 'ACTIVE').length;
  const pendingPayments = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
  const totalProducts = products.length;
  const pendingNegotiations = negotiations.filter(n => n.status === 'PENDING').length;
  const pendingContractRequests = contractRequests.filter(r => r.status === 'PENDING').length;

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => 
    (new Date().getFullYear() + i).toString()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('Loading your dashboard...')}</p>
          {farmerEmail && (
            <p className="text-sm text-gray-500 mt-2">Loading data for: {farmerEmail}</p>
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
            <h1 className="text-3xl font-bold text-green-700">🌾 Farmer Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}!
              {farmerEmail && (
                <span className="text-xs text-gray-500 block mt-1">
                  Farmer ID: {farmerEmail}
                  {contracts.length > 0 && ` • ${contracts.length} contracts`}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Backend Connection Status */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${backendConnections.java ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-600">Java 8080</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${backendConnections.python ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-600">Python 5000</span>
                </div>
              </div>
              
              <button
                onClick={testBackendConnections}
                disabled={backendConnections.checking}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition disabled:opacity-50 text-sm"
                title="Click to test connection"
              >
                {backendConnections.checking ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Wifi className="w-3 h-3" />
                )}
                <span className="text-xs">{backendConnections.checking ? 'Checking...' : 'Test'}</span>
              </button>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
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
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'contracts', label: 'Contracts', icon: FileText },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'payments', label: 'Payments', icon: DollarSign },
              { id: 'negotiations', label: 'Negotiations', icon: MessageSquare },
              { id: 'prediction', label: 'Price Prediction', icon: TrendingUp }
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
                  {tab.id === 'prediction' && predictionResult && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      ✓
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
                    <p className="text-gray-600 text-sm">Active Contracts</p>
                    <h3 className="text-3xl font-bold text-green-700">{activeContracts}</h3>
                  </div>
                  <FileText className="text-green-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Products</p>
                    <h3 className="text-3xl font-bold text-blue-700">{totalProducts}</h3>
                  </div>
                  <Package className="text-blue-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Payments</p>
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
                    <p className="text-gray-600 text-sm">Pending Negotiations</p>
                    <h3 className="text-3xl font-bold text-orange-700">{pendingNegotiations + pendingContractRequests}</h3>
                    <p className="text-xs text-orange-600 mt-1">
                      {pendingNegotiations} price • {pendingContractRequests} contract
                    </p>
                  </div>
                  <MessageSquare className="text-orange-500" size={40} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowContractModal(true)}
                  className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-200 transition"
                >
                  <Plus className="text-green-600" size={24} />
                  <span className="font-semibold text-green-700">Create Contract</span>
                </button>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-blue-200 transition"
                >
                  <Plus className="text-blue-600" size={24} />
                  <span className="font-semibold text-blue-700">Add Product</span>
                </button>
                <button 
                  onClick={() => setActiveTab('negotiations')}
                  className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-2 border-orange-200 transition relative"
                >
                  <MessageSquare className="text-orange-600" size={24} />
                  <span className="font-semibold text-orange-700">View Negotiations</span>
                  {(pendingNegotiations + pendingContractRequests) > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                      {pendingNegotiations + pendingContractRequests}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('prediction')}
                  className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border-2 border-purple-200 transition"
                >
                  <TrendingUp className="text-purple-600" size={24} />
                  <span className="font-semibold text-purple-700">Price Prediction</span>
                </button>
              </div>
            </div>

            {/* Recent Activity & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Contracts</h2>
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
                            Buyer: {contract.buyer?.name || contract.buyer?.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(contract.price)} • {contract.quantity} kg
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
                      <p>No contracts found</p>
                      <button
                        onClick={() => setShowContractModal(true)}
                        className="mt-2 text-green-600 hover:text-green-700 font-medium"
                      >
                        Create your first contract to get started
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear all
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
                      <p>No notifications</p>
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
              <h2 className="text-2xl font-bold text-gray-800">Contract Management</h2>
              <button
                onClick={() => setShowContractModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={18} />
                New Contract
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Contract ID</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Crop</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Buyer</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Quantity</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Price</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Delivery Date</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
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
                        <td className="py-3 px-4">{contract.quantity} kg</td>
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
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No contracts found</h3>
                    <p className="text-gray-500 mb-4">Create your first contract to get started</p>
                    <button
                      onClick={() => setShowContractModal(true)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Create Contract
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
              <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
              <button
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={18} />
                Add New Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.productId} className="bg-white rounded-xl shadow-lg p-6 border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {getTranslatedProductName(product)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getTranslatedCategory(product.category)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product.productId)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description || 'No description'}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{product.quantity} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">{formatPrice(product.price)}/kg</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Created: {formatDate(product.createdAt)}
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
                      Create Contract
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Add your first product to start selling</p>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add Product
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Total Revenue</h2>
              <p className="text-4xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
              <p className="text-gray-600 mt-2">
                {payments.filter(p => p.status === 'COMPLETED').length} completed payments
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Payment ID</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Contract</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Amount</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Payment Date</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Method</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
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
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No payment records</h3>
                    <p className="text-gray-500">Payments will appear here once contracts are completed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Negotiations Tab */}
        {activeTab === 'negotiations' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Negotiations & Contract Requests</h2>
              <p className="text-gray-600">Review and respond to price negotiations and contract requests from buyers</p>
            </div>

            {/* Contract Requests Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-orange-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Contract Requests from Buyers</h3>
                    <p className="text-gray-600 text-sm">
                      {contractRequests.filter(r => r.status === 'PENDING').length} Pending • 
                      {contractRequests.filter(r => r.status === 'ACCEPTED').length} Active • 
                      {contractRequests.filter(r => r.status === 'COMPLETED').length} Completed
                    </p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Contract ID</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Crop</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">From</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Quantity Requested</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Proposed Price</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Delivery</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
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
                        <td className="py-3 px-4">{request.quantity} kg</td>
                        <td className="py-3 px-4">{formatPrice(request.proposedPrice)}/kg</td>
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
                                  {isProcessingNegotiation === request.requestId ? 'Processing...' : 'Accept'}
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
                                  {isProcessingNegotiation === request.requestId ? 'Processing...' : 'Reject'}
                                </button>
                                <button
                                  onClick={() => handleInitiateCounter(request.requestId)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  Counter
                                </button>
                              </>
                            )}
                            
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
                                {isProcessingNegotiation === request.requestId ? 'Processing...' : 'Mark as Completed'}
                              </button>
                            )}
                            
                            {request.status === 'ACCEPTED' && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            )}
                            
                            {request.status === 'REJECTED' && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Rejected
                              </span>
                            )}
                            
                            {request.status === 'COUNTERED' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded flex items-center gap-1">
                                <ArrowUpDown className="w-3 h-3" />
                                Countered
                              </span>
                            )}
                            
                            {request.status === 'COMPLETED' && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                            
                            <button
                              onClick={() => {
                                alert(`Contract Request Details:\n\n` +
                                      `Contract ID: #${request.requestId}\n` +
                                      `Crop: ${request.cropName || request.product?.name}\n` +
                                      `From: ${request.buyer?.name || request.buyer?.email}\n` +
                                      `Quantity: ${request.quantity} kg\n` +
                                      `Proposed Price: ${formatPrice(request.proposedPrice)}/kg\n` +
                                      `Delivery Date: ${formatDate(request.deliveryDate)}\n` +
                                      `Status: ${request.status}\n` +
                                      `Message: ${request.message || 'No message'}`);
                              }}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              View
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
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No contract requests</h3>
                    <p className="text-gray-500">Buyers will send contract requests for your products</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price Negotiations Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-purple-50">
                <h3 className="text-xl font-bold text-gray-800">Price Negotiations from Buyers</h3>
                <p className="text-gray-600 text-sm">
                  {negotiations.filter(n => n.status === 'PENDING').length} Pending • 
                  {negotiations.filter(n => n.status === 'COUNTERED').length} Countered
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
                                <p className="text-gray-500">Your Listed Price</p>
                                <p className="font-medium">{formatPrice(negotiation.farmerPrice)}/kg</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Buyer's Offer</p>
                                <p className="font-medium">{formatPrice(negotiation.buyerPrice)}/kg</p>
                              </div>
                              <div>
                                <p className="text-gray-500">From</p>
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
                                  {isProcessingNegotiation === negotiation.negotiationId ? 'Processing...' : 'Accept Offer'}
                                </button>
                                <button
                                  onClick={() => handleRejectNegotiation(negotiation.negotiationId)}
                                  disabled={isProcessingNegotiation === negotiation.negotiationId}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50"
                                >
                                  {isProcessingNegotiation === negotiation.negotiationId ? 'Processing...' : 'Reject'}
                                </button>
                                <button
                                  onClick={() => handleOpenNegotiationCounter(negotiation)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                  Counter
                                </button>
                              </>
                            )}
                            {negotiation.status === 'ACCEPTED' && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                                ✅ You accepted this offer
                              </span>
                            )}
                            {negotiation.status === 'REJECTED' && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded">
                                ❌ You rejected this offer
                              </span>
                            )}
                            {negotiation.status === 'COUNTERED' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                                💰 Counter offer sent
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
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No price negotiations</h3>
                    <p className="text-gray-500">Buyers will appear here when they want to negotiate prices</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Price Prediction Tab */}
        {activeTab === 'prediction' && (
          <div className="space-y-6">
            {/* Prediction Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Enter crop details for prediction</h3>
              
              {/* Crop Suggestions */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Crop Suggestions</h4>
                <div className="flex flex-wrap gap-2">
                  {cropSuggestions.slice(0, 12).map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setPredictionForm({...predictionForm, cropName: crop})}
                      className={`px-3 py-1.5 text-sm rounded-full transition ${
                        predictionForm.cropName === crop
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Available Crops: {availableCrops.length} crops available
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    value={predictionForm.cropName}
                    onChange={(e) => setPredictionForm({...predictionForm, cropName: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., Tomato, Wheat, Onion"
                    list="crop-suggestions"
                  />
                  <datalist id="crop-suggestions">
                    {availableCrops.map((crop) => (
                      <option key={crop} value={crop} />
                    ))}
                  </datalist>
                  <p className="text-xs text-gray-500 mt-1">Select from available crops</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    value={predictionForm.year}
                    onChange={(e) => setPredictionForm({...predictionForm, year: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month *
                  </label>
                  <select
                    value={predictionForm.month}
                    onChange={(e) => setPredictionForm({...predictionForm, month: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Month</option>
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchPricePrediction}
                  disabled={predicting || !predictionForm.cropName || !predictionForm.year || !predictionForm.month || !backendConnections.python}
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {predicting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading prediction...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4" />
                      Predict Price
                    </>
                  )}
                </button>
                
                {!backendConnections.python && (
                  <div className="text-red-600 text-sm">
                    ⚠️ Python ML backend not connected. Please start the Python server on port 5000.
                  </div>
                )}
              </div>
              
              {predictionError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-red-600 mt-0.5" size={16} />
                    <p className="text-red-700">{predictionError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Prediction Results */}
            {predictionResult && (
              <>
                {/* Results Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart3 className="text-green-600" size={24} />
                      <h3 className="text-lg font-bold text-gray-800">Prediction Results</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Predicted Wholesale Price Index (WPI)</p>
                        <p className="text-2xl font-bold text-green-600">{predictionResult.wpi.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Predicted Price per kg (₹)</p>
                        <p className="text-2xl font-bold text-blue-600">₹{predictionResult.price_per_kg.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Prediction Confidence</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          predictionResult.confidence === 'high' ? 'bg-green-100 text-green-800' :
                          predictionResult.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {predictionResult.confidence === 'high' ? 'High Confidence' :
                           predictionResult.confidence === 'medium' ? 'Moderate Confidence' :
                           'Low Confidence'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="text-blue-600" size={24} />
                      <h3 className="text-lg font-bold text-gray-800">Best time to sell</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Recommended Time</p>
                        <p className="text-xl font-bold text-blue-600">{predictionResult.best_time_to_sell}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Market Trend</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            predictionResult.market_trend === 'up' ? 'bg-green-100 text-green-800' :
                            predictionResult.market_trend === 'stable' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {predictionResult.market_trend === 'up' ? '📈 Up' :
                             predictionResult.market_trend === 'stable' ? '➡️ Stable' :
                             '📉 Down'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Average Price</p>
                        <p className="text-lg font-medium text-gray-800">
                          ₹{predictionResult.historical_data && predictionResult.historical_data.length > 0 
                            ? (predictionResult.historical_data.reduce((sum, d) => sum + d.price, 0) / predictionResult.historical_data.length).toFixed(2)
                            : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Info className="text-purple-600" size={24} />
                      <h3 className="text-lg font-bold text-gray-800">Factors Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Weather Impact</p>
                        <p className="text-sm text-gray-600">{predictionResult.factors.weather_impact}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Market Demand</p>
                        <p className="text-sm text-gray-600">{predictionResult.factors.market_demand}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Seasonal Factors</p>
                        <p className="text-sm text-gray-600">{predictionResult.factors.seasonal_factors}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Trend Chart */}
                {predictionResult.historical_data && predictionResult.historical_data.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Historical Price Trends - {predictionForm.cropName}
                    </h3>
                    <div className="h-80">
                      <Line data={getPredictionChartData()!} options={chartOptions} />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      if (predictionResult) {
                        const reportData = {
                          crop: predictionForm.cropName,
                          year: predictionForm.year,
                          month: predictionForm.month,
                          wpi: predictionResult.wpi,
                          price_per_kg: predictionResult.price_per_kg,
                          confidence: predictionResult.confidence,
                          market_trend: predictionResult.market_trend,
                          best_time_to_sell: predictionResult.best_time_to_sell
                        };
                        
                        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `price_prediction_${predictionForm.cropName}_${predictionForm.year}_${predictionForm.month}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        
                        alert('Data exported successfully');
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Export Data
                  </button>
                  <button
                    onClick={() => {
                      if (predictionResult) {
                        const report = `
Price Prediction Report
=======================

Crop: ${predictionForm.cropName}
Year: ${predictionForm.year}
Month: ${predictionForm.month}

Prediction Results:
-------------------
Wholesale Price Index (WPI): ${predictionResult.wpi.toFixed(2)}
Predicted Price per kg: ₹${predictionResult.price_per_kg.toFixed(2)}
Confidence Level: ${predictionResult.confidence}
Market Trend: ${predictionResult.market_trend}
Best Time to Sell: ${predictionResult.best_time_to_sell}

Factors Analysis:
-----------------
Weather Impact: ${predictionResult.factors.weather_impact}
Market Demand: ${predictionResult.factors.market_demand}
Seasonal Factors: ${predictionResult.factors.seasonal_factors}

Historical Data Available: ${predictionResult.historical_data ? predictionResult.historical_data.length : 0} months
                        `;
                        
                        const blob = new Blob([report], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `price_prediction_report_${predictionForm.cropName}_${predictionForm.year}_${predictionForm.month}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Generate Report
                  </button>
                </div>
              </>
            )}

            {/* No Results Message */}
            {!predictionResult && !predicting && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No prediction data available</h3>
                <p className="text-gray-500 mb-6">Generate prediction to see historical trends</p>
                <div className="text-sm text-gray-400">
                  <p>Note: For price prediction, please enter your crop name, year and month, then click "Predict Price" button.</p>
                  <p className="mt-2">Make sure your Python backend server is running (http://localhost:5000)</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Negotiation Counter Offer Modal */}
        {showNegotiationCounterModal && selectedNegotiation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Make Counter Offer</h3>
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
                    Enter Counter Price (₹ per kg) *
                  </label>
                  <input
                    type="number"
                    value={negotiationCounterPrice}
                    onChange={(e) => setNegotiationCounterPrice(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your counter price"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Buyer's Offer: {formatPrice(selectedNegotiation.buyerPrice)}/kg
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="text-blue-500 mt-0.5" size={16} />
                    <p className="text-sm text-blue-700">
                      Your counter offer will be sent to the buyer for review. They can accept or reject it.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNegotiationCounterModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCounterNegotiation}
                  disabled={isProcessingNegotiation === selectedNegotiation.negotiationId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessingNegotiation === selectedNegotiation.negotiationId ? 'Processing...' : 'Submit'}
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
                <h3 className="text-xl font-bold text-gray-800">Send Counter Offer</h3>
                <button
                  onClick={() => setShowCounterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Counter Price (₹ per kg) *
                    </label>
                    <input
                      type="number"
                      value={counterData.counterPrice}
                      onChange={(e) => setCounterData({...counterData, counterPrice: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter your counter price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Counter Quantity (kg)
                    </label>
                    <input
                      type="number"
                      value={counterData.counterQuantity}
                      onChange={(e) => setCounterData({...counterData, counterQuantity: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Counter Delivery Date
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
                    Message to Buyer
                  </label>
                  <textarea
                    value={counterData.counterMessage}
                    onChange={(e) => setCounterData({...counterData, counterMessage: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    placeholder="Optional message explaining your counter offer"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCounterModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedRequestId && handleCounterContractRequest(selectedRequestId)}
                  disabled={isProcessingNegotiation === selectedRequestId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessingNegotiation === selectedRequestId ? 'Processing...' : 'Send Counter Offer'}
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
                <h3 className="text-xl font-bold text-gray-800">Create New Contract</h3>
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
                    Buyer Email *
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
                    Product ID *
                  </label>
                  <select
                    value={newContract.productId}
                    onChange={(e) => setNewContract({...newContract, productId: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product.productId} value={product.productId}>
                        {product.name} ({product.quantity} kg)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (kg) *
                    </label>
                    <input
                      type="number"
                      value={newContract.quantity}
                      onChange={(e) => setNewContract({...newContract, quantity: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹ per kg) *
                    </label>
                    <input
                      type="number"
                      value={newContract.price}
                      onChange={(e) => setNewContract({...newContract, price: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    value={newContract.crop}
                    onChange={(e) => setNewContract({...newContract, crop: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., Wheat, Rice, Tomato"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date *
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
                  Cancel
                </button>
                <button
                  onClick={handleAddContract}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Contract
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
                <h3 className="text-xl font-bold text-gray-800">Add New Product</h3>
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
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., Organic Wheat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows={2}
                    placeholder="Optional description of your product"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select category</option>
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
                      Quantity (kg) *
                    </label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹ per kg) *
                    </label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Product
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