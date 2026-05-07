import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type InboxTab = 'Message' | 'Notification';

const MESSAGES = [
  {
    id: '1',
    name: 'Robert Fox',
    avatar: 'https://i.pravatar.cc/60?u=robert',
    message: 'Hello, how are you today? I would like to...',
    time: '09:41',
    unread: 2,
  },
  {
    id: '2',
    name: 'Esther Howard',
    avatar: 'https://i.pravatar.cc/60?u=esther',
    message: 'Great! See you on the next session then.',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'Floyd Miles',
    avatar: 'https://i.pravatar.cc/60?u=floyd',
    message: 'I uploaded the new lecture slides.',
    time: 'Mon',
    unread: 1,
  },
  {
    id: '4',
    name: 'Jenny Wilson',
    avatar: 'https://i.pravatar.cc/60?u=jenny',
    message: 'Please review the assignment I submitted.',
    time: 'Mon',
    unread: 0,
  },
  {
    id: '5',
    name: 'Cameron W.',
    avatar: 'https://i.pravatar.cc/60?u=cameron',
    message: 'The course will start next Monday.',
    time: 'Sun',
    unread: 0,
  },
  {
    id: '6',
    name: 'Devon Lane',
    avatar: 'https://i.pravatar.cc/60?u=devon',
    message: 'Thanks for enrolling in the course!',
    time: 'Sat',
    unread: 0,
  },
];

const NOTIFICATIONS = [
  {
    id: '1',
    icon: 'ribbon-outline' as const,
    color: '#3B82F6',
    title: 'Course Completed!',
    message: 'You have completed the Python for Beginners course.',
    time: '09:41 AM',
  },
  {
    id: '2',
    icon: 'cart-outline' as const,
    color: '#10B981',
    title: 'Payment Successful',
    message: 'Your payment for UI/UX Design Fundamentals was successful.',
    time: '10:00 AM',
  },
  {
    id: '3',
    icon: 'star-outline' as const,
    color: '#F59E0B',
    title: 'New Review',
    message: 'Someone left a 5-star review on your profile.',
    time: 'Yesterday',
  },
  {
    id: '4',
    icon: 'gift-outline' as const,
    color: '#EC4899',
    title: 'Special Offer!',
    message: 'Get 40% off on all Business courses this week only.',
    time: 'Yesterday',
  },
  {
    id: '5',
    icon: 'person-add-outline' as const,
    color: '#8B5CF6',
    title: 'New Mentor',
    message: 'A new mentor has joined the platform. Check them out!',
    time: 'Mon',
  },
];

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState<InboxTab>('Message');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>e</Text>
          </View>
          <Text style={styles.headerTitle}>Inbox</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['Message', 'Notification'] as InboxTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Message'
          ? MESSAGES.map((msg) => (
              <TouchableOpacity key={msg.id} style={styles.messageRow}>
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: msg.avatar }} style={styles.avatar} />
                  <View style={styles.onlineDot} />
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageTopRow}>
                    <Text style={styles.senderName}>{msg.name}</Text>
                    <Text style={styles.messageTime}>{msg.time}</Text>
                  </View>
                  <View style={styles.messageBottomRow}>
                    <Text style={styles.messagePreview} numberOfLines={1}>{msg.message}</Text>
                    {msg.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{msg.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          : NOTIFICATIONS.map((notif) => (
              <TouchableOpacity key={notif.id} style={styles.notifRow}>
                <View style={[styles.notifIcon, { backgroundColor: notif.color + '20' }]}>
                  <Ionicons name={notif.icon} size={24} color={notif.color} />
                </View>
                <View style={styles.notifContent}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 8,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  // Message styles
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  messageTime: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  messageBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreview: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 999,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Notification styles
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    gap: 16,
  },
  notifIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
    paddingTop: 2,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  notifMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
