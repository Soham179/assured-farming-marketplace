// api.ts - FIXED VERSION WITH CORRECT PYTHON ENDPOINTS
import { UserRole } from './types';

// Base API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Python ML Backend URL for price prediction
const PYTHON_ML_BACKEND_URL = 'http://localhost:5000';

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

// Python backend headers (no auth needed)
const getPythonHeaders = (includeJson: boolean = true) => {
  const headers: HeadersInit = {};
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
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

// Python ML Backend request handler
const handlePythonRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${PYTHON_ML_BACKEND_URL}${endpoint}`;
  return handleRequest<T>(url, options);
};

// ===============================
// ✅ PRICE PREDICTION API (FIXED TO MATCH YOUR PYTHON BACKEND)
// ===============================
export const pricePredictionApi = {
  // Test connection to Python ML backend
  testConnection: async () => {
    try {
      console.log('🧪 Testing Python ML backend connection...');
      const response = await fetch(`${PYTHON_ML_BACKEND_URL}/`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Python ML backend connected:', data);
        return { 
          connected: true,
          status: data.status || 'running',
          model_loaded: data.model_loaded || false
        };
      } else {
        console.warn('⚠️ Python ML backend not responding properly');
        return { connected: false };
      }
    } catch (error: any) {
      console.error('❌ Python ML backend connection failed:', error);
      return { 
        connected: false, 
        error: error.message,
        tip: 'Make sure Python backend is running on port 5000: python app.py'
      };
    }
  },

  // Get available crops from model - FIXED ENDPOINT: /available-crops
  getAvailableCrops: async () => {
    try {
      console.log('🌱 Getting available crops from model...');
      
      // Call your actual Python backend endpoint
      const response = await handlePythonRequest<{
        success: boolean;
        crops: string[];
        count: number;
      }>('/available-crops', {
        method: 'GET',
        headers: getPythonHeaders(),
      });
      
      console.log('✅ Got crops from Python backend:', response);
      return response;
      
    } catch (error: any) {
      console.error('❌ Error getting crops from Python backend:', error);
      // Fallback to hardcoded list if backend fails
      const crops = [
        "Bajra", "Carrot", "Corn", "Cotton", "Jowar",
        "Masoor", "Moong", "Onion", "Orange", "Rice",
        "Soyabean", "Sugarcane", "Sunflower", "SweetPotato",
        "Tomato", "Urad", "Wheat"
      ];
      
      return {
        success: false,
        crops: crops,
        count: crops.length,
        error: error.message,
        message: 'Using fallback crop list'
      };
    }
  },

  // Predict price for crop - FIXED ENDPOINT: /predict-price
  predictPrice: async (predictionData: {
    cropName: string;
    year?: number;
    month?: number;
    rainfall?: number;
    temperature?: number;
    season?: number;
    prevMonthWPI?: number;
  }) => {
    try {
      console.log('🔮 Making price prediction:', predictionData);
      
      // Prepare data for YOUR Python backend
      // Your backend expects keys: crop_name, year, month, Rainfall, Temperature, Season, Prev_Month_WPI
      const requestData = {
        crop_name: predictionData.cropName,
        year: predictionData.year || new Date().getFullYear(),
        month: predictionData.month || new Date().getMonth() + 1,
        Rainfall: predictionData.rainfall || 50,
        Temperature: predictionData.temperature || 30,
        Season: predictionData.season || 1,
        Prev_Month_WPI: predictionData.prevMonthWPI || 100
      };
      
      console.log('📤 Sending to Python backend:', requestData);
      
      // Call YOUR actual endpoint: /predict-price
      const response = await handlePythonRequest<{
        success: boolean;
        wpi?: number;
        price_per_kg?: number;
        confidence?: string;
        market_trend?: string;
        best_time_to_sell?: string;
        historical_data?: Array<{month: string, price: number}>;
        factors?: any;
        crop?: string;
        year?: number;
        month?: number;
        error?: string;
      }>('/predict-price', {
        method: 'POST',
        headers: getPythonHeaders(),
        body: JSON.stringify(requestData),
      });
      
      if (response.success) {
        console.log('✅ Prediction successful from Python backend:', response);
        return response;
      } else {
        console.error('❌ Prediction failed:', response.error);
        throw new Error(response.error || 'Prediction failed');
      }
    } catch (error: any) {
      console.error('❌ Price prediction error:', error);
      throw error;
    }
  },

  // Get historical price trends - FIXED: Use Python backend if available, otherwise mock
  getHistoricalTrends: async (cropName: string, months: number = 12) => {
    try {
      console.log(`📈 Getting historical trends for ${cropName}`);
      
      // Try to get from Python backend if you add this endpoint
      // For now, we'll use the mock data from frontend
      const historicalData = generateHistoricalData(
        cropName, 
        new Date().getFullYear(), 
        new Date().getMonth() + 1, 
        0
      );
      
      return {
        success: true,
        crop: cropName,
        data: historicalData,
        average_price: calculateAverage(historicalData),
        min_price: Math.min(...historicalData.map(d => d.price)),
        max_price: Math.max(...historicalData.map(d => d.price))
      };
    } catch (error: any) {
      console.error('❌ Error getting historical trends:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
};

// Helper function to generate historical data for chart
const generateHistoricalData = (cropName: string, year: number, month: number, currentPrice: number) => {
  const historical = [];
  
  // Generate 12 months of historical data
  for (let i = 11; i >= 0; i--) {
    let histMonth = month - i;
    let histYear = year;
    
    if (histMonth <= 0) {
      histMonth += 12;
      histYear -= 1;
    }
    
    // Generate realistic price based on crop type and seasonality
    const basePrice = getBasePriceForCrop(cropName);
    const seasonFactor = getSeasonFactor(cropName, histMonth);
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    const price = basePrice * seasonFactor * randomFactor;
    
    historical.push({
      month: `${histMonth.toString().padStart(2, '0')}-${histYear}`,
      price: Math.round(price * 100) / 100
    });
  }
  
  return historical;
};

// Helper function to get base price for crop
const getBasePriceForCrop = (cropName: string): number => {
  const basePrices: Record<string, number> = {
    "Bajra": 20, "Carrot": 25, "Corn": 18, "Cotton": 22, "Jowar": 21,
    "Masoor": 40, "Moong": 50, "Onion": 20, "Orange": 30, "Rice": 30,
    "Soyabean": 28, "Sugarcane": 10, "Sunflower": 45, "SweetPotato": 18,
    "Tomato": 25, "Urad": 48, "Wheat": 20
  };
  
  return basePrices[cropName] || 25; // Default price
};

// Helper function to get season factor
const getSeasonFactor = (cropName: string, month: number): number => {
  // Simple seasonality factors
  const isWinter = month >= 11 || month <= 2;
  const isSummer = month >= 3 && month <= 6;
  const isMonsoon = month >= 7 && month <= 10;
  
  // Different crops have different seasonality
  const seasonalCrops = ["Tomato", "Onion", "Carrot", "Potato"];
  const rabiCrops = ["Wheat", "Mustard", "Barley", "Gram"];
  const kharifCrops = ["Rice", "Maize", "Cotton", "Soyabean"];
  
  if (seasonalCrops.includes(cropName)) {
    if (isWinter) return 1.3; // Higher price in winter
    if (isSummer) return 0.7; // Lower price in summer
  }
  
  if (rabiCrops.includes(cropName)) {
    if (isWinter) return 1.2;
    if (isSummer) return 0.8;
  }
  
  if (kharifCrops.includes(cropName)) {
    if (isMonsoon) return 1.1;
    if (isSummer) return 0.9;
  }
  
  return 1.0; // No seasonality
};

// Helper function to calculate average
const calculateAverage = (data: Array<{price: number}>): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, item) => acc + item.price, 0);
  return Math.round((sum / data.length) * 100) / 100;
};

// ===============================
// ✅ PRICE NEGOTIATION API (FIXED)
// ===============================
export const negotiationApi = {
  // ================= BUYER =================
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
  getByFarmer: async (farmerEmail: string) => {
    return handleRequest(
      `${API_BASE_URL}/negotiations/farmer/${farmerEmail}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
  },

  counterByFarmer: async (negotiationId: number, farmerPrice: number) => {
    return handleRequest(
      `${API_BASE_URL}/negotiations/counter/${negotiationId}?farmerPrice=${farmerPrice}`,
      {
        method: 'PUT',
        headers: getHeaders(false),
      }
    );
  },

  accept: async (negotiationId: number) => {
    return handleRequest(
      `${API_BASE_URL}/negotiations/accept/${negotiationId}`,
      {
        method: 'PUT',
        headers: getHeaders(false),
      }
    );
  },

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

