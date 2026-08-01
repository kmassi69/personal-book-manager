export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
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
          onClick={() => onEdit(book)}
          className="text-stone-600 hover:text-stone-900 px-2 py-1"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(book._id)}
          className="text-rose-600 hover:text-rose-800 px-2 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}