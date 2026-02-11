import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-fintech-green mb-4">Afactoring</h1>
        <p className="text-gray-600">Seu sistema de microcrédito está online!</p>
        <div className="mt-6">
          <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">
            Simular Empréstimo
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
