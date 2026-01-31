const PrimaryBtn = (params) => {
  return (
    <button className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl text-white text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shadow-sm active:translate-y-px">
      {params.content}
    </button>
  );
};

export default PrimaryBtn;
