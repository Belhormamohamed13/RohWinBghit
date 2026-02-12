/**
 * Chat Model
 * Represents chat conversations between users
 */

class ChatModel {
    constructor(knex) {
        this.knex = knex;
        this.tableName = 'chats';
    }

    /**
     * Create or retrieve existing chat between two users
     * @param {string} user1Id - First user ID
     * @param {string} user2Id - Second user ID
     * @returns {Promise<Object>} Chat object
     */
    async findOrCreate(user1Id, user2Id) {
        // Ensure consistent ordering to prevent duplicate chats
        if (user1Id === user2Id) {
            throw new Error('Cannot create chat with self');
        }
        const [u1, u2] = [user1Id, user2Id].sort();

        // Check if chat exists
        const existingChat = await this.knex(this.tableName)
            .where({ user1_id: u1, user2_id: u2 })
            .first();

        if (existingChat) {
            return this.format(existingChat);
        }

        // Create new chat
        const [newChat] = await this.knex(this.tableName)
            .insert({
                user1_id: u1,
                user2_id: u2,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning('*');

        return this.format(newChat);
    }

    /**
     * Get user's chats with last message
     * @param {string} userId - User ID
     * @returns {Promise<Array>} List of chats
     */
    async getUserChats(userId) {
        const chats = await this.knex(this.tableName)
            .select(
                'chats.*',
                'u1.first_name as u1_first_name', 'u1.last_name as u1_last_name', 'u1.avatar_url as u1_avatar',
                'u2.first_name as u2_first_name', 'u2.last_name as u2_last_name', 'u2.avatar_url as u2_avatar'
            )
            .leftJoin('users as u1', 'chats.user1_id', 'u1.id')
            .leftJoin('users as u2', 'chats.user2_id', 'u2.id')
            .where('user1_id', userId)
            .orWhere('user2_id', userId)
            .orderBy('updated_at', 'desc');

        // Fetch last message for each chat
        const chatsWithLastMessage = await Promise.all(chats.map(async (chat) => {
            const lastMessage = await this.knex('messages')
                .where('chat_id', chat.id)
                .orderBy('created_at', 'desc')
                .first();

            const unreadCount = await this.knex('messages')
                .where('chat_id', chat.id)
                .where('read_at', null)
                .whereNot('sender_id', userId)
                .count('* as count')
                .first();

            return {
                ...this.format(chat, userId),
                lastMessage: lastMessage ? {
                    content: lastMessage.content,
                    createdAt: lastMessage.created_at,
                    isRead: !!lastMessage.read_at,
                    senderId: lastMessage.sender_id
                } : null,
                unreadCount: parseInt(unreadCount.count)
            };
        }));

        return chatsWithLastMessage;
    }

    /**
     * Get messages for a chat
     * @param {string} chatId - Chat ID
     * @param {Object} options - Pagination options
     * @returns {Promise<Array>} List of messages
     */
    async getMessages(chatId, options = {}) {
        const { limit = 50, offset = 0 } = options;

        const messages = await this.knex('messages')
            .where('chat_id', chatId)
            .orderBy('created_at', 'desc') // returning newest first
            .limit(limit)
            .offset(offset);

        return messages.reverse(); // returning oldest first for display
    }

    /**
     * Send a message
     * @param {string} chatId - Chat ID
     * @param {string} senderId - Sender ID
     * @param {string} content - Message content
     * @returns {Promise<Object>} Created message
     */
    async sendMessage(chatId, senderId, content) {
        const [message] = await this.knex('messages')
            .insert({
                chat_id: chatId,
                sender_id: senderId,
                content,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning('*');

        // Update chat timestamp
        await this.knex(this.tableName)
            .where('id', chatId)
            .update('updated_at', new Date());

        return message;
    }

    /**
     * Mark messages as read
     * @param {string} chatId - Chat ID
     * @param {string} userId - User reading the messages
     */
    async markAsRead(chatId, userId) {
        await this.knex('messages')
            .where('chat_id', chatId)
            .whereNot('sender_id', userId)
            .where('read_at', null)
            .update('read_at', new Date());
    }

    /**
     * Format chat object
     * @param {Object} chat - Raw chat object
     * @param {string} currentUserId - ID of the current user (to determine the "other" participant)
     * @returns {Object} Formatted chat
     */
    format(chat, currentUserId) {
        if (!chat) return null;

        let otherUser = {};
        if (currentUserId) {
            if (chat.user1_id === currentUserId) {
                otherUser = {
                    id: chat.user2_id,
                    firstName: chat.u2_first_name,
                    lastName: chat.u2_last_name,
                    fullName: `${chat.u2_first_name} ${chat.u2_last_name}`,
                    avatarUrl: chat.u2_avatar
                };
            } else {
                otherUser = {
                    id: chat.user1_id,
                    firstName: chat.u1_first_name,
                    lastName: chat.u1_last_name,
                    fullName: `${chat.u1_first_name} ${chat.u1_last_name}`,
                    avatarUrl: chat.u1_avatar
                };
            }
        }

        return {
            id: chat.id,
            participants: [chat.user1_id, chat.user2_id],
            otherUser,
            createdAt: chat.created_at,
            updatedAt: chat.updated_at
        };
    }
}

module.exports = ChatModel;
