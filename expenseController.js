const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'ss'
});

exports.addExpense = (req, res) => {
    const { user_id, amount, description, category } = req.body;
    const query = `INSERT INTO expenses (user_id, amount, description, category) VALUES (?, ?, ?, ?)`;

    db.query(query, [user_id, amount, description, category], (err, result) => {
        if (err) {
            return res.status(500).send('Error adding expense');
        }
        res.send('Expense added successfully');
    });
};

exports.deleteExpense = (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    // Check if the expense belongs to the user
    const checkQuery = `SELECT * FROM expenses WHERE id = ? AND user_id = ?`;
    db.query(checkQuery, [id, user_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Expense not found or not authorized');
        }

        // Delete the expense
        const deleteQuery = `DELETE FROM expenses WHERE id = ? AND user_id = ?`;
        db.query(deleteQuery, [id, user_id], (err, result) => {
            if (err) {
                return res.status(500).send('Error deleting expense');
            }
            res.send('Expense deleted successfully');
        });
    });
};
