import app from "./app";
import authRoutes from './routes/authRoutes';
import { connectDB } from "./config/connectDB";
import events from 'events'
const emitter = events.EventEmitter;
const bus = new emitter();
bus.setMaxListeners(20);  // Increase to 20 (or any number you need)

bus.on('exit', () => {
  console.log('Exit listener triggered');
});
const PORT = process.env.PORT || 5000;

app.use('/api',authRoutes);
connectDB()
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
