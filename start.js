
const path = require('path');

const Server = require('./server/server');
const App = require('./server/app');


App(new Server(
  (process.env.PORT || 3001),   // port
  path.join(__dirname, 'public')   // public folder
));
