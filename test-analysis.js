// Test script for AI analysis API
// Run with: node test-analysis.js

const fs = require('fs');
const path = require('path');

async function testAnalysis() {
  try {
    // Read the test RFP file
    const testFilePath = path.join(__dirname, 'test-rfp.txt');
    const fileContent = fs.readFileSync(testFilePath, 'utf8');

    console.log('Test RFP Content:');
    console.log('================');
    console.log(fileContent.substring(0, 500) + '...');
    console.log('================');

    // Create a simple test by calling the API
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: new FormData(),
    });

    console.log('API Response Status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('Analysis Result:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log('API Error:', error);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAnalysis();
}

module.exports = { testAnalysis };
