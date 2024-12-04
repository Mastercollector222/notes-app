require('dotenv').config();

console.log('Testing .env file configuration:');
console.log('----------------------------------');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('----------------------------------');

// Parse the connection string to check its components
try {
    const url = new URL(process.env.MONGODB_URI);
    console.log('\nConnection string components:');
    console.log('Protocol:', url.protocol);
    console.log('Username:', url.username);
    console.log('Password:', '********'); // Hidden for security
    console.log('Host:', url.host);
    console.log('Database:', url.pathname.substr(1));
    console.log('Parameters:', url.search);
    console.log('\nEnvironment file loaded successfully!');
} catch (error) {
    console.error('\nError parsing connection string:', error.message);
}
