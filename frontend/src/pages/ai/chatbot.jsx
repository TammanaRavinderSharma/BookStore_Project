import { useState, useRef } from "react";

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

  const sendMessage = async () => {
    if (!message.trim()) return;

    stopSpeech(); // stop previous audio when new msg comes

    const userMsg = { role: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg.text, language }),
    });

    const data = await res.json();

    const botMsg = { role: "bot", text: data.reply };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
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
      selectedVoice =
        voices.find((v) => v.lang.includes("mr")) ||
        voices.find((v) => v.lang.includes("hi")) ||
        voices.find((v) => v.lang.includes("en"));
    } else if (language === "hi") {
      selectedVoice =
        voices.find((v) => v.lang.includes("hi")) ||
        voices.find((v) => v.lang.includes("en"));
    } else {
      selectedVoice = voices.find((v) => v.lang.includes("en"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.rate = 0.9;

    utterance.onstart = () => {
      setSpeakingIndex(index);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setSpeakingIndex(null);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setSpeakingIndex(null);
      setIsPaused(false);
    };

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
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

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
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>📚 AI Book Assistant</h2>

        <div style={styles.langBox}>
          <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  style={{
    padding: "0px",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "black",
    border: "none",
    fontWeight: "500",
  }}
>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
        </div>

        <div style={styles.chatBox}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#7c3aed,#4c1d95)"
                    : "linear-gradient(135deg,#9333ea,#6d28d9)",
              }}
            >
              <div>{msg.text}</div>

              {msg.role === "bot" && (
                <div style={styles.audioControls}>
                  <button onClick={() => playSpeech(msg.text, i)} style={styles.speakBtn}>
                    {speakingIndex === i && isPaused ? "▶ Resume" : "▶ Play"}
                  </button>

                  <button onClick={pauseSpeech} style={styles.pauseBtn}>
                    ⏸ Pause
                  </button>

                  <button onClick={stopSpeech} style={styles.stopBtn}>
                    ⏹ Stop
                  </button>
                </div>
              )}
            </div>
          ))}

          {loading && <div style={styles.typing}>AI is typing...</div>}
        </div>

        <div style={styles.inputArea}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type or speak..."
            style={styles.input}
          />
          <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
          <button style={styles.micBtn} onClick={startListening}>
            {listening ? "🎤 Listening..." : "🎤 Speak"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
 container: {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg,#141e30,#243b55)",
  padding: "20px",
},

  wrapper: {
  width: "100%",
  maxWidth: "1000px",
  minWidth: "1000px",   // ⭐ locks width
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
},

  title: { fontSize: "28px", marginBottom: "15px" },
  langBox: { marginBottom: "10px" },

  chatBox: {
  width: "100%",
  height: "500px",
  padding: "18px",
  borderRadius: "18px",
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  overflowY: "auto",
  boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
},

  message: {
    padding: "12px 14px",
    borderRadius: "14px",
    maxWidth: "75%",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  audioControls: { display: "flex", gap: "6px", marginTop: "6px" },

  speakBtn: { padding: "4px 10px", borderRadius: "8px", border: "none", background: "#22c55e", color: "white", cursor: "pointer" },
  pauseBtn: { padding: "4px 10px", borderRadius: "8px", border: "none", background: "#f59e0b", color: "white", cursor: "pointer" },
  stopBtn: { padding: "4px 10px", borderRadius: "8px", border: "none", background: "#ef4444", color: "white", cursor: "pointer" },

  typing: { fontStyle: "italic", opacity: 0.7 },

  inputArea: {
  marginTop: "14px",
  width: "100%",
  display: "flex",
  gap: "10px",
},

  input: {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.3)",
  outline: "none",
  fontSize: "15px",
  background: "rgba(255,255,255,0.15)",
  color: "white",
  backdropFilter: "blur(6px)",
},
  sendBtn: { padding: "10px 16px", borderRadius: "10px", border: "none", background: "#7c3aed", color: "white", cursor: "pointer" },
  micBtn: { padding: "10px 14px", borderRadius: "10px", border: "none", background: "#0ea5e9", color: "white", cursor: "pointer" },
};
