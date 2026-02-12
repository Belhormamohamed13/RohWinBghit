import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../../constants/theme'

const mockChats = [
  {
    id: '1',
    name: 'Ahmed Benali',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Je serai là dans 5 minutes',
    time: '10:30',
    unread: 2,
  },
  {
    id: '2',
    name: 'Karim Hadj',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'Merci pour le trajet!',
    time: 'Hier',
    unread: 0,
  },
  {
    id: '3',
    name: 'Sofia Merad',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'À quelle heure partez-vous?',
    time: 'Lun',
    unread: 1,
  },
]

const MessagesScreen = () => {
  const renderChat = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Ionicons name="create-outline" size={24} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockChats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
})

export default MessagesScreen
