import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import { getAuthUser } from "@/lib/auth";

// PUT: Update an existing book
export async function PUT(req, { params }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();

    // Ensure the book exists and belongs to the logged-in user
    const book = await Book.findOne({ _id: id, userId: authUser.userId });
    if (!book) {
      return NextResponse.json(
        { error: "Book not found or access denied" },
        { status: 404 }
      );
    }

    if (body.title !== undefined) book.title = body.title;
    if (body.author !== undefined) book.author = body.author;
    if (body.tags !== undefined) book.tags = body.tags;
    if (body.status !== undefined) book.status = body.status;

    await book.save();

    return NextResponse.json({ message: "Book updated successfully", book });
  } catch (error) {
    console.error("PUT /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a book
export async function DELETE(req, { params }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const deletedBook = await Book.findOneAndDelete({
      _id: id,
      userId: authUser.userId,
    });

    if (!deletedBook) {
      return NextResponse.json(
        { error: "Book not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}