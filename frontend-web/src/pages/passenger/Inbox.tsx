import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../../services/api';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';

const Inbox: React.FC = () => {
    const { user: authUser } = useAuthStore();
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [message, setMessage] = useState('');

    const { data: chats, isLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const response = await chatApi.getChats();
            return response.data.data;
        }
    });

    const { data: messages, refetch: refetchMessages } = useQuery({
        queryKey: ['messages', selectedChat?.id],
        queryFn: async () => {
            if (!selectedChat) return [];
            const response = await chatApi.getMessages(selectedChat.id);
            return response.data.data;
        },
        enabled: !!selectedChat,
        refetchInterval: 3000
    });

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat) return;

        try {
            await chatApi.sendMessage(selectedChat.id, message);
            setMessage('');
            refetchMessages();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (isLoading) return <div className="flex items-center justify-center p-20 animate-pulse">Chargement de vos messages...</div>;

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-elevated overflow-hidden">
            {/* Sidebar: Conversations List */}
            <div className="w-96 border-r border-slate-100 dark:border-slate-800 flex flex-col">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">forum</span>
                        Messages
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {chats?.map((chat: any) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`w-full p-6 rounded-3xl flex items-center gap-4 transition-all ${selectedChat?.id === chat.id
                                ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            <img
                                src={chat.participant?.avatar_url || `https://ui-avatars.com/api/?name=${chat.participant?.first_name}+${chat.participant?.last_name}&background=13ec6d&color=fff&bold=true`}
                                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20"
                                alt="User"
                            />
                            <div className="flex-1 text-left overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                    <p className={`font-black text-sm truncate ${selectedChat?.id === chat.id ? 'text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                                        {chat.participant?.first_name} {chat.participant?.last_name}
                                    </p>
                                    <span className="text-[9px] font-bold opacity-60">12:45</span>
                                </div>
                                <p className="text-xs truncate opacity-70 font-medium">C'est parfait...</p>
                            </div>
                        </button>
                    ))}
                    {!chats?.length && (
                        <div className="text-center p-10 opacity-50 italic text-sm">Aucune discussion en cours</div>
                    )}
                </div>
            </div>

            {/* Main: Chat View */}
            <div className="flex-1 flex flex-col bg-white/20 dark:bg-slate-950/20">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedChat.participant?.avatar_url || `https://ui-avatars.com/api/?name=${selectedChat.participant?.first_name}&background=2bee6c&color=fff&bold=true`}
                                    className="w-12 h-12 rounded-xl object-cover"
                                    alt="User"
                                />
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                        {selectedChat.participant?.first_name} {selectedChat.participant?.last_name}
                                    </h3>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1.5 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                                        EN LIGNE
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400">
                                    <span className="material-symbols-outlined">call</span>
                                </button>
                                <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {messages?.map((msg: any) => {
                                const isMe = msg.sender_id === authUser?.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-6 rounded-[2rem] shadow-sm ${isMe
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-tr-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                            <p className="text-[9px] font-black mt-2 opacity-40 text-right uppercase tracking-[0.2em]">
                                                {format(new Date(msg.created_at || Date.now()), 'HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {!messages?.length && (
                                <div className="text-center py-20 opacity-30">
                                    <span className="material-symbols-outlined text-6xl mb-4">chat_bubble</span>
                                    <p className="text-sm font-black uppercase tracking-widest">Commencez la discussion</p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <div className="relative flex-1 group">
                                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">sentiment_satisfied</span>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Votre message ici..."
                                        className="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-[1.75rem] outline-none transition-all font-medium text-sm text-slate-900 dark:text-white shadow-soft"
                                    />
                                    <button className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                                        <span className="material-symbols-outlined">attach_file</span>
                                    </button>
                                </div>
                                <button className="w-16 h-16 bg-primary text-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                    <span className="material-symbols-outlined font-black">send</span>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 opacity-30 text-center italic">
                        <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center mb-10">
                            <span className="material-symbols-outlined text-6xl">forum</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">RohWin Chat</h3>
                        <p className="max-w-xs mx-auto">Séléctionnez une discussion pour commencer à échanger.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
