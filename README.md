AMK Server - Docker Setup

This setup runs:

Node.js backend

MongoDB

Docker Compose

1. Create .env

Add this in the project root:

MONGODB_URI=mongodb://mongodb:27017/amko
JWT_SECRET=your-secret
JWT_EXPIRES_IN=1h

2. Make sure Docker Desktop is running

Check:

docker info

3. Build and start the project

Run from the project root:

docker compose up --build

After the first build, you can normally start it with:

docker compose up

4. Run in background

docker compose up -d

5. Check running containers

docker compose ps

6. View backend logs

docker compose logs -f backend

7. View MongoDB logs

docker compose logs -f mongodb

8. Stop the setup

docker compose down

URLs

Backend:

http://localhost:5000

MongoDB Compass:

mongodb://localhost:27017/amko

Development

When Docker Compose is running, save changes in VS Code and Nodemon will restart the backend automatically.

If Dockerfile or dependencies change, rebuild:

docker compose up --build