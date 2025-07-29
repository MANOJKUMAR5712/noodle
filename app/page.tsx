'use client';

import Image from "next/image";
import bg from "./assets/bg3.jpg";
import logo from "./assets/logo1.png";
import { useChat } from '@ai-sdk/react';
import { Message } from "@ai-sdk/react";

import LoadingBubble from "./components/loadingBubble";
import PromptSuggestion from "./components/promptSuggestion";
import Bubble from "./components/bubble";

export default function Home() {
  const { append, status, messages, input, handleInputChange, handleSubmit } = useChat();
  const noMessages = !messages || messages.length === 0;
  const handlePrompt = (prompt)=>{
    const msg : Message = {
      id : crypto.randomUUID(),
      content : prompt,
      role : 'user',
    }

    append(msg);
  }

  return (
    <main
      className="relative flex flex-col items-center justify-start min-h-screen bg-center bg-cover bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      {/* Logo fixed to top-left corner */}
      <div className="absolute top-4 left-4 z-10">
        <Image
          src={logo}
          width={60}
          height={60}
          alt="Noodle logo"
          className="w-14 sm:w-16 md:w-20 h-auto object-contain fixed"
          priority
        />
      </div>

      {/* Chat Section */}
      <section className="w-full max-w-2xl flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-24 mb-4">
        
        {/* Messages Section */}
        <div className="flex-1 p-4 overflow-y-scroll bg-gradient-to-b from-blue-100 via-blue-200 to-red-300 text-sm sm:text-base">
          {noMessages ? (
            <>
              <div className="flex items-center justify-center h-full text-red-800 text-center">
                Noodle is up and ready...
                <br></br>
                <br></br>
              </div>
              <PromptSuggestion onPromptClick={handlePrompt}/>
            </>
          ) : (
            <>
              {/* Render messages here */}
              {messages.map((message)=>(
                <Bubble key={`message-${message.id}`} message = {message}/>
              ))}

              {(status === "submitted") && <LoadingBubble/>}
             
            </>
          )}
        </div>

        {/* Input Area */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-gradient-to-b from-red-300 to-red-400 border-t dark:border-gray-500 p-3 sm:p-4 flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me something..."
            className="flex-grow px-4 py-2 rounded-full sm:rounded-full focus:outline-none focus:ring focus:ring-red-300 text-black text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={status == 'submitted'}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-red-300 to-red-400 text-white font-medium rounded-full sm:rounded-full border-gray-500 disabled:bg-red-200 text-sm sm:text-base"
          >
            Send
          </button>
        </form>
      </section>
    </main>
  );
}
