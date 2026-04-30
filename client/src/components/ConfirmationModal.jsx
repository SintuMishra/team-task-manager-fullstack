export function ConfirmationModal({ open, title, message, confirmText = "Confirm", onConfirm, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="panel w-full max-w-md p-6" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <div className="mb-4 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">
          Confirm action
        </div>
        <h3 id="confirm-modal-title" className="font-display text-2xl font-bold tracking-tight text-slate-950">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn-danger">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
