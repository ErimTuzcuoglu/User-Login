const express = require('express');
const router = express.Router();
const users = require('../controllers/Users');

// routes
router
.route('/login')
.post(users.login);

router
.route('/register')
.post(users.register);

router
.route('/verify')
.post(users.verify);

router
.route('/admin')
.get(users.adminData);

router
.route('/forgot')
.post(users.forgotMyPass)
.put(users.resetPass);

router
.route('/')
.get(users.getAll)

router
.route('/:id')
.get(users.getById)
.put(users.update)
.delete(users._delete);


module.exports = router;