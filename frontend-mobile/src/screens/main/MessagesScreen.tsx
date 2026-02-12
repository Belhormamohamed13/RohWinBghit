import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { chatApi } from '../../services/api'
import { colors, spacing } from '../../constants/theme'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const MessagesScreen = () => {
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      // Assuming GET /chats returns user's conversations
      const response = await chatApi.getChats()
      return response.data.data
    },
  })

  const renderChat = ({ item }: { item: any }) => {
    // Adapter for chat data structure
    const otherUser = item.participants?.find((p: any) => p.id !== 'current-user-id') || item.otherUser || {} // Logic to find other user depends on API response structure
    // Using fallback values for now as we don't know exact API shape

    return (
      <TouchableOpacity style={styles.chatItem}>
        <Image
          source={{ uri: otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${otherUser.firstName || 'User'}` }}
          style={styles.avatar}
        />
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{otherUser.firstName} {otherUser.lastName}</Text>
            <Text style={styles.time}>
              {item.lastMessage?.createdAt ? format(new Date(item.lastMessage.createdAt), 'HH:mm') : ''}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage?.content || 'Nouvelle conversation'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Ionicons name="create-outline" size={24} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={chats || []}
          renderItem={renderChat}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Aucun message</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[100],
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark[900],
  },
  newMessageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingVertical: spacing.sm,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[50],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  chatContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark[900],
  },
  time: {
    fontSize: 12,
    color: colors.dark[400],
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.dark[500],
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: colors.dark[500],
    fontSize: 16,
  },
})

export default MessagesScreen
