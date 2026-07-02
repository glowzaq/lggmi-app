import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import eventRoutes from './modules/events/events.routes';
import sermonRoutes from './modules/sermons/sermons.routes'
import attendanceRoutes from './modules/attendance/attendance.routes';
import donationRoutes from './modules/donations/donations.routes';
import announcementRoutes from './modules/announcements/announcements.routes';
import prayerRequestRoutes from './modules/prayer-requests/prayer-requests.routes';
import familyRoutes from './modules/families/families.routes';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/prayer-requests', prayerRequestRoutes);
app.use('/api/families', familyRoutes);

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