// pages/ContractManagementPage.tsx - COMPLETE FIXED VERSION (English Only)

import React, { useState, useEffect, useContext } from 'react';
import { 
  Search, Filter, Plus, Download, MoreVertical, 
  Eye, Edit, Trash2, CheckCircle, XCircle, 
  AlertCircle, Calendar, DollarSign, Package,
  RefreshCw, ChevronDown, ChevronUp, User, Clock,
  FileText, MessageSquare, ArrowUpDown, Globe,
  Sprout  // Added for crop icon
} from 'lucide-react';
import { AuthContext } from '../App';
import api from '../api';

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

interface CreateContractData {
  farmerEmail: string;
  buyerEmail: string;
  productId: number;
  quantity: number;
  price: number;
  deliveryDate: string;
  crop: string;
}

interface UpdateContractData {
  quantity?: number;
  price?: number;
  endDate?: string;
  status?: string;
}

// Define user role type
type UserRole = 'FARMER' | 'BUYER' | 'ADMIN' | null;

const ContractManagementPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const userRole = authContext?.userRole as UserRole;
  const logout = authContext?.logout || (() => {});
  
  // State Management
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [cropFilter, setCropFilter] = useState<string>('All');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  
  // Selected Contract
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Form States
  const [newContract, setNewContract] = useState<CreateContractData>({
    farmerEmail: '',
    buyerEmail: '',
    productId: 0,
    quantity: 0,
    price: 0,
    deliveryDate: '',
    crop: ''
  });
  
  const [editContract, setEditContract] = useState<UpdateContractData>({
    quantity: 0,
    price: 0,
    endDate: '',
    status: ''
  });
  
  // Available products for dropdown
  const [products, setProducts] = useState<Product[]>([]);
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);
  
  // User email
  const [userEmail, setUserEmail] = useState<string>('');
  
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
  
  // Extract user email from localStorage
  useEffect(() => {
    const extractUserEmail = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.email) {
            return payload.email;
          }
        } catch (e) {
          console.log('Could not extract email from token');
        }
      }
      
      // Check localStorage for email
      const userDataStr = localStorage.getItem('currentUser');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          if (userData.email) {
            return userData.email;
          }
        } catch (parseError) {
          console.error('Error parsing userData:', parseError);
        }
      }
      
      const emailSources = ['farmerEmail', 'loginEmail', 'userEmail', 'email'];
      for (const source of emailSources) {
        const value = localStorage.getItem(source);
        if (value && value.includes('@')) {
          return value;
        }
      }
      
      return '';
    };
    
    const email = extractUserEmail();
    setUserEmail(email);
    console.log('📧 User email extracted:', email);
    
    if (email) {
      fetchData();
    } else {
      setLoading(false);
      setError('No user email found. Please login again.');
    }
  }, []);
  
  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test connection first
      await testBackendConnection();
      
      // Fetch contracts
      await fetchContracts();
      
      // Fetch products for dropdown
      await fetchProducts();
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ FIXED: Fetch contracts with proper crop names
  const fetchContracts = async () => {
    try {
      let contractsData;
      
      if (userRole === 'FARMER') {
        contractsData = await api.contracts.getContractsByFarmer(userEmail);
      } else if (userRole === 'BUYER') {
        contractsData = await api.contracts.getContractsByBuyer(userEmail);
      } else {
        contractsData = await api.contracts.getAllContracts();
      }
      
      if (Array.isArray(contractsData)) {
        // ✅ FIX: Process contracts to ensure proper crop names
        const processedContracts = contractsData.map((contract: any) => {
          let cropName = contract.crop;
          
          // If crop is "General" or empty, try to get from product
          if (!cropName || cropName === 'General' || cropName === 'general') {
            if (contract.product) {
              if (contract.product.category && contract.product.category !== 'General' && contract.product.category !== 'general') {
                cropName = contract.product.category;
              } else if (contract.product.name) {
                cropName = contract.product.name;
              } else {
                cropName = 'Crop';
              }
            } else {
              cropName = 'Crop';
            }
          }
          
          return {
            ...contract,
            crop: cropName
          };
        });
        
        setContracts(processedContracts);
        setFilteredContracts(processedContracts);
        
        // Extract unique crops (excluding "General" and "Crop")
        const crops = Array.from(
          new Set(
            processedContracts
              .map((contract: Contract) => contract.crop)
              .filter((crop: string) => 
                crop && 
                crop !== 'General' && 
                crop !== 'general' && 
                crop !== 'Crop'
              )
          )
        ).filter(Boolean);
        
        setAvailableCrops(crops as string[]);
      } else {
        setContracts([]);
        setFilteredContracts([]);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setContracts([]);
      setFilteredContracts([]);
    }
  };
  
  const fetchProducts = async () => {
    try {
      const productsData = await api.products.getAllProducts();
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };
  
  // Apply filters
  useEffect(() => {
    let filtered = contracts;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contract =>
        contract.crop.toLowerCase().includes(query) ||
        contract.contractId.toString().includes(query) ||
        contract.buyer?.email?.toLowerCase().includes(query) ||
        contract.buyer?.name?.toLowerCase().includes(query) ||
        contract.farmer?.email?.toLowerCase().includes(query) ||
        contract.farmer?.name?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }
    
    // Apply crop filter
    if (cropFilter !== 'All') {
      filtered = filtered.filter(contract => contract.crop === cropFilter);
    }
    
    setFilteredContracts(filtered);
  }, [contracts, searchQuery, statusFilter, cropFilter]);
  
  // ✅ FIXED: Handle Create Contract - Backend will set crop from product
  const handleCreateContract = async () => {
    // Validate form
    if (!newContract.buyerEmail || !newContract.productId || !newContract.quantity || 
        !newContract.price || !newContract.deliveryDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Get selected product
    const selectedProduct = products.find(p => p.productId === newContract.productId);
    if (!selectedProduct) {
      alert('Selected product not found');
      return;
    }
    
    // ✅ FIX: Send empty crop or actual crop name (backend will handle it)
    const contractData = {
      farmerEmail: userEmail,
      buyerEmail: newContract.buyerEmail,
      productId: newContract.productId,
      quantity: newContract.quantity,
      price: newContract.price,
      deliveryDate: newContract.deliveryDate,
      terms: newContract.crop || ''  // Send crop name or empty string
    };
    
    console.log('📤 Creating contract, backend will set crop from product');
    
    try {
      const createdContract = await api.contracts.createContract(contractData);
      console.log('✅ Contract created:', createdContract);
      
      // Refresh contracts
      await fetchContracts();
      
      // Reset form and close modal
      setNewContract({
        farmerEmail: '',
        buyerEmail: '',
        productId: 0,
        quantity: 0,
        price: 0,
        deliveryDate: '',
        crop: ''
      });
      setShowCreateModal(false);
      
      // Show success message
      alert('Contract created successfully');
      
    } catch (error: any) {
      console.error('❌ Error creating contract:', error);
      alert(`Failed to create contract: ${error.message}`);
    }
  };
  
  // Handle Edit Contract
  const handleEditContract = async () => {
    if (!selectedContract) return;
    
    try {
      // FIX: Using activateContract for ACCEPT and cancelContract for REJECT
      if (editContract.status === 'ACTIVE') {
        await api.contracts.activateContract(selectedContract.contractId);
      } else if (editContract.status === 'CANCELLED') {
        await api.contracts.cancelContract(selectedContract.contractId);
      } else {
        // For other updates, create a new contract with updated data
        await api.contracts.createContractByEmail({
          productId: selectedContract.product.productId,
          buyerEmail: selectedContract.buyer?.email || '',
          farmerEmail: selectedContract.farmer?.email || userEmail,
          quantity: editContract.quantity || selectedContract.quantity,
          price: editContract.price || selectedContract.price,
          endDate: editContract.endDate || selectedContract.endDate,
          crop: selectedContract.crop  // Keep the existing crop
        });
      }
      
      console.log('✅ Contract updated');
      
      // Refresh contracts
      await fetchContracts();
      
      // Reset and close modal
      setShowEditModal(false);
      setSelectedContract(null);
      
      // Show success message
      alert('Contract updated successfully');
      
    } catch (error: any) {
      console.error('❌ Error updating contract:', error);
      alert(`Failed to update contract: ${error.message}`);
    }
  };
  
  // ✅ FIXED: Handle Delete Contract - Actually deletes instead of cancels
  const handleDeleteContract = async () => {
    if (!selectedContract) return;
    
    try {
      // Use the delete endpoint
      await api.contracts.deleteContract(selectedContract.contractId);
      console.log('✅ Contract deleted');
      
      // Refresh contracts
      await fetchContracts();
      
      // Reset and close modal
      setShowDeleteModal(false);
      setSelectedContract(null);
      
      // Show success message
      alert('Contract deleted successfully');
      
    } catch (error: any) {
      console.error('❌ Error deleting contract:', error);
      alert(`Failed to delete contract: ${error.message}`);
    }
  };
  
  // Handle Accept Contract (for PENDING contracts)
  const handleAcceptContract = async (contractId: number) => {
    try {
      await api.contracts.activateContract(contractId);
      console.log('✅ Contract accepted');
      
      // Refresh contracts
      await fetchContracts();
      
      alert('Contract accepted successfully');
      
    } catch (error: any) {
      console.error('❌ Error accepting contract:', error);
      alert(`Failed to accept contract: ${error.message}`);
    }
  };
  
  // Handle Reject Contract (for PENDING contracts)
  const handleRejectContract = async (contractId: number) => {
    try {
      await api.contracts.cancelContract(contractId);
      console.log('✅ Contract rejected');
      
      // Refresh contracts
      await fetchContracts();
      
      alert('Contract rejected successfully');
      
    } catch (error: any) {
      console.error('❌ Error rejecting contract:', error);
      alert(`Failed to reject contract: ${error.message}`);
    }
  };
  
  // Handle Mark as Completed
  const handleMarkAsCompleted = async (contractId: number) => {
    try {
      await api.contracts.completeContract(contractId);
      console.log('✅ Contract marked as completed');
      
      // Refresh contracts
      await fetchContracts();
      
      alert('Contract marked as completed');
      
    } catch (error: any) {
      console.error('❌ Error updating contract status:', error);
      alert(`Failed to update contract: ${error.message}`);
    }
  };
  
  // Handle Cancel Contract
  const handleCancelContract = async (contractId: number) => {
    if (window.confirm('Are you sure you want to cancel this contract?')) {
      try {
        await api.contracts.cancelContract(contractId);
        console.log('✅ Contract cancelled');
        
        // Refresh contracts
        await fetchContracts();
        
        alert('Contract cancelled');
        
      } catch (error: any) {
        console.error('❌ Error cancelling contract:', error);
        alert(`Failed to cancel contract: ${error.message}`);
      }
    }
  };
  
  // ✅ NEW: Fix existing contract crops
  const handleFixCrops = async () => {
    if (window.confirm('Fix all contract crops that show "General"? This will update the database.')) {
      try {
        // Use the new API method
        await api.contracts.fixContractCrops();
        console.log('✅ Contract crops fixed');
        
        // Refresh contracts
        await fetchContracts();
        
        alert('Crops fixed successfully');
        
      } catch (error: any) {
        console.error('❌ Error fixing crops:', error);
        alert(`Failed to fix crops: ${error.message}`);
      }
    }
  };
  
  // ✅ NEW: Debug crops - check raw data
  const handleDebugCrops = async () => {
    try {
      const contractsData = await api.contracts.getAllContracts();
      console.log('🔍 ALL CONTRACTS RAW DATA:', contractsData);
      
      if (Array.isArray(contractsData)) {
        contractsData.forEach((c: any, i: number) => {
          console.log(`Contract #${c.contractId}:`, {
            id: c.contractId,
            crop: c.crop,
            productId: c.productId,
            product: c.product,
            productCategory: c.product?.category,
            productName: c.product?.name
          });
        });
        alert(`Check console for ${contractsData.length} contracts crop data`);
      }
    } catch (error: any) {
      console.error('❌ Error debugging crops:', error);
      alert(`Debug failed: ${error.message}`);
    }
  };
  
  // Format date
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
  
  // Format price
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate stats
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => c.status === 'ACTIVE').length;
  const pendingContracts = contracts.filter(c => c.status === 'PENDING').length;
  const totalValue = contracts.reduce((sum, contract) => sum + (contract.price * contract.quantity), 0);
  
  // Test API function
  const testContractsAPI = async () => {
    console.log('🧪 Testing contracts API...');
    try {
      const testData = await api.contracts.getAllContracts();
      console.log('🧪 Test Result:', testData);
      alert(`Test successful! Found ${Array.isArray(testData) ? testData.length : 0} contracts`);
    } catch (error: any) {
      console.error('🧪 Test Failed:', error);
      alert(`Test failed: ${error.message}`);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contracts...</p>
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
            <h1 className="text-3xl font-bold text-green-700">📄 Contract Management</h1>
            <p className="text-sm text-gray-600">
              Welcome{userRole === 'FARMER' ? ' Farmer' : userRole === 'BUYER' ? ' Buyer' : ' Admin'}!
              {userEmail && <span className="text-xs text-gray-500 block mt-1">ID: {userEmail}</span>}
            </p>
          </div>
          <div className="flex items-center gap-4">
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
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
            </div>
            
            {/* Debug Crops Button */}
            <button
              onClick={handleDebugCrops}
              className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
              title="Debug Crops"
            >
              <Sprout size={18} />
              Debug Crops
            </button>
            
            {/* Fix Crops Button */}
            <button
              onClick={handleFixCrops}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              title="Fix General crops in existing contracts"
            >
              <RefreshCw size={18} />
              Fix Crop Names
            </button>
            
            <button
              onClick={testContractsAPI}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Test API
            </button>
            
            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
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
              <p className="text-yellow-800 font-medium">Working in Offline Mode</p>
              <p className="text-yellow-600 text-sm">Check that your backend server is running</p>
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
              <button
                onClick={fetchData}
                className="mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Contracts</p>
                <h3 className="text-3xl font-bold text-blue-700">{totalContracts}</h3>
              </div>
              <FileText className="text-blue-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Contracts</p>
                <h3 className="text-3xl font-bold text-green-700">{activeContracts}</h3>
              </div>
              <CheckCircle className="text-green-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Approval</p>
                <h3 className="text-3xl font-bold text-yellow-700">{pendingContracts}</h3>
              </div>
              <Clock className="text-yellow-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Value</p>
                <h3 className="text-3xl font-bold text-purple-700">{formatPrice(totalValue)}</h3>
              </div>
              <DollarSign className="text-purple-500" size={40} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              {/* Crop Filter */}
              <div className="relative">
                <select
                  value={cropFilter}
                  onChange={(e) => setCropFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  {availableCrops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              {/* Clear Filters */}
              {(statusFilter !== 'All' || cropFilter !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter('All');
                    setCropFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Clear filters
                </button>
              )}
              
              {/* Create Contract Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={18} />
                Create New Contract
              </button>
              
              {/* Export Button */}
              <button
                onClick={() => alert('Export functionality will be added soon')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Contracts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {userRole === 'FARMER' ? 'Buyer' : 'Farmer'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContracts.map(contract => (
                  <tr key={contract.contractId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{contract.contractId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {/* ✅ FIXED: Show actual crop name with icon */}
                      <div className="flex items-center gap-2">
                        <Sprout className="text-green-600" size={16} />
                        <span>
                          {contract.crop === 'General' || contract.crop === 'general' 
                            ? (contract.product?.category || contract.product?.name || 'Crop')
                            : contract.crop}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {userRole === 'FARMER' 
                        ? contract.buyer?.name || contract.buyer?.email || 'Unknown Buyer'
                        : contract.farmer?.name || contract.farmer?.email || 'Unknown Farmer'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contract.quantity} kg</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(contract.price)}/kg</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(contract.endDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {/* Show Accept/Reject buttons for PENDING contracts (for farmers only) */}
                        {contract.status === 'PENDING' && userRole === 'FARMER' && (
                          <>
                            <button
                              onClick={() => handleAcceptContract(contract.contractId)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Accept Contract"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleRejectContract(contract.contractId)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Reject Contract"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        
                        {(contract.status === 'ACTIVE' || contract.status === 'PENDING') && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedContract(contract);
                                setEditContract({
                                  quantity: contract.quantity,
                                  price: contract.price,
                                  endDate: contract.endDate,
                                  status: contract.status
                                });
                                setShowEditModal(true);
                              }}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedContract(contract);
                                setShowNegotiationModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-800 p-1"
                              title="Negotiations"
                            >
                              <MessageSquare size={18} />
                            </button>
                            
                            {contract.status === 'ACTIVE' && (
                              <button
                                onClick={() => handleMarkAsCompleted(contract.contractId)}
                                className="text-green-700 hover:text-green-900 p-1"
                                title="Mark as Completed"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleCancelContract(contract.contractId)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Cancel Contract"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredContracts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-600">No contracts found</h3>
                <p className="text-gray-500">Create your first contract to get started</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Plus size={18} />
                  Create New Contract
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Create Contract Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Create New Contract</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {userRole === 'FARMER' ? 'Buyer Email' : 'Farmer Email'} *
                </label>
                <input
                  type="email"
                  value={newContract.buyerEmail}
                  onChange={(e) => setNewContract({...newContract, buyerEmail: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={userRole === 'FARMER' ? "buyer@example.com" : "farmer@example.com"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select a product *
                </label>
                <select
                  value={newContract.productId}
                  onChange={(e) => {
                    const productId = parseInt(e.target.value);
                    const selectedProduct = products.find(p => p.productId === productId);
                    
                    setNewContract(prev => ({
                      ...prev,
                      productId,
                      // Auto-fill crop from product category or name
                      crop: selectedProduct?.category || selectedProduct?.name || ''
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="0">Select a product</option>
                  {products.map(product => (
                    <option key={product.productId} value={product.productId}>
                      {product.name} ({product.category || 'No category'})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Name *
                </label>
                <input
                  type="text"
                  value={newContract.crop}
                  onChange={(e) => setNewContract({...newContract, crop: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Wheat, Rice, Cotton"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-filled from product. Change if needed.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    value={newContract.quantity}
                    onChange={(e) => setNewContract({...newContract, quantity: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="100"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹ per kg) *
                  </label>
                  <input
                    type="number"
                    value={newContract.price}
                    onChange={(e) => setNewContract({...newContract, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="50"
                    min="1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  value={newContract.deliveryDate}
                  onChange={(e) => setNewContract({...newContract, deliveryDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContract}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Create Contract
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Contract Modal */}
      {showEditModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Contract #{selectedContract.contractId}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    value={editContract.quantity}
                    onChange={(e) => setEditContract({...editContract, quantity: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹ per kg) *
                  </label>
                  <input
                    type="number"
                    value={editContract.price}
                    onChange={(e) => setEditContract({...editContract, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  value={editContract.endDate}
                  onChange={(e) => setEditContract({...editContract, endDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editContract.status}
                  onChange={(e) => setEditContract({...editContract, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditContract}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Update Contract
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Contract Modal */}
      {showDeleteModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Delete Contract</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Are you sure you want to delete this contract?</p>
                  <p className="text-red-600 text-sm mt-1">This action cannot be undone.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Contract ID:</span>
                <span className="font-semibold">#{selectedContract.contractId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Crop:</span>
                <span className="font-semibold">{selectedContract.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold">{selectedContract.quantity} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold">{formatPrice(selectedContract.price)}/kg</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteContract}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Contract
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Contract Details Modal */}
      {showDetailsModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Contract Details #{selectedContract.contractId}</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contract ID:</span>
                      <span className="font-semibold">#{selectedContract.contractId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crop:</span>
                      <span className="font-semibold flex items-center gap-2">
                        <Sprout className="text-green-600" size={16} />
                        {selectedContract.crop}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedContract.status)}`}>
                        {selectedContract.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Parties */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Parties</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Farmer</p>
                      <p className="font-medium">
                        {selectedContract.farmer?.name || selectedContract.farmer?.email || 'Unknown Farmer'}
                      </p>
                      {selectedContract.farmer?.email && (
                        <p className="text-sm text-gray-500">{selectedContract.farmer.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Buyer</p>
                      <p className="font-medium">
                        {selectedContract.buyer?.name || selectedContract.buyer?.email || 'Unknown Buyer'}
                      </p>
                      {selectedContract.buyer?.email && (
                        <p className="text-sm text-gray-500">{selectedContract.buyer.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Terms */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Contract Terms</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-semibold">{selectedContract.quantity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">{formatPrice(selectedContract.price)}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-semibold text-green-600">
                        {formatPrice(selectedContract.quantity * selectedContract.price)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Dates */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Dates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-semibold">{formatDate(selectedContract.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-semibold">{formatDate(selectedContract.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created Date:</span>
                      <span className="font-semibold">{formatDate(selectedContract.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            {selectedContract.product && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Product Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Product Name</p>
                    <p className="font-medium">{selectedContract.product.name || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{selectedContract.product.category || 'Not specified'}</p>
                  </div>
                  {selectedContract.product.description && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium">{selectedContract.product.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowEditModal(true);
                }}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Edit Contract
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Negotiation Modal */}
      {showNegotiationModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Negotiations - {selectedContract.crop}</h3>
              <button
                onClick={() => setShowNegotiationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(selectedContract.price)}/kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(selectedContract.quantity * selectedContract.price)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Negotiation History (Placeholder) */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Negotiation History</h4>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">Initial Offer</p>
                        <p className="text-sm text-gray-600">{formatDate(selectedContract.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{formatPrice(selectedContract.price)}/kg</p>
                        <p className="text-sm text-gray-600">by {selectedContract.farmer?.name || 'Farmer'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sample negotiation messages */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">Counter Offer</p>
                        <p className="text-sm text-gray-600">{formatDate(selectedContract.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{formatPrice(selectedContract.price * 0.9)}/kg</p>
                        <p className="text-sm text-gray-600">by {selectedContract.buyer?.name || 'Buyer'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Send Message */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Send Message</h4>
                <div className="space-y-3">
                  <textarea
                    placeholder="Type your message here..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                  ></textarea>
                  <div className="flex justify-between">
                    <button
                      onClick={() => alert('Price negotiation functionality will be added soon')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Make Counter Offer
                    </button>
                    <button
                      onClick={() => alert('Message sending functionality will be added soon')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowNegotiationModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => alert('Negotiation agreement functionality will be added soon')}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Finalize Agreement
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 FarmConnect Contract Management
            {userEmail && ` • ${userEmail}`}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="text-sm text-gray-600 hover:text-green-600 flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              onClick={() => window.open('/docs', '_blank')}
              className="text-sm text-gray-600 hover:text-green-600"
            >
              Help
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContractManagementPage;