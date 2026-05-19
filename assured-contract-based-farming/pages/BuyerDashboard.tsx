// pages/BuyerDashboard.tsx - UPDATED WITH WORKING PAYMENT OPTIONS
// ✅ FIXED: Payment options now visible
// ✅ ADDED: Auto-create payment when contract is accepted
// ✅ ADDED: Payment button for pending payments
// ✅ FIXED: Type conflicts between local and imported Payment interfaces
// ✅ FIXED: paymentMethod type mismatch
// ✅ FIXED: All negotiation actions now call API properly
// ✅ FIXED: TypeScript errors with undefined vs null
// ✅ REMOVED: Marathi language support and language toggle button

import React, { useState, useEffect } from 'react';
import { 
  LogOut, FileText, Package, DollarSign, 
  Calendar, Bell, Plus, Trash2, Edit, X, Check, Search,
  ShoppingCart, Users, BarChart3, User, MapPin, ShoppingBag,
  MessageSquare, ChevronLeft, ChevronRight, Tag, AlertCircle,
  RefreshCw, Info, ExternalLink, ThumbsUp, ThumbsDown, MessageCircle,
  CreditCard, Receipt, Printer, Download, Wallet, Eye
} from 'lucide-react';
import api from '../api';
import PaymentService, { Payment as RazorpayPayment } from '../services/PaymentService';

// Add this line after the imports
const API_BASE_URL = 'http://localhost:8080/api';

// Types matching your database
interface User {
  userId: number;
  id?: number;
  name: string | null;
  email: string | null;
  role: string | null;
  status: string;
  phone?: string;
  address?: string;
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

// Local Payment interface that matches your database structure
interface LocalPayment {
  paymentId: number;
  contract: Contract;
  amount: number;
  paymentDate: string | null;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | null;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  description?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  createdAt?: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success';
  time: string;
}

interface PriceNegotiation {
  negotiationId: number;
  product: Product;
  buyer: User;
  farmer: User;
  buyerPrice: number;
  farmerPrice?: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
  lastUpdatedBy: 'BUYER' | 'FARMER';
  createdAt: string;
  updatedAt: string;
}

interface LocalStorageUser {
  userId?: number;
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  phone?: string;
  address?: string;
}

// English Translations only
const translations = {
  // Header
  dashboard: "🛒 Buyer Dashboard",
  welcome: "Welcome back",
  logout: "Logout",
  refresh: "Refresh",
  connected: "Connected",
  offline: "Offline Mode",
  checking: "Checking...",
  
  // Tabs
  overview: "Overview",
  products: "Browse Products",
  contracts: "My Contracts",
  payments: "Payments",
  negotiations: "Negotiations",
  
  // Overview
  activeContracts: "Active Contracts",
  availableProducts: "Available Products",
  pendingPayments: "Pending Payments",
  totalSpent: "Total Spent",
  quickActions: "Quick Actions",
  findProducts: "Find farmers and products",
  manageContracts: "Manage your agreements",
  startNegotiating: "Start Negotiating",
  findNegotiate: "Find products to negotiate",
  recentContracts: "Recent Contracts",
  noContracts: "No contracts found. Browse products to create your first contract.",
  browseProducts: "Browse Products →",
  clearAll: "Clear all",
  noNotifications: "No notifications",
  viewAll: "View All",
  
  // Products
  browseProductsTitle: "Browse Products",
  findProductsDesc: "Find products from farmers and start negotiations",
  searchPlaceholder: "Search products, farmers, categories...",
  allCategories: "All Categories",
  demoMode: "Demo Mode Active",
  demoDesc: "Negotiations and contract requests will be simulated. For real functionality, ensure the backend server is running.",
  noProductsFound: "No products found",
  noProductsDesc: "No products are currently available. Check back later or contact farmers directly.",
  adjustSearch: "Try adjusting your search or filter criteria",
  clearFilters: "Clear filters and show all products",
  farmerLabel: "Farmer:",
  availableQuantity: "Available Quantity",
  pricePerKg: "Price per kg",
  requestContract: "Request Contract",
  negotiatePrice: "Negotiate Price",
  sending: "Sending...",
  howItWorks: "How it works:",
  
  // Contracts
  contractManagement: "Contract Management",
  viewManageContracts: "View and manage your contracts with farmers",
  contractId: "Contract ID",
  farmer: "Farmer",
  product: "Product",
  quantity: "Quantity",
  price: "Price",
  deliveryDate: "Delivery Date",
  status: "Status",
  actions: "Actions",
  noContractsYet: "No contracts yet",
  startByBrowsing: "Start by browsing products and creating contracts",
  
  // Payments
  paymentTracking: "Payment Tracking",
  pendingPaymentsTitle: "Pending Payments",
  completedPayments: "Completed Payments",
  payment: "Payment",
  due: "Due",
  paid: "Paid",
  noPendingPayments: "No pending payments",
  noCompletedPayments: "No completed payments",
  makePayment: "Make Payment",
  payNow: "Pay Now",
  paymentDetails: "Payment Details",
  receipt: "Receipt",
  printReceipt: "Print Receipt",
  downloadReceipt: "Download Receipt",
  paymentMethod: "Payment Method",
  transactionId: "Transaction ID",
  paymentAmount: "Payment Amount",
  paymentDate: "Payment Date",
  viewDetails: "View Details",
  createPayment: "Create Payment",
  
  // Negotiations
  negotiationsTitle: "Price Negotiations",
  negotiationsDesc: "View and respond to price negotiations with farmers",
  allNegotiations: "All Negotiations",
  pending: "Pending",
  countered: "Countered",
  accepted: "Accepted",
  rejected: "Rejected",
  negotiationId: "Negotiation ID",
  yourPrice: "Your Price",
  farmerPrice: "Farmer's Price",
  lastUpdated: "Last Updated",
  action: "Action",
  noNegotiations: "No negotiations found",
  startNegotiations: "Start negotiating with farmers to see offers here",
  accept: "Accept",
  reject: "Reject",
  counter: "Counter",
  send: "Send",
  cancel: "Cancel",
  counterOfferModal: "Send Counter Offer",
  counterOfferDesc: "Propose a new price to the farmer",
  yourCounterPrice: "Your Counter Price (₹)",
  enterCounterPrice: "Enter your counter price",
  messageToFarmer: "Message to Farmer",
  counterMessagePlaceholder: "Explain your counter offer...",
  sendCounterOffer: "Send Counter Offer",
  negotiationTips: "Negotiation Tips",
  
  // Contract Request Panel
  requestContractTitle: "Request Contract",
  productDetails: "Product Details",
  farmerEmail: "Farmer Email",
  buyerEmail: "Buyer Email",
  productId: "Product ID",
  quantityKg: "Quantity (kg)",
  enterQuantity: "Enter quantity",
  pricePerKgRupees: "Price per kg (₹)",
  enterPrice: "Enter price per kg",
  originalPrice: "Original price:",
  totalPrice: "Total Price",
  deliveryDateLabel: "Delivery Date *",
  cropType: "Crop Type",
  cropPlaceholder: "e.g., Wheat, Rice, Vegetables",
  notesForFarmer: "Notes for Farmer (Optional)",
  notesPlaceholder: "Add any specific requirements or notes...",
  sendContractRequest: "Send Contract Request",
  sendingRequest: "Sending Request...",
  howContractWorks: "How contract requests work:",
  
  // Price Negotiation Modal
  priceNegotiation: "Price Negotiation",
  proposeNewPrice: "Propose a new price to",
  yourInformation: "Your Information",
  buyerName: "Buyer Name",
  buyerId: "Buyer ID",
  userRole: "User Role",
  notSpecified: "Not specified",
  notFound: "Not found",
  yourProposedPrice: "Your Proposed Price per kg (₹)",
  enterProposedPrice: "Enter your proposed price",
  messageToFarmerLabel: "Message to Farmer *",
  negotiationMessagePlaceholder: "Explain why you're proposing this price, quantity needed, delivery expectations, etc.",
  negotiationTipsLabel: "Negotiation Tips",
  
  // Footer
  buyerDashboard: "Buyer Dashboard",
  connectWithFarmers: "Connect directly with farmers, negotiate prices, and manage contracts efficiently.",
  quickLinks: "Quick Links",
  support: "Support",
  lastRefresh: "Last refresh:",
  copyright: "© AgriConnect Buyer Dashboard. All rights reserved.",
  
  // Connection Banner
  workingOffline: "Working in Offline Mode",
  backendFailed: "Backend connection failed. You can still browse products, but negotiations will be saved locally. Check that your backend server is running at",
  
  // Loading
  loadingDashboard: "Loading your dashboard...",
  loadingDataFor: "Loading data for:",
  
  // Error
  noBuyerEmail: "No buyer email found. Please login again.",
  failedLoadData: "Failed to load buyer data. Please login again.",
  failedDashboard: "Failed to load dashboard data. Please try refreshing.",
  
  // Add missing translations
  contract: "Contract",
  theFarmer: "the farmer",
  processing: "Processing...",
  negotiationAccepted: "Negotiation Accepted",
  negotiationRejected: "Negotiation Rejected",
  counterOfferSent: "Counter Offer Sent",
  currentPrice: "Current Price",
  
  // Payment Modal
  confirmPayment: "Confirm Payment",
  paymentProcessing: "Processing Payment...",
  paymentSuccess: "Payment Successful!",
  paymentFailed: "Payment Failed",
  paymentCancelled: "Payment Cancelled",
  retryPayment: "Retry Payment",
  totalAmount: "Total Amount",
};

// Helper arrays for lists
const howItWorksItems = [
  "Request Contract: Send a direct contract request to the farmer",
  "Negotiate Price: Propose a different price and discuss terms",
  "Farmers will see your requests in their dashboard and respond",
  "Check the Notifications section for responses"
];

const contractWorkItems = [
  "Your request will be sent to the farmer for review",
  "The farmer can accept, reject, or negotiate the terms",
  "You'll receive a notification when they respond",
  "Once accepted, the contract becomes active"
];

const negotiationTipItems = [
  "Start with a reasonable offer (5-15% below asking price)",
  "Mention bulk purchase quantities for better leverage",
  "Consider long-term contracts for better pricing",
  "Farmers are more likely to negotiate on larger quantities",
  "Be clear about delivery expectations and payment terms"
];

const tips = [
  "Be reasonable in your counter offer",
  "Consider the farmer's perspective",
  "Mention if you want to buy in bulk",
  "Be clear about delivery expectations"
];

// Helper function for arrays
const getListItems = (listName: 'howItWorksItems' | 'contractWorkItems' | 'negotiationTipItems' | 'tips'): string[] => {
  const lists = {
    howItWorksItems,
    contractWorkItems,
    negotiationTipItems,
    tips
  };
  return lists[listName];
};

const BuyerDashboard: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'contracts' | 'payments' | 'negotiations'>('overview');
  const [showContractPanel, setShowContractPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  // Data States
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<LocalPayment[]>([]);
  const [negotiations, setNegotiations] = useState<PriceNegotiation[]>([]);
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<LocalPayment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [selectedContractForPayment, setSelectedContractForPayment] = useState<Contract | null>(null);
  const [creatingPayment, setCreatingPayment] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'Welcome to your dashboard! Browse products and create contracts.',
      type: 'info',
      time: 'Just now'
    }
  ]);

  // New Contract Form State
  const [newContract, setNewContract] = useState({
    farmerEmail: '',
    productId: '',
    quantity: '',
    price: '',
    deliveryDate: '',
    crop: '',
    notes: ''
  });

  // Price Negotiation State
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [isSendingNegotiation, setIsSendingNegotiation] = useState(false);
  const [isSendingContract, setIsSendingContract] = useState(false);

  // Counter Offer State
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState<PriceNegotiation | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [isSendingCounter, setIsSendingCounter] = useState(false);

  // Processing state for negotiations
  const [processingNegotiationId, setProcessingNegotiationId] = useState<number | null>(null);

  // Get translation function
  const t = (key: keyof typeof translations): string => {
    return translations[key];
  };

  // Load buyer data on component mount
  useEffect(() => {
    const loadBuyerData = async () => {
      try {
        console.log('=== LOADING BUYER DATA ===');
        
        const userDataStr = localStorage.getItem('currentUser');
        let userData: LocalStorageUser | null = null;
        
        if (userDataStr) {
          try {
            userData = JSON.parse(userDataStr) as LocalStorageUser;
            console.log('📋 Found user in localStorage:', userData);
            
            const normalizedUser: User = {
              userId: userData?.userId || userData?.id || 0,
              id: userData?.id || userData?.userId || 0,
              name: userData?.name || '',
              email: userData?.email || '',
              role: userData?.role || 'BUYER',
              status: userData?.status || 'ACTIVE',
              phone: userData?.phone || '',
              address: userData?.address || ''
            };
            
            setCurrentUser(normalizedUser);
            setBuyerEmail(normalizedUser.email || '');
            console.log('✅ Immediately set user data:', normalizedUser);
            
          } catch (parseError) {
            console.error('Error parsing userData:', parseError);
          }
        }
        
        testBackendConnection();
        
        if (userData?.email) {
          await fetchDashboardData();
          return;
        }
        
        const backupEmail = localStorage.getItem('buyerEmail') || 
                           localStorage.getItem('loginEmail') ||
                           localStorage.getItem('email') ||
                           localStorage.getItem('userEmail') ||
                           localStorage.getItem('user');
        
        if (backupEmail) {
          console.log('✅ Using backup email:', backupEmail);
          setBuyerEmail(backupEmail);
          
          try {
            const apiUserData = await api.users.getUserByEmail(backupEmail);
            if (apiUserData) {
              const normalizedApiUser: User = {
                userId: (apiUserData as any).userId || (apiUserData as any).id || 0,
                id: (apiUserData as any).id || (apiUserData as any).userId || 0,
                name: (apiUserData as any).name || '',
                email: (apiUserData as any).email || '',
                role: (apiUserData as any).role || 'BUYER',
                status: (apiUserData as any).status || 'ACTIVE',
                phone: (apiUserData as any).phone || '',
                address: (apiUserData as any).address || ''
              };
              setCurrentUser(normalizedApiUser);
              console.log('✅ Got user data from API:', normalizedApiUser);
            } else {
              const minimalUser: User = {
                userId: 0,
                name: '',
                email: backupEmail,
                role: 'BUYER',
                status: 'ACTIVE'
              };
              setCurrentUser(minimalUser);
            }
          } catch (apiError) {
            console.log('Could not fetch user from API, using minimal data');
            const minimalUser: User = {
              userId: 0,
              name: '',
              email: backupEmail,
              role: 'BUYER',
              status: 'ACTIVE'
            };
            setCurrentUser(minimalUser);
          }
          
          await fetchDashboardData();
          return;
        }
        
        console.error('❌ No buyer email found!');
        setError(t('noBuyerEmail'));
        setLoading(false);
        
      } catch (error) {
        console.error('Error loading buyer data:', error);
        setError(t('failedLoadData'));
        setLoading(false);
      }
    };
    
    loadBuyerData();
  }, []);

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      setConnectionStatus('checking');
      
      const endpoints = [
        `${API_BASE_URL}/ping`,
        `http://localhost:8080/api/ping`,
      ];
      
      let isConnected = false;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔗 Testing connection to: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (response.ok) {
            console.log(`✅ Backend reachable at: ${endpoint}`);
            isConnected = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (isConnected) {
        setConnectionStatus('connected');
        console.log('✅ Backend connection successful');
      } else {
        setConnectionStatus('disconnected');
        console.warn('⚠️ Backend connection failed - showing offline mode');
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
      setConnectionStatus('disconnected');
    }
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);
      
      console.log('=== FETCHING DASHBOARD DATA ===');
      console.log('Current buyerEmail:', buyerEmail);
      
      if (!buyerEmail && !currentUser?.email) {
        setError(t('noBuyerEmail'));
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const emailToUse = buyerEmail || currentUser?.email || '';
      console.log('✅ Fetching data for buyer:', emailToUse);
      
      await fetchContracts();
      await fetchProducts();
      await fetchPayments();
      await fetchNegotiations();
      await autoCreatePaymentsForActiveContracts();
      
      await checkForNotifications();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(t('failedDashboard'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-create payments for active contracts that don't have payments
  const autoCreatePaymentsForActiveContracts = async () => {
    try {
      const activeContracts = contracts.filter(c => c.status === 'ACTIVE' || c.status === 'COMPLETED');
      const contractIdsWithPayments = new Set(payments.map(p => p.contract.contractId));
      
      for (const contract of activeContracts) {
        if (!contractIdsWithPayments.has(contract.contractId)) {
          console.log(`📝 Creating payment for contract #${contract.contractId}`);
          await createPaymentForContract(contract);
        }
      }
    } catch (error) {
      console.error('Error auto-creating payments:', error);
    }
  };

  // Create a payment for a specific contract
  const createPaymentForContract = async (contract: Contract) => {
    try {
      const paymentData = {
        contractId: contract.contractId,
        amount: contract.price * contract.quantity,
        paymentMethod: 'UPI' as const,
        description: `Payment for ${contract.crop} - ${contract.quantity} kg @ ₹${contract.price}/kg`
      };
      
      const newPayment = await PaymentService.createPayment(paymentData);
      console.log('✅ Payment created:', newPayment);
      
      setNotifications(prev => [{
        id: prev.length + 1,
        message: `💰 Payment created for Contract #${contract.contractId}: ₹${paymentData.amount}`,
        type: 'info',
        time: 'Just now'
      }, ...prev]);
      
      // Refresh payments list
      await fetchPayments();
      
      return newPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      return null;
    }
  };

  // Manual create payment for a contract
  const handleCreatePaymentForContract = async (contract: Contract) => {
    setSelectedContractForPayment(contract);
    setShowCreatePaymentModal(true);
  };

  // Confirm create payment
  const handleConfirmCreatePayment = async () => {
    if (!selectedContractForPayment) return;
    
    setCreatingPayment(true);
    try {
      await createPaymentForContract(selectedContractForPayment);
      alert(`✅ Payment created successfully!`);
    } catch (error: any) {
      alert(`Failed to create payment: ${error.message}`);
    } finally {
      setCreatingPayment(false);
      setShowCreatePaymentModal(false);
      setSelectedContractForPayment(null);
    }
  };

  // Fetch buyer's contracts
  const fetchContracts = async () => {
    try {
      const emailToUse = buyerEmail || currentUser?.email || '';
      console.log('Fetching contracts for buyer:', emailToUse);
      
      try {
        const contractsData = await api.contracts.getContractsByBuyer(emailToUse);
        console.log('Buyer contracts data:', contractsData);
        
        if (Array.isArray(contractsData)) {
          setContracts(contractsData);
        } else {
          console.warn('Invalid contracts data format:', contractsData);
          setContracts([]);
        }
      } catch (endpointError) {
        console.warn('Buyer endpoint failed, trying all contracts:', endpointError);
        const allContracts = await api.contracts.getAllContracts();
        if (Array.isArray(allContracts)) {
          const buyerContracts = allContracts.filter((contract: any) => 
            contract.buyer?.email === emailToUse
          );
          setContracts(buyerContracts);
        }
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setContracts([]);
    }
  };

  // Fetch all available products
  const fetchProducts = async () => {
    try {
      console.log('Fetching all products for buyer...');
      const productsData = await api.products.getAllProducts();
      console.log('All products data:', productsData);
      
      if (Array.isArray(productsData)) {
        const validProducts = productsData.filter((product: any) => 
          product.farmer && product.farmer.email
        );
        setProducts(validProducts);
      } else {
        console.warn('Invalid products data format:', productsData);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  // Fetch payments
  const fetchPayments = async () => {
    try {
      console.log('Fetching payments...');
      const paymentsData = await PaymentService.getAllPayments();
      console.log('All payments data:', paymentsData);
      
      if (Array.isArray(paymentsData)) {
        const buyerContractIds = contracts.map(contract => contract.contractId);
        const buyerPayments = paymentsData
          .filter((payment: RazorpayPayment) => 
            buyerContractIds.includes(payment.contract?.contractId)
          )
          .map((payment: RazorpayPayment): LocalPayment => ({
            paymentId: payment.paymentId,
            contract: payment.contract as Contract,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            paymentMethod: payment.paymentMethod as 'CASH' | 'CARD' | 'UPI' | null,
            status: payment.status as 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED',
            description: payment.description ?? null,
            razorpayOrderId: payment.razorpayOrderId ?? null,
            razorpayPaymentId: payment.razorpayPaymentId ?? null,
            razorpaySignature: payment.razorpaySignature ?? null,
            createdAt: payment.createdAt
          }));
        setPayments(buyerPayments);
      } else {
        console.warn('Invalid payments data format:', paymentsData);
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  };

  // Fetch negotiations
  const fetchNegotiations = async () => {
    try {
      const emailToUse = buyerEmail || currentUser?.email || '';
      console.log('Fetching negotiations for buyer:', emailToUse);
      
      try {
        const negotiationsData = await api.negotiations.getByBuyer(emailToUse);
        console.log('Buyer negotiations data:', negotiationsData);
        
        if (Array.isArray(negotiationsData)) {
          const sortedNegotiations = negotiationsData.sort((a: any, b: any) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setNegotiations(sortedNegotiations);
        } else {
          console.warn('Invalid negotiations data format:', negotiationsData);
          setNegotiations([]);
        }
      } catch (error) {
        console.error('Error fetching negotiations:', error);
        setNegotiations([]);
      }
    } catch (error) {
      console.error('Error in fetchNegotiations:', error);
      setNegotiations([]);
    }
  };

  // Check for notifications
  const checkForNotifications = async () => {
    try {
      const emailToUse = buyerEmail || currentUser?.email || '';
      if (!emailToUse) return;
      
      const myNegotiations = await api.negotiations.getByBuyer(emailToUse);
      console.log('My negotiations:', myNegotiations);
      
      if (Array.isArray(myNegotiations)) {
        myNegotiations.forEach((neg: any) => {
          if (neg.status === 'ACCEPTED' && !notifications.find(n => n.message.includes(`negotiation accepted for ${neg.product?.name}`))) {
            setNotifications(prev => [{
              id: prev.length + 1,
              message: `✅ Negotiation accepted for ${neg.product?.name}! Price: ₹${neg.buyerPrice}/kg`,
              type: 'success',
              time: 'Just now'
            }, ...prev]);
          } else if (neg.status === 'REJECTED' && !notifications.find(n => n.message.includes(`negotiation rejected for ${neg.product?.name}`))) {
            setNotifications(prev => [{
              id: prev.length + 1,
              message: `😞 Negotiation rejected for ${neg.product?.name}`,
              type: 'warning',
              time: 'Just now'
            }, ...prev]);
          }
        });
      }
    } catch (error) {
      console.log('No negotiation updates or error checking:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    await testBackendConnection();
    await fetchDashboardData();
  };

  // Calculate Stats
  const totalSpent = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const activeContracts = contracts.filter(c => c.status === 'ACTIVE').length;
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
  const availableProducts = products.length;
  const pendingNegotiations = negotiations.filter(n => n.status === 'PENDING' || n.status === 'COUNTERED').length;

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.farmer?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]];

  // Handlers
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Initialize contract creation from product
  const handleRequestContract = (product: Product) => {
    if (!product.farmer?.email) {
      alert('Cannot create contract: Farmer email not found');
      return;
    }

    setSelectedProduct(product);
    setNewContract({
      farmerEmail: product.farmer.email,
      productId: product.productId.toString(),
      quantity: '100',
      price: product.price?.toString() || '0',
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      crop: product.category || 'General',
      notes: `Interested in ${product.name}. Please consider my request.`
    });
    setShowContractPanel(true);
  };

  // Initialize price negotiation
  const handlePriceNegotiation = (product: Product) => {
    if (!product.farmer?.email) {
      alert('Cannot negotiate: Farmer email not found');
      return;
    }

    setSelectedProduct(product);
    setNegotiationPrice((product.price ? product.price * 0.9 : 0).toString());
    setNegotiationMessage(`I'm interested in purchasing ${product.name}. Would you consider a price of ₹${product.price ? product.price * 0.9 : 0}/kg for bulk purchase?`);
    setShowNegotiation(true);
  };

  // Handle payment initiation
  const handleMakePayment = (payment: LocalPayment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  // Convert LocalPayment to RazorpayPayment format for PaymentService
  // Convert LocalPayment to RazorpayPayment format for PaymentService
const convertToRazorpayPayment = (payment: LocalPayment): RazorpayPayment => {
  return {
    paymentId: payment.paymentId,
    contract: {
      contractId: payment.contract.contractId,
      crop: payment.contract.crop,
      quantity: payment.contract.quantity,
      price: payment.contract.price,
      farmer: {
        userId: payment.contract.farmer.userId,
        name: payment.contract.farmer.name || '',
        email: payment.contract.farmer.email || ''
      },
      buyer: {
        userId: payment.contract.buyer.userId,
        name: payment.contract.buyer.name || '',
        email: payment.contract.buyer.email || ''
      }
    },
    amount: payment.amount,
    status: payment.status,
    paymentMethod: payment.paymentMethod,
    paymentDate: payment.paymentDate,
    description: payment.description ?? null,  // Convert undefined to null
    razorpayOrderId: payment.razorpayOrderId ?? null,  // Convert undefined to null
    razorpayPaymentId: payment.razorpayPaymentId ?? null,  // Convert undefined to null
    razorpaySignature: payment.razorpaySignature ?? null,  // Convert undefined to null
    createdAt: payment.createdAt || new Date().toISOString()
  };
};

  // Handle payment confirmation with Razorpay
  const handleConfirmPayment = async () => {
    if (!selectedPayment) return;
    
    setIsProcessingPayment(true);
    
    try {
      console.log('🚀 Initiating payment for:', selectedPayment);
      
      const razorpayPayment = convertToRazorpayPayment(selectedPayment);
      
      await PaymentService.initiatePayment(
        razorpayPayment,
        (verifiedPayment) => {
          console.log('✅ Payment successful:', verifiedPayment);
          
          setPayments(prev => prev.map(p => 
            p.paymentId === verifiedPayment.paymentId 
              ? {
                  ...p,
                  status: 'COMPLETED',
                  paymentDate: verifiedPayment.paymentDate,
                  razorpayPaymentId: verifiedPayment.razorpayPaymentId ?? null,
                  razorpaySignature: verifiedPayment.razorpaySignature ?? null
                }
              : p
          ));
          
          setNotifications(prev => [{
            id: prev.length + 1,
            message: `✅ Payment successful for Contract #${verifiedPayment.contract?.contractId}! Amount: ₹${verifiedPayment.amount}`,
            type: 'success',
            time: 'Just now'
          }, ...prev]);
          
          setShowPaymentModal(false);
          setSelectedPayment(null);
          alert(t('paymentSuccess'));
          
          setTimeout(() => fetchPayments(), 1000);
        },
        (error) => {
          console.error('❌ Payment failed:', error);
          
          setNotifications(prev => [{
            id: prev.length + 1,
            message: `❌ Payment failed for Contract #${selectedPayment.contract?.contractId}. ${error.message || ''}`,
            type: 'warning',
            time: 'Just now'
          }, ...prev]);
          
          alert(`${t('paymentFailed')}: ${error.message || 'Unknown error'}`);
          setShowPaymentModal(false);
          setSelectedPayment(null);
        }
      );
      
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      alert(`${t('paymentFailed')}: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle printing receipt
  const handlePrintReceipt = (payment: LocalPayment) => {
    const razorpayPayment = convertToRazorpayPayment(payment);
    PaymentService.printReceipt(razorpayPayment);
  };

  // Handle downloading receipt
  const handleDownloadReceipt = (payment: LocalPayment) => {
    const razorpayPayment = convertToRazorpayPayment(payment);
    PaymentService.downloadReceipt(razorpayPayment);
  };

  // Handle counter offer
  const handleCounterOffer = (negotiation: PriceNegotiation) => {
    setSelectedNegotiation(negotiation);
    setCounterPrice(negotiation.farmerPrice?.toString() || '');
    setCounterMessage(`I appreciate your counter offer of ₹${negotiation.farmerPrice}/kg. Would you consider ₹${(negotiation.farmerPrice ? negotiation.farmerPrice * 0.95 : 0)}/kg?`);
    setShowCounterOffer(true);
  };

  // Submit counter offer
  const handleSubmitCounterOffer = async () => {
    if (!selectedNegotiation || !counterPrice) {
      alert('Please enter a counter price');
      return;
    }

    const price = parseFloat(counterPrice);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setIsSendingCounter(true);

    try {
      const negotiationData = {
        productId: selectedNegotiation.product?.productId || 0,
        buyerId: selectedNegotiation.buyer?.userId || currentUser?.userId || 0,
        buyerPrice: price
      };
      
      const response = await api.negotiations.createNegotiation(negotiationData);
      console.log('✅ Counter offer sent successfully:', response);
      
      setNotifications(prev => [{
        id: prev.length + 1,
        message: `✅ Counter offer sent to ${selectedNegotiation.farmer?.name || 'farmer'}!`,
        type: 'success',
        time: 'Just now'
      }, ...prev]);
      
      alert(`✅ Counter offer sent successfully!\n\nProposed Price: ₹${price}/kg`);
      
      setShowCounterOffer(false);
      setCounterPrice('');
      setCounterMessage('');
      
      setTimeout(() => fetchDashboardData(), 1000);

    } catch (error: any) {
      console.error('❌ Error submitting counter offer:', error);
      alert(`Failed to submit counter offer: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSendingCounter(false);
    }
  };

  // Accept negotiation
  const handleAcceptNegotiation = async (negotiation: PriceNegotiation) => {
    if (window.confirm('Are you sure you want to accept this price?')) {
      setProcessingNegotiationId(negotiation.negotiationId);
      
      try {
        await api.negotiations.accept(negotiation.negotiationId);
        
        setNotifications(prev => [{
          id: prev.length + 1,
          message: `✅ Price accepted for ${negotiation.product?.name}!`,
          type: 'success',
          time: 'Just now'
        }, ...prev]);
        
        await fetchNegotiations();
        
        alert(`✅ Negotiation accepted!`);
        
      } catch (error: any) {
        console.error('Error accepting negotiation:', error);
        alert('Error accepting price');
      } finally {
        setProcessingNegotiationId(null);
      }
    }
  };

  // Reject negotiation
  const handleRejectNegotiation = async (negotiation: PriceNegotiation) => {
    if (window.confirm('Are you sure you want to reject this price?')) {
      setProcessingNegotiationId(negotiation.negotiationId);
      
      try {
        await api.negotiations.reject(negotiation.negotiationId);
        
        setNotifications(prev => [{
          id: prev.length + 1,
          message: `😞 Price rejected for ${negotiation.product?.name}`,
          type: 'warning',
          time: 'Just now'
        }, ...prev]);
        
        await fetchNegotiations();
        
        alert(`❌ Negotiation rejected!`);
        
      } catch (error: any) {
        console.error('Error rejecting negotiation:', error);
        alert('Error rejecting price');
      } finally {
        setProcessingNegotiationId(null);
      }
    }
  };

  // Submit price negotiation
  const handleSubmitNegotiation = async () => {
    if (!negotiationPrice || !negotiationMessage || !selectedProduct?.farmer?.email) {
      alert('Please enter your proposed price and message');
      return;
    }

    const price = parseFloat(negotiationPrice);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setIsSendingNegotiation(true);

    try {
      let buyerId = 0;
      
      if (currentUser?.userId && currentUser.userId > 0) {
        buyerId = currentUser.userId;
      } else if (currentUser?.id && currentUser.id > 0) {
        buyerId = currentUser.id;
      }
      
      const negotiationData = {
        productId: selectedProduct.productId,
        buyerId: buyerId,
        buyerPrice: price
      };
      
      try {
        const response = await api.negotiations.createNegotiation(negotiationData);
        console.log('✅ Negotiation sent successfully:', response);
        
        setNotifications(prev => [{
          id: prev.length + 1,
          message: `✅ Price negotiation sent to ${selectedProduct.farmer?.name || 'farmer'} for ${selectedProduct.name}!`,
          type: 'success',
          time: 'Just now'
        }, ...prev]);
        
        alert(`✅ Price negotiation request sent!\n\nProposed Price: ₹${price}/kg`);
        
      } catch (apiError: any) {
        console.warn('⚠️ API call failed:', apiError.message);
        
        setNotifications(prev => [{
          id: prev.length + 1,
          message: `🟡 DEMO: Negotiation ready for ${selectedProduct.name}`,
          type: 'info',
          time: 'Just now'
        }, ...prev]);
        
        alert(`🟡 DEMO MODE: Price negotiation would be sent!\n\nProposed Price: ₹${price}/kg`);
      }
      
      setShowNegotiation(false);
      setNegotiationPrice('');
      setNegotiationMessage('');
      
      setTimeout(() => fetchDashboardData(), 1000);

    } catch (error: any) {
      console.error('❌ Error submitting negotiation:', error);
      alert(`Failed to submit negotiation: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSendingNegotiation(false);
    }
  };

  // Submit contract request
  const handleAddContract = async () => {
    if (!newContract.farmerEmail || !newContract.productId || !newContract.quantity || !newContract.price || !newContract.deliveryDate) {
      alert('Please fill all required fields');
      return;
    }

    const quantity = parseFloat(newContract.quantity);
    const price = parseFloat(newContract.price);
    
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setIsSendingContract(true);

    try {
      const requestData = {
        productId: parseInt(newContract.productId),
        buyerEmail: buyerEmail || currentUser?.email || '',
        quantity: quantity,
        proposedPrice: price,
        deliveryDate: newContract.deliveryDate,
        message: newContract.notes || `Contract request for ${selectedProduct?.name || 'product'}`
      };
      
      try {
        const response = await api.contractRequests.sendRequest(requestData);
        console.log('✅ Contract request created via API:', response);
        
        setNotifications(prev => [{
          id: prev.length + 1,
          message: `✅ Contract request sent to farmer for ${selectedProduct?.name || 'product'}!`,
          type: 'success',
          time: 'Just now'
        }, ...prev]);
        
        alert(`✅ Contract request sent successfully!`);
        
      } catch (apiError: any) {
        console.warn('⚠️ Contract request API failed:', apiError.message);
        
        const contractData = {
          farmerEmail: newContract.farmerEmail,
          buyerEmail: buyerEmail || currentUser?.email || '',
          productId: parseInt(newContract.productId),
          quantity: quantity,
          price: price,
          deliveryDate: newContract.deliveryDate,
          crop: newContract.crop || 'General Crop'
        };
        
        try {
          const fallbackResponse = await api.contracts.createContract(contractData);
          console.log('✅ Contract created via fallback:', fallbackResponse);
          
          setNotifications(prev => [{
            id: prev.length + 1,
            message: `✅ Contract created for ${selectedProduct?.name || 'product'}!`,
            type: 'success',
            time: 'Just now'
          }, ...prev]);
          
          alert(`✅ Contract created successfully!`);
          
        } catch (fallbackError: any) {
          console.warn('⚠️ Fallback also failed:', fallbackError.message);
          
          setNotifications(prev => [{
            id: prev.length + 1,
            message: `🟡 DEMO: Contract request ready for ${selectedProduct?.name || 'product'}`,
            type: 'info',
            time: 'Just now'
          }, ...prev]);
          
          alert(`🟡 DEMO MODE: Contract request would be sent!\n\nProduct: ${selectedProduct?.name}\nQuantity: ${quantity} kg\nPrice: ₹${price}/kg`);
        }
      }

      setShowContractPanel(false);
      setNewContract({ farmerEmail: '', productId: '', quantity: '', price: '', deliveryDate: '', crop: '', notes: '' });
      
      setTimeout(() => fetchDashboardData(), 1000);

    } catch (error: any) {
      console.error('❌ Error creating contract:', error);
      alert(`Failed to create contract: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSendingContract(false);
    }
  };

  const handleCancelContract = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this contract?')) {
      try {
        await api.contracts.cancelContract(id);
        await fetchContracts();
        
        setNotifications(prev => [{
          id: prev.length + 1,
          message: 'Contract cancelled successfully',
          type: 'success',
          time: 'Just now'
        }, ...prev]);
      } catch (error: any) {
        console.error('Error cancelling contract:', error);
        alert(`Failed to cancel contract: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNegotiationStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'COUNTERED': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format time for notifications
  const formatTime = (dateString: string) => {
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
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingDashboard')}</p>
          {buyerEmail && (
            <p className="text-sm text-gray-500 mt-2">{t('loadingDataFor')} {buyerEmail}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">{t('dashboard')}</h1>
            <p className="text-sm text-gray-600">
              {t('welcome')}{currentUser?.name ? `, ${currentUser.name}` : ''}!
              {currentUser?.email && (
                <span className="text-xs text-gray-500 block mt-1">
                  Buyer ID: {currentUser.email}
                  {currentUser?.userId && ` • User ID: ${currentUser.userId}`}
                  {contracts.length > 0 && ` • ${contracts.length} contracts`}
                  {pendingPayments > 0 && ` • ${pendingPayments} pending payments`}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
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
              {connectionStatus === 'connected' ? t('connected') : 
               connectionStatus === 'disconnected' ? t('offline') : t('checking')}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : t('refresh')}
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
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Connection Status Banner */}
      {connectionStatus === 'disconnected' && (
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="text-yellow-600 w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">{t('workingOffline')}</p>
              <p className="text-yellow-600 text-sm">
                {t('backendFailed')} {API_BASE_URL}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 w-5 h-5 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">{error}</p>
              <p className="text-red-600 text-sm mt-1">
                Try refreshing or check if you're logged in as a buyer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: t('overview'), icon: BarChart3 },
              { id: 'products', label: t('products'), icon: Package },
              { id: 'contracts', label: t('contracts'), icon: FileText },
              { id: 'payments', label: t('payments'), icon: DollarSign },
              { id: 'negotiations', label: t('negotiations'), icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              const count = tab.id === 'contracts' ? contracts.length : 
                          tab.id === 'negotiations' ? pendingNegotiations :
                          tab.id === 'payments' ? pendingPayments : 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {count > 0 && (
                    <span className={`${tab.id === 'payments' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                      {count}
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
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('activeContracts')}</p>
                    <h3 className="text-3xl font-bold text-blue-700">{activeContracts}</h3>
                  </div>
                  <FileText className="text-blue-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('availableProducts')}</p>
                    <h3 className="text-3xl font-bold text-green-700">{availableProducts}</h3>
                  </div>
                  <Package className="text-green-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('pendingPayments')}</p>
                    <h3 className="text-3xl font-bold text-yellow-700">{pendingPayments}</h3>
                  </div>
                  <DollarSign className="text-yellow-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('totalSpent')}</p>
                    <h3 className="text-3xl font-bold text-purple-700">{formatPrice(totalSpent)}</h3>
                  </div>
                  <ShoppingCart className="text-purple-500" size={40} />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Contracts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('quickActions')}</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="text-blue-600" size={20} />
                      <span className="text-sm font-medium">{t('findProducts')}</span>
                    </div>
                    <ChevronRight className="text-blue-600" size={20} />
                  </button>

                  <button
                    onClick={() => setActiveTab('contracts')}
                    className="flex items-center justify-between w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-green-600" size={20} />
                      <span className="text-sm font-medium">{t('manageContracts')}</span>
                    </div>
                    <ChevronRight className="text-green-600" size={20} />
                  </button>

                  <button
                    onClick={() => setActiveTab('payments')}
                    className="flex items-center justify-between w-full p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <DollarSign className="text-yellow-600" size={20} />
                      <span className="text-sm font-medium">{t('makePayment')}</span>
                    </div>
                    <ChevronRight className="text-yellow-600" size={20} />
                  </button>

                  <button
                    onClick={() => setActiveTab('negotiations')}
                    className="flex items-center justify-between w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="text-purple-600" size={20} />
                      <span className="text-sm font-medium">{t('startNegotiating')}</span>
                    </div>
                    <ChevronRight className="text-purple-600" size={20} />
                  </button>
                </div>
              </div>

              {/* Recent Contracts */}
              <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">{t('recentContracts')}</h3>
                  <button
                    onClick={() => setActiveTab('contracts')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t('viewAll')} →
                  </button>
                </div>

                {contracts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500 text-sm border-b">
                          <th className="pb-3">{t('contractId')}</th>
                          <th className="pb-3">{t('farmer')}</th>
                          <th className="pb-3">{t('product')}</th>
                          <th className="pb-3">{t('quantity')}</th>
                          <th className="pb-3">{t('status')}</th>
                          <th className="pb-3">{t('payment')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.slice(0, 5).map(contract => {
                          const contractPayment = payments.find(p => p.contract.contractId === contract.contractId);
                          return (
                            <tr key={contract.contractId} className="border-b hover:bg-gray-50">
                              <td className="py-3 font-medium">#{contract.contractId}</td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <User className="text-gray-400" size={16} />
                                  <span>{contract.farmer?.name || t('notSpecified')}</span>
                                </div>
                              </td>
                              <td className="py-3">{contract.product?.name || 'Product'}</td>
                              <td className="py-3">{contract.quantity} kg</td>
                              <td className="py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                                  {contract.status}
                                </span>
                              </td>
                              <td className="py-3">
                                {contractPayment ? (
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(contractPayment.status)}`}>
                                    {contractPayment.status === 'COMPLETED' ? 'Paid' : contractPayment.status}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleCreatePaymentForContract(contract)}
                                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                  >
                                    {t('createPayment')}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="text-gray-300 w-12 h-12 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-600 mb-2">{t('noContracts')}</h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Browse products to create your first contract.
                    </p>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <ShoppingBag size={18} />
                      {t('browseProducts')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Notifications
                  {notifications.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </h3>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {t('clearAll')}
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        notification.type === 'success'
                          ? 'bg-green-50 border-green-400'
                          : notification.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-blue-50 border-blue-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-gray-800">{notification.message}</p>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="text-gray-300 w-12 h-12 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600">{t('noNotifications')}</h4>
                  <p className="text-gray-500 text-sm mt-2">
                    New messages will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('browseProductsTitle')}</h2>
              <p className="text-gray-600">{t('findProductsDesc')}</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">{t('allCategories')}</option>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    <X size={18} />
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Mode Banner */}
            {connectionStatus === 'disconnected' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">{t('demoMode')}</p>
                    <p className="text-yellow-600 text-sm mt-1">{t('demoDesc')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.productId} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{product.name || 'Product'}</h3>
                          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          #{product.productId}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">{t('farmerLabel')}</span>
                          <div className="flex items-center gap-2">
                            <User className="text-gray-400" size={16} />
                            <span className="font-medium">{product.farmer?.name || 'Unknown'}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">{t('availableQuantity')}</span>
                          <span className="font-semibold">{product.quantity || 0} kg</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">{t('pricePerKg')}</span>
                          <span className="text-xl font-bold text-green-600">{formatPrice(product.price)}/kg</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRequestContract(product)}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                          <FileText size={18} />
                          {t('requestContract')}
                        </button>
                        <button
                          onClick={() => handlePriceNegotiation(product)}
                          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
                        >
                          <MessageSquare size={18} />
                          {t('negotiatePrice')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Package className="text-gray-300 w-16 h-16 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">{t('noProductsFound')}</h3>
                <p className="text-gray-500 mb-6">{t('noProductsDesc')}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    {t('clearFilters')}
                  </button>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* How it works */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">{t('howItWorks')}</h3>
              <ul className="space-y-3">
                {getListItems('howItWorksItems').map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('contractManagement')}</h2>
              <p className="text-gray-600">{t('viewManageContracts')}</p>
            </div>

            {contracts.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('contractId')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('farmer')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('product')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('quantity')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('price')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('deliveryDate')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('status')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {contracts.map(contract => {
                        const contractPayment = payments.find(p => p.contract.contractId === contract.contractId);
                        return (
                          <tr key={contract.contractId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-medium">#{contract.contractId}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <User className="text-gray-400" size={16} />
                                <div>
                                  <p className="font-medium">{contract.farmer?.name || t('notSpecified')}</p>
                                  <p className="text-sm text-gray-500">{contract.farmer?.email || ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="font-medium">{contract.product?.name || 'Product'}</p>
                              <p className="text-sm text-gray-500">{contract.product?.category || ''}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-medium">{contract.quantity} kg</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-bold text-green-600">{formatPrice(contract.price)}</span>
                              <p className="text-xs text-gray-500">Total: {formatPrice(contract.price * contract.quantity)}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-medium">{formatDate(contract.endDate)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                                  {contract.status}
                                </span>
                                {contractPayment && (
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(contractPayment.status)}`}>
                                    {contractPayment.status === 'COMPLETED' ? 'Paid' : contractPayment.status}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    alert(`Contract Details:\n\nID: ${contract.contractId}\nFarmer: ${contract.farmer?.name}\nProduct: ${contract.product?.name}\nQuantity: ${contract.quantity} kg\nPrice: ${formatPrice(contract.price)}/kg\nTotal: ${formatPrice(contract.price * contract.quantity)}\nStatus: ${contract.status}\nDelivery: ${formatDate(contract.endDate)}`);
                                  }}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                >
                                  <Eye size={16} />
                                  Details
                                </button>
                                {contractPayment && contractPayment.status === 'PENDING' && (
                                  <button
                                    onClick={() => handleMakePayment(contractPayment)}
                                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                  >
                                    <CreditCard size={14} />
                                    {t('payNow')}
                                  </button>
                                )}
                                {!contractPayment && (contract.status === 'ACTIVE' || contract.status === 'COMPLETED') && (
                                  <button
                                    onClick={() => handleCreatePaymentForContract(contract)}
                                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                  >
                                    <DollarSign size={14} />
                                    {t('createPayment')}
                                  </button>
                                )}
                                {(contract.status === 'PENDING' || contract.status === 'ACTIVE') && (
                                  <button
                                    onClick={() => handleCancelContract(contract.contractId)}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                  >
                                    <X size={16} />
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FileText className="text-gray-300 w-16 h-16 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">{t('noContractsYet')}</h3>
                <p className="text-gray-500 mb-6">{t('startByBrowsing')}</p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <ShoppingBag size={18} />
                  {t('browseProducts')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Payments Tab - Updated with working payment options */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('paymentTracking')}</h2>
              <p className="text-gray-600">{t('pendingPaymentsTitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Payments */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('pendingPaymentsTitle')}</h3>
                {payments.filter(p => p.status === 'PENDING').length > 0 ? (
                  <div className="space-y-4">
                    {payments
                      .filter(p => p.status === 'PENDING')
                      .map(payment => (
                        <div key={payment.paymentId} className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{t('payment')} #{payment.paymentId}</p>
                              <p className="text-sm text-gray-600">
                                Contract: #{payment.contract?.contractId} - {payment.contract?.crop}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              {t('due')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <span className="text-xl font-bold text-yellow-700">{formatPrice(payment.amount)}</span>
                              {payment.description && (
                                <p className="text-xs text-gray-500 mt-1">{payment.description}</p>
                              )}
                            </div>
                            <button 
                              onClick={() => handleMakePayment(payment)}
                              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                              <CreditCard size={18} />
                              {t('payNow')}
                            </button>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Contract: {payment.contract?.quantity} kg @ {formatPrice(payment.contract?.price)}/kg
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="text-gray-300 w-12 h-12 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-600">{t('noPendingPayments')}</h4>
                    <p className="text-sm text-gray-500 mt-2">
                      All payments are completed.
                    </p>
                  </div>
                )}
              </div>

              {/* Completed Payments */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('completedPayments')}</h3>
                {payments.filter(p => p.status === 'COMPLETED').length > 0 ? (
                  <div className="space-y-4">
                    {payments
                      .filter(p => p.status === 'COMPLETED')
                      .slice(0, 5)
                      .map(payment => (
                        <div key={payment.paymentId} className="p-4 border border-green-200 rounded-lg bg-green-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{t('payment')} #{payment.paymentId}</p>
                              <p className="text-sm text-gray-600">
                                Contract: #{payment.contract?.contractId} - {payment.contract?.crop}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {t('paid')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-green-700">{formatPrice(payment.amount)}</span>
                            <div className="flex gap-2">
                              {payment.razorpayPaymentId && (
                                <span className="text-xs text-gray-500">TX: {payment.razorpayPaymentId.slice(-8)}</span>
                              )}
                              <button
                                onClick={() => handlePrintReceipt(payment)}
                                className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                                title={t('printReceipt')}
                              >
                                <Printer size={16} />
                              </button>
                              <button
                                onClick={() => handleDownloadReceipt(payment)}
                                className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                                title={t('downloadReceipt')}
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {t('paymentDate')}: {formatDate(payment.paymentDate)}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="text-gray-300 w-12 h-12 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-600">{t('noCompletedPayments')}</h4>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            {payments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('totalAmount')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">{t('totalSpent')}</p>
                    <p className="text-2xl font-bold text-purple-600">{formatPrice(totalSpent)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">{t('pendingPaymentsTitle')}</p>
                    <p className="text-2xl font-bold text-yellow-600">{formatPrice(payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0))}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">{t('completedPayments')}</p>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(totalSpent)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Payment Contracts</p>
                    <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Negotiations Tab */}
        {activeTab === 'negotiations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('negotiationsTitle')}</h2>
              <p className="text-gray-600">{t('negotiationsDesc')}</p>
            </div>

            {negotiations.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('negotiationId')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('product')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('yourPrice')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('farmerPrice')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('lastUpdated')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('status')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {negotiations.map(negotiation => (
                        <tr key={negotiation.negotiationId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium">#{negotiation.negotiationId}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium">{negotiation.product?.name || 'Product'}</p>
                              <p className="text-sm text-gray-500">
                                Farmer: {negotiation.farmer?.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-blue-600">₹{negotiation.buyerPrice}/kg</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-green-600">
                              {negotiation.farmerPrice ? `₹${negotiation.farmerPrice}/kg` : '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">{formatTime(negotiation.updatedAt)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getNegotiationStatusColor(negotiation.status)}`}>
                              {negotiation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {negotiation.status === 'PENDING' && negotiation.lastUpdatedBy === 'FARMER' && (
                                <>
                                  <button
                                    onClick={() => handleAcceptNegotiation(negotiation)}
                                    disabled={processingNegotiationId === negotiation.negotiationId}
                                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
                                  >
                                    <Check size={14} />
                                    {processingNegotiationId === negotiation.negotiationId ? t('processing') : t('accept')}
                                  </button>
                                  <button
                                    onClick={() => handleRejectNegotiation(negotiation)}
                                    disabled={processingNegotiationId === negotiation.negotiationId}
                                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50"
                                  >
                                    <X size={14} />
                                    {processingNegotiationId === negotiation.negotiationId ? t('processing') : t('reject')}
                                  </button>
                                </>
                              )}
                              {negotiation.status === 'COUNTERED' && (
                                <button
                                  onClick={() => handleCounterOffer(negotiation)}
                                  className="flex items-center gap-1 bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
                                >
                                  <MessageCircle size={14} />
                                  {t('counter')}
                                </button>
                              )}
                              {negotiation.status === 'ACCEPTED' && (
                                <span className="text-green-600 font-medium">{t('accepted')}</span>
                              )}
                              {negotiation.status === 'REJECTED' && (
                                <span className="text-red-600 font-medium">{t('rejected')}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <MessageSquare className="text-gray-300 w-16 h-16 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">{t('noNegotiations')}</h3>
                <p className="text-gray-500 mb-6">{t('startNegotiations')}</p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <MessageSquare size={18} />
                  {t('startNegotiating')}
                </button>
              </div>
            )}

            {/* Negotiation Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">{t('negotiationTips')}</h3>
              <ul className="space-y-3">
                {getListItems('negotiationTipItems').map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Info className="text-blue-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Payment Modal with Razorpay */}
        {showPaymentModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{t('confirmPayment')}</h3>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPayment(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{t('contract')}</p>
                    <p className="font-semibold">#{selectedPayment.contract?.contractId} - {selectedPayment.contract?.crop}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{t('paymentAmount')}</p>
                    <p className="text-3xl font-bold text-green-600">{formatPrice(selectedPayment.amount)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{t('farmer')}</p>
                    <p className="font-semibold">{selectedPayment.contract?.farmer?.name || 'Farmer'}</p>
                    <p className="text-sm text-gray-500">{selectedPayment.contract?.farmer?.email}</p>
                  </div>

                  {selectedPayment.description && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">{t('paymentDetails')}</p>
                      <p className="text-sm">{selectedPayment.description}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPayment(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={isProcessingPayment}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <RefreshCw className="animate-spin w-4 h-4" />
                        {t('paymentProcessing')}
                      </>
                    ) : (
                      <>
                        <Wallet size={18} />
                        {t('payNow')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Payment Modal */}
        {showCreatePaymentModal && selectedContractForPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{t('createPayment')}</h3>
                  <button
                    onClick={() => {
                      setShowCreatePaymentModal(false);
                      setSelectedContractForPayment(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{t('contract')}</p>
                    <p className="font-semibold">#{selectedContractForPayment.contractId} - {selectedContractForPayment.crop}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{t('totalAmount')}</p>
                    <p className="text-3xl font-bold text-green-600">{formatPrice(selectedContractForPayment.price * selectedContractForPayment.quantity)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{t('farmer')}</p>
                    <p className="font-semibold">{selectedContractForPayment.farmer?.name || 'Farmer'}</p>
                    <p className="text-sm text-gray-500">{selectedContractForPayment.farmer?.email}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{t('product')}</p>
                    <p className="font-semibold">{selectedContractForPayment.product?.name || 'Product'}</p>
                    <p className="text-sm text-gray-500">{selectedContractForPayment.quantity} kg @ {formatPrice(selectedContractForPayment.price)}/kg</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowCreatePaymentModal(false);
                      setSelectedContractForPayment(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleConfirmCreatePayment}
                    disabled={creatingPayment}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {creatingPayment ? (
                      <>
                        <RefreshCw className="animate-spin w-4 h-4" />
                        {t('processing')}
                      </>
                    ) : (
                      <>
                        <DollarSign size={18} />
                        {t('createPayment')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contract Request Panel */}
        {showContractPanel && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{t('requestContractTitle')}</h3>
                  <button
                    onClick={() => setShowContractPanel(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">{t('productDetails')}</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{selectedProduct.name || 'Product'}</p>
                        <p className="text-gray-600">{selectedProduct.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">{t('availableQuantity')}</p>
                        <p className="font-bold">{selectedProduct.quantity} kg</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('farmerEmail')}
                    </label>
                    <input
                      type="email"
                      value={newContract.farmerEmail}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('buyerEmail')}
                    </label>
                    <input
                      type="email"
                      value={buyerEmail || currentUser?.email || ''}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('productId')}
                    </label>
                    <input
                      type="text"
                      value={newContract.productId}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('quantityKg')}
                    </label>
                    <input
                      type="number"
                      value={newContract.quantity}
                      onChange={(e) => setNewContract({...newContract, quantity: e.target.value})}
                      placeholder={t('enterQuantity')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pricePerKgRupees')}
                    </label>
                    <input
                      type="number"
                      value={newContract.price}
                      onChange={(e) => setNewContract({...newContract, price: e.target.value})}
                      placeholder={t('enterPrice')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t('originalPrice')} {formatPrice(selectedProduct.price)}/kg
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{t('totalPrice')}</span>
                      <span className="text-2xl font-bold text-green-600">
                        {newContract.quantity && newContract.price 
                          ? formatPrice(parseFloat(newContract.quantity) * parseFloat(newContract.price))
                          : '₹0'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('deliveryDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={newContract.deliveryDate}
                      onChange={(e) => setNewContract({...newContract, deliveryDate: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('cropType')}
                    </label>
                    <input
                      type="text"
                      value={newContract.crop}
                      onChange={(e) => setNewContract({...newContract, crop: e.target.value})}
                      placeholder={t('cropPlaceholder')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('notesForFarmer')}
                  </label>
                  <textarea
                    value={newContract.notes}
                    onChange={(e) => setNewContract({...newContract, notes: e.target.value})}
                    placeholder={t('notesPlaceholder')}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">{t('howContractWorks')}</h4>
                  <ul className="space-y-2">
                    {getListItems('contractWorkItems').map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowContractPanel(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleAddContract}
                    disabled={isSendingContract}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isSendingContract ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="animate-spin w-4 h-4" />
                        {t('sendingRequest')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FileText size={18} />
                        {t('sendContractRequest')}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Price Negotiation Modal */}
        {showNegotiation && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{t('priceNegotiation')}</h3>
                  <button
                    onClick={() => setShowNegotiation(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">
                    {t('proposeNewPrice')} {selectedProduct.farmer?.name || t('theFarmer')}
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{selectedProduct.name || 'Product'}</p>
                        <p className="text-gray-600">{selectedProduct.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">{t('currentPrice')}</p>
                        <p className="font-bold text-green-600">{formatPrice(selectedProduct.price)}/kg</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-4">{t('yourInformation')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">{t('buyerName')}</p>
                      <p className="font-medium">{currentUser?.name || t('notSpecified')}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">{t('buyerId')}</p>
                      <p className="font-medium">{currentUser?.userId || currentUser?.id || t('notFound')}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">{t('userRole')}</p>
                      <p className="font-medium">{currentUser?.role || t('notSpecified')}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('yourProposedPrice')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={negotiationPrice}
                      onChange={(e) => setNegotiationPrice(e.target.value)}
                      placeholder={t('enterProposedPrice')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('messageToFarmerLabel')}
                  </label>
                  <textarea
                    value={negotiationMessage}
                    onChange={(e) => setNegotiationMessage(e.target.value)}
                    placeholder={t('negotiationMessagePlaceholder')}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">{t('negotiationTipsLabel')}</h4>
                  <ul className="space-y-2">
                    {getListItems('tips').map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Info className="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowNegotiation(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleSubmitNegotiation}
                    disabled={isSendingNegotiation}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isSendingNegotiation ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="animate-spin w-4 h-4" />
                        {t('sending')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <MessageSquare size={18} />
                        {t('send')} {t('negotiatePrice')}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Counter Offer Modal */}
        {showCounterOffer && selectedNegotiation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{t('counterOfferModal')}</h3>
                  <button
                    onClick={() => setShowCounterOffer(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">{t('counterOfferDesc')}</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{selectedNegotiation.product?.name || 'Product'}</p>
                        <p className="text-gray-600">
                          Farmer: {selectedNegotiation.farmer?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Farmer's offer</p>
                        <p className="font-bold text-yellow-600">₹{selectedNegotiation.farmerPrice}/kg</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('yourCounterPrice')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      placeholder={t('enterCounterPrice')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('messageToFarmer')}
                  </label>
                  <textarea
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                    placeholder={t('counterMessagePlaceholder')}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">{t('negotiationTips')}</h4>
                  <ul className="space-y-2">
                    {getListItems('tips').map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Info className="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCounterOffer(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleSubmitCounterOffer}
                    disabled={isSendingCounter}
                    className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
                  >
                    {isSendingCounter ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="animate-spin w-4 h-4" />
                        {t('sending')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <MessageCircle size={18} />
                        {t('sendCounterOffer')}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t('buyerDashboard')}</h3>
              <p className="text-gray-400">
                {t('connectWithFarmers')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contracts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Payments</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('support')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>{t('lastRefresh')} {new Date().toLocaleTimeString()} • {t('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuyerDashboard;