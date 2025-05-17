const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User'); // Make sure this path is correct
const Contact = require('./models/Contact');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 5000; // You can choose any port

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON request bodies

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Back-end server is running!');
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
// Use the default MongoDB URI for localhost and specify your database name
const mongoURI = 'mongodb://localhost:27017/flora-business-data';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Could not connect to MongoDB:', err);
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // 1. Check if the username already exists in the database
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // 2. Create a new user instance
    const newUser = new User({ username: username.toLowerCase(), password });

    // 3. Save the new user to the database
    await newUser.save();

    console.log(`User registered: ${username}`);
    res.status(201).json({ message: 'Registration successful!' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Something went wrong during registration.' });
  }
});

 // Make sure to require it at the top

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // 1. Find the user in the database by username (case-insensitive)
    const user = await User.findOne({ username: username.toLowerCase() });

    // 2. If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 3. Compare the provided password with the stored hashed password
    const isPasswordValid = await user.isValidPassword(password);

    // 4. If the passwords don't match, return an error
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 5. If the credentials are valid, generate a JWT
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' }); // Replace 'your-secret-key' with a strong, secret key

    console.log(`User logged in: ${username}`);
    res.status(200).json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong during login.' });
  }
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'This is a protected route!', userId: req.userId });
});

// Contact form submission route (as before)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    console.log('Contact form submitted and saved:', { name, email, message });
    res.status(200).json({ message: 'Your message has been received!' });

    // Optional: You could also add code here to send an email notification
  } catch (error) {
    console.error('Error saving contact form data:', error);
    res.status(500).json({ message: 'Something went wrong while saving your message.' });
  }
});