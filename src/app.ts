import express from 'express';
import uploadRouter from './routes/uploadReel';
import userRouter from './routes/userRoute';
import { applyTimeout, haltOnTimedout } from './middleware/timeOutMiddleware';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(applyTimeout)
app.use(haltOnTimedout)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/upload', uploadRouter )
app.use('/auth', userRouter)

export default app;
