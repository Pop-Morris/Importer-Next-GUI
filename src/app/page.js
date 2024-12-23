"use client";

import { useState } from 'react';

export default function HomePage() {
  const [storeHash, setStoreHash] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!storeHash || !authToken || !selectedFile) {
      alert('Please provide store hash, auth token, and select a CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const fileContent = reader.result;

      // Call the API endpoint
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeHash, authToken, fileContent }),
      });

      const result = await response.json();
      console.log('Result:', result);
      alert('Process Complete! Check the console for details.');
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Subscriber Importer</h1>
      <p className="mb-6">
        Enter your BigCommerce credentials and select a CSV to upload:
      </p>

      {/* Store Hash */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">
          Store Hash
        </label>
        <input
          type="text"
          value={storeHash}
          onChange={(e) => setStoreHash(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white text-black px-3 py-2 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Auth Token */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">
          Auth Token
        </label>
        <input
          type="text"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white text-black px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* CSV File Input */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-700">
          CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:border-0 
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Upload & Process
      </button>
    </div>
  );
}
