// import React, { useState, useEffect, useRef } from "react";
// import { BASE_URL } from "../utils/constant";

// const AiChatInterface = () => {
//   const [chats, setChats] = useState([]); // Stores chat history
//   const [prompt, setPrompt] = useState(""); // Input prompt
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);



//   // Scroll to bottom when chats change
//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [chats]);

//   // Fetch existing chat history when component mounts
//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/Expense/Premium/Ai`, {
//           method: "GET",
//           credentials: "include",
//         });

//         if (!res.ok) throw new Error("Failed to fetch chat history");

//         const data = await res.json();
//         setChats(data.result || []);
//       } catch (err) {
//         console.error("Error fetching chat:", err);
//       }
//     };

//     fetchChats();
//   }, []);

//   // Handle sending prompt
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!prompt.trim()) return;

//     const newChat = {
//       Prompt: prompt,
//       Response: null, // placeholder till response arrives
//     };

//     setChats((prev) => [...prev, newChat]);
//     setPrompt("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${BASE_URL}/Expense/Premium/Ai`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ prompt }),
//       });

//       if (!res.ok) throw new Error("Failed to get response");

//       const data = await res.json();
//       const aiResponse = data?.result || "No response received.";

//       // Replace placeholder with backend response
//       setChats((prev) => {
//         const updated = [...prev];
//         updated[updated.length - 1].Response = aiResponse;
//         return updated;
//       });
//     } catch (err) {
//       console.error("Error sending prompt:", err);
//     } finally {
//       setLoading(false);
//       scrollToBottom();
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header */}
//       <div className="bg-green-600 text-white text-center py-4 text-lg font-semibold shadow">
//         💬 AI Expense Assistant
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//         {chats.map((chat, idx) => (
//           <div key={idx} className="space-y-2">
//             {/* User Prompt */}
//             <div className="flex justify-end">
//               <div className="bg-green-500 text-white p-3 rounded-xl max-w-[70%] shadow">
//                 {chat.Prompt}
//               </div>
//             </div>

//             {/* AI Response */}
//             {chat.Response ? (
//               <div className="flex justify-start">
//                 <div
//                   className="bg-white border p-3 rounded-xl max-w-[75%] shadow"
//                   dangerouslySetInnerHTML={{
//                     __html: chat.Response.replace(/\n/g, "<br/>"),
//                   }}
//                 ></div>
//               </div>
//             ) : (
//               <div className="flex justify-start">
//                 <div className="text-gray-500 italic">Thinking...</div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Loader when waiting */}
//         {loading && (
//           <div className="flex justify-start items-center space-x-2">
//             <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
//             <span className="text-gray-600 text-sm">AI is thinking...</span>
//           </div>
//         )}

//         <div ref={chatEndRef}></div>
//       </div>

//       {/* Input Box */}
//       <form
//         onSubmit={handleSend}
//         className="flex items-center bg-white p-4 border-t shadow-md"
//       >
//         <input
//           type="text"
//           className="flex-1 border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
//           placeholder="Ask something..."
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="ml-3 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AiChatInterface;





import React, { useState, useEffect, useRef } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addRefresh } from "../utils/refresh";
import { addUser } from "../utils/userSlice";

const AiChatInterface = () => {
  const [chats, setChats] = useState([]); // Chat history
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();


  // Scroll to bottom whenever chats update
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [chats]);

  // Fetch chat history from backend on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/Expense/Premium/Ai`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch chat history");

        const data = await res.json();
        setChats(data.result || []);
      } catch (err) {
        console.error("Error fetching chat:", err);
      }
    };

    fetchChats();
  }, []);

  // Helper: format timestamp
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle user submitting a new prompt
  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // if (!user || user.Wallet_Balance <= 0) {
    //   setShowPopup(true);
    //   setTimeout(() => setShowPopup(false), 2500);
    //   return;
    // }

    // Always fetch updated profile first
    const profileRes = await fetch(`${BASE_URL}/Profile`, {
      credentials: "include",
    });
    const profileData = await profileRes.json();

    if (profileData.Data.Wallet_Balance <= 0) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
      return;
    }

    // Use dispatch so Redux stays in sync
    dispatch(addUser(profileData.Data));

    const newChat = {
      Prompt: prompt,
      Response: null,
      createdAt: new Date().toISOString(),
    };

    setChats((prev) => [...prev, newChat]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/Expense/Premium/Ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      const aiResponse = data?.result || "No response received.";
      const createdAt = data?.createdAt || new Date().toISOString();

      // Update last chat with AI response
      setChats((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].Response = aiResponse;
        updated[updated.length - 1].createdAt = createdAt;
        return updated;
      });
      dispatch(addRefresh());
    } catch (err) {
      console.error("Error sending prompt:", err);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100  relative">
      {/* Header */}
      <div className="bg-green-600 text-white text-center py-4 text-lg font-semibold shadow">
        💬 AI Expense Assistant
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {chats.map((chat, idx) => (
          <div key={idx} className="space-y-2">
            {/* User Prompt */}
            <div className="flex justify-end">
              <div className="bg-green-500 text-white p-3 rounded-xl max-w-[70%] shadow">
                <div>{chat.Prompt}</div>
                <div className="text-xs text-gray-200 mt-1 text-right">
                  {formatTime(chat.createdAt)}
                </div>
              </div>
            </div>

            {/* AI Response */}
            {chat.Response ? (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-xl max-w-[75%] shadow">
                  <div
                    className="text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: chat.Response.replace(/\n/g, "<br/>"),
                    }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formatTime(chat.createdAt)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="text-gray-500 italic">Thinking...</div>
              </div>
            )}
          </div>
        ))}

        {/* Loader */}
        {loading && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 text-sm">AI is thinking...</span>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {showPopup && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-md text-sm animate-fade-in-out">
          You don’t have enough balance. Please recharge to ask questions 💰
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="flex items-center bg-white p-4 border-t shadow-md"
      >
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ask something..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-3 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AiChatInterface;
