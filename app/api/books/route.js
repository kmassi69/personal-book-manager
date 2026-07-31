import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import { getAuthUser } from "@/lib/auth";

// GET: Fetch all books for authenticated user
export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const books = await Book.find({ userId: authUser.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("GET /api/books error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST: Add a new book
export async function POST(req) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, author, tags, status } = await req.json();

    if (!title || !author) {
      return NextResponse.json(
        { error: "Title and Author are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newBook = await Book.create({
      title,
      author,
      tags: Array.isArray(tags) ? tags : [],
      status: status || "WANT_TO_READ",
      userId: authUser.userId,
    });

    return NextResponse.json(
      { message: "Book added successfully", book: newBook },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/books error:", error);
    return NextResponse.json(
      { error: "Failed to add book" },
      { status: 500 }
    );
  }
}