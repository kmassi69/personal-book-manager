"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      {/* Top Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-200">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800">
            Personal Library
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Welcome back, <span className="font-semibold text-stone-700">{user?.name}</span>
          </p>
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
              {status === "ALL"
                ? "All Books"
                : status.replace(/_/g, " ")}
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
            <div
              key={book._id}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-serif font-bold text-stone-800 text-lg leading-snug">
                    {book.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      book.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : book.status === "READING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {book.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-stone-600 text-sm mb-4">by {book.author}</p>

                {book.tags && book.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {book.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2 text-xs font-semibold">
                <button
                  onClick={() => openEditModal(book)}
                  className="text-stone-600 hover:text-stone-900 px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="text-rose-600 hover:text-rose-800 px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-serif font-bold text-stone-800 mb-4">
              {editingBook ? "Edit Book" : "Add New Book"}
            </h2>

            <form onSubmit={handleSaveBook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Author
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Reading Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800"
                >
                  <option value="WANT_TO_READ">Want to Read</option>
                  <option value="READING">Reading</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Fiction, Sci-Fi, Favorites"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}