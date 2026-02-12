import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import { Send, ArrowLeft, MoreVertical, Phone, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import PassengerSpaceLayout from '../../components/layout/PassengerSpaceLayout';
import DriverLayout from '../../components/layout/DriverLayout';

interface ChatProps {
    noLayout?: boolean;
}

// Define wrapper component outside to prevent re-renders
const ChatLayout: React.FC<{ user: any, noLayout?: boolean, children: React.ReactNode }> = ({ user, noLayout, children }) => {
    if (noLayout) return <React.Fragment>{children}</React.Fragment>;
    if (user?.role === 'driver') return <DriverLayout>{children}</DriverLayout>;
    return <PassengerSpaceLayout activeTab="messages" onTabChange={() => { }}>{children}</PassengerSpaceLayout>;
};

const Chat: React.FC<ChatProps> = ({ noLayout }) => {
    const { userId: targetUserId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [activeChat, setActiveChat] = useState<any>(null);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isMobileListVisible, setIsMobileListVisible] = useState(!targetUserId);

    // Fetch all user chats
    const { data: chats, isLoading: chatsLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const response = await chatApi.getChats();
            return response.data.data;
        },
        refetchInterval: 5000 // Poll for new chats/updates
    });

    // Initialize/Find chat if targetUserId is present
    useEffect(() => {
        const initChat = async () => {
            if (targetUserId && chats) {
                // Check if chat already exists in list
                const existing = chats.find((c: any) =>
                    c.otherUser.id === targetUserId
                );

                if (existing) {
                    setActiveChat(existing);
                    setIsMobileListVisible(false);
                } else {
                    try {
                        // Create new chat
                        const response = await chatApi.initiate(targetUserId);
                        setActiveChat(response.data.data);
                        setIsMobileListVisible(false);
                        queryClient.invalidateQueries({ queryKey: ['chats'] });
                    } catch (error) {
                        console.error('Failed to initiate chat', error);
                        navigate(user?.role === 'driver' ? '/driver' : '/passenger/my-bookings');
                    }
                }
            }
        };

        initChat();
    }, [targetUserId, chats, navigate, queryClient, user?.role]);

    // Fetch messages for active chat
    const { data: messages, isLoading: messagesLoading } = useQuery({
        queryKey: ['messages', activeChat?.id],
        queryFn: async () => {
            if (!activeChat?.id) return [];
            const response = await chatApi.getMessages(activeChat.id);
            return response.data.data;
        },
        enabled: !!activeChat?.id,
        refetchInterval: 3000 // Poll for new messages
    });

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: (content: string) => chatApi.sendMessage(activeChat.id, content),
        onSuccess: () => {
            setMessageInput('');
            queryClient.invalidateQueries({ queryKey: ['messages', activeChat.id] });
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
        onError: (error) => {
            console.error('Message send error:', error);
            toast.error('Impossible d\'envoyer le message. Veuillez réessayer.');
        }
    });

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim() && activeChat) {
            sendMessageMutation.mutate(messageInput);
        }
    };

    const handleChatSelect = (chat: any) => {
        setActiveChat(chat);
        setIsMobileListVisible(false);
        const basePath = user?.role === 'driver' ? '/driver/messages' : '/passenger/messages';
        // Use replace: false to allow back navigation
        navigate(`${basePath}/${chat.otherUser.id}`);
    };

    return (
        <ChatLayout user={user} noLayout={noLayout}>
            <div className={`h-[calc(100vh-100px)] max-w-6xl mx-auto p-4 flex gap-6 ${user?.role === 'driver' ? 'mt-4' : 'mt-8'}`}>
                {/* Chat List Sidebar */}
                <div className={`w-full md:w-96 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden flex flex-col ${isMobileListVisible ? 'block' : 'hidden md:flex'}`}>
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Messages</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {chatsLoading ? (
                            <div className="text-center py-10 text-slate-400 text-xs uppercase tracking-widest">Chargement...</div>
                        ) : chats?.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">
                                <p className="text-xs font-black uppercase tracking-widest mb-2">Aucune conversation</p>
                                <p className="text-[10px] opacity-70">Vos discussions apparaîtront ici</p>
                            </div>
                        ) : (
                            chats?.map((chat: any) => (
                                <button
                                    key={chat.id}
                                    onClick={() => handleChatSelect(chat)}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${activeChat?.id === chat.id
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={chat.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${chat.otherUser.firstName}+${chat.otherUser.lastName}&background=random`}
                                            alt={chat.otherUser.firstName}
                                            className="w-12 h-12 rounded-xl object-cover"
                                        />
                                        {chat.unreadCount > 0 && activeChat?.id !== chat.id && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                                                {chat.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-sm truncate">{chat.otherUser.fullName}</h3>
                                            {chat.lastMessage && (
                                                <span className={`text-[9px] font-bold ${activeChat?.id === chat.id ? 'opacity-70' : 'text-slate-400'}`}>
                                                    {format(new Date(chat.lastMessage.createdAt), 'HH:mm')}
                                                </span>
                                            )}
                                        </div>
                                        {chat.lastMessage ? (
                                            <p className={`text-xs truncate ${activeChat?.id === chat.id ? 'opacity-80' : 'text-slate-500'}`}>
                                                {chat.lastMessage.senderId === user?.id ? 'Vous: ' : ''}{chat.lastMessage.content}
                                            </p>
                                        ) : (
                                            <p className="text-[10px] italic opacity-50">Nouvelle conversation</p>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`flex-1 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden flex flex-col ${!isMobileListVisible ? 'block' : 'hidden md:flex'}`}>
                    {activeChat ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsMobileListVisible(true)}
                                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </button>
                                    <div className="relative">
                                        <img
                                            src={activeChat.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${activeChat.otherUser.firstName}+${activeChat.otherUser.lastName}&background=random`}
                                            alt={activeChat.otherUser.firstName}
                                            className="w-10 h-10 rounded-xl object-cover"
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white">{activeChat.otherUser.fullName}</h3>
                                        <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En ligne</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                                        <Info className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-black/20">
                                {messagesLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    messages?.map((msg: any) => {
                                        const isMe = msg.sender_id === user?.id; // Note: msg.sender_id matches DB, check API response format
                                        // Wait, getMessages returns raw DB objects? Yes, Step 915 - getMessages selects *.
                                        // I should double check the API response format.
                                        // The ChatModel.getMessages returns raw 'messages' table rows.
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] p-4 rounded-2xl ${isMe
                                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-none shadow-lg'
                                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700'
                                                    }`}>
                                                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                                    <p className={`text-[9px] font-black uppercase tracking-widest mt-2 block text-right ${isMe ? 'opacity-50' : 'text-slate-400'
                                                        }`}>
                                                        {format(new Date(msg.created_at), 'HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Écrivez votre message..."
                                        className="flex-1 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-slate-900 dark:focus:border-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-700 dark:text-white placeholder:text-slate-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim() || sendMessageMutation.isPending}
                                        className="bg-[#13ec6d] text-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        <Send className="w-6 h-6 -ml-1 mt-1" />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                <MoreVertical className="w-10 h-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Vos Messages</h3>
                            <p className="max-w-xs mt-2 text-sm">Sélectionnez une conversation pour commencer à discuter avec vos covoitureurs.</p>
                        </div>
                    )}
                </div>
            </div>
        </ChatLayout>
    );
};

export default Chat;
