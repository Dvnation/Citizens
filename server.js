// server.js
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000
const authRoutes = require('./routes/auth');
const JsonFile = require('./models/JsonFIle');
const Report = require('./models/report')

// Generate a 256-bit (32 bytes) secret key
// const secret = crypto.randomBytes(32).toString('hex');
// console.log(secret);







// Middleware to parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);







// Connect to MongoDB (replace <username>, <password>, and <dbname> with your actual MongoDB details)

mongoose.connect('mongodb+srv://Dvnations:Rayback@bibleapi.ru5no.mongodb.net/?retryWrites=true&w=majority&appName=BibleApi', 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));









  


  const authorizeReportAccess = async (req, res, next) => {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
  
    // Check if the logged-in user is the owner of the report
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to access this report' });
    }
  
    next();  // If authorized, proceed to the next middleware or route handler
  };
  





  app.put('/reports/:id', authorizeReportAccess, async (req, res) => {
    // Code to update the report
  });
  
  app.delete('/reports/:id', authorizeReportAccess, async (req, res) => {
    // Code to delete the report
  });




  app.post('/reports', async (req, res) => {
    const { title, description, location, fileUrl } = req.body;
    
    // Assuming you have the user's ID after authentication
    const userId = req.user._id;
    
    try {
      const newReport = new Report({
        title,
        description,
        location,
        fileUrl,
        user: userId,  // Link the report to the logged-in user
      });
      
      await newReport.save();
      res.status(201).json({ message: 'Report created successfully', report: newReport });
    } catch (error) {
      res.status(500).json({ message: 'Error creating report', error });
    }
  });

  
  app.get('/my-reports', async (req, res) => {
    try {
      const userId = req.user._id;  // Authenticated user's ID
      
      // Fetch only reports created by this user
      const userReports = await Report.find({ user: userId });
      
      res.status(200).json({ reports: userReports });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving reports', error });
    }
  });
  

// POST route to save JSON data
app.post('/json', async (req, res) => {
  try {
    const newJson = new JsonFile({ data: req.body });
    const savedJson = await newJson.save();
    res.json(savedJson);
  } catch (err) {
    res.status(500).json({ message: 'Error saving JSON data', error: err });
  }
});

// GET route to retrieve all stored JSON data
app.get('/json', async (req, res) => {
  try {
    const jsonFiles = await JsonFile.find();
    res.json(jsonFiles);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving JSON data', error: err });
  }
});

// Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Sample JSON data (in-memory)
let data = [
    {
        "id": 1,
        "feature": [
            {
                "name": "Deuteronomy",
                "chapter": 7,
                "value": "Deuteronomy 7:8 He did it out of sheer love, keeping the promise he made to your ancestors. GOD stepped in and mightily bought you back out of that world of slavery, freed you from the iron grip of Pharaoh king of Egypt. MSG",
                "verse": 8,
                
            },
            {
                "name": "Deuteronomy",
                "chapter": 7,
                "value": "Deuteronomy 7:7 The LORD did not set his love upon you, nor choose you, because ye were more in number than any people; for ye [were] the fewest of all people: KJV",
                "verse": 7
            },
            {
                "name": "Deuteronomy",
                "chapter": 7,
                "value": "Deuteronomy 7:8 But because the LORD loved you, and because he would keep the oath which he had sworn unto your fathers, hath the LORD brought you out with a mighty hand, and redeemed you out of the house of bondmen, from the hand of Pharaoh king of Egypt. KJV",
                "verse": 8
            }
        ]
    }
];

let json = [

]

let report = [

]

let signup=[

]




// app.get('/json', (req, res) => {
//   res.json({ message: 'Hello, world!' });
// });



// Get all data
app.get('/data', (req, res) => {
  res.json(data);
});

// Get item by ID
app.get('/data/:id', (req, res) => {
  const id = req.params.id;
  const item = data.find(d => d.id == id);
  if (item) {
    // console.log(item);
    res.json(item);
  } else {
    console.log(id + item);
    res.status(404).send({ message: 'Item not found' });
  }
});


app.delete('/data/:id/feature/:index', (req, res) => {
    const id = req.params.id;
    const index = req.params.index;


    const item = data.find(d => d.id == id);
    if (item && index) {
          item.feature.splice(item.feature[index],1)
res.json(item.feature)
    } else {
      res.status(404).send({ message: 'Item not found' });
    }
  });

// Create new data (POST)
app.post('/data', (req, res) => {
  const newItem = req.body;
  
  // Ensure the new item has an id
//   if (!newItem.id) {
//     return res.status(400).send({ message: 'ID is required' });
//   }
// let id = data.length+1
  // Add the new item to the data array
 
  data.push({id:data.length+1,feature:newItem });
  res.status(201).json(newItem);
});

// Update an existing item (PUT)
app.put('/data/:id', (req, res) => {
  const id = req.params.id;
  const index = data.findIndex(d => d.id === id);
  
  if (index !== -1) {
    // Update the item with the new data
    data[index] = req.body;
    res.json(data[index]);
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});

// Delete an item by ID (DELETE)
app.delete('/data/:id', (req, res) => {
  const id = req.params.id;
  const index = data.findIndex(d => d.id === id);
  
  if (index !== -1) {
    // Remove the item from the array
    const deletedItem = data.splice(index, 1);
    res.json(deletedItem);
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});