# Hostel Championship

A full-stack web application designed to manage and display standings, matches, teams, and a gallery for a Hostel Sports Championship. The application features a React-based frontend built with Vite and Tailwind CSS, and a Node.js/Express backend connected to a MongoDB database.

---

## Project Structure

```
Hostel Championship/
├── client/          # Frontend React Application (Vite)
└── server/          # Backend Express API
```

---

## Tech Stack

### Frontend (`client/`)
- **Framework/Build Tool**: React (Vite)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Routing**: React Router DOM
- **Animation**: Framer Motion
- **HTTP Client**: Axios

### Backend (`server/`)
- **Runtime & Framework**: Node.js, Express
- **Database**: MongoDB via Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Dev Tools**: Nodemon

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+ recommended) and [MongoDB](https://www.mongodb.com/) installed on your local machine, or access to a MongoDB Atlas cluster.

---

### Backend Setup (`server/`)

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `server` directory and configure the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ADMIN_SECRET=your_admin_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```

4. **Start the server:**
   - For development (with auto-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

---

### Frontend Setup (`client/`)

1. **Navigate to the client directory:**
   ```bash
   cd ../client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## Collaborator Guide (Fork & Sync Workflow)

To contribute to this repository or update it from your fork, follow this workflow:

### 1. Fork the Repository
Click the **Fork** button at the top-right of the original GitHub repository page to create a copy under your own GitHub account.

### 2. Clone Your Fork
Clone your newly forked repository to your local machine:
```bash
git clone https://github.com/YOUR_USERNAME/Hostel-Championship.git
cd Hostel-Championship
```

### 3. Add the Upstream Remote
To keep your local repository in sync with the original repository (upstream), add it as a remote:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/Hostel-Championship.git
```
Verify the remotes:
```bash
git remote -v
```

### 4. Keeping Your Fork Up-to-Date
Before starting any new work, fetch the latest changes from the original repository:
```bash
# Fetch upstream changes
git checkout main
git pull upstream main

# Push the updated main branch to your fork
git push origin main
```

### 5. Create a Feature Branch
Create a new branch for your changes:
```bash
git checkout -b feature/your-feature-name
```

### 6. Make Changes and Commit
Make your modifications, staging and committing them with clear messages:
```bash
git add .
git commit -m "Add description of changes"
```

### 7. Push and Create a Pull Request
Push your branch to your forked repository:
```bash
git push origin feature/your-feature-name
```

