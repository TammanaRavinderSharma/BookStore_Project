import { useNavigate } from "react-router-dom";

const moods = [
  { label: "Happy",      emoji: "😄", image: "/happy.jpeg",     gradient: "from-yellow-500/20 to-yellow-600/5",   border: "border-yellow-500/40",  glow: "hover:shadow-yellow-500/20",  route: "happy"      },
  { label: "Calm",       emoji: "😌", image: "/calm.jpeg",      gradient: "from-cyan-500/20 to-cyan-600/5",       border: "border-cyan-500/40",    glow: "hover:shadow-cyan-500/20",    route: "calm"       },
  { label: "Thoughtful", emoji: "🤔", image: "/thoughtful.jpeg",gradient: "from-fuchsia-500/20 to-fuchsia-600/5", border: "border-fuchsia-500/40", glow: "hover:shadow-fuchsia-500/20", route: "thoughtful" },
  { label: "Sad",        emoji: "😔", image: "/sady.jpg",       gradient: "from-purple-500/20 to-purple-600/5",   border: "border-purple-500/40",  glow: "hover:shadow-purple-500/20",  route: "sad"        },
  { label: "Motivated",  emoji: "🔥", image: "/motivated.jpeg", gradient: "from-red-500/20 to-red-600/5",         border: "border-red-500/40",     glow: "hover:shadow-red-500/20",     route: "motivated"  },
  { label: "Relaxed",    emoji: "🌿", image: "/relaxed.jpg",    gradient: "from-emerald-500/20 to-emerald-600/5", border: "border-emerald-500/40", glow: "hover:shadow-emerald-500/20", route: "relaxed"    },
];

export default function MoodCircles() {
  const navigate = useNavigate();

  return (
    <div className="py-12 px-4">
      <div className="max-w-screen-2xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-10">
          <p className="text-fuchsia-400 text-xs font-bold uppercase tracking-widest mb-2">
            🎭 Mood-Based Discovery
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            How are you feeling today?
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Pick a mood and we'll find the perfect books for you
          </p>
        </div>

        {/* 3×2 pill grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {moods.map((mood) => (
            <button
              key={mood.route}
              onClick={() => navigate(`/mood/${mood.route}`)}
              className={`
                group relative flex items-center gap-4 p-4 rounded-2xl
                bg-gradient-to-br ${mood.gradient}
                border ${mood.border}
                hover:border-opacity-80
                shadow-lg ${mood.glow} hover:shadow-xl
                transition-all duration-300 hover:scale-105 hover:-translate-y-0.5
                overflow-hidden text-left
              `}
            >
              {/* Background image overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url(${mood.image})` }}
              />

              {/* Emoji */}
              <span className="text-3xl flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-300">
                {mood.emoji}
              </span>

              {/* Label */}
              <div className="relative z-10">
                <p className="text-white font-bold text-base leading-tight">{mood.label}</p>
                <p className="text-gray-400 text-xs mt-0.5 group-hover:text-gray-300 transition-colors">
                  Browse books →
                </p>
              </div>

              {/* Hover glow streak */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}