import express from 'express';
import imageRouter from './routes/uploadReel';
import uploadRouter from './routes/uploadReel';
import userRouter from './routes/userRoute';
import { applyTimeout, haltOnTimedout } from './middleware/timeOutMiddleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(applyTimeout)
app.use(haltOnTimedout)

// Routes
app.use('/images', imageRouter)
app.use('/upload', uploadRouter )
app.use('/auth', userRouter)

export default app;
