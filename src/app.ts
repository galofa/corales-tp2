import express from 'express';
import imageRouter from './routes/uploadReel';
import menuRouter from './routes/menuRoute';
import uploadRouter from './routes/uploadReel';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/', menuRouter)
app.use('/images', imageRouter)
app.use('/cloudinary', uploadRouter)
app.use('/upload', )

export default app;
