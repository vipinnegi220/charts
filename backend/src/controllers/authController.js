const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');
const { jwtSecret } = require('../config/env');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const db = await getDb();
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.full_name }, jwtSecret, { expiresIn: '12h' });
  return res.json({ token, user: { id: user.id, email: user.email, name: user.full_name } });
}

module.exports = { login };
