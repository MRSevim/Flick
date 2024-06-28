# Flick Articles

These are the codes for the website [Flick Articles](https://www.flickarticles.com/). Project is made with React (Create React App) in the frontend and Nodejs (Express) and Mongodb (Mongoose) in the backend. Development servers runs at different ports whereas production server is at a single port since production build is served statically via backend.

## Running development servers

If you want to run this app on your machine, do the following steps

- Download or clone the repository and Create .env file in root of the directory.
- Write PORT=5000 in the .env file and save (You can change the port if you want)
- In your development terminal run:

```bash
cd ./backend
npm install
npm run dev
```

Then your backend should be live at localhost:5000 (or in your port in .env file)

- In a seperate terminal, from root directory run:

```bash
cd ./frontend
npm install
npm run start
```

Your frontend should be live at port written at the terminal.

It runs based on the env file in the root, if for some reason it does not run, try adding empty .env file to root directory. Yet please note that for the whole app to function appropriately, environment variables should exist.
