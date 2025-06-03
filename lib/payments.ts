import Razorpay from 'razorpay';
import { getDbConnection } from './db';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string
});

export async function handleSubscriptionDeleted({
    payment,
    razorpay,
}: {
    payment: RazorpayPayment;
    razorpay: Razorpay;
}) {
    try {
        const sql = await getDbConnection();

        // Assuming customer_id maps to your user customerId
        await sql`
      UPDATE users SET status = 'cancelled' WHERE customer_id = ${payment.customer_id}
    `;

        console.log(`User with customer_id ${payment.customer_id} marked as cancelled`);
    } catch (error) {
        console.error('❌ Error handling subscription deleted:', error);
        throw error;
    }
}

interface RazorpayPayment {
    id: string;
    customer_id: string;
    email: string;
    amount: number;
    currency: string;
    status: 'created' | 'captured' | 'failed';
}

export async function handleCheckoutSessionCompleted({
    payment,
    razorpay
}: {
    payment: RazorpayPayment;
    razorpay: Razorpay;
}) {
    try {
        console.log('✅ Razorpay payment received:', payment);

        const paymentDetails = await razorpay.payments.fetch(payment.id);
        const customerEmail = payment.email || paymentDetails.email || '';
        const customerName = paymentDetails.notes?.name || '';
        const customerId = payment.customer_id || '';
        const priceId = paymentDetails.notes?.priceId || paymentDetails.order_id || '';


        if (customerEmail && priceId) {
            const sql = await getDbConnection();

            await createOrUpdateUser({
                sql,
                email: customerEmail,
                fullName: customerName,
                customerId,
                priceId,
                status: 'active'
            });

            await createPayment({
                sql,
                payment: paymentDetails,
                priceId,
                userEmail: customerEmail
            });

            console.log('📦 Saving payment to DB:', {
                email: customerEmail,
                fullName: customerName,
                customerId,
                priceId,
                paymentId: payment.id,
                amount: payment.amount,
                currency: payment.currency,
            });

        } else {
            console.warn('Missing required fields for user or payment creation.');
        }

    } catch (error) {
        console.error('❌ Error handling Razorpay payment:', error);
        throw error;
    }
}

interface UserData {
    sql: any;
    email: string;
    fullName: string;
    customerId: string;
    priceId: string;
    status: string;
}



async function createOrUpdateUser({
    sql,
    email,
    fullName,
    customerId,
    priceId,
    status
}: UserData): Promise<void> {
    try {
        email = email.trim().toLowerCase();
        console.log('Checking user with email:', email);

        const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
        console.log('Existing user:', existingUser);

        if (existingUser.length === 0) {
            console.log('Inserting new user...');
            await sql`
        INSERT INTO users (
          email, full_name, customer_id, price_id, status
        ) VALUES (
          ${email}, ${fullName}, ${customerId}, ${priceId}, ${status}
        )
      `;
            console.log('User inserted');
        } else {
            console.log('Updating existing user...');
            await sql`
        UPDATE users SET
          full_name = ${fullName},
          customer_id = ${customerId},
          price_id = ${priceId},
          status = ${status}
        WHERE email = ${email}
      `;
            console.log('User updated');
        }
    } catch (error) {
        console.error('Error creating/updating user:', error);
        throw error;
    }
}


async function createPayment({
    sql,
    payment,
    priceId,
    userEmail
}: {
    sql: any;
    payment: any; // using `any` to support full Razorpay payment object
    priceId: string;
    userEmail: string;
}) {
    try {
        const { amount, id, status } = payment;

        await sql`
      INSERT INTO payments (
        amount,
        status,
        stripe_payment_id,  -- keeping the column name as per your schema
        price_id,
        user_email
      ) VALUES (
        ${amount},
        ${status},
        ${id},  -- Razorpay payment ID inserted here
        ${priceId},
        ${userEmail}
      )
    `;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
}
// async function createPayment({
//   sql,
//   payment,
//   priceId,
//   userEmail
// }: {
//   sql: any;
//   payment: RazorpayPayment;
//   priceId: string;
//   userEmail: string;
// }) {
//   try {
//     const { amount, id, status } = payment;

//     await sql`
//       INSERT INTO payments (
//         amount,
//         status,
//         stripe_payment_id,
//         price_id,
//         user_email
//       ) VALUES (
//         ${amount},
//         ${status},
//         ${id},
//         ${priceId},
//         ${userEmail}
//       )
//     `;
//   } catch (error) {
//     console.error('Error creating payment:', error);
//     throw error;
//   }
// }