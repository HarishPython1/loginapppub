const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());


// Replace with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://Test123:Test123@essen.hpptm.mongodb.net/';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Error connecting to MongoDB Atlas:', err));


// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.send('User registered successfully!');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        res.send('Login successful!');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.use(cors({
    origin: 'https://dainty-pothos-290a5f.netlify.app/' // Replace with Netlify URL
}));


// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

app.get('/', (req, res) => {
    res.send('Welcome to the Login App!');
});c
