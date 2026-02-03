const SecondaryBtn = ({ content, className = "", onClick, disabled = false, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
  className={`px-6 py-2.5 surface-soft hover:bg-(--surface-1) border border-(--border) rounded-2xl text-slate-700 text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shadow-sm active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed dark:text-white/90 ${className}`}
    >
      {content}
    </button>
  );
};

export default SecondaryBtn;
