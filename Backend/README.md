# Hark Backend API

This is the backend API for the Hark project, built with Node.js, Express, and MongoDB. It provides authentication, project management, task tracking, and workspace collaboration features.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root of the `Backend` directory and add the following environment variables:


For production deployment:
1. Set `NODE_ENV=production`.
2. Set a strong `JWT_SECRET`.
3. Set `CORS_ORIGIN` to your frontend domain.
4. Use a production-ready MongoDB instance (e.g., MongoDB Atlas).


## Running the Server

Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your specified PORT).

## API Routes

- **Auth**: `/api/auth` (Register, Login, Profile)
- **Workspaces**: `/api/workspaces`
- **Projects**: `/api/projects`
- **Tasks**: `/api/tasks`
- **Users**: `/api/users`
