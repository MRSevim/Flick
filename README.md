# Flick Articles

These are the codes for the website [Flick Articles](https://www.flickarticles.com/). Project is made with React (Create React App) in the frontend and Nodejs (Express) and Mongodb (Mongoose) in the backend. Development servers runs at different ports whereas production server is at a single port since production build is served statically via backend.

## Running development servers

If you want to run this app on your machine, do the following steps

- In your development terminal run:

```bash
cd ./backend
npm install
npm run dev
```

Then your backend should be live at localhost:5000

-In a seperate terminal, from root directory run:

```bash
cd ./frontend
npm install
npm run start
```

Your frontend should be live at port written at the terminal.

It runs based on the env file in the root, if for some reason it does not run, try adding empty .env file to root directory. Yet please note that for the whole app to function appropriately, environment variables should exist.
