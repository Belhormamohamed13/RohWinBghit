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

    const isDriver = user?.role === 'driver';
    const accentColor = isDriver ? 'accent-teal' : 'sand-300';
    const accentText = isDriver ? 'text-accent-teal' : 'text-sand-300';
    const accentBg = isDriver ? 'bg-accent-teal' : 'bg-sand-300';
    const accentBorder = isDriver ? 'border-accent-teal' : 'border-sand-300';

    // Fetch all user chats
    const { data: chats, isLoading: chatsLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const response = await chatApi.getChats();
            return response.data.data;
        },
        refetchInterval: 5000
    });

    // Initialize/Find chat
    useEffect(() => {
        const initChat = async () => {
            if (targetUserId && chats) {
                const existing = chats.find((c: any) => c.otherUser.id === targetUserId);

                if (existing) {
                    setActiveChat(existing);
                    setIsMobileListVisible(false);
                } else {
                    try {
                        const response = await chatApi.initiate(targetUserId);
                        setActiveChat(response.data.data);
                        setIsMobileListVisible(false);
                        queryClient.invalidateQueries({ queryKey: ['chats'] });
                    } catch (error) {
                        console.error('Failed to initiate chat', error);
                        navigate(isDriver ? '/driver' : '/passenger/my-bookings');
                    }
                }
            }
        };
        initChat();
    }, [targetUserId, chats, navigate, queryClient, isDriver]);

    // Fetch messages
    const { data: messages, isLoading: messagesLoading } = useQuery({
        queryKey: ['messages', activeChat?.id],
        queryFn: async () => {
            if (!activeChat?.id) return [];
            const response = await chatApi.getMessages(activeChat.id);
            return response.data.data;
        },
        enabled: !!activeChat?.id,
        refetchInterval: 3000
    });

    const sendMessageMutation = useMutation({
        mutationFn: (content: string) => chatApi.sendMessage(activeChat.id, content),
        onSuccess: () => {
            setMessageInput('');
            queryClient.invalidateQueries({ queryKey: ['messages', activeChat.id] });
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
        onError: () => toast.error('Impossible d\'envoyer le message.')
    });

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
        const basePath = isDriver ? '/driver/messages' : '/passenger/messages';
        navigate(`${basePath}/${chat.otherUser.id}`);
    };

    return (
        <ChatLayout user={user} noLayout={noLayout}>
            <div className={`h-[calc(100vh-100px)] max-w-7xl mx-auto p-4 flex gap-6 mt-4 font-body animate-fade-in`}>

                {/* Conversations List Panel */}
                <div className={`w-full md:w-1/3 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden flex flex-col ${isMobileListVisible ? 'block' : 'hidden md:flex'}`}>
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className={`text-2xl font-display tracking-wide text-white`}>MESSAGES</h2>
                        <div className={`w-8 h-8 rounded-full ${isDriver ? 'bg-accent-teal/10 text-accent-teal' : 'bg-sand-300/10 text-sand-300'} flex items-center justify-center border border-white/10`}>
                            <MoreVertical size={16} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {chatsLoading ? (
                            <div className="flex justify-center py-10"><div className={`w-8 h-8 rounded-full border-2 border-t-transparent animate-spin ${accentBorder}`}></div></div>
                        ) : chats?.length === 0 ? (
                            <div className="text-center py-20 text-white/40 font-mono">
                                <p className="text-xs font-bold uppercase tracking-widest mb-2">No Conversations</p>
                            </div>
                        ) : (
                            chats?.map((chat: any) => {
                                const isActive = activeChat?.id === chat.id;
                                return (
                                    <button
                                        key={chat.id}
                                        onClick={() => handleChatSelect(chat)}
                                        className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${isActive
                                            ? `${isDriver ? 'bg-accent-teal/20 border-l-4 border-accent-teal' : 'bg-sand-300/20 border-l-4 border-sand-300'}`
                                            : 'hover:bg-white/5 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={chat.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${chat.otherUser.firstName}+${chat.otherUser.lastName}&background=random`}
                                                alt={chat.otherUser.firstName}
                                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10"
                                            />
                                            {chat.unreadCount > 0 && !isActive && (
                                                <div className={`absolute -top-1 -right-1 w-5 h-5 ${accentBg} rounded-full border-2 border-night-900 flex items-center justify-center text-[10px] font-bold text-night-900`}>
                                                    {chat.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left overflow-hidden">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-white/80'}`}>{chat.otherUser.fullName}</h3>
                                                <span className={`text-[10px] font-mono ${isActive ? accentText : 'text-white/40'}`}>
                                                    {chat.lastMessage && format(new Date(chat.lastMessage.createdAt), 'HH:mm')}
                                                </span>
                                            </div>
                                            <p className={`text-xs truncate font-medium ${isActive ? 'text-white/80' : 'text-white/40'}`}>
                                                {chat.lastMessage ? (
                                                    <>
                                                        {chat.lastMessage.senderId === user?.id && <span className="opacity-70">You: </span>}
                                                        {chat.lastMessage.content}
                                                    </>
                                                ) : <span className="italic opacity-50">New conversation</span>}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Window Panel */}
                <div className={`flex-1 bg-night-800/60 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-card overflow-hidden flex flex-col relative ${!isMobileListVisible ? 'block' : 'hidden md:flex'}`}>
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md absolute top-0 left-0 right-0 z-10 rounded-t-[2rem]">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsMobileListVisible(true)}
                                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="relative">
                                        <img
                                            src={activeChat.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${activeChat.otherUser.firstName}+${activeChat.otherUser.lastName}&background=random`}
                                            alt={activeChat.otherUser.firstName}
                                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-night-900 shadow-[0_0_8px_#22c55e]"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg text-white tracking-wide">{activeChat.otherUser.fullName}</h3>
                                        <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest font-mono">Online</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                        <Phone size={18} />
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                        <Info size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 pt-24 space-y-6 bg-transparent">
                                {messagesLoading ? (
                                    <div className="flex justify-center h-full items-center">
                                        <div className={`w-10 h-10 rounded-full border-4 ${accentBorder} border-t-transparent animate-spin`}></div>
                                    </div>
                                ) : (
                                    messages?.map((msg: any) => {
                                        const isMe = msg.sender_id === user?.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] p-4 rounded-2xl relative group ${isMe
                                                    ? `${accentBg} text-night-900 rounded-br-none shadow-glow`
                                                    : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                                                    }`}>
                                                    <p className="text-sm font-medium leading-relaxed font-body">{msg.content}</p>
                                                    <p className={`text-[9px] font-mono font-bold uppercase tracking-widest mt-2 block text-right ${isMe ? 'opacity-60' : 'opacity-40'}`}>
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
                            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className={`flex-1 bg-night-900 border border-white/10 focus:border-${isDriver ? 'accent-teal' : 'sand-300'} rounded-xl px-6 py-4 outline-none transition-all font-medium text-white placeholder:text-white/20`}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim() || sendMessageMutation.isPending}
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 ${accentBg} text-night-900`}
                                    >
                                        <Send size={20} className="-ml-1 mt-1" />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-10 text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                                <MoreVertical size={40} className="opacity-20" />
                            </div>
                            <h3 className="text-2xl font-display text-white mb-2 tracking-wide">YOUR MESSAGES</h3>
                            <p className="max-w-xs mt-2 text-sm font-mono opacity-60">Select a conversation to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </ChatLayout>
    );
};

export default Chat;
