

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from '@/lib/payments';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
    }

    // Verify webhook signature using Razorpay recommended way
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('⚠️ Invalid signature on Razorpay webhook');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log(`✅ Razorpay webhook event received: ${event.event}`);

    switch (event.event) {
      case 'payment.captured': {
        const paymentId = event.payload.payment.entity.id;
        console.log('🔹 Payment captured with ID:', paymentId);

        // Fetch full payment details
        const payment = await razorpay.payments.fetch(paymentId);
        console.log('🔹 Full payment details:', payment);

        // Fetch order details if available
        if (payment.order_id) {
          const order = await razorpay.orders.fetch(payment.order_id);
          console.log('🔹 Order details:', order);

          const orderPayments = await razorpay.orders.fetchPayments(payment.order_id);
          console.log('🔹 Payments for the order:', orderPayments);
        }

        await handleCheckoutSessionCompleted({
          payment: event.payload.payment.entity,
          razorpay,
        });
        break;
      }

      case 'order.paid': {
        const orderId = event.payload.order.entity.id;
        console.log('🔹 Order paid with ID:', orderId);

        const fullOrder = await razorpay.orders.fetch(orderId);
        const orderPayments = await razorpay.orders.fetchPayments(orderId);

        await handleSubscriptionDeleted({
          payment: event.payload.payment.entity,
          razorpay,
        });
        console.log('🔹 Complete order data:', { order: fullOrder, payments: orderPayments });
        break;
      }

      case 'subscription.cancelled': {
        const subscriptionId = event.payload.subscription.entity.id;
        console.log('🔹 Subscription cancelled with ID:', subscriptionId);

        const subscription = await razorpay.subscriptions.fetch(subscriptionId);
        console.log('🔹 Subscription details:', subscription);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('❌ Razorpay webhook handler error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: err.message },
      { status: 500 }
    );
  }
};
