import express from 'express';
import router from './routes/routes';
import imageRouter from './routes/cloudinaryRoutes';
import menuRouter from './routes/menuRoute';
import cloudinaryRouter from './routes/cloudinaryRoutes';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/api/items', router);
app.use('/', menuRouter)
app.use('/images', imageRouter)
app.use('/cloudinary', cloudinaryRouter)

export default app;
