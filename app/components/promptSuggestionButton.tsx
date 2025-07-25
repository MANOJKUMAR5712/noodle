const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 m-2 bg-gradient-to-r from-yellow-300 to-red-300 text-black font-medium rounded-lg shadow hover:shadow-md transition duration-200"
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
