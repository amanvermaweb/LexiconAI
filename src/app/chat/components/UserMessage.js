const UserMessage = ({ message }) => {
  return (
    <div className="flex justify-end w-auto">
      <div className="max-w-full sm:max-w-[70%] rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm leading-relaxed text-white shadow-md">
        <p className="whitespace-pre-wrap wrap-anywhere">
          {message}
        </p>
      </div>
    </div>
  );
};

export default UserMessage;
