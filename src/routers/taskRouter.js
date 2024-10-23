const express = require('express');
const taskRouter = express.Router();
const TaskModel = require('../models/taskModel');
const rateLimiterMiddleware = require('../middleware/rateLimiter');
const { logTask } = require('../utils/logger');

// Task Function (provided)
async function task(user_id)
{
  const timestamp = Date.now();
  logTask(`${user_id}-task completed at-${timestamp}`);
  console.log(`${user_id}-task completed at-${timestamp}`);
}

// Object to store queues per user
const userQueues = {};

// Function to process the queue for each user
const processQueue = async (userId) =>
{
  const queue = userQueues[userId];

  while (queue.length > 0)
  {
    // Get the first task in the queue
    const currentTask = queue[0];

    // Simulate task processing
    await task(userId);
    await TaskModel.updateOne({ _id: currentTask._id }, { status: 'completed' });

    // Remove the processed task from the queue
    queue.shift();
  }
};

// POST route to handle task creation
taskRouter.post('/task', rateLimiterMiddleware, async (req, res) =>
{
  const { user_id } = req.body;

  try
  {
    const newTask = new TaskModel(
      {
        user_id,
        timestamp: Date.now(),
        status: 'queued',
      }
    );

    await newTask.save();    

    // Add the task to the user's queue
    if (!userQueues[user_id])
    {
      userQueues[user_id] = [];
    }
    userQueues[user_id].push(newTask);

    // If this is the only task in the queue, start processing
    if (userQueues[user_id].length === 1)
    {
      processQueue(user_id);
    }

    res.status(200).send('Task queued');
  } catch (error)
  {
    res.status(500).send('Internal server error');
  }
});

module.exports = taskRouter;
