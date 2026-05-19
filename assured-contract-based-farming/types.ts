
export type UserRole = 'farmer' | 'buyer';

export interface Contract {
  id: string;
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  status: 'Pending' | 'Active' | 'Completed' | 'Rejected';
  farmerName: string;
  buyerName: string;
  createdDate: string;
}
