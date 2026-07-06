const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';

async function testApp() {
  try {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log('1. Registering user...');
    const registerRes = await axios.post(`${API_URL}/auth/signup`, {
      name: 'Test User',
      email: uniqueEmail,
      password,
    });
    const token = registerRes.data.token;
    console.log('User registered successfully.');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('2. Creating a test document file...');
    fs.writeFileSync('test_doc.txt', 'This is a test document. The secret word is BANANA.');
    
    console.log('3. Uploading document...');
    const form = new FormData();
    form.append('file', fs.createReadStream('test_doc.txt'));
    
    const uploadRes = await axios.post(`${API_URL}/documents`, form, {
      headers: {
        ...headers,
        ...form.getHeaders()
      }
    });
    const docId = uploadRes.data._id;
    console.log('Document uploaded successfully. ID:', docId);

    console.log('4. Asking the AI a question about the document...');
    const askRes = await axios.post(`${API_URL}/ask`, {
      documentId: docId,
      question: 'What is the secret word in the document?'
    }, { headers });
    
    console.log('\n--- AI Response ---');
    console.log(askRes.data.aiResponse);
    console.log('-------------------\n');

    console.log('All tests passed successfully!');

  } catch (error) {
    console.error('Test failed!');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  } finally {
    if (fs.existsSync('test_doc.txt')) fs.unlinkSync('test_doc.txt');
  }
}

testApp();
