import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "./Button";
import { Input } from "./Input";
import Navbar from "./navbar";
import { User, Bot, Send } from "lucide-react";
import { sendChatMessage } from "src/utils/api";

interface Message {
  id: number;
  text: string;
  sender: "user" | "lexiscope";
}

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "lexiscope",
      text: "Hello! How can I assist you with legal information today?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const userId = "1234";
  const [isTyping, setIsTyping] = useState(false);
  const [hasSubmittedPrompt, setHasSubmittedPrompt] = useState(false);

  // Scroll to the bottom of the messages list whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: input,
      };
      setMessages([...messages, newMessage]);
      setInput("");
      setIsTyping(true);
      setHasSubmittedPrompt(true);

      try {
        const aiResponseJson = await sendChatMessage(userId, input);
        if (aiResponseJson && aiResponseJson.response) {
          const lexiscopeResponse: Message = {
            id: messages.length + 2,
            text: aiResponseJson.response,
            sender: "lexiscope",
          };
          setMessages((prevMessages) => [...prevMessages, lexiscopeResponse]);
        } else {
          const lexiscopeResponse: Message = {
            id: messages.length + 2,
            text: "Sorry, an error occured. Please try again.",
            sender: "lexiscope",
          };
          setMessages((prevMessages) => [...prevMessages, lexiscopeResponse]);
        }
      } catch (error) {
        const lexiscopeResponse: Message = {
          id: messages.length + 2,
          text: "Network error. Please check your connection.",
          sender: "lexiscope",
        };
        setMessages((prevMessages) => [...prevMessages, lexiscopeResponse]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="w-full flex flex-col h-screen bg-gray-50 dark:bg-blue-800 md:flex-row">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        {!hasSubmittedPrompt && (
          <header className="bg-white shadow-sm z-10 p-4 pt-2 text-center">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Hello, {"User"}
            </h1>
            <p className="text-gray-500 text-lg">How can I help you today?</p>
          </header>
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "jsutify-start"
                  }`}
                >
                  <div
                    className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end max-w-[80%]"
                }`}
                  >
                    <div className="w-8 h-8">
                      {message.sender === "user" ? (
                        <User className="text-indigo-500" />
                      ) : (
                        <Bot className="text-gray-400" />
                      )}
                    </div>
                    <div
                      className={`mx-2 p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-indigo-500 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      } shadow-md transition-all duration-300 ease-in-out animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {message.sender === "lexiscope" ? (
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      ) : (
                        message.text
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex flex-row items-end">
                    <div className="w-8 h-8">
                      <Bot className="text-gray-400" />
                    </div>
                    <div className="mx-2 p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-md">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex space-x-2 md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a prompt here"
                className="w-full flex-grow md:flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleSend}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
