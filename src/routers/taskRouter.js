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

    // Simulate task processing
    setTimeout(async () =>
    {
      await task(user_id);
      await TaskModel.updateOne({ _id: newTask._id }, { status: 'completed' });
    }, 1000);

    res.status(200).send('Task queued');
  } catch (error)
  {
    res.status(500).send('Internal server error');
  }
});

module.exports = taskRouter;
