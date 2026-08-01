export default function BookModal({
  isOpen,
  editingBook,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h2 className="text-xl font-serif font-bold text-stone-800 mb-4">
          {editingBook ? "Edit Book" : "Add New Book"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
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
              onClick={onClose}
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
  );
}