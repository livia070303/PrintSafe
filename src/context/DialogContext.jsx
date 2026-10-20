import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const DialogContext = createContext(null);

const VARIANTS = {
  info: { title: "Aviso", icon: "ℹ️" },
  success: { title: "Sucesso", icon: "✅" },
  error: { title: "Erro", icon: "❌" },
  warning: { title: "Atenção", icon: "⚠️" },
  confirm: { title: "Confirmar", icon: "❓" },
};

function DialogOverlay({ dialog, onClose }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!dialog) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();

    function onKey(e) {
      if (e.key === "Escape") {
        onClose(dialog.type === "confirm" ? false : undefined);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [dialog, onClose]);

  if (!dialog) return null;

  const preset = VARIANTS[dialog.variant] ?? VARIANTS.info;
  const title = dialog.title ?? preset.title;
  const icon = dialog.icon ?? preset.icon;

  return (
    <div
      className="dialog-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose(dialog.type === "confirm" ? false : undefined);
        }
      }}
    >
      <div
        className={`dialog-card dialog-${dialog.variant}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        <div className="dialog-icon" aria-hidden="true">
          {icon}
        </div>
        <h2 id="dialog-title" className="dialog-title">
          {title}
        </h2>
        <p id="dialog-message" className="dialog-message">
          {dialog.message}
        </p>
        <div className="dialog-actions">
          {dialog.type === "confirm" && (
            <button
              type="button"
              className="btn btn-secondary dialog-btn"
              onClick={() => onClose(false)}
            >
              {dialog.cancelLabel ?? "Cancelar"}
            </button>
          )}
          <button
            ref={confirmRef}
            type="button"
            className="btn btn-primary dialog-btn"
            onClick={() => onClose(dialog.type === "confirm" ? true : undefined)}
          >
            {dialog.confirmLabel ??
              (dialog.type === "confirm" ? "Confirmar" : "OK")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolverRef = useRef(null);

  const close = useCallback((result) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setDialog(null);
    resolve?.(result);
  }, []);

  const showAlert = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({
        type: "alert",
        message,
        variant: options.variant ?? "info",
        title: options.title,
        icon: options.icon,
        confirmLabel: options.confirmLabel ?? "OK",
      });
    });
  }, []);

  const showConfirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({
        type: "confirm",
        message,
        variant: options.variant ?? "confirm",
        title: options.title,
        icon: options.icon,
        confirmLabel: options.confirmLabel ?? "Confirmar",
        cancelLabel: options.cancelLabel ?? "Cancelar",
      });
    });
  }, []);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <DialogOverlay dialog={dialog} onClose={close} />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within DialogProvider");
  }
  return ctx;
}
