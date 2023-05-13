# Multilingual Semantic Search for Video

<img width="1108" alt="Screenshot 2023-05-13 at 02 49 34" src="https://github.com/lawalbolaji/Multilingual-Semantic-Search-for-Video/assets/22568024/e9ab52e8-c11b-4d48-a74e-e6ad49b5e5ce">

A significant amount of valuable information is publicly available in video form, unfortunately, a large proportion of this is long form content and spans hours. Learners and innovators need a way to be able to access relevant information quickly. 

Our multilingual semantic search for video enables you to just skip to that part of the video that has the information you need, and accelerate information retreieval from videos.

This project was built as a submission for [CohereAIHack](https://ai6lagos.devpost.com/) 2023 by [Abdulrasheed Bolaji Lawal](/) and [Abdulgafar Tobi Jimoh](https://github.com/tobi-ace)

## Features
- Semantically Search through videos in over a 100 languages
- Seek through search results to find most relevant content quickly

## Installation
### Using Docker
**Requires docker to be installed**
1. Get a free API Key at [Cohere](https://cohere.com)
2. Clone the repo
   ```sh
   git clone https://github.com/lawalbolaji/Multilingual-Semantic-Search-for-Video
   ```
3. In the project's root directory, run:
    ```sh
    cp .env.example .env
    ```
4. Update the variables in .env with your configurations
5. Boot up your docker container:
   ```sh
   docker compose --env-file .env -f .docker-compose.yml up
   ```
6. Client is now running at http://localhost:5173
7. Server is now running at http://localhost:3100

### On local Machine
**Requires Python3 and NodeJs ^16.* to be installed**

_instructions on how to install_

## Known Issues
The first time you fetch the youtube videos, you need to authenticate your machine with google servers for youtube access. We will automate this in a future release but as a stop gap, you can solve this problem by taking the following steps:

   **_While docker is running, i.e after step 6_**:
 1. Go to http://localhost:5317 in the browser
 2. In the video url search box, type in a valid youtube url
 3. click on Get video
 4. Go to the terminal and copy the provided token
 5. Navigate to https://www.google.com/device and enter the provided token

<p align="right">(<a href="#readme-top">back to top</a>)</p>


