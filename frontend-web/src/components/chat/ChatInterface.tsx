import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Avatar, Rating } from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { TrustBadge } from '@/components/common/TrustBadges';

// Icons
const SendIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const AttachIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

const EmojiIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MoreVerticalIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const VideoIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CheckDoubleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

// Types
interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
    id: string;
    participant: {
        id: string;
        name: string;
        avatar?: string;
        isOnline: boolean;
        rating?: number;
        isVerified?: boolean;
    };
    lastMessage: {
        text: string;
        timestamp: string;
        unread: boolean;
    };
    trip?: {
        origin: string;
        destination: string;
        date: string;
    };
}

interface ChatInterfaceProps {
    conversation: Conversation;
    messages: Message[];
    currentUserId: string;
    onSendMessage: (text: string) => void;
    onBack?: () => void;
    className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    conversation,
    messages,
    currentUserId,
    onSendMessage,
    onBack,
    className,
}) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'اليوم';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'أمس';
        } else {
            return date.toLocaleDateString('ar', { month: 'short', day: 'numeric' });
        }
    };

    // Group messages by date
    const groupedMessages = messages.reduce<{ [key: string]: Message[] }>((acc, message) => {
        const date = new Date(message.timestamp).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(message);
        return acc;
    }, {});

    return (
        <div className={cn('flex flex-col h-full bg-white rounded-xl shadow-card overflow-hidden', className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 hover:bg-dark-100 rounded-lg">
                            <ArrowLeftIcon className="w-5 h-5 text-dark-600" />
                        </button>
                    )}
                    <div className="relative">
                        <Avatar
                            src={conversation.participant.avatar}
                            name={conversation.participant.name}
                            size="md"
                        />
                        {conversation.participant.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-dark-900">{conversation.participant.name}</h3>
                            {conversation.participant.isVerified && (
                                <TrustBadge type="verified" size="sm" showLabel={false} />
                            )}
                        </div>
                        {conversation.participant.rating && (
                            <div className="flex items-center gap-1">
                                <Rating value={conversation.participant.rating} size="sm" showValue />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-dark-100 rounded-lg">
                        <PhoneIcon className="w-5 h-5 text-dark-600" />
                    </button>
                    <button className="p-2 hover:bg-dark-100 rounded-lg">
                        <VideoIcon className="w-5 h-5 text-dark-600" />
                    </button>
                    <button className="p-2 hover:bg-dark-100 rounded-lg">
                        <MoreVerticalIcon className="w-5 h-5 text-dark-600" />
                    </button>
                </div>
            </div>

            {/* Trip Info Banner */}
            {conversation.trip && (
                <div className="px-4 py-2 bg-primary-50 border-b border-primary-100">
                    <p className="text-sm text-primary-700">
                        <span className="font-medium">رحلة:</span> {conversation.trip.origin} ← {conversation.trip.destination}
                    </p>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date}>
                        {/* Date separator */}
                        <div className="flex items-center justify-center mb-4">
                            <span className="px-3 py-1 text-xs text-dark-400 bg-dark-50 rounded-full">
                                {formatDate(dateMessages[0].timestamp)}
                            </span>
                        </div>

                        {/* Messages */}
                        {dateMessages.map((message) => {
                            const isOwn = message.senderId === currentUserId;
                            return (
                                <div
                                    key={message.id}
                                    className={cn('flex mb-3', isOwn ? 'justify-end' : 'justify-start')}
                                >
                                    <div
                                        className={cn(
                                            'max-w-[75%] px-4 py-2 rounded-2xl',
                                            isOwn
                                                ? 'bg-primary-500 text-white rounded-br-sm'
                                                : 'bg-dark-100 text-dark-900 rounded-bl-sm'
                                        )}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <div
                                            className={cn(
                                                'flex items-center justify-end gap-1 mt-1',
                                                isOwn ? 'text-white/70' : 'text-dark-400'
                                            )}
                                        >
                                            <span className="text-xs">{formatTime(message.timestamp)}</span>
                                            {isOwn && (
                                                <span>
                                                    {message.status === 'read' ? (
                                                        <CheckDoubleIcon className="w-4 h-4" />
                                                    ) : message.status === 'delivered' ? (
                                                        <CheckDoubleIcon className="w-4 h-4 opacity-70" />
                                                    ) : (
                                                        <CheckIcon className="w-4 h-4" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-white">
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-dark-100 rounded-lg">
                        <AttachIcon className="w-5 h-5 text-dark-400" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="اكتب رسالة..."
                        className="flex-1 px-4 py-2.5 bg-dark-100 rounded-full border-none focus:ring-2 focus:ring-primary-500 text-dark-900 placeholder:text-dark-400"
                    />
                    <button className="p-2 hover:bg-dark-100 rounded-lg">
                        <EmojiIcon className="w-5 h-5 text-dark-400" />
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="p-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Conversation List Item
interface ConversationItemProps {
    conversation: Conversation;
    onClick: () => void;
    isActive?: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
    conversation,
    onClick,
    isActive = false,
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200',
                isActive ? 'bg-primary-50' : 'hover:bg-dark-50'
            )}
        >
            <div className="relative flex-shrink-0">
                <Avatar
                    src={conversation.participant.avatar}
                    name={conversation.participant.name}
                    size="md"
                />
                {conversation.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full" />
                )}
            </div>
            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                    <h4 className={cn(
                        'font-medium truncate',
                        conversation.lastMessage.unread ? 'text-dark-900' : 'text-dark-700'
                    )}>
                        {conversation.participant.name}
                    </h4>
                    <span className="text-xs text-dark-400 flex-shrink-0">
                        {formatTimeAgo(conversation.lastMessage.timestamp)}
                    </span>
                </div>
                <p className={cn(
                    'text-sm truncate',
                    conversation.lastMessage.unread ? 'text-dark-900 font-medium' : 'text-dark-500'
                )}>
                    {conversation.lastMessage.text}
                </p>
            </div>
        </button>
    );
};

// Helper function
function formatTimeAgo(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `${minutes}د`;
    if (hours < 24) return `${hours}س`;
    if (days < 7) return `${days}ي`;
    return date.toLocaleDateString('ar', { month: 'short', day: 'numeric' });
}

export default ChatInterface;
