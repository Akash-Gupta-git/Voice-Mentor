import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { FaBars, FaPlus } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import ChatContent from '../../components/ChatContent';
import {  collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firestore'; // Import Firestore instance
import "../../css/App.css";
// import { useAuth } from '../../context/AuthContext';
// import { getAuth } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

const generateUniqueId = () => `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const Chat = () => {
    const { currentUser } = useAuth();
    const { chatId } = useParams();
    const navigate = useNavigate();

    // const [chatKey, setChatKey] = useState(0); // Key to force re-mount for new chat
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [conversations, setConversations] = useState([]); // Stores all conversations
    const [activeChatId, setActiveChatId] = useState(null); // ID of the currently active chat

 
    const userEmail = currentUser?.email;
    const userName = currentUser?.displayName || userEmail?.split('@')[0] || 'User';

    
    const handleNewChat = useCallback(async () => {
        if (!currentUser) return;
            const newChatId = generateUniqueId();
            const newChatRef = doc(db, `users/${currentUser.uid}/chats`, newChatId);
            // const chatDomain = domain || 'General';
            const initialMessages = [{ type: 'bot', text: `Hi, ${userName}! I'm your AI assistant. Ask me anything.` }];
            const newChatData = {
                title: "New Chat",
                messages: initialMessages,
                lastUpdated: new Date(),
                // domain: chatDomain
                userName: userName
            };
            try {
                await setDoc(newChatRef, newChatData);
                setConversations(prev => [{ id: newChatId, ...newChatData }, ...prev]);
                setActiveChatId(newChatId);
                navigate(`/chat/${newChatId}`);
                // navigate(`/Dashboard/chat/${newChatId}`);
            } catch (e) {
                console.error("Error creating new chat:", e);
            }
            if (window.innerWidth < 992) {
                setIsSidebarOpen(false);
            }
    }, [currentUser, userName, navigate]);


    
