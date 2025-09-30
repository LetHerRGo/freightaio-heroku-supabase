# FreightAIO 
www.freightaio.com

## Overview

FreightAIO will be able to track the rail movement of sea container in Canada wide.

### Problem Space

The traditional tool is CN tracker, which is hard to use and has limited access to client or oversea agent. User can easily miss super important updates or information.

### User Profile

Target users will be the freight forwarder operations, canadian importers (client), and oversea agents. There will be a login function and different user will have different role to access associated features after login.

### Features

List the functionality that your app will include. These can be written as user stories or descriptions with related details. Do not describe _how_ these features are implemented, only _what_ needs to be implemented.

Operations will have access to all features, will be able to track containers' movement and get all information. Client will be only see ETA of a container. Oversea agent will have access to track a particular container and see all containers' ETA.

Login function.
Tracking a single container.
Adding multiple containers and save as users' own table, asign to associated agent and client.
Showing most updated information of each container.
Showing delivery appointment for each container.
Retrieving all movements log for each container.
Sorting by urgency, in order of time sensitivity.
Sorting by agents name, clients name.

## Implementation

### Tech Stack

- React
- TypeScript
- Scss
- MySQL
- Express
- Client libraries:
  - react
  - react-router
  - axios
- Server libraries:
  - knex
  - express
  - bcrypt for password hashing



### Sitemap

-Login page
-Single container tracking page
-Associated user's tracking table
-Key in container page

<img width="1529" height="963" alt="login" src="https://github.com/user-attachments/assets/68191641-7686-491a-8794-6ad42decb06c" />

<img width="2184" height="1206" alt="trace" src="https://github.com/user-attachments/assets/e7f5e094-0ad8-44f7-bc21-dc4df9f9f011" />

<img width="1188" height="705" alt="tracelog" src="https://github.com/user-attachments/assets/bce02e6d-66bb-4cdc-b672-e6bcc54a91e2" />

<img width="2157" height="1194" alt="track" src="https://github.com/user-attachments/assets/2495fb83-2ef8-4f97-baab-a71e87505383" />

<img width="2417" height="1200" alt="addshipment" src="https://github.com/user-attachments/assets/88db78a7-cbc1-4cdc-be67-1e9a12601474" />

<img width="1591" height="978" alt="database" src="https://github.com/user-attachments/assets/14504803-2e68-42b0-ab6c-749f3c30b68f" />







