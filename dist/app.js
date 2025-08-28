import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import connectToDB from './utils/connectToDb.js';
import authRouter from './routes/auth.routes.js';
dotenv.config();
connectToDB();
const app = express();
// In production behind a proxy (e.g., Render/Heroku), enable trust proxy for secure cookies
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
// Parse JSON bodies
app.use(express.json());
// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // Only send secure cookies in production; allow HTTP in dev to avoid issues
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    }
}));
app.use('/api', authRouter);
const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});
