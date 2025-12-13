const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  try {
    console.log('1. Submitting Render Job...');
    const submitRes = await axios.post(`${API_URL}/render`, {
      inputType: 'url',
      content: 'https://example.com',
      options: {
        format: 'A4'
      }
    });

    const { jobId } = submitRes.data;
    console.log(`   Job ID: ${jobId}`);

    console.log('2. Polling for Status...');
    let status = 'queued';
    let result = null;
    
    while (status !== 'completed' && status !== 'failed') {
      await delay(2000); // Poll every 2s
      const statusRes = await axios.get(`${API_URL}/status/${jobId}`);
      status = statusRes.data.state;
      result = statusRes.data.result;
      console.log(`   Status: ${status}`);
    }

    if (status === 'completed') {
      console.log('3. Job Completed!');
      console.log(`   Result Path: ${result}`);
      
      // Optional: Verify download
      const downloadRes = await axios.get(`${API_URL}/download/${jobId}`);
      console.log(`   Download Info:`, downloadRes.data);
      
    } else {
      console.error('Job Failed!');
    }

  } catch (error) {
    console.error('Test Failed:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
  }
}

runTest();
