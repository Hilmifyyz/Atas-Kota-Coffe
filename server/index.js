import express from 'express';
import cors from 'cors';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate required environment variables
if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
    console.error('Error: Midtrans API keys are not configured in .env file');
    process.exit(1);
}

const app = express();

// Configure CORS for Vite development server
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.PRODUCTION_URL || 'https://your-production-url.com'
        : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));

// Add cookie parser middleware
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('SameSite', 'None');
    res.header('Secure', 'true');
    next();
});

// Create Midtrans Client
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Generate transaction token
app.post('/api/payment/token', async (req, res) => {
    try {
        const { orderId, amount, items, customerDetails } = req.body;

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount
            },
            credit_card: {
                secure: true,
                save_card: false,
                authentication: true
            },
            callbacks: {
                finish: `${process.env.NODE_ENV === 'production' 
                    ? process.env.PRODUCTION_URL 
                    : 'http://localhost:5173'}/complete-payment`
            },
            item_details: items.map(item => ({
                id: String(item.id),
                price: parseInt(item.price),
                quantity: parseInt(item.quantity),
                name: String(item.name || 'Product')
            })),
            customer_details: {
                first_name: String(customerDetails.first_name || 'Customer'),
                email: String(customerDetails.email || 'customer@example.com')
            }
        };

        const token = await snap.createTransaction(parameter);
        res.json({ token: token.token });
    } catch (error) {
        console.error('Error generating payment token:', error);
        res.status(500).json({ error: 'Failed to generate payment token' });
    }
});

// Handle payment notification from Midtrans
app.post('/api/payment/notification', async (req, res) => {
    try {
        const notification = await snap.transaction.notification(req.body);
        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}`);
        console.log(`Transaction status: ${transactionStatus}`);
        console.log(`Fraud status: ${fraudStatus}`);

        // Handle the transaction status
        if (transactionStatus === 'capture') {
            if (fraudStatus === 'challenge') {
                // TODO: handle challenge payment
            } else if (fraudStatus === 'accept') {
                // TODO: handle successful payment
            }
        } else if (transactionStatus === 'settlement') {
            // TODO: handle successful payment
        } else if (transactionStatus === 'cancel' ||
            transactionStatus === 'deny' ||
            transactionStatus === 'expire') {
            // TODO: handle failed payment
        } else if (transactionStatus === 'pending') {
            // TODO: handle pending payment
        }

        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error('Error processing payment notification:', error);
        res.status(500).json({ error: 'Failed to process payment notification' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 