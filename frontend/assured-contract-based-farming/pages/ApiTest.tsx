// import React, { useEffect, useState } from 'react';
// import api from '../api';

// const ApiTest = () => {
//   const [response, setResponse] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Test backend connection with a simple API
//     api.products.getAllProducts()
//       .then(data => setResponse(data))
//       .catch(err => setError(err.message));
//   }, []);

//   return (
//     <div>
//       <h1>API Test</h1>
//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}
//       {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
//       {!response && !error && <p>Loading...</p>}
//     </div>
//   );
// };

// export default ApiTest;
