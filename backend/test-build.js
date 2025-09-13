// Simple Node.js test to verify basic functionality
console.log('✅ Node.js is working');
console.log('✅ Testing basic imports...');

try {
  require('express');
  console.log('✅ Express import successful');
} catch (e) {
  console.log('❌ Express import failed:', e.message);
}

try {
  require('cors');
  console.log('✅ CORS import successful');
} catch (e) {
  console.log('❌ CORS import failed:', e.message);
}

try {
  require('@prisma/client');
  console.log('✅ Prisma client import successful');
} catch (e) {
  console.log('❌ Prisma client import failed:', e.message);
}

console.log('✅ Test completed');