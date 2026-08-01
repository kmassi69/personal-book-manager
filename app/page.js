"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookCard from "@/components/BookCard";
import BookModal from "@/components/BookModal";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    status: "WANT_TO_READ",
    tags: "",
  });

  useEffect(() => {
    fetchUserDataAndBooks();
  }, []);

  const fetchUserDataAndBooks = async () => {
    try {
      // Check auth status
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) {
        router.push("/login");
        return;
      }
      const userData = await userRes.json();
      setUser(userData.user);

      // Fetch user's books
      const booksRes = await fetch("/api/books");
      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData.books || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({ title: "", author: "", status: "WANT_TO_READ", tags: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      status: book.status,
      tags: book.tags ? book.tags.join(", ") : "",
    });
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    const formattedTags = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: formData.title,
      author: formData.author,
      status: formData.status,
      tags: formattedTags,
    };

    try {
      if (editingBook) {
        // Update existing book
        const res = await fetch(`/api/books/${editingBook._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const updated = await res.json();
          setBooks(books.map((b) => (b._id === editingBook._id ? updated.book : b)));
        }
      } else {
        // Create new book
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const created = await res.json();
          setBooks([created.book, ...books]);
        }
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!confirm("Are you sure you want to remove this book?")) return;

    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBooks(books.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  // Filtered books calculated on the fly
  const filteredBooks = books.filter((book) => {
    const matchesStatus =
      selectedStatus === "ALL" || book.status === selectedStatus;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-600 font-medium">
        Loading your library...
      </div>
    );
  }

  const totalBooks = books.length;
  const readingCount = books.filter((b) => b.status === "READING").length;
  const completedCount = books.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      {/* Top Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-200">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">
            Personal Library
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Welcome back,{" "}
            <span className="font-semibold text-stone-700">{user?.name}</span>
          </p>
        </div>
        <div className="flex gap-4 my-4">
          <div className="bg-stone-100 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700">
            Total Books: <span className="font-bold">{totalBooks}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-800">
            Reading: <span className="font-bold">{readingCount}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-800">
            Completed: <span className="font-bold">{completedCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium shadow transition"
          >
            + Add Book
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Filters & Search Bar */}
      <section className="my-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          {["ALL", "WANT_TO_READ", "READING", "COMPLETED"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedStatus === status
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {status === "ALL" ? "All Books" : status.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title, author, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 text-stone-800 w-full md:w-72"
        />
      </section>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 border border-dashed border-stone-200 rounded-2xl">
          <p className="text-stone-500 text-sm">No books found in this view.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={openEditModal}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Book Modal */}
      <BookModal
        isOpen={isModalOpen}
        editingBook={editingBook}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveBook}
      />
    </div>
  );
}