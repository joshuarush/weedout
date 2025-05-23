const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  const { address, city, zip } = event.queryStringParameters || {};
  
  if (!zip) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Zip code is required' })
    };
  }
  
  const params = new URLSearchParams();
  if (address) params.append('Address', address);
  if (city) params.append('City', city);
  params.append('Zip', zip);
  params.append('DistType', 'A');
  
  try {
    const response = await fetch(`https://rws.capitol.texas.gov/api/MatchAddress?${params}`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://wrm.capitol.texas.gov/',
        'User-Agent': 'Mozilla/5.0 (compatible; YourApp/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Failed to fetch data',
        details: error.message 
      })
    };
  }
};
