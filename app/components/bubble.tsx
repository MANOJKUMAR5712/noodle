const Bubble = ({ message }) => {
  const isUser = message.role === 'user';
  const text = message.content;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div
        className={`
          px-4 py-2 rounded-2xl max-w-[80%] text-sm sm:text-base 
          ${isUser 
            ? 'bg-gradient-to-r from-red-400 to-yellow-300 text-white rounded-br-none' 
            : 'bg-white text-gray-800 border border-gray-300 rounded-bl-none shadow-sm'}
        `}
      >
        {text}
      </div>
    </div>
  );
};

export default Bubble;
