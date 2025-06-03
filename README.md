# My Favorite Movies App

A web application to manage your personal movie collection. Keep track of all the movies you've watched, mark your favorites, and filter through your collection with ease.

## Features

- **User Authentication**: Sign up and log in to access your personal movie collection
- **Movie Management**: Add, remove, and mark movies as favorites
- **Search & Filter**: Easily find movies by title or director, and filter by favorites
- **Responsive Design**: Works on desktop and mobile devices
- **Theme Support**: Switch between light and dark themes based on your preference

## User Flows

### Authentication Flow
1. New users can sign up with name, email, and password
2. Existing users can log in with email and password
3. Users stay logged in between sessions unless they explicitly log out

### Movie Management Flow
1. From the dashboard, users can add new movies to their collection
2. For each movie, users can enter:
   - Title (required)
   - Release year
   - Director (required)
   - Movie poster URL
   - Genres (multiple selections)
   - Personal notes
3. Users can mark movies as favorites by clicking the star icon
4. Movies can be deleted from the collection

### Browsing Flow
1. All movies are displayed in a grid layout on the dashboard
2. Users can search for movies by title or director
3. Users can filter to show all movies or only favorites
4. The theme toggle in the navbar allows switching between light and dark modes

## Technical Details

- Built with React
- User data and movies stored in browser localStorage
- Theme preference persists between sessions
- Responsive design using CSS Grid and Flexbox

## Future Improvements

- Movie recommendation engine
- Import movies from external APIs
- Share movie collections with friends
- Rating system for movies
- Watch history tracking

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
