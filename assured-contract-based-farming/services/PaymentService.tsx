// src/services/PaymentService.ts

export interface PaymentRequest {
  contractId: number;
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI';
  description?: string;
}

export interface Payment {
  paymentId: number;
  contract: {
    contractId: number;
    crop: string;
    quantity: number;
    price: number;
    farmer: { 
      userId: number;
      name: string; 
      email: string;
    };
    buyer: { 
      userId: number;
      name: string; 
      email: string;
    };
  };
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | null;
  paymentDate: string | null;
  description: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  createdAt: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export class PaymentService {
  private static API_BASE_URL = 'http://localhost:8080/api';

  // Get Razorpay key from environment variable
  private static getRazorpayKeyId(): string {
    const key = process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!key || key === 'YOUR_RAZORPAY_KEY_ID') {
      console.warn('⚠️ Razorpay key not configured. Using test key...');
    // Fallback to your actual key for testing
    return 'rzp_test_Rxfhs4IUXIxoYd';
    }
    return key || '';
  }

  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Load Razorpay script dynamically
  static async loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        console.log('✅ Razorpay already loaded');
        resolve(true);
        return;
      }
      
      console.log('📥 Loading Razorpay script...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('✅ Razorpay script loaded');
        resolve(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  // Create a new payment record
  static async createPayment(paymentData: PaymentRequest): Promise<Payment> {
    try {
      console.log('📝 Creating payment record:', paymentData);
      
      const response = await fetch(`${this.API_BASE_URL}/payments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          contract: { contractId: paymentData.contractId },
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          description: paymentData.description || `Payment for Contract #${paymentData.contractId}`,
          status: 'PENDING'
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create payment: ${response.status} - ${errorText}`);
      }
      
      const payment = await response.json();
      console.log('✅ Payment created:', payment);
      return payment;
      
    } catch (error) {
      console.error('❌ Error creating payment:', error);
      throw error;
    }
  }

  // Create Razorpay order
  static async createRazorpayOrder(paymentId: number): Promise<any> {
    try {
      console.log('💰 Creating Razorpay order for payment:', paymentId);
      
      const response = await fetch(`${this.API_BASE_URL}/payments/create-order/${paymentId}`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create Razorpay order: ${response.status} - ${errorText}`);
      }
      
      const orderJson = await response.text();
      const order = JSON.parse(orderJson);
      console.log('✅ Razorpay order created:', order);
      return order;
      
    } catch (error) {
      console.error('❌ Error creating Razorpay order:', error);
      throw error;
    }
  }

  // Verify payment after Razorpay callback
  static async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<Payment> {
    try {
      console.log('🔐 Verifying payment:', { orderId, paymentId, signature });
      
      const response = await fetch(`${this.API_BASE_URL}/payments/verify?orderId=${orderId}&paymentId=${paymentId}&signature=${signature}`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to verify payment: ${response.status} - ${errorText}`);
      }
      
      const verifiedPayment = await response.json();
      console.log('✅ Payment verified:', verifiedPayment);
      return verifiedPayment;
      
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      throw error;
    }
  }

  // Get all payments
  static async getAllPayments(): Promise<Payment[]> {
    try {
      console.log('📊 Fetching all payments...');
      
      const response = await fetch(`${this.API_BASE_URL}/payments`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.status}`);
      }
      
      const payments = await response.json();
      console.log(`✅ Fetched ${payments.length} payments`);
      return payments;
      
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
      return [];
    }
  }

  // Get payment by ID
  static async getPaymentById(paymentId: number): Promise<Payment | null> {
    try {
      console.log(`🔍 Fetching payment ${paymentId}...`);
      
      const response = await fetch(`${this.API_BASE_URL}/payments/${paymentId}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch payment: ${response.status}`);
      }
      
      const payment = await response.json();
      console.log('✅ Payment fetched:', payment);
      return payment;
      
    } catch (error) {
      console.error('❌ Error fetching payment:', error);
      return null;
    }
  }

  // Get payments by contract ID
  static async getPaymentsByContract(contractId: number): Promise<Payment[]> {
    try {
      console.log(`📋 Fetching payments for contract ${contractId}...`);
      
      const response = await fetch(`${this.API_BASE_URL}/payments/contract/${contractId}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contract payments: ${response.status}`);
      }
      
      const payments = await response.json();
      console.log(`✅ Fetched ${payments.length} payments for contract ${contractId}`);
      return payments;
      
    } catch (error) {
      console.error('❌ Error fetching contract payments:', error);
      return [];
    }
  }

  // Initiate payment with Razorpay
  static async initiatePayment(
    payment: Payment, 
    onSuccess: (payment: Payment) => void, 
    onFailure: (error: any) => void
  ) {
    try {
      console.log('🚀 Initiating payment flow for:', payment);
      
      // Check if Razorpay key is configured
      const razorpayKeyId = this.getRazorpayKeyId();
      if (!razorpayKeyId) {
        onFailure(new Error('Razorpay is not configured. Please add REACT_APP_RAZORPAY_KEY_ID to your .env file'));
        return;
      }
      
      // Load Razorpay script
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        onFailure(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
        return;
      }

      // Create Razorpay order
      const order = await this.createRazorpayOrder(payment.paymentId);
      
      console.log('📦 Razorpay order details:', order);
      
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'AgriConnect',
        description: payment.description || `Payment for Contract #${payment.contract.contractId} - ${payment.contract.crop}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            console.log('📞 Razorpay callback received:', response);
            
            // Verify payment
            const verifiedPayment = await this.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            
            console.log('✅ Payment verified successfully:', verifiedPayment);
            onSuccess(verifiedPayment);
            
          } catch (error) {
            console.error('❌ Payment verification failed:', error);
            onFailure(error);
          }
        },
        prefill: {
          name: payment.contract.buyer.name || 'Buyer',
          email: payment.contract.buyer.email,
          contact: ''
        },
        notes: {
          contractId: payment.contract.contractId.toString(),
          paymentId: payment.paymentId.toString(),
          crop: payment.contract.crop
        },
        theme: {
          color: '#10b981' // Green color matching AgriConnect theme
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal closed by user');
            onFailure(new Error('Payment cancelled by user'));
          }
        }
      };
      
      console.log('🎯 Opening Razorpay checkout with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('❌ Error initiating payment:', error);
      onFailure(error);
    }
  }

  // Update payment status (for cash payments)
  static async updatePaymentStatus(paymentId: number, status: 'COMPLETED' | 'CANCELLED' | 'FAILED'): Promise<Payment> {
    try {
      console.log(`🔄 Updating payment ${paymentId} status to ${status}`);
      
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      payment.status = status;
      if (status === 'COMPLETED') {
        payment.paymentDate = new Date().toISOString();
      }
      
      const response = await fetch(`${this.API_BASE_URL}/payments/${paymentId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payment)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update payment status: ${response.status}`);
      }
      
      const updatedPayment = await response.json();
      console.log('✅ Payment status updated:', updatedPayment);
      return updatedPayment;
      
    } catch (error) {
      console.error('❌ Error updating payment status:', error);
      throw error;
    }
  }

  // Delete payment (for admin/cancellation)
  static async deletePayment(paymentId: number): Promise<void> {
    try {
      console.log(`🗑️ Deleting payment ${paymentId}...`);
      
      const response = await fetch(`${this.API_BASE_URL}/payments/${paymentId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete payment: ${response.status}`);
      }
      
      console.log('✅ Payment deleted successfully');
      
    } catch (error) {
      console.error('❌ Error deleting payment:', error);
      throw error;
    }
  }

  // Get payment statistics for a user
  static async getPaymentStats(userEmail: string, role: 'FARMER' | 'BUYER'): Promise<{
    totalAmount: number;
    pendingAmount: number;
    completedCount: number;
    pendingCount: number;
    failedCount: number;
    recentPayments: Payment[];
  }> {
    try {
      const allPayments = await this.getAllPayments();
      
      // Filter payments based on role
      let userPayments = allPayments;
      if (role === 'FARMER') {
        userPayments = allPayments.filter(p => p.contract?.farmer?.email === userEmail);
      } else {
        userPayments = allPayments.filter(p => p.contract?.buyer?.email === userEmail);
      }
      
      const completed = userPayments.filter(p => p.status === 'COMPLETED');
      const pending = userPayments.filter(p => p.status === 'PENDING');
      const failed = userPayments.filter(p => p.status === 'FAILED');
      
      const totalAmount = completed.reduce((sum, p) => sum + p.amount, 0);
      const pendingAmount = pending.reduce((sum, p) => sum + p.amount, 0);
      
      // Get recent payments (last 5)
      const recentPayments = [...userPayments]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      return {
        totalAmount,
        pendingAmount,
        completedCount: completed.length,
        pendingCount: pending.length,
        failedCount: failed.length,
        recentPayments
      };
      
    } catch (error) {
      console.error('❌ Error getting payment stats:', error);
      return {
        totalAmount: 0,
        pendingAmount: 0,
        completedCount: 0,
        pendingCount: 0,
        failedCount: 0,
        recentPayments: []
      };
    }
  }

  // Generate receipt HTML for printing
  static generateReceiptHTML(payment: Payment): string {
    const paymentDate = payment.paymentDate 
      ? new Date(payment.paymentDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Pending';
    
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    };
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - AgriConnect</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 30px;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #10b981;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0 0;
          }
          .receipt-title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            color: #333;
          }
          .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 30px;
            padding: 15px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .detail-item {
            display: flex;
            flex-direction: column;
          }
          .detail-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .detail-value {
            font-size: 14px;
            font-weight: 500;
            color: #333;
          }
          .party-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .party-box {
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .party-box h4 {
            margin: 0 0 10px 0;
            color: #10b981;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
          }
          th {
            background: #f9fafb;
            font-weight: 600;
          }
          .totals {
            text-align: right;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
          }
          .total-line {
            font-size: 18px;
            font-weight: bold;
            margin: 5px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #666;
          }
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }
          .status-completed {
            background: #d1fae5;
            color: #065f46;
          }
          .status-pending {
            background: #fed7aa;
            color: #92400e;
          }
          .status-failed {
            background: #fee2e2;
            color: #991b1b;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h1>🌾 AgriConnect</h1>
            <p>Connecting Farmers & Buyers</p>
          </div>
          
          <div class="receipt-title">PAYMENT RECEIPT</div>
          
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Receipt No:</span>
              <span class="detail-value">RCPT-${payment.paymentId}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Payment Date:</span>
              <span class="detail-value">${paymentDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Payment ID:</span>
              <span class="detail-value">#${payment.paymentId}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Transaction ID:</span>
              <span class="detail-value">${payment.razorpayPaymentId || 'N/A'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status:</span>
              <span class="detail-value">
                <span class="status status-${payment.status.toLowerCase()}">
                  ${payment.status}
                </span>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">${payment.paymentMethod || 'N/A'}</span>
            </div>
          </div>
          
          <div class="party-details">
            <div class="party-box">
              <h4>Received From</h4>
              <p><strong>${payment.contract.buyer.name || 'Buyer'}</strong></p>
              <p>${payment.contract.buyer.email}</p>
            </div>
            <div class="party-box">
              <h4>Paid To</h4>
              <p><strong>${payment.contract.farmer.name || 'Farmer'}</strong></p>
              <p>${payment.contract.farmer.email}</p>
            </div>
          </div>
          
          <h4>Contract Details</h4>
          <table>
            <thead>
              <tr>
                <th>Contract ID</th>
                <th>Crop</th>
                <th>Quantity</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#${payment.contract.contractId}</td>
                <td>${payment.contract.crop}</td>
                <td>${payment.contract.quantity} kg</td>
                <td>${formatPrice(payment.contract.price)}/kg</td>
              </tr>
            </tbody>
          </table>
          
          <h4>Payment Summary</h4>
          <table>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td class="total-line">${formatPrice(payment.amount)}</td>
              </tr>
              <tr>
                <td>GST (5%)</td>
                <td>${formatPrice(payment.amount * 0.05)}</td>
              </tr>
              <tr style="border-top: 2px solid #e5e7eb;">
                <td><strong>Total Amount</strong></td>
                <td><strong>${formatPrice(payment.amount * 1.05)}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated receipt. No signature required.</p>
            <p>For any queries, contact support@agriconnect.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Print receipt
  static printReceipt(payment: Payment): void {
    const receiptHTML = this.generateReceiptHTML(payment);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Download receipt as PDF (opens print dialog)
  static downloadReceipt(payment: Payment): void {
    this.printReceipt(payment);
  }
}

export default PaymentService;