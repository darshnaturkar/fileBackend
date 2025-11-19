const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');


const app = express();

app.use(cors());
app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/file', require('./routes/fileRoutes'));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
// const MONGO_URI = 'mongodb://localhost:27017/fdb';
const MONGO_URI = 'mongodb+srv://rajkumar120in:uZaLTbSTjAn64RA9@cluster0.w8pyppa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));