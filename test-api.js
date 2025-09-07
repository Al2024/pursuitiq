// Quick test for the API
const fs = require('fs');
const path = require('path');

async function testAPI() {
  try {
    const filePath = path.join(__dirname, 'sample-rfp.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    console.log('Testing API with sample file...');
    console.log('File content length:', fileContent.length);

    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: new FormData(),
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (response.ok) {
      const result = await response.json();
      console.log('Success! Result:', result);
    } else {
      const error = await response.text();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();
