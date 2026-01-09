const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
    origin: '*', // In production this should be specific
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('new_booking_alert', (data) => {
        io.emit('new_booking_alert', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// --- Mock Data Store for fallback ---
// Since we are restoring blindly, we'll setup basic routes to prevent 404s
// Ideally this should connect to a DB.

// Basic Routes
app.get('/', (req, res) => {
    res.send('GharKeSeva Backend Running');
});

// Mock Booking Route
app.post('/api/auth/bookings/create', (req, res) => {
    console.log("Booking Received:", req.body);
    // Simulate success
    setTimeout(() => {
        res.status(201).json({ success: true, message: "Booking Created", data: req.body });
    }, 1000);
});

// Mock Services Route to prevent empty page
app.get('/api/services', (req, res) => {
    // Return some mock data if DB is not connected
    const mockServices = [
        { _id: '1', packageName: 'Split AC Service', serviceCategory: 'AC Service', priceAmount: 599, packageImage: 'https://via.placeholder.com/150', isServiceActive: true },
        { _id: '2', packageName: 'Window AC Service', serviceCategory: 'AC Service', priceAmount: 499, packageImage: 'https://via.placeholder.com/150', isServiceActive: true },
        { _id: '3', packageName: 'AC Installation', serviceCategory: 'AC Service', priceAmount: 1499, packageImage: 'https://via.placeholder.com/150', isServiceActive: true },
        { _id: '4', packageName: 'Gas Charging', serviceCategory: 'AC Service', priceAmount: 2500, packageImage: 'https://via.placeholder.com/150', isServiceActive: true },
        { _id: '5', packageName: 'Classic Cleaning (2 Bathrooms)', serviceCategory: 'Cleaning', priceAmount: 899, packageImage: 'https://via.placeholder.com/150', isServiceActive: true },
    ];
    // Filter logic would go here
    res.json(mockServices);
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
