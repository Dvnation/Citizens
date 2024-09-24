const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt
const router = express.Router();

// Middleware to validate input
const validateUserInput = (req, res, next) => {
    const { email, password } = req.body;

    console.log(email + "signup");
    console.log(password + "signup");
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    next();
};

// Sign up route
router.post('/signup', validateUserInput, async (req, res) => {
    const { email, password, name} = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);



        const newUser = new User({ email, password: hashedPassword,name,reports:[]});

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Log in route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(password + "login");
    console.log(email + "login");
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
       

        // Compare the entered password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

      if(isMatch){
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '363tefeixhf3rth8ffhgsgf8fg8g', {
            expiresIn: '7d',
        });
        console.log(token);
        // res.send({titler : token})
      return  res.status(200).send({token, message:"Logged in successfully" });
      }
    }
     catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});




// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password from the result
        res.status(200).json(users);
        console.log(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});





router.post('/report',async (req,res)=>{
    const { email, category,description,location} = req.body;

    try{
           const users = await User.findOne({email})

           if(!users){
            return res.status(400).send({message:"email not Found"})
           }
           users.reports.push({
            category,
            description,
            location,
            date: new Date(),
          });
      
          await users.save();
          res.status(200).json({ message: 'Report added successfully', users });


    }
    catch{

    }

} )

module.exports = router;
