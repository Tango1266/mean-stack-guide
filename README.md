# Description
This project was created for educational purposes. It follows the udemy course [The MEAN Stack Guide](https://www.udemy.com/angular-2-and-nodejs-the-practical-guide/)

## Getting Started - Development
The project comprises an Angular frontend, NodeJs backend, and a MongoDB persistence layer.
Provided that all dependencies are installed, all components can be launched with scripts within the project directory.

### Configuration
Visit ```nodemon.json``` in the project directory to specify environment variables like database connection, server ports, and encryption keys. 
For production, those environment variables need be set in the hosting service.

### Start developing - Run components

#### Step 1: Run MongoDB instance
For development, docker is used to run MongodDb.  
- In project dir execute ```$npm run start:db```

#### Step 2: Run NodeJS instance
- Run server with local database 
  - In project dir execute ```$npm run start:devserver```.
- Run server with cloud database
  - In project dir execute ```$npm run start:server```.

#### Step 3: Run Angular instance
- In project dir execute ```$ng serve```