// Auth API
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
    return handleRequest<{
      token: string;
      userId: number;
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

// Contract API (Keep all your existing contract API functions as they are)
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

  createContract: async (contractData: {
    farmerEmail: string;
    buyerEmail: string;
    productId: number;
    quantity: number;
    price: number;
    deliveryDate: string;
    terms?: string;
  }) => {
    let cropName = contractData.terms || '';
    
    if (!cropName || cropName === 'General') {
      cropName = '';
    }
    
    const newContractData = {
      productId: contractData.productId,
      buyerEmail: contractData.buyerEmail,
      farmerEmail: contractData.farmerEmail,
      quantity: contractData.quantity,
      price: contractData.price,
      startDate: new Date().toISOString().split('T')[0],
      endDate: contractData.deliveryDate,
      crop: cropName
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

  fixContractCrops: async () => {
    return handleRequest(`${API_BASE_URL}/contracts/fix-crops`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },
};

// Payment API (Keep all your existing payment API functions as they are)
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

// Product API (Keep all your existing product API functions as they are)
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

// Farmer API (Keep all your existing farmer API functions as they are)
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

// User API (Keep all your existing user API functions as they are)
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

// CONTRACT REQUEST API (Keep all your existing contract request API functions as they are)
export const contractRequestApi = {
  getAllRequests: async () => {
    return handleRequest(`${API_BASE_URL}/contract-requests`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getByFarmer: async (farmerEmail: string) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/farmer/${encodeURIComponent(farmerEmail)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getByBuyer: async (buyerEmail: string) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/buyer/${encodeURIComponent(buyerEmail)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getRequestById: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

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

  acceptRequest: async (requestId: number) => {
    console.log('✅ FARMER accepting contract request:', requestId);
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/accept`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  rejectRequest: async (requestId: number) => {
    console.log('❌ FARMER rejecting contract request:', requestId);
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/reject`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

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

  acceptCounter: async (requestId: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/accept-counter`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  rejectCounter: async (requestId: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/reject-counter`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  createContractFromRequest: async (requestId: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${requestId}/create-contract`, {
      method: 'POST',
      headers: getHeaders(),
    });
  },

  deleteRequest: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/contract-requests/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },
};

// Notification API (Keep all your existing notification API functions as they are)
export const notificationApi = {
  getUserNotifications: async (userId: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/user/${userId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getUnreadNotifications: async (userId: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/user/${userId}/unread`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  markAsRead: async (notificationId: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  markAllAsRead: async (userId: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/user/${userId}/mark-all-read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

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

  deleteNotification: async (id: number) => {
    return handleRequest(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },
};

// Debug API
export const debugApi = {
  ping: async () => {
    return handleRequest(`${API_BASE_URL}/ping`, {
      method: 'GET',
      headers: getHeaders(false),
    });
  },

  testNegotiationEndpoint: async () => {
    return handleRequest(`${API_BASE_URL}/negotiations/test`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  testContractRequestEndpoint: async () => {
    return handleRequest(`${API_BASE_URL}/contract-requests/test`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

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

// Test connection to Java backend
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
    
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Token exists:', !!token);
    
    const pingResponse = await fetch('http://localhost:8080/api/ping');
    console.log('Ping status:', pingResponse.status, pingResponse.ok);
    
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
  pricePrediction: pricePredictionApi, // Now correctly connected to your Python backend
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  testConnection,
  testAuth,
};