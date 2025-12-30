// api.ts - COMPLETE UPDATED VERSION WITH FIXES
import { UserRole } from './types';

// Base API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Token storage key - consistent across the app
const TOKEN_KEY = 'token';

// Common headers with better debugging
const getHeaders = (includeJson: boolean = true) => {
  const headers: HeadersInit = {};
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  // Add authorization header if token exists
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('🔐 Current token in getHeaders:', token ? 'exists (' + token.substring(0, 20) + '...)' : 'null');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  return headers;
};

// Enhanced request handler with better error logging
const handleRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
    console.log('📦 Request headers:', options.headers);
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}: ${url}`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown error'}`);
    }
    
    // For 204 No Content responses, return void
    if (response.status === 204) {
      console.log(`✅ API Success: ${options.method || 'GET'} ${url} (204 No Content)`);
      return undefined as T;
    }
    
    const data = await response.json();
    console.log(`✅ API Success: ${options.method || 'GET'} ${url}`, data);
    return data;
  } catch (error) {
    console.error('🚨 API request failed:', error);
    throw error;
  }
};

// ===============================
// ✅ PRICE NEGOTIATION API (FIXED)
// ===============================
export const negotiationApi = {

  // ================= BUYER =================

  // Buyer sends initial offer
  createNegotiation: async (data: {
    productId: number;
    buyerId: number;
    buyerPrice: number;
  }) => {
    const params = new URLSearchParams({
      productId: data.productId.toString(),
      buyerId: data.buyerId.toString(),
      buyerPrice: data.buyerPrice.toString(),
    });

    return handleRequest(
      `${API_BASE_URL}/negotiations/create?${params.toString()}`,
      {
        method: 'POST',
        headers: getHeaders(false),
      }
    );
  },

  // Buyer views own negotiations
  getByBuyer: async (buyerEmail: string) => {
    return handleRequest(
      `${API_BASE_URL}/negotiations/buyer/${buyerEmail}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
  },

  // ================= FARMER =================

  // Farmer views received negotiations
  getByFarmer: async (farmerEmail: string) => {
    return handleRequest(
      `${API_BASE_URL}/negotiations/farmer/${farmerEmail}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
  },

  // Farmer counters with new price
  counterByFarmer: async (negotiationId: number, farmerPrice: number) => {
    return handleRequest(
      `${API_BASE_URL}/negotiations/counter/${negotiationId}?farmerPrice=${farmerPrice}`,
      {
        method: 'PUT',
        headers: getHeaders(false),
      }
    );
  },

  // Farmer accepts buyer price
  accept: async (negotiationId: number) => {
    return handleRequest(
      `${API_BASE_URL}/negotiations/accept/${negotiationId}`,
      {
        method: 'PUT',
        headers: getHeaders(false),
      }
    );
  },

  // Farmer rejects buyer price
  reject: async (negotiationId: number) => {
    return handleRequest(
      `${API_BASE_URL}/negotiations/reject/${negotiationId}`,
      {
        method: 'PUT',
        headers: getHeaders(false),
      }
    );
  },
};

// Auth API - ✅ FIXED: Login response matches backend AuthResponse
export const authApi = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    address?: string;
  }) => {
    return handleRequest(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    // ✅ FIXED: Updated to match backend AuthResponse structure
    return handleRequest<{
      token: string;
      userId: number;    // ✅ Changed from nested "user.id" to flat "userId"
      name: string;
      email: string;
      role: UserRole;
    }>(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
  },
};

// Contract API
export const contractApi = {
  getAllContracts: async () => {
    return handleRequest(`${API_BASE_URL}/contracts`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getContractById: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/contracts/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // ✅ FIXED: Send empty crop to let backend determine from product
  createContract: async (contractData: {
    farmerEmail: string;
    buyerEmail: string;
    productId: number;
    quantity: number;
    price: number;
    deliveryDate: string;
    terms?: string;
  }) => {
    // Get crop from terms or use empty (backend will get from product)
    let cropName = contractData.terms || '';
    
    // If empty or General, let backend handle it
    if (!cropName || cropName === 'General') {
      cropName = ''; // Backend will get from product
    }
    
    const newContractData = {
      productId: contractData.productId,
      buyerEmail: contractData.buyerEmail,
      farmerEmail: contractData.farmerEmail,
      quantity: contractData.quantity,
      price: contractData.price,
      startDate: new Date().toISOString().split('T')[0],
      endDate: contractData.deliveryDate,
      crop: cropName  // Send crop, backend will fix if empty
    };
    
    console.log('📤 Creating contract, crop will be set by backend from product');
    
    return handleRequest(`${API_BASE_URL}/contracts/create-by-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(newContractData),
    });
  },

  createContractByIds: async (contractData: {
    productId: number;
    buyerId: number;
    farmerId: number;
    quantity: number;
    price: number;
    startDate?: string;
    endDate?: string;
    crop?: string;
  }) => {
    return handleRequest(`${API_BASE_URL}/contracts/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contractData),
    });
  },

  createContractByEmail: async (contractData: {
    productId: number;
    buyerEmail: string;
    farmerEmail: string;
    quantity: number;
    price: number;
    startDate?: string;
    endDate?: string;
    crop?: string;
  }) => {
    // Fix: If crop is "General" or empty, send empty to let backend handle
    const fixedContractData = {
      ...contractData,
      crop: (contractData.crop && contractData.crop !== 'General') ? contractData.crop : ''
    };
    
    return handleRequest(`${API_BASE_URL}/contracts/create-by-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(fixedContractData),
    });
  },

  activateContract: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/contracts/activate/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  completeContract: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/contracts/complete/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  cancelContract: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/contracts/cancel/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  getContractsByFarmer: async (email: string) => {
    return handleRequest(`${API_BASE_URL}/contracts/farmer/${email}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getContractsByBuyer: async (email: string) => {
    return handleRequest(`${API_BASE_URL}/contracts/buyer/${email}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  deleteContract: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/contracts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // ✅ NEW: Fix existing contract crops
  fixContractCrops: async () => {
    return handleRequest(`${API_BASE_URL}/contracts/fix-crops`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },
};

// Payment API
export const paymentApi = {
  getAllPayments: async () => {
    return handleRequest(`${API_BASE_URL}/payments`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getPaymentById: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/payments/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  createPayment: async (paymentData: {
    contractId: number;
    amount: number;
    dueDate: string;
    paymentMethod?: string;
    description?: string;
  }) => {
    return handleRequest(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });
  },

  completePayment: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/payments/complete/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  cancelPayment: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/payments/cancel/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  getPaymentsByContractId: async (contractId: number) => {
    return handleRequest(`${API_BASE_URL}/payments/contract/${contractId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  deletePayment: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/payments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },
};

// Product API
export const productApi = {
  getAllProducts: async () => {
    return handleRequest(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getProductById: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  createProduct: async (productData: {
    name: string;
    description?: string;
    category: string;
    quantity: number;
    price: number;
    farmerEmail: string;
  }) => {
    const backendPayload = {
      name: productData.name,
      description: productData.description || '',
      category: productData.category,
      quantity: productData.quantity,
      price: productData.price,
      farmer: {
        email: productData.farmerEmail
      }
    };
    
    console.log('📤 Creating product with payload:', JSON.stringify(backendPayload, null, 2));
    
    return handleRequest(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(backendPayload),
    });
  },

  createProductWithFarmer: async (productData: {
    name: string;
    description?: string;
    category: string;
    quantity: number;
    price: number;
    farmerEmail: string;
  }) => {
    const url = `${API_BASE_URL}/products/with-farmer?farmerEmail=${encodeURIComponent(productData.farmerEmail)}`;
    
    const { farmerEmail, ...productWithoutEmail } = productData;
    
    console.log('📤 Creating product via /with-farmer endpoint');
    console.log('URL:', url);
    console.log('Payload:', JSON.stringify(productWithoutEmail, null, 2));
    
    return handleRequest(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productWithoutEmail),
    });
  },

  updateProduct: async (id: number, productData: {
    name?: string;
    description?: string;
    category?: string;
    quantity?: number;
    price?: number;
  }) => {
    return handleRequest(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  getProductsByFarmer: async (email: string) => {
    return handleRequest(`${API_BASE_URL}/products/farmer/${email}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  }
};

// Farmer API
export const farmerApi = {
  getAllFarmers: async () => {
    return handleRequest(`http://localhost:8080/farmers`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getFarmerById: async (id: number) => {
    return handleRequest(`http://localhost:8080/farmers/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  createFarmer: async (farmerData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    farmSize?: number;
    crops?: string[];
  }) => {
    return handleRequest(`http://localhost:8080/farmers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(farmerData),
    });
  },

  deleteFarmer: async (id: number) => {
    return handleRequest(`http://localhost:8080/farmers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },
};

// User API
export const userApi = {
  getAllUsers: async () => {
    return handleRequest(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getUserById: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getUserByEmail: async (email: string) => {
    return handleRequest(`${API_BASE_URL}/users/email/${email}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  updateUser: async (id: number, userData: {
    name?: string;
    phone?: string;
    address?: string;
  }) => {
    return handleRequest(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },
};

// CONTRACT REQUEST API - UPDATED WITH FIXES
export const contractRequestApi = {
  // Get all contract requests
  getAllRequests: async () => {
    return handleRequest(`${API_BASE_URL}/contract-requests`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // Get requests by farmer email (FARMER uses this)
  getByFarmer: async (farmerEmail: string) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/farmer/${encodeURIComponent(farmerEmail)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // Get requests by buyer email (BUYER uses this)
  getByBuyer: async (buyerEmail: string) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/buyer/${encodeURIComponent(buyerEmail)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // Get specific request by ID
  getRequestById: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // BUYER sends contract request (BuyerDashboard calls this)
  sendRequest: async (requestData: {
    productId: number;
    buyerEmail: string;
    quantity: number;
    proposedPrice: number;
    deliveryDate: string;
    message?: string;
  }) => {
    console.log('📝 BUYER sending contract request:', requestData);
    return handleRequest(`${API_BASE_URL}/contract-requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestData),
    });
  },

  // FARMER accepts contract request (FarmerDashboard calls this)
  acceptRequest: async (requestId: number) => {
    console.log('✅ FARMER accepting contract request:', requestId);
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/accept`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  // FARMER rejects contract request (FarmerDashboard calls this)
  rejectRequest: async (requestId: number) => {
    console.log('❌ FARMER rejecting contract request:', requestId);
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/reject`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  // FARMER counters the contract request
  counterRequest: async (requestId: number, counterData: {
    counterPrice: number;
    counterQuantity?: number;
    counterDeliveryDate?: string;
    message?: string;
  }) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/counter`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(counterData),
    });
  },

  // BUYER accepts farmer's counter
  acceptCounter: async (requestId: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/accept-counter`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  // BUYER rejects farmer's counter
  rejectCounter: async (requestId: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/reject-counter`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  // Create contract from accepted request
  createContractFromRequest: async (requestId: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/create-contract`, {
      method: 'POST',
      headers: getHeaders(),
    });
  },

  // Delete contract request
  deleteRequest: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },
};

// Notification API
export const notificationApi = {
  // Get all notifications for user
  getUserNotifications: async (userId: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/user/${userId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // Get unread notifications
  getUnreadNotifications: async (userId: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/user/${userId}/unread`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // Mark notification as read
  markAsRead: async (notificationId: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/user/${userId}/mark-all-read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  // Create notification
  createNotification: async (notificationData: {
    userId: number;
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'NEGOTIATION' | 'CONTRACT';
    title: string;
    message: string;
    link?: string;
  }) => {
    return handleRequest(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(notificationData),
    });
  },

  // Delete notification
  deleteNotification: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },
};

// Debug API - for testing connections
export const debugApi = {
  // Test if API server is running
  ping: async () => {
    return handleRequest(`${API_BASE_URL}/ping`, {
      method: 'GET',
      headers: getHeaders(false),
    });
  },

  // Test negotiation endpoint
  testNegotiationEndpoint: async () => {
    return handleRequest(`${API_BASE_URL}/negotiations/test`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // Test contract request endpoint
  testContractRequestEndpoint: async () => {
    return handleRequest(`${API_BASE_URL}/contract-requests/test`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // Get all endpoints (for debugging)
  getAllEndpoints: async () => {
    return handleRequest(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },
};

// Utility function to set auth token
export const setAuthToken = (token: string) => {
  console.log('🔑 Setting auth token:', token.substring(0, 20) + '...');
  localStorage.setItem(TOKEN_KEY, token);
};

// Utility function to remove auth token
export const removeAuthToken = () => {
  console.log('🗑️ Removing auth token');
  localStorage.removeItem(TOKEN_KEY);
};

// Utility function to get auth token
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('🔍 Getting auth token:', token ? 'exists' : 'null');
  return token;
};

// Test connection to backend
export const testConnection = async () => {
  try {
    console.log('🔗 Testing connection to backend...');
    const response = await fetch(`${API_BASE_URL}/ping`);
    return response.ok;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};

// Test authentication
export const testAuth = async () => {
  try {
    console.log('🔐 Testing authentication...');
    
    // Check token
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Token exists:', !!token);
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token first 50 chars:', token.substring(0, 50) + '...');
    }
    
    // Try a simple endpoint that doesn't require auth
    console.log('Testing /api/ping...');
    const pingResponse = await fetch('http://localhost:8080/api/ping');
    console.log('Ping status:', pingResponse.status, pingResponse.ok);
    
    // Check user email
    const userEmail = localStorage.getItem('loginEmail') || 
                     localStorage.getItem('email') ||
                     localStorage.getItem('farmerEmail');
    console.log('User email:', userEmail);
    
    return { token: !!token, email: userEmail, ping: pingResponse.ok };
    
  } catch (error) {
    console.error('Auth test failed:', error);
    throw error;
  }
};

// Export all APIs in a single object
export default {
  auth: authApi,
  contracts: contractApi,
  payments: paymentApi,
  products: productApi,
  farmers: farmerApi,
  users: userApi,
  negotiations: negotiationApi,
  contractRequests: contractRequestApi,
  notifications: notificationApi,
  debug: debugApi,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  testConnection,
  testAuth,  // NEW: Test authentication function
};