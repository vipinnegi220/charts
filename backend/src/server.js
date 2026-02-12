const app = require('./app');
const { port } = require('./config/env');
require('./utils/initDb');

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
