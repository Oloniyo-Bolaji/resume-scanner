import { db } from "@/lib/database";
import { usersTable } from "@/lib/database/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and password are required",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUsers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists with this email",
        },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(usersTable).values({
      name: name,
      email: email,
      password: hashedPassword,
      provider: "email",
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (err: unknown) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}