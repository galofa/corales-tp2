import express from 'express';
import imageRouter from './routes/uploadReel';
import menuRouter from './routes/menuRoute';
import uploadRouter from './routes/uploadReel';
import multer from 'multer';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/', menuRouter)
app.use('/images', imageRouter)
app.use('/upload',  uploadRouter )

export default app;
