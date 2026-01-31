const SecondaryBtn = (params) => {
  return (
    <button
      className={`px-6 py-2.5 bg-white/70 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl text-slate-700 text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shadow-sm active:translate-y-px dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/15 dark:text-white/90 ${params.className || ""}`}
    >
      {params.content}
    </button>
  );
};

export default SecondaryBtn;
