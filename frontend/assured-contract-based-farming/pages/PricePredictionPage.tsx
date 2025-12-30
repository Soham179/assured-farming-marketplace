
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CROPS } from '../constants';

const historicalData = [
  { name: 'Jan', price: 20 }, { name: 'Feb', price: 22 }, { name: 'Mar', price: 21 },
  { name: 'Apr', price: 23 }, { name: 'May', price: 25 }, { name: 'Jun', price: 24 },
];

const PricePredictionPage: React.FC = () => {
  const [prediction, setPrediction] = useState<{ price: number; confidence: number } | null>(null);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy prediction logic
    const price = Math.floor(Math.random() * (35 - 25 + 1)) + 25;
    const confidence = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
    setPrediction({ price, confidence });
  };

  const predictedData = prediction ? [...historicalData, { name: 'Predicted', price: prediction.price }] : historicalData;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Crop Price Prediction</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Prediction Inputs</h2>
            <form onSubmit={handlePredict} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Crop</label>
                <select className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                  {CROPS.map(crop => <option key={crop}>{crop}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input type="text" placeholder="e.g., California, USA" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Month/Season</label>
                <input type="text" placeholder="e.g., October" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity (in tons)</label>
                <input type="number" placeholder="1000" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <button type="submit" className="w-full py-3 font-bold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300">Predict Price</button>
            </form>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Prediction Results</h2>
            {prediction ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-center">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Predicted Price</p>
                    <p className="text-5xl font-bold text-green-600">${prediction.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">per ton</p>
                  </div>
                  <div className="flex justify-center items-center">
                     <ConfidenceCircle score={prediction.confidence} />
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={predictedData}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="name" stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'} />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="price" name="Historical Price" stroke="#8884d8" />
                      {prediction && <Line type="monotone" dataKey="price" name="Predicted Price" stroke="#82ca9d" strokeDasharray="5 5" />}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                 <div className="mt-6 text-center">
                    <p className="italic text-gray-600 dark:text-gray-300">Suggestion: Best to sell in October for maximum profit.</p>
                    <button className="mt-4 px-6 py-2 bg-golden-400 text-gray-900 font-semibold rounded-lg hover:bg-golden-300 transition-colors">Download PDF Report</button>
                 </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Fill out the form to see a price prediction.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const ConfidenceCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 52; // 2 * pi * radius
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-gray-200 dark:text-gray-600" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    className="text-green-500"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-2xl font-bold text-gray-800 dark:text-white">{score}%</span>
                 <span className="text-xs text-gray-500 dark:text-gray-400">Confidence</span>
            </div>
        </div>
    );
};

export default PricePredictionPage;
