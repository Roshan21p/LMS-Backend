import app from './app.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';

app.listen(PORT, async () => {
  console.log(`App is running at http://localhost:${PORT}`);
  await connectDB();
});
