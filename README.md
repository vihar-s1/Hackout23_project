# Splitwise Backend Clone

A simple backend for an application like splitwise to share expenses between groups of people.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Usage](#installation-and-usage)
- [Endpoints](#endpoints)
  - [User Endpoints](#user-endpoints)
  - [Group Endpoints](#group-endpoints)

## Getting Started

- The `src` folder contains the main code for the backend. `SQLfiles` contains SQL codes that need to be run directly and cannot be configured via `Node.JS` modules like functions and triggers.
  - The files are executed on booting the server.
- Following are the requirements to fullfill before starting the project, and steps on how to set up and run the backend on your system.

### Prerequisites

The System on which the backend is running must have:

- Node.js
- npm (Node Package Manager) or yarn
- PostgreSQL

### Installation and Usage

A step-by-step guide on how to install and configure your project:

1. Clone the repository:

    ```bash
    git clone https://github.com/vihar-s1/Splitwise-Backend-Clone.git
    cd Splitwise-Backend-Clone
    ```

2. Install the dependecies/ required Modules:

    ```bash
    npm install
    # If you installed Node Package Manager (npm)
    ```

    ```bash
    yarn install
    # If you installed Yarn on your computer
    ```

3. Configure the environment file:

    ```bash
    # CONTENTS OF .ENV FILE
    FRONTEND_URL="*" # FRONT URL
    PORT=5000   # BACKEND PORT

    # DataBase Variables
    DB_USERNAME="<username-under-which-the-database-exists>"
    DB_PASSWORD="<corresponding-password>"
    DB_HOST="<url-of-where-the-database-is-hosted>"
    DB_PORT=<port-on-which-database-is-listening>
    DB_NAME="<name-of-the-database>"

    # JWT variables
    JWT_SECRET="<jwt-secret-used-to-sign-authentication-tokens>"
    TOKEN_LIFE="<time-period-after-which-token-expires>"
    ```

    > You can alternately use the `.env.sample` file present in the root for development process by renaming it to `.env`.

    > NOTE THAT THE VALUES OF ENVIRONMENT VARIABLES IN `.env.sample` ARE FOR LOCAL DEVELOPMENT SERVER AND NOT VALID/SECURE FOR DEPLOYED SERVER APPLICATION.

4. Run the Project:

    ```bash
    npm run start
    ```

    ```bash
    yarn start
    ```

## Endpoints

Currently, following are the existing endpoints:

### User Endpoints

- _(POST) **/api/user/new-user**_: Create a new user with unique email if not already exists. Return authentication token on success.
- _(POST) **/api/user/login**_: Login a user using email and password. Returns authentication token on success.
- _(GET) **/api/user/profile**_: Fetch details of the user whose valid authentication token is provided.
- _(PUT) **/api/user/update-profile**_: Update user profile details.
- _(PUT) **/api/user/change-password**_: Change user password using authenticatoin token and old-new password method.
- _(DELETE) **/api/user/delete**_: Delete user profile.

### Group Endpoints

- _(POST) **/api/group/create-group**_: Create a new group and add its members.
- _(GET) **/api/group/:groupId**_: get details of the group with ID groupId if authenticated user belonging to that group.
- _(PUT) **/api/group/update/:groupId**_: Update group details if authenticated user belongs to that group.
- _(DELETE) **/api/group/delete/:groupId**_: Delete the group if authenticated user belongs to that group.
