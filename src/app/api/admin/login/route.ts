import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expectedPasscode = process.env.ADMIN_PASSCODE || "admin123";

    if (password !== expectedPasscode) {
      return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_authenticated", "true", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
