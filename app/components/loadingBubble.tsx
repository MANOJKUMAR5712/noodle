const LoadingBubble = () => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce [animation-delay:0s]" />
      <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.1s]" />
      <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.2s]" />
    </div>
  );
};


export default LoadingBubble