import app from './app.js'
import connectDB from './config/dbConfig.js';

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
    console.log(`App is running at http://localhost:${PORT}`);
    await connectDB();
})