// Initialize a new chat when component mounts or domain/chatKey changes
useEffect(() => {


    const fetchConversations = async () => {
        if (!currentUser) return;
            try {
                const q = query(collection(db, `users/${currentUser.uid}/chats`), orderBy("lastUpdated", "desc"), limit(20));
                const querySnapshot = await getDocs(q);

                const fetchedConversations = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setConversations(fetchedConversations);

                if (chatId && fetchedConversations.find(c => c.id === chatId)) {
                    setActiveChatId(chatId);
                } else if (fetchedConversations.length > 0) {
                    // If no specific chat ID, set the most recent chat as active
                    setActiveChatId(fetchedConversations[0].id);
                    navigate(`/Dashboard/chat/${fetchedConversations[0].id}`, { replace: true });
                } else {
                    // If no chats exist, create a new one
                    handleNewChat();
                }
            } catch (e) {
                console.error("Error fetching conversations:", e);
                // Redirect on error to prevent bad requests
                navigate('/');
            }

        };

        fetchConversations();
    }, [currentUser, chatId, navigate, handleNewChat]);


     // Saves the current messages to Firestore
    const handleSaveChat = useCallback(async (id, updatedMessages) => {
        if (!currentUser) return;
        const chatRef = doc(db, `users/${currentUser.uid}/chats`, id);
        const firstUserMessage = updatedMessages.find(msg => msg.type === 'user');
        const newTitle = firstUserMessage ? firstUserMessage.text.substring(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '') : "New Chat";
        try {
            await setDoc(chatRef, {
                messages: updatedMessages,
                title: newTitle,
                lastUpdated: new Date(),
                userName: userName
            }, { merge: true }); // Use merge to avoid overwriting other fields
                // Update local state after successful save
                setConversations(prev => {
                    const updatedConversations = prev.map(conv =>
                    conv.id === id ? { id, messages: updatedMessages, title: newTitle, lastUpdated: new Date(), userName: userName } : conv
                );
                return updatedConversations;
            });
        } catch (e) {
            console.error("Error saving chat:", e);
        }
    }, [currentUser, userName]);

    const handleSelectChat = useCallback((id) => {
        if (activeChatId === id) return;
            setActiveChatId(id);
            navigate(`/Dashboard/chat/${id}`);
        if (window.innerWidth < 992) {
            setIsSidebarOpen(false);
        }
    }, [activeChatId, navigate]);



    
    // if (!activeChatId || !conversations.find(conv => conv.id === activeChatId)) {
    //         const newChatId = generateUniqueId();
    //         setConversations(prev => [
    //             { id: newChatId, title: "New Chat", messages: [{ type: 'bot', text: `Hi! I'm your AI assistant for ${decodeURIComponent(domain)}. Ask me anything.` }] },
    //             ...prev
    //         ]);
    //         setActiveChatId(newChatId);
    //         navigate(`/Dashboard/chat/${newChatId}`, { replace: true });
    //     }
    // },  [activeChatId, domain, navigate, conversations]);

    
    // // Saves the current messages to a specific conversation ID
    // const handleSaveChat = useCallback((id, updatedMessages) => {
    //     setConversations(prev => {
    //         const currentChatIndex = prev.findIndex(conv => conv.id === id);
    //         if (currentChatIndex !== -1) {
    //             const updatedConversations = [...prev];
    //             const firstUserMessage = updatedMessages.find(msg =>
    //                 msg.type === 'user' &&
    //                 msg.text &&
    //                 !msg.text.startsWith("Sending voice message") &&
    //                 !msg.text.startsWith("📎 Uploaded file") &&
    //                 !msg.text.startsWith("🎤 Voice message")
    //             );
    //             const newTitle = firstUserMessage ? firstUserMessage.text.substring(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '') : "New Chat";

    //             updatedConversations[currentChatIndex] = {
    //                 ...updatedConversations[currentChatIndex],
    //                 messages: updatedMessages,
    //                 title: newTitle
    //             };
    //             return updatedConversations;
    //         }
    //         return prev;
    //     });
    // }, []);
    
    // // Loads a specific conversation by ID
    // const handleNewChat = () => {
    //     const newChatId = generateUniqueId();
    //     const newConversation = {
    //         id: newChatId,
    //         title: "New Chat",
    //         messages: [{ type: 'bot', text: `Hi! I'm your AI assistant for ${decodeURIComponent(domain)}. Ask me anything.` }]
    //     };
    //     // const currentChat = conversations.find(conv => conv.id === activeChatId);
    //     // if (currentChat && currentChat.messages.some(msg => msg.type === 'user')) {
    //     //     handleSaveChat(activeChatId, currentChat.messages);
    //     // }
    //     setConversations(prev => [newConversation, ...prev]);
    //     // setChatKey(prevKey => prevKey + 1);
    //     setActiveChatId(newChatId);
    //      navigate(`/Dashboard/chat/${newChatId}`); // Update URL
    //     if (window.innerWidth < 992) {
    //         setIsSidebarOpen(false);
    //     }
    // };
    // const handleSelectChat = useCallback((id) => {
    //     if (activeChatId === id) return;

    //     const selectedConv = conversations.find(conv => conv.id === id);
    //     if (selectedConv) {
    //         setActiveChatId(id);
    //     }
    //      navigate(`/Dashboard/chat/${id}`); // Update URL when a chat is selected
    //     if (window.innerWidth < 992) {
    //         setIsSidebarOpen(false);
    //     }
    // }, [conversations, navigate, activeChatId]);



    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Close sidebar if screen resizes to desktop size while it's open (mobile-only behavior)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992 && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

    // Get the messages for the currently active chat
    const currentChatMessages = activeChatId ? conversations.find(conv => conv.id === activeChatId)?.messages || [] : [];
    

    return (
        <Container fluid className="my-1 d-flex flex-grow-1 p-0"> {/* Use fluid for full width, flex-grow-1 for full height */}
            <div className="animated-background"></div> {/* Animated background */}

            {/* Sidebar Component */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                onNewChat={handleNewChat}
                conversations={conversations}
                onSelectChat={handleSelectChat}
                activeChatId={activeChatId}
            />
            {/* Overlay to dim main content and close sidebar on click (mobile only) */}
            <div className={`sidebar-overlay d-lg-none ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>

            {/* Main Chat Area */}
            <div className="chat-area flex-grow-1"> {/* Flex-grow to take remaining width */}
                {/* Burger menu button (mobile-only, controlled by Chat component) */}

                <Button variant="link" className="burger-menu-btn d-lg-none" onClick={toggleSidebar} title="Open Menu">
                    <FaBars size={24} color="#0072ff" />
                </Button>

                {activeChatId && ( // Only render ChatContent if an activeChatId exists
                    <ChatContent
                        key={activeChatId} // Use activeChatId as key to force re-mount only when switching chats
                        userName={userName}
                        userEmail={userEmail}
                        currentMessages={currentChatMessages}
                        onSaveChat={handleSaveChat}
                        activeChatId={activeChatId}
                    />
                )}
            </div>
        </Container>
    );
};

export default Chat;