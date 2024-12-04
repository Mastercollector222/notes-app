// Suppress deprecation warnings
process.removeAllListeners('warning');

require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n=== MongoDB Connection Test ===');
console.log('Attempting to connect...');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('\n✅ Successfully connected to MongoDB!');
    console.log('Connection test passed.');
    process.exit(0);
})
.catch(err => {
    console.error('\n❌ Connection failed:');
    console.error('Error:', err.message);
    process.exit(1);
});
