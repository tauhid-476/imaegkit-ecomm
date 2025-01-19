import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Process the webhook event here.
    const event = JSON.parse(body);

    await connectToDatabase();

    if (event.event === "payment.captured") {
      // Update the order status in the database.
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: event.payload.payment.entity.order_id },
        {
          razorpayPaymentId: event.payload.payment.entity.id,
          status: "completed",
        }
      ).populate([
        { path: "productId", select: "name" },
        { path: "userId", select: "email" },
      ]);

      if (order) {
        // Send email to the user.
        const transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        })

        await transporter.sendMail({
          from: '"ImageKit Shop" <noreply@imagekitshop.com>',
          to: order.userId.email,
          subject: "Payment Confirmation - ImageKit Shop",
          text: `
                Thank you for your purchase!

                Order Details:
                - Order ID: ${order._id.toString().slice(-6)}
                - Product: ${order.productId.name}
                - Version: ${order.variant.type}
                - License: ${order.variant.license}
                - Price: $${order.amount.toFixed(2)}

                Your image is now available in your orders page.
                Thank you for shopping with ImageKit Shop!
                          `.trim(),
        });
      }
    }
    
    return NextResponse.json({ recieved: true })
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
