



import React, { useEffect, useRef, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";

// helper: format timestamp
const formatTime = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

// helper: format date for last message
const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

export default function ChatApp() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [contactType, setContactType] = useState("My contacts"); // "My contacts" or "All contacts"

  const [selectedContact, setSelectedContact] = useState(null); // contact object
  const [messages, setMessages] = useState([]); // messages of selected contact

  const [input, setInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
    const [lastMessageForAI, setLastMessageForAI] = useState({});
    const [chatForMe,setChatForMe]=useState(false)

  const messagesEndRef = useRef(null);
  const sidebarRef = useRef(null);

  const user = useSelector((state) => state.user);
  const userId = user?.id;

  // --- Fetch contacts based on type ---
  const fetchContacts = async (type = contactType) => {
    try {
      const queryParam = type === "My contacts" ? "myContacts" : "allContacts";
      const res = await fetch(`${BASE_URL}/contacts?type=${queryParam}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();

      // Transform the user data to match our UI structure
      const transformedContacts =
        data.result?.map((user) => {
          return {
            id: user.id, // Using user id as contact id
            name: user.name || "Unknown",
            photoUrl: user.photoUrl || null,
            lastMessage: "No messages yet", // You'll need to get this from chat history
            lastTime: user.updatedAt || user.createdAt,
            userData: user, // Store the full user data for later use
          };
        }) || [];

      setContacts(transformedContacts);
      setFilteredContacts(transformedContacts);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setContacts([]);
      setFilteredContacts([]);
    }
  };

  // --- Fetch messages for a contact ---
  const fetchMessagesFor = async (contact) => {
    if (!contact) return;
    setLoadingMessages(true);
    setMessages([]);

    try {
      // Now we need to fetch chat between current user and selected contact
      const res = await fetch(
        `${BASE_URL}/Chat/message?otherUserId=${contact.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();

      // Transform messages to match our UI structure
      // Assuming the backend returns data in the format you showed earlier
      const chatData = data.result?.[0];
      if (chatData) {
        const transformedMessages =
          chatData.Messages?.map((msg) => ({
            id: `msg-${msg.createdAt}-${msg.Sender_id}`,
            senderId: msg.Sender_id,
            text: msg.Message,
            createdAt: msg.createdAt,
          })) || [];

        setMessages(transformedMessages);

        // Update the contact's last message and time
        if (transformedMessages.length > 0) {
          const lastMessage =
            transformedMessages[transformedMessages.length - 1];
          setContacts((prevContacts) =>
            prevContacts.map((c) =>
              c.id === contact.id
                ? {
                    ...c,
                    lastMessage: lastMessage.text,
                    lastTime: lastMessage.createdAt,
                  }
                : c
            )
          );
        }
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
      setTimeout(() => scrollToBottom(), 150);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!selectedContact) return;

    const socket = createSocketConnection();
      socket.emit("joinChat", { userId, selectedContact: selectedContact.id });
      
       socket.on("receivedMessage", (input) => {
         // Update the message if needed
           console.log("Message received:", input.input);


           
            const newMsg = {
              id: `local-${Date.now()}`,
              senderId: input.userId,
              text: input.input,
              createdAt: new Date().toISOString(),
            };

           setMessages((m) => [...m, newMsg]);
           setLastMessageForAI(newMsg);
       });

    return () => {
      socket.disconnect();
    };
  }, [selectedContact]);

    useEffect(() => {
      if (!chatForMe || lastMessageForAI.senderId==userId) {
        return;
      }
        const talkForME = async ( lastMessageForAI ) => {
            try {
              console.log(lastMessageForAI, "lastMessageForAI");
              const socket = createSocketConnection();
              const res = await fetch(`${BASE_URL}/Chat/message/AI`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  prompt: lastMessageForAI.text,
                }),
              });

              if (!res.ok) throw new Error("Send failed");
              
              const data = await res.json();
              const aiResponse = data?.result || "No response received.";

               socket.emit("sendMessage", {
                 input: aiResponse,
                 userId: userId,
                 selectedContact: selectedContact.id,
               });
              
          }
          catch (err) {
              console.log(err.message)
           }
        };

        talkForME(lastMessageForAI);
        
        
    }, [lastMessageForAI]);

  // Handle contact type change
  const handleContactTypeChange = (type) => {
    setContactType(type);
    setSelectedContact(null);
    setMessages([]);
    fetchContacts(type);
  };

  // When you click a contact
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    fetchMessagesFor(contact);
  };

  // Search contacts
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(
        contacts.filter((c) => (c.name || "").toLowerCase().includes(q))
      );
    }
  }, [search, contacts]);

  // Auto-scroll to bottom in chat window when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Send message
  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!input.trim() || !selectedContact) return;

    const socket = createSocketConnection();

    // Optimistic UI: push message locally
   
   

    // Send via socket
    socket.emit("sendMessage", {
      input: input,
      userId: userId,
      selectedContact: selectedContact.id,
    });

   
     setInput("");
     scrollToBottom();
   
    // setSending(true);
    // try {
    //   const res = await fetch(`${BASE_URL}/Chat/message`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include",
    //     body: JSON.stringify({
    //       reciver: selectedContact.id,
    //       message: input,
    //       sender: userId,
    //     }),
    //   });

    //   if (!res.ok) throw new Error("Send failed");
    // } catch (err) {
    //   console.error("Send failed:", err);
      
    // } finally {
    //   setSending(false);
    // }
  };

  // UI pieces
  const ContactRow = ({ contact, active }) => {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
          active ? "bg-green-50" : "hover:bg-gray-50"
        }`}
        onClick={() => handleSelectContact(contact)}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={
              contact.photoUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                contact.name || "U"
              )}&background=0D9488&color=fff`
            }
            alt={contact.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-800 truncate">
              {contact.name}
            </h4>
            <span className="text-xs text-gray-400 ml-2">
              {contact.lastTime ? formatDate(contact.lastTime) : ""}
            </span>
          </div>
          {/* <p className="text-sm text-gray-500 truncate mt-1">
            {contact.lastMessage}
          </p> */}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
          <p className="text-xs text-gray-500 mt-1">Recent conversations</p>
        </div>

        {/* Contact Type Toggle */}
        <div className="px-4 py-3 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => handleContactTypeChange("My contacts")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                contactType === "My contacts"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              My contacts
            </button>
            <button
              onClick={() => handleContactTypeChange("All contacts")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                contactType === "All contacts"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All contacts
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Contacts list - scrollable */}
        <div
          ref={sidebarRef}
          className="flex-1 overflow-y-auto p-3 space-y-2"
          aria-label="Contact list"
        >
          {filteredContacts.length === 0 ? (
            <div className="text-center text-sm text-gray-500 mt-8">
              {contacts.length === 0
                ? "No contacts found"
                : "No matching contacts"}
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                active={selectedContact?.id === contact.id}
              />
            ))
          )}
        </div>

        {/* <div className="px-4 py-3 border-t">
          <button
            onClick={() => alert("Create new chat - implement later")}
            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition"
          >
            + New Chat
          </button>
        </div> */}
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center gap-4 flex-shrink-0">
          {selectedContact ? (
            <>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={
                        selectedContact.photoUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedContact.name || "U"
                        )}&background=0D9488&color=fff`
                      }
                      alt={selectedContact.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="text-lg font-semibold text-gray-800">
                      {selectedContact.name}
                    </div>
                    {/* <div className="text-sm text-gray-500">
                      {selectedContact.lastMessage || "No messages yet"}
                    </div> */}
                  </div>
                </div>

                {!chatForMe && (
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition disabled:opacity-60"
                    onClick={() => setChatForMe(true)}
                  >
                    Chat for me
                  </button>
                )}
                {chatForMe && (
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition disabled:opacity-60"
                    onClick={() => setChatForMe(false)}
                  >
                    Stop
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-500">
              Select a contact to start chatting
            </div>
          )}
        </div>

        {/* Chat messages — scrollable independently */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#f7f7f7]">
          <div className="max-w-3xl mx-auto space-y-4">
            {selectedContact ? (
              loadingMessages ? (
                <div className="text-center text-gray-500 py-10">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  No messages yet. Say hi 👋
                </div>
              ) : (
                messages.map((message) => {
                  const isMe = message.senderId === userId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-xl shadow ${
                          isMe
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">
                          {message.text}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isMe ? "text-gray-200" : "text-gray-400"
                          } text-right`}
                        >
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <div className="h-full grid place-items-center text-gray-400">
                <div>
                  <div className="text-2xl font-semibold mb-2">
                    Welcome to Chat
                  </div>
                  <div className="text-sm">
                    Select a contact to view messages
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="bg-white px-6 py-4 border-t flex-shrink-0"
        >
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedContact ? "Type a message..." : "Select a contact first"
              }
              disabled={!selectedContact}
              className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            {!chatForMe && ( <button
              type="submit"
              disabled={!selectedContact || !input.trim() || sending}
              className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send"}
            </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}