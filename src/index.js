const express = require('express');
require('dotenv').config();

// Connect to MongoDB
require("./db/mongoose");

const taskRouter = require('./routers/taskRouter');
const app = express();

// Parse JSON bodies
app.use(express.json());

// Task route
app.use('/api/v1', taskRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
