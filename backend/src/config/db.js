const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected to Atlas successfully');
  } catch (err) {
    console.error('MongoDB Atlas connection failed:', err.message);
    console.log('Falling back to local In-Memory MongoDB...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '4.4.29'
        }
      });
      const mongoUri = mongoServer.getUri();
      console.log(`In-Memory MongoDB Server started at: ${mongoUri}`);
      await mongoose.connect(mongoUri);
      console.log('Connected to In-Memory MongoDB successfully');
    } catch (fallbackErr) {
      console.error('Fallback In-Memory MongoDB failed:', fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
