# Readme is a simple headless blog engine

![image](https://up.htmlacademy.ru/assets/intensives/nodejs-2/6/projects/readme/image.jpeg?v=202404260259)
## About the Project
Readme is a simple headless blog engine built using a microservice architecture and the modern Nest.js framework. The project is completed and consists of several microservices, each handling a specific task.

## Project Overview
The project is a backend for a multi-user blog with various publication formats (video, text, quote, photo, link) and the ability to subscribe to updates from other users, influencing the user's content feed.

## Technical Requirements
The project uses a microservice architecture where each service handles a specific task and may have its own database. The databases used are MongoDB and PostgreSQL.

All services are developed in TypeScript and housed in a monorepository using NX. The project runs on the latest LTS release of Node.js.

## Technologies
1. Node.js (LTS release)
2. Nest.js (framework)
3. TypeScript (programming language)
4. PostgreSQL (database)
5. MongoDB (database)
6. NX (monorepository)
7. RabbitMQ (message broker)

## Use Cases
1. User registration.
2. User authentication using JWT.
3. Creating new blog posts of various types: video, text, quote, photo, link.
4. Viewing detailed information about a post.
5. Editing blog posts.
6. Deleting blog posts.
7. Uploading images for blog posts.
8. Commenting on blog posts.
9. Liking posts and counting the number of likes.
10. Pagination for posts.
11. Retrieving a list of posts.
12. Sorting posts by popularity, creation date, number of likes, and number of comments.
13. Reposting blog entries.
14. User feed.
15. Categorizing posts by tags.
16. Email notifications about new posts.
17. Searching posts by title.
18. Retrieving detailed information about a user.
19. Changing the user's password.
20. Subscribing to updates from other users.
