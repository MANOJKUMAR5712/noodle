'use client';
import Image from "next/image";
import bg from "./assets/bg3.jpg"
import logo from "./assets/logo1.png";
import { useChat } from '@ai-sdk/react';

export default function Home() {
  const { append, status, messages, input, handleInputChange, handleSubmit } = useChat();
  const noMessages = messages.length === 0;

  return (
    <main className="flex flex-col items-center min-h-screen bg-center bg-cover bg-no-repeat to-red-100 px-1 sm:px-1 md:px-1 py-6" style={{backgroundImage : `url(${bg.src})`}}>
      
      {/* Logo with responsive spacing */}
      <div className="sm:p-3 md:p-4">
        <Image 
          src={logo} 
          width={90}
          alt="Noodle logo" 
          className="p-0 ml-0 mr-150 mt-0 w-20 sm:w-24 md:w-28 h-auto object-contain"
        />
      </div>

      {/* Chat Section */}
      <section className="w-full max-w-2xl flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-200 via-gray-300 to-red-300 max-h-[60vh] sm:max-h-[70vh] text-sm sm:text-base">
          {noMessages ? (
            <div className="flex items-center justify-center h-full text-red-800 text-center">
              Noodle is up and ready...
            </div>
          ) : (
            <>
              {/* Messages will appear here */}
            </>
          )}
        </div>

        {/* Input */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-gradient-to-b from-red-300 to-red-400 border-t dark:border-gray-500 p-3 sm:p-4 flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me something..."
            className="flex-grow px-4 py-2 dark:border-gray-600 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring focus:ring-red-300 dark:bg-gradient-to-r from-gray-400 via-gray-300 to-red-300 text-black text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={status !== 'ready'}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-red-300 to-red-400 text-white font-medium rounded-lg sm:rounded-r-lg sm:rounded-l-none  border-gray-500 disabled:bg-red-200 text-sm sm:text-base"
          >
            Send
          </button>
        </form>
      </section>
    </main>
  );
}
