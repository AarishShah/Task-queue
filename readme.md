# Node.js API Task Queuing with Rate Limiting (MongoDB)

## Overview

This project implements a Node.js API that accepts user tasks and enforces **rate limiting** of 1 task per second and a maximum of 20 tasks per minute for each user. Tasks exceeding the rate limit are queued ensuring that no tasks are dropped. MongoDB is used to store the task queue and manage rate limits. Tasks are logged to a file with a timestamp once completed.

### Features

- Rate limiting: 1 task per second and 20 tasks per minute per user.
- Task queuing system: Tasks are queued and processed in sequence.
- Task logging: Task completions are logged in a file with user ID and timestamp.
- Resilience: The system ensures no requests are dropped, and tasks are processed even if rate limits are exceeded.

---

## Project Structure

```
Task_Queue/
│
├── node_modules/
├── src/
│   ├── db/
│   │   └── mongoose.js            # MongoDB connection setup
│   ├── middleware/
│   │   └── rateLimiter.js         # Middleware for rate limiting
│   ├── models/
│   │   └── taskModel.js           # MongoDB schema for task queue
│   ├── routers/
│   │   └── taskRouter.js          # Task API route
│   ├── utils/
│   │   └── logger.js              # Task logging utility
│   └── index.js                   # Main entry point of the app
├── .env                           # Environment variables (MongoDB connection URI)
├── .gitignore                     # Ignore node_modules, .env, and log files
├── package-lock.json
├── package.json                   # Dependencies and scripts
└── task_logs.log                  # File to store task completion logs

```

---

## Prerequisites

- **Node.js** (v14 or above)
- **MongoDB** (Running locally or via a cloud instance like MongoDB Atlas)

---

## Setup Instructions

### Step 1: Clone the repository

```bash
git clone https://github.com/AarishShah/Task-queue.git

```

### Step 2: Install dependencies

Make sure you have Node.js and MongoDB installed, then run:

```bash
npm install

```

### Step 3: Set up environment variables

Create a `.env` file in the root directory and add the following to specify your MongoDB connection string:

```
# Database Configuration
DB_USERNAME=YOUR_USERNAME
DB_PASSWORD=YOUR_PASSWORD
DB_CLUSTER_URL=YOUR_CLUSTER_URL
APP_NAME=YOUR_APP_NAME

```

### Step 4: Start the server

To run the server, use the following command:

```bash
npm start

```

or if you want to test the application using `nodemon`, use the following command:

```
npm run dev

```

The server will start on port **5000** (or the port specified in your `.env` file).

---

## Testing the API

You can use **Postman** or any other HTTP client to test the API.

### 1. Task Submission

- **URL**: `POST http://localhost:3000/api/v1/task`
- **Request Body**:

```json
{
  "user_id": "123"
}

```

- **Response**: On success, you will receive:

```json
{
  "message": "Task queued"
}

```

If the rate limit is exceeded, you will receive a `429` (Too Many Requests) response:

```json
{
  "message": "Rate limit exceeded. Task queued."
}

```

### 2. Checking Task Logs

After a task is processed (with a 1-second delay), check the `task_logs.log` file to verify task completion:

```
123-task completed at-<timestamp>

```

Each completed task will be logged with the `user_id` and a timestamp.

---

## Key Components

### 1. **Rate Limiting (src/middleware/rateLimiter.js)**

https://github.com/AarishShah/Task-queue/blob/main/src/middleware/rateLimiter.js

The rate limiting mechanism is user-based and ensures no user processes more than 1 task per second or 20 tasks per minute. Any requests exceeding this limit are queued and handled after the appropriate delay.

### 2. **Task Queueing (src/routers/taskRouter.js)**

https://github.com/AarishShah/Task-queue/blob/main/src/routers/taskRouter.js

When a task is received, it is saved in the MongoDB task queue with the status `queued`. Tasks are processed asynchronously and once completed the task status is updated to `completed`.

### 3. **Task Logging (src/utils/logger.js)**

https://github.com/AarishShah/Task-queue/blob/main/src/utils/logger.js

Each task completion is logged in the `task_logs.log` file using the `winston` logging library. The log includes the user ID and the timestamp at which the task was completed.

---

## Handling Failures and Edge Cases

- **Rate Limit Exceeded**: If a user exceeds the rate limit, their task is queued, and they are notified with a `429 Too Many Requests` response.
- **Invalid User ID**: If no user ID is provided in the request body, a `400 Bad Request` response is returned.
- **Error Handling**: All errors are caught and logged, and appropriate responses are returned to the user.
- **No Task Dropped**: Even when the rate limit is exceeded no task is dropped. All tasks are processed sequentially.