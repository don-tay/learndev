# LearnDev Backend API

Backend API for LearnDev, an online programming bootcamp marketplace platform.

## Getting Started

### Package manager

Yarn is the recommended package manager for LearnDev.

### First time setup

#### Install all dependencies

On the command line in the root directory of LearnDev, run 
```yarn install```

#### Set up environment variables:

##### Follow the steps below:

1. Under directory `/config`, create file `config.env`.

2. Open `sample-config.env` and copy the entire code over to `config.env`.

3. Under `config.env`, fill in the missing fields and modify existing fields, where necessary.

#### Database setup

##### Create a new instance of MongoDB

Refer to this [guide](https://docs.atlas.mongodb.com/getting-started/) on hosting a MongoDB database with MongoDB Atlas.

##### Connect MongoDB instance to the LearnDev web server

Copy the MongoDB Connection String (see [guide](https://docs.atlas.mongodb.com/tutorial/connect-to-your-cluster/)), and paste it into the `MONGO_URI` field in the `config.env` file created.

#### Database population

##### Load seeder files

On the command line in the root directory of LearnDev, run
```node seeder.js -i```

##### Destroy all data

On the command line in the root directory of LearnDev, run
```node seeder.js -d```

### Running the server

#### Run in production

On the command line in the root directory of LearnDev, run 
```yarn start```

#### Run in development environment

On the command line in the root directory of LearnDev, run 
```yarn run dev```

## Documentation

Stay tuned for the release of LearnDev's API documentation.
