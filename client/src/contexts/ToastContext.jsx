import { createContext, useCallback, useState } from "react";

export const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = toastId++;
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`rounded-3xl border px-4 py-4 text-sm font-medium shadow-panel backdrop-blur ${
              toast.type === "error"
                ? "border-rose-400/30 bg-rose-600/95 text-white"
                : "border-slate-700/20 bg-slate-950/95 text-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">{toast.type === "error" ? "Error" : "Success"}</p>
                <p className="mt-1">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
