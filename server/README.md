# WikiUD Project

This project is a Node.js application that uses Express, RabbitMQ, and MongoDB. It includes a publisher and consumer for RabbitMQ, and it saves messages to MongoDB.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- MongoDB installed and running.
- RabbitMQ installed and running.

## Installation

1. **Clone the repository**:

    ```sh
    git clone https://github.com/your-username/WikiUD.git
    cd WikiUD
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

## Packages Used

- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **morgan**: HTTP request logger middleware for Node.js.
- **mongoose**: Elegant MongoDB object modeling for Node.js.
- **amqplib**: AMQP 0-9-1 library and client for Node.js.

### Installing Packages

To install the required packages, run the following command:

```sh
npm install express morgan mongoose amqplib
```
### MongoDB

Ensure MongoDB is installed and running. You can start MongoDB with the following command:

```sh
mongod --dbpath <path_to_your_db_directory>
```