const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        px-4 py-2 m-2 bg-pink-100 text-pink-800 font-medium rounded-lg shadow hover:bg-pink-200 transition
        focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
