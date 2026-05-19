import React, { useState } from 'react';
import { type Contract } from '../types';
import { CROPS } from '../constants';
import { X } from './icons';

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: Omit<Contract, 'id' | 'status' | 'farmerName' | 'createdDate'>) => void;
}

const CreateContractModal: React.FC<CreateContractModalProps> = ({ isOpen, onClose, onSave }) => {
  const [cropName, setCropName] = useState(CROPS[0]);
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [buyerName, setBuyerName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity || !pricePerUnit || !buyerName) {
      alert('Please fill out all fields.');
      return;
    }
    onSave({
      cropName,
      quantity: Number(quantity),
      pricePerUnit: Number(pricePerUnit),
      buyerName,
    });
    // Reset form
    setCropName(CROPS[0]);
    setQuantity('');
    setPricePerUnit('');
    setBuyerName('');
  };

  const commonInputClasses = "mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow";

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Contract</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Crop</label>
              <select 
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className={commonInputClasses}
              >
                {CROPS.map(crop => <option key={crop} value={crop}>{crop}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity (in tons)</label>
              <input 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 1000" 
                className={commonInputClasses}
                required 
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price per Unit ($)</label>
              <input 
                type="number" 
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="e.g., 20.50" 
                className={commonInputClasses}
                required 
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Buyer Name</label>
              <input 
                type="text" 
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g., AgriCorp" 
                className={commonInputClasses}
                required 
              />
            </div>
          </div>
          <div className="flex justify-end items-center p-6 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 rounded-b-xl space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-gray-700 dark:text-gray-300 bg-transparent rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors transform hover:scale-105">Save Contract</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContractModal;