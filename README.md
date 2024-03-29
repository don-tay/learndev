# LearnDev Backend API

Backend API for LearnDev, an online programming bootcamp marketplace platform.

## Getting Started

### First time setup

#### Install all dependencies

On the command line in the root directory of LearnDev:

```
npm i
```

#### Set up environment variables:

##### Follow the steps below:

1. Under directory `/config`, create file `config.env`.

2. Open `config.env.env` and copy the entire code over to `config.env`.

3. Under `config.env`, fill in the missing fields and modify existing fields, where necessary.

#### Database setup

##### Create a new instance of MongoDB

Refer to this [guide](https://docs.atlas.mongodb.com/getting-started/) on hosting a MongoDB database with MongoDB Atlas.

##### Connect MongoDB instance to the LearnDev web server

Copy the MongoDB Connection String (see [guide](https://docs.atlas.mongodb.com/tutorial/connect-to-your-cluster/)), and paste it into the `MONGO_URI` field in the `config.env` file created.

#### Database population

On the command line in the root directory of LearnDev:

```
#### Load seeder files
node seeder.js -i

#### Destroy all data
node seeder.js -d
```

### Running the Application

On the command line in the root directory of LearnDev:

```
#### Run in production
npm start

#### Run in development environment
npm run dev
```

## Documentation

[Apiary documentation](https://learndev.docs.apiary.io/)

## License

-   Version: 1.0.0
-   License: MIT
