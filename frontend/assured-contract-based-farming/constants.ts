
import { type Contract } from './types';

export const MOCK_CONTRACTS: Contract[] = [
  { id: 'C001', cropName: 'Wheat', quantity: 1000, pricePerUnit: 20, status: 'Active', farmerName: 'John Doe', buyerName: 'AgriCorp', createdDate: '2023-10-15' },
  { id: 'C002', cropName: 'Corn', quantity: 5000, pricePerUnit: 15, status: 'Pending', farmerName: 'Jane Smith', buyerName: 'Global Grains', createdDate: '2023-10-20' },
  { id: 'C003', cropName: 'Soybean', quantity: 2500, pricePerUnit: 30, status: 'Completed', farmerName: 'John Doe', buyerName: 'Food Inc.', createdDate: '2023-09-01' },
  { id: 'C004', cropName: 'Barley', quantity: 800, pricePerUnit: 18, status: 'Rejected', farmerName: 'Emily White', buyerName: 'AgriCorp', createdDate: '2023-10-18' },
  { id: 'C005', cropName: 'Rice', quantity: 3000, pricePerUnit: 25, status: 'Active', farmerName: 'Michael Green', buyerName: 'Global Grains', createdDate: '2023-10-05' },
];

export const CROPS = ['Wheat', 'Corn', 'Soybean', 'Barley', 'Rice', 'Cotton', 'Sugarcane'];
