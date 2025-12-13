const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testFormat(format) {
  console.log(`\nTesting format: ${format}...`);
  try {
    const submitRes = await axios.post(`${API_URL}/render`, {
        inputType: 'html',
        content: '<h1>Hello World</h1><p>This is a test.</p>',
        options: { format }
    });

    const { jobId } = submitRes.data;
    console.log(`Job ID: ${jobId}`);

    let status = 'queued';
    let result = null;
    let error = null;
    
    while (status !== 'completed' && status !== 'failed') {
      await delay(1000);
      const statusRes = await axios.get(`${API_URL}/status/${jobId}`);
      status = statusRes.data.state;
      result = statusRes.data.result;
      error = statusRes.data.error;
    }

    if (status === 'completed') {
      console.log(`SUCCESS: ${result}`);
    } else {
      console.error(`FAILED: ${error}`);
    }

  } catch (error) {
    console.error(`ERROR: ${error.message}`);
  }
}

async function run() {
    await testFormat('png');
    await testFormat('docx');
}

run();
