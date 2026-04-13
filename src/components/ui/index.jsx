import PropTypes from "prop-types";

// ── Status Badge ──────────────────────────────────────────────────────────────

const BADGE_VARIANTS = {
  active:    "bg-green-100 text-green-700 ring-green-200",
  inactive:  "bg-red-100 text-red-600 ring-red-200",
  paid:      "bg-green-100 text-green-700 ring-green-200",
  unpaid:    "bg-blue-100 text-blue-700 ring-blue-200",
  overdue:   "bg-amber-100 text-amber-700 ring-amber-200",
  cancelled: "bg-red-100 text-red-600 ring-red-200",
  pending:   "bg-amber-100 text-amber-700 ring-amber-200",
  accepted:  "bg-green-100 text-green-700 ring-green-200",
  rejected:  "bg-red-100 text-red-600 ring-red-200",
  published: "bg-green-100 text-green-700 ring-green-200",
  draft:     "bg-gray-100 text-gray-600 ring-gray-200",
  present:   "bg-green-100 text-green-700 ring-green-200",
  absent:    "bg-red-100 text-red-600 ring-red-200",
};

export function Badge({ label }) {
  const key = String(label || "").toLowerCase();
  const classes = BADGE_VARIANTS[key] || "bg-gray-100 text-gray-600 ring-gray-200";

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {label}
    </span>
  );
}

Badge.propTypes = { label: PropTypes.string.isRequired };

// ── Loading Spinner ───────────────────────────────────────────────────────────

export function Spinner({ size = "md", label = "Loading..." }) {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} border-[3px] border-green-200 border-t-green-600 rounded-full animate-spin`} />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  label: PropTypes.string,
};

// ── Empty State ───────────────────────────────────────────────────────────────

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <p className="text-gray-700 font-semibold">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};

// ── Page Header ───────────────────────────────────────────────────────────────

export function PageHeader({ title, subtitle, breadcrumbs = [], action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {crumb.onClick ? (
                  <button
                    type="button"
                    onClick={crumb.onClick}
                    className="hover:text-gray-600 cursor-pointer transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-600 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  })),
  action: PropTypes.node,
};

// ── Stat Card ─────────────────────────────────────────────────────────────────

const STAT_COLORS = [
  { bg: "bg-blue-50", icon: "text-blue-600", ring: "ring-blue-100" },
  { bg: "bg-green-50", icon: "text-green-600", ring: "ring-green-100" },
  { bg: "bg-amber-50", icon: "text-amber-600", ring: "ring-amber-100" },
  { bg: "bg-purple-50", icon: "text-purple-600", ring: "ring-purple-100" },
  { bg: "bg-rose-50", icon: "text-rose-600", ring: "ring-rose-100" },
  { bg: "bg-cyan-50", icon: "text-cyan-600", ring: "ring-cyan-100" },
];

export function StatCard({ icon: Icon, label, value, delta, colorIndex = 0, onClick }) {
  const color = STAT_COLORS[colorIndex % STAT_COLORS.length];

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-start gap-4 ${onClick ? "cursor-pointer hover:shadow-md hover:border-gray-200 transition-all" : ""}`}
      onClick={onClick}
    >
      <div className={`w-10 h-10 rounded-xl ${color.bg} ring-1 ${color.ring} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {delta && (
          <p className={`text-xs mt-1 font-medium ${delta.positive ? "text-green-600" : "text-red-500"}`}>
            {delta.positive ? "▲" : "▼"} {delta.text}
          </p>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  delta: PropTypes.shape({ positive: PropTypes.bool, text: PropTypes.string }),
  colorIndex: PropTypes.number,
  onClick: PropTypes.func,
};

// ── Data Table ────────────────────────────────────────────────────────────────
// Wrapper that provides consistent table styling

export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-100">{children}</tr>
    </thead>
  );
}

export function Th({ children, center }) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${center ? "text-center" : "text-left"}`}>
      {children}
    </th>
  );
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-gray-50 bg-white">{children}</tbody>;
}

export function Tr({ children, onClick }) {
  return (
    <tr
      className={`transition-colors ${onClick ? "cursor-pointer hover:bg-green-50/50" : "hover:bg-gray-50/60"}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function Td({ children, center, muted }) {
  return (
    <td className={`px-4 py-3.5 ${center ? "text-center" : ""} ${muted ? "text-gray-400" : "text-gray-700"}`}>
      {children}
    </td>
  );
}

Table.propTypes = { children: PropTypes.node.isRequired };
THead.propTypes = { children: PropTypes.node.isRequired };
Th.propTypes = { children: PropTypes.node, center: PropTypes.bool };
TBody.propTypes = { children: PropTypes.node.isRequired };
Tr.propTypes = { children: PropTypes.node.isRequired, onClick: PropTypes.func };
Td.propTypes = { children: PropTypes.node, center: PropTypes.bool, muted: PropTypes.bool };

// ── Search Bar ────────────────────────────────────────────────────────────────

export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white"
      />
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

// ── Pagination ────────────────────────────────────────────────────────────────

export function Pagination({ currentPage, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-4 py-1.5 text-sm font-medium text-green-700 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        ← Previous
      </button>
      <span className="text-xs text-gray-500">
        Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
        <span className="font-semibold text-gray-700">{totalPages}</span>
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-4 py-1.5 text-sm font-medium text-green-700 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Next →
      </button>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

// ── Modal Shell ───────────────────────────────────────────────────────────────

export function ModalShell({ title, onClose, children, size = "md" }) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 w-full ${sizes[size]} flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

ModalShell.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

// ── Success Modal ─────────────────────────────────────────────────────────────

export function SuccessModal({ title, message, buttonLabel, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl py-8 px-10 w-full max-w-sm shadow-2xl text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors cursor-pointer"
        >
          {buttonLabel || "Done"}
        </button>
      </div>
    </div>
  );
}

SuccessModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

// ── Form Field ────────────────────────────────────────────────────────────────

export function FormField({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// ── Input ─────────────────────────────────────────────────────────────────────

export function Input({ ...props }) {
  return (
    <input
      {...props}
      className={`border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 w-full bg-white placeholder:text-gray-400 ${props.className || ""}`}
    />
  );
}

// ── Select ────────────────────────────────────────────────────────────────────

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={`border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 w-full bg-white ${props.className || ""}`}
    >
      {children}
    </select>
  );
}

Select.propTypes = { children: PropTypes.node.isRequired };

// ── Btn ───────────────────────────────────────────────────────────────────────

export function Btn({ children, variant = "primary", size = "md", disabled, onClick, type = "button", className = "" }) {
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 border-transparent",
    secondary: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700 border-transparent",
    ghost: "bg-transparent text-green-700 border-green-300 hover:bg-green-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg border
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  );
}

Btn.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
};