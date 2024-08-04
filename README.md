# Project Build with Docker and Nodejs

1. Create .env file and copy infomation from email
2. Run `docker compose up -d --build` command to run Postgresql and Redis
3. Run `npm i` command to install dependency
4. Run `npm run migrate` command
5. Run `npm run db:push` command
6. Run `npm run dev` command

Server listening at: http://localhost:8080

HealthChecker at: http://localhost:8080/api/healthchecker
