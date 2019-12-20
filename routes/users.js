const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require("passport")

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * TODO: Implement Passport authentication strategy
 */
// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', [
    check('firstName', 'A First name is required').not().isEmpty(), 
    check('lastName', 'A Last name is required').not().isEmpty(), 
    check('userName', 'A Username is required').not().isEmpty(), 
    check('email', "Please include a valid email").isEmail(),
    check('password', 'Please enter a passowrd with 7 or more characters').isLength({ min:7 })
],
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const { firstName, lastName, userName, email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if(user) {
            return res.status(400).json({msg:"Email already registered"})
        }

        user = await User.findOne({ userName })
        if(user) {
            return res.status(400).json({msg:"Username already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashed_pw = await bcrypt.hash(password,salt)
        user = new User({
            firstName, lastName, userName, email, password: hashed_pw  
        })
        await user.save()
        const payload = {
            user: {
                id: user._id
            }
        }
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: 18000
        }, (err,token) => {
            if(err) throw err
            res.json({ token })
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports =  router 