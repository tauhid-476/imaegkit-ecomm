//get all the orders of a specific user

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const orders = await Order.find({ userId: session.user.id })
      .populate({
        path: "productId",
        select: "name imageUrl",
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 })
      .lean();
      //path --> give the full product Document too
    return NextResponse.json( orders , { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
