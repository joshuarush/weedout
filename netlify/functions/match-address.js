const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  // Parse query parameters
  const query = event.queryStringParameters || {};
  const { address, city, zip, DistType } = query;
  
  console.log('Parsed query parameters:', { address, city, zip, DistType });
  
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

  if (!zip) {
    console.error('Missing zip code in request');
    return {
      statusCode: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Zip code is required',
        receivedQuery: query,
        allParams: event.queryStringParameters,
        rawEvent: event
      })
    };
  }
  
  // Build the API URL with parameters
  const apiParams = new URLSearchParams();
  if (address) apiParams.append('Address', address);
  if (city) apiParams.append('City', city);
  apiParams.append('Zip', zip);
  apiParams.append('DistType', DistType || 'A');
  
  const apiUrl = `https://rws.capitol.texas.gov/api/MatchAddress?${apiParams.toString()}`;
  console.log('Calling API URL:', apiUrl);
  
  try {
    const response = await fetch(apiUrl, {
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
