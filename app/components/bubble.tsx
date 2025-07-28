// Bubble.tsx
const Bubble = ({ message }) => {
  const isUser = message.role === 'user';
  const text = message.content;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div
        className={`
          px-4 py-2 rounded-2xl max-w-[80%] text-sm sm:text-base
          ${isUser 
            ? 'bg-pink-200 text-pink-700 rounded-br-none shadow-sm' 
            : 'bg-blue-100 text-gray-800 border border-blue-200 rounded-bl-none shadow-sm'}
        `}
      >
        {text}
      </div>
    </div>
  );
};

export default Bubble;
