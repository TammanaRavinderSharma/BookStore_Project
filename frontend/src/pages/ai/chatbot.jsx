import { useState, useRef, useEffect } from "react";
import { FiSend, FiMic, FiPlay, FiPause, FiSquare } from "react-icons/fi";
import { FaRobot, FaUser } from "react-icons/fa";

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  // 🔊 Speech control states
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    stopSpeech(); // stop previous audio when new msg comes

    const userMsg = { role: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, language }),
      });
      const data = await res.json();
      const botMsg = { role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errMsg = { role: "bot", text: "Oops! Something went wrong. Please try again." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ---------------- TEXT TO SPEECH ----------------
  const playSpeech = (text, index) => {
    if (!text) return;
    const synth = window.speechSynthesis;

    // resume if paused
    if (speakingIndex === index && isPaused) {
      synth.resume();
      setIsPaused(false);
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    let selectedVoice = null;

    if (language === "mr") {
      selectedVoice = voices.find((v) => v.lang.includes("mr")) || voices.find((v) => v.lang.includes("hi")) || voices.find((v) => v.lang.includes("en"));
    } else if (language === "hi") {
      selectedVoice = voices.find((v) => v.lang.includes("hi")) || voices.find((v) => v.lang.includes("en"));
    } else {
      selectedVoice = voices.find((v) => v.lang.includes("en"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.rate = 0.9;
    utterance.onstart = () => { setSpeakingIndex(index); setIsPaused(false); };
    utterance.onend = () => { setSpeakingIndex(null); setIsPaused(false); };
    utterance.onerror = () => { setSpeakingIndex(null); setIsPaused(false); };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const pauseSpeech = () => {
    if (!window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeakingIndex(null);
    setIsPaused(false);
  };

  // ---------------- SPEECH TO TEXT ----------------
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser 😢");
      return;
    }

    const recognition = new SpeechRecognition();
    if (language === "hi") recognition.lang = "hi-IN";
    else if (language === "mr") recognition.lang = "mr-IN";
    else recognition.lang = "en-US";

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  return (
    <div className="w-full flex justify-center items-center h-[calc(100vh-140px)]">
      {/* Wrapper matching the project's glassmorphism style similar to Login.jsx */}
      <div className="w-full max-w-4xl h-full max-h-[800px] flex flex-col bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden p-4 sm:p-6 transition-all duration-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 mb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 text-blue-400 rounded-lg">
              <FaRobot className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white tracking-wide">AI Book Assistant</h2>
              <p className="text-xs text-gray-400">Ask me anything about books or the store</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300 font-medium">Lang:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-white text-sm py-1.5 px-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col justify-center items-center opacity-50 space-y-3">
              <FaRobot className="size-16 text-gray-400" />
              <p className="text-gray-300 text-center">I'm ready! How can I help you today?</p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                
                {/* Bot Avatar */}
                {!isUser && (
                  <div className="mr-3 flex-shrink-0 mt-1">
                     <div className="bg-slate-700 p-2 rounded-full border border-slate-600">
                        <FaRobot className="size-4 text-blue-300" />
                     </div>
                  </div>
                )}

                <div 
                  className={`relative max-w-[85%] sm:max-w-[75%] px-5 py-3.5 shadow-md flex flex-col gap-2 
                    ${isUser 
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                      : "bg-slate-800/90 text-gray-100 rounded-2xl rounded-tl-sm border border-slate-700"}`}
                >
                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-light">{msg.text}</div>

                  {/* Audio Controls below bot messages */}
                  {!isUser && (
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-600/50">
                      <button 
                        onClick={() => playSpeech(msg.text, i)} 
                        title={speakingIndex === i && isPaused ? "Resume" : "Play"}
                        className="text-gray-400 hover:text-green-400 transition-colors"
                      >
                        <FiPlay size={16} />
                      </button>
                      
                      {speakingIndex === i && (
                        <>
                          <button onClick={pauseSpeech} title="Pause" className="text-gray-400 hover:text-yellow-400 transition-colors">
                            <FiPause size={16} />
                          </button>
                          <button onClick={stopSpeech} title="Stop" className="text-gray-400 hover:text-red-400 transition-colors">
                            <FiSquare size={16} />
                          </button>
                          <span className="text-xs text-blue-300 animate-pulse ml-auto">Speaking...</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="ml-3 flex-shrink-0 mt-1">
                     <div className="bg-blue-800 p-2 rounded-full border border-blue-600">
                        <FaUser className="size-4 text-white" />
                     </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex w-full justify-start">
               <div className="mr-2 flex-shrink-0 mt-1">
                 <div className="bg-slate-700 p-2 rounded-full border border-slate-600">
                    <FaRobot className="size-4 text-blue-300" />
                 </div>
               </div>
               <div className="bg-slate-800/90 rounded-2xl rounded-tl-sm border border-slate-700 px-5 py-4 shadow-md flex items-center space-x-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
               </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-end gap-2 sm:gap-3">
          <div className="flex-1 min-h-[50px] bg-slate-900/60 border border-slate-700 rounded-xl flex items-center p-1 sm:p-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-none outline-none text-white px-3 py-1 text-sm sm:text-base resize-none self-center max-h-32 min-h-[24px]"
              rows={1}
            />
            <button 
              onClick={startListening} 
              disabled={loading}
              title="Speak"
              className={`p-2 sm:p-3 rounded-lg flex-shrink-0 transition-all 
                ${listening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-slate-800 text-gray-400 hover:text-blue-400'}`}
            >
              <FiMic size={20} />
            </button>
          </div>

          <button 
            onClick={sendMessage}
            disabled={!message.trim() || loading}
            title="Send"
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white p-3 sm:p-4 rounded-xl shadow-lg transition-transform active:scale-95 flex-shrink-0"
          >
            <FiSend size={20} className="ml-0.5" />
          </button>
        </div>
        
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3); 
        }
      `}} />
    </div>
  );
}
