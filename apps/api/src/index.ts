import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './modules/auth/auth.routes';
import memberRoutes from './modules/members/members.routes';
import eventRoutes from './modules/events/events.routes';
import sermonRoutes from './modules/sermons/sermons.routes'
import attendanceRoutes from './modules/attendance/attendance.routes';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/sermons', sermonRoutes)

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        message: 'LGGMI App API is running',
        timestamp: new Date().toISOString(),
    })
})

app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
})

export default app