const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// Set up MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rudransh@1',
    database: 'ww'  // Use the user's database name 'ww'
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Signup function
exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).send('Please provide all required fields');
    }

    // Hash the password before saving it to the database
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error encrypting password:', err);
            return res.status(500).send('Error encrypting password');
        }

        // Insert the user into the database
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        db.query(query, [name, email, hash], (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).send('Error creating user');
            }
            res.redirect('/login.html'); // Redirect to login page after successful signup
        });
    });
};

// Login function
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
        return res.status(400).send('Please provide all required fields');
    }

    // Fetch the user from the database
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Database query error');
        }

        if (results.length === 0) {
            return res.status(400).send('User not found');
        }

        // Compare the provided password with the stored hashed password
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('Error comparing passwords');
            }

            if (!isMatch) {
                return res.status(400).send('Password does not match');
            }

            // If password matches, redirect to the expenses page
            res.redirect('/expenses.html');
        });
    });
};
