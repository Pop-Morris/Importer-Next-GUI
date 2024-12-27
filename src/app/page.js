"use client";

import { useState } from 'react';

export default function HomePage() {
  const [storeHash, setStoreHash] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setResults(null); // Clear previous results
  };

  const handleSubmit = async () => {
    if (!storeHash || !authToken || !selectedFile) {
      alert('Please provide store hash, auth token, and select a CSV file.');
      return;
    }

    setIsProcessing(true);
    setResults(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileContent = reader.result;
        const response = await fetch('/api/process-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storeHash, authToken, fileContent }),
        });

        const result = await response.json();
        console.log('Result:', result);
        alert('Process Complete!');
        setResults(result);
      } catch (error) {
        setResults({ error: 'Failed to process the file. Please try again.' });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className="min-h-screen bg-bc-background">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-[28px] font-normal text-bc-text mb-2">
          Subscriber Importer
        </h1>
        <p className="text-bc-text-secondary text-[14px] mb-6">
          Enter your BigCommerce credentials and select a CSV to upload:
        </p>

        <div className="bg-white p-6 rounded shadow-sm border border-bc-border">
          <div className="space-y-6">
            {/* Store Hash */}
            <div>
              <label className="block text-[14px] font-semibold text-bc-text mb-2">
                Store Hash
              </label>
              <input
                type="text"
                value={storeHash}
                onChange={(e) => setStoreHash(e.target.value)}
                placeholder="Enter store hash"
                className="w-full h-[38px] px-3 border border-bc-border rounded bg-white text-bc-text
                         focus:outline-none focus:ring-2 focus:ring-bc-blue focus:border-bc-blue"
              />
            </div>

            {/* Auth Token */}
            <div>
              <label className="block text-[14px] font-semibold text-bc-text mb-2">
                Auth Token
              </label>
              <input
                type="text"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Enter auth token"
                className="w-full h-[38px] px-3 border border-bc-border rounded bg-white text-bc-text
                         focus:outline-none focus:ring-2 focus:ring-bc-blue focus:border-bc-blue"
              />
            </div>

            {/* File Input */}
            <div>
              <label className="block text-[14px] font-semibold text-bc-text mb-2">
                CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-bc-text text-[14px]
                         file:mr-4 file:py-2 file:px-4
                         file:rounded file:border-0
                         file:text-[14px] file:font-semibold
                         file:text-white
                         file:bg-gradient-to-r file:from-[#3C64F4] file:to-[#462DFF]
                         hover:file:from-[#2852EB] hover:file:to-[#3421D9]
                         file:transition-all file:duration-300
                         cursor-pointer"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!storeHash || !authToken || !selectedFile}
              className="w-full h-[38px] bg-bc-blue text-white rounded
                       hover:bg-bc-blue-hover transition-colors
                       focus:outline-none focus:ring-2 focus:ring-bc-blue focus:ring-offset-2
                       disabled:bg-bc-disabled disabled:text-bc-disabled-text disabled:cursor-not-allowed
                       text-[14px] font-semibold"
            >
              Upload & Process
            </button>
          </div>
        </div>

        {/* Add Results Section */}
        {isProcessing && (
          <div className="mt-6 p-4 bg-white rounded shadow-sm border border-bc-border">
            <p className="text-bc-text">Processing subscribers...</p>
          </div>
        )}

        {results && (
          <div className="mt-6 p-4 bg-white rounded shadow-sm border border-bc-border">
            <h2 className="text-[18px] font-semibold text-bc-text mb-4">Results</h2>
            
            {results.error ? (
              <div className="text-red-600 text-[14px]">{results.error}</div>
            ) : (
              <>
                <p className="text-bc-text-secondary text-[14px] mb-4">{results.message}</p>
                <div className="space-y-2">
                  {results.results?.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded text-[14px] ${
                        result.error 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}
                    >
                      <span className="font-medium">{result.email}: </span>
                      {result.error 
                        ? `Error - ${JSON.stringify(result.error)}` 
                        : `Success (Status: ${result.status})`}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
