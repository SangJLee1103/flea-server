const express = require('express');

const User = require('../models/user');
const { body } = require('express-validator');
const { validatorErrorChecker } = require('../middleware/validatorMiddleware');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware');
const { count } = require('../models/user');

const router = express.Router();




module.exports = router;