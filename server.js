import express from 'express';
import cors from 'cors';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json());

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
                order_id: String(orderId),
                gross_amount: parseInt(amount)
            },
            credit_card: {
                secure: true
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

        console.log('Request parameters:', JSON.stringify(parameter, null, 2));

        const transaction = await snap.createTransaction(parameter);
        console.log('Midtrans response:', JSON.stringify(transaction, null, 2));
        
        // Return only the token
        res.json({ token: transaction.token });
    } catch (error) {
        console.error('Error generating payment token:', error);
        console.error('Error details:', error.message);
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