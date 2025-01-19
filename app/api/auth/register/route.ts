
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest){
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
        return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
 
    await User.create({ email, password, role: "user" });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}


