import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
    } = await request.json();

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return Response.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Payment is verified — activate the user's subscription
    // TODO: Update your database with the subscription details
    // For example:
    // await supabase.from('subscriptions').insert({
    //   user_id: userId,
    //   plan: planName,
    //   payment_id: razorpay_payment_id,
    //   order_id: razorpay_order_id,
    //   status: 'active',
    //   created_at: new Date().toISOString(),
    // });

    return Response.json({
      success: true,
      message: `Payment verified! ${planName} plan activated.`,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return Response.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
