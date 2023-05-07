# Multilingual Semantic Search for Video

We've all wanted to just skip to the part of a video that has the information we need. Our multilingual semantic search for video enables you to just skip to that part ofx the video that has the information you need.

This project was built a submission for Cohere's 2023 AI Hackathon by Abdulrasheed Bolaji Lawal and Abdulgafar Tobi Jimoh


## Installation

_Instructions on how to Install._

1. Get a free API Key at [Cohere](https://cohere.com)
2. Clone the repo
   ```sh
   git clone https://github.com/lawalbolaji/Multilingual-Semantic-Search-for-Video
   ```
3. In the project's root directory, run:
    ```sh
    cp .env.example .env
    ```
4. Boot up your docker container:
   ```sh
   docker compose --env-file .env -f .docker-compose.yml up -d
   ```
5. Client is now running at http://localhost:5317
6. Server is now running at http://localhost:3100

### Note: You need to take some additional steps to authenticate with google servers for youtube access
   While docker is running, i.e after step 6:
 1. Run:
    ```sh
    docker logs -f server
    ```
 2. Go to http://localhost:5317 in the browser
 3. In the video url search box, type in a valid youtube url
 4. click on Get video
 5. Go to the terminal and copy the provided token
 6. Navigate to https://www.google.com/device and enter the provided token

<p align="right">(<a href="#readme-top">back to top</a>)</p>


