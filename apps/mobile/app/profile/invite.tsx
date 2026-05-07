import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock Data
const INITIAL_FRIENDS = [
  { id: '1', name: 'Tynisha Obey', phone: '+1-300-555-0135', avatar: 'https://i.pravatar.cc/150?u=1', invited: false },
  { id: '2', name: 'Florencio Dorrance', phone: '+1-202-555-0136', avatar: 'https://i.pravatar.cc/150?u=2', invited: false },
  { id: '3', name: 'Chantal Shelburne', phone: '+1-300-555-0119', avatar: 'https://i.pravatar.cc/150?u=3', invited: false },
  { id: '4', name: 'Maryland Winkles', phone: '+1-300-555-0161', avatar: 'https://i.pravatar.cc/150?u=4', invited: false },
  { id: '5', name: 'Rodolfo Goode', phone: '+1-300-555-0136', avatar: 'https://i.pravatar.cc/150?u=5', invited: false },
  { id: '6', name: 'Benny Spanbauer', phone: '+1-202-555-0167', avatar: 'https://i.pravatar.cc/150?u=6', invited: false },
  { id: '7', name: 'Tyra Dhillon', phone: '+1-202-555-0119', avatar: 'https://i.pravatar.cc/150?u=7', invited: false },
  { id: '8', name: 'Jamel Eusebio', phone: '+1-300-555-0171', avatar: 'https://i.pravatar.cc/150?u=8', invited: false },
  { id: '9', name: 'Pedro Huard', phone: '+1-202-555-0171', avatar: 'https://i.pravatar.cc/150?u=9', invited: false },
  { id: '10', name: 'Clinton Mcclure', phone: '+1-300-555-0172', avatar: 'https://i.pravatar.cc/150?u=10', invited: false },
];

export default function InviteFriendsScreen() {
  const router = useRouter();
  const [friends, setFriends] = useState(INITIAL_FRIENDS);

  const toggleInvite = (id: string) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, invited: !friend.invited } : friend
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {friends.map((friend) => (
          <View key={friend.id} style={styles.friendRow}>
            <View style={styles.friendInfo}>
              <Image source={{ uri: friend.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendPhone}>{friend.phone}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.inviteButton, friend.invited && styles.invitedButton]}
              onPress={() => toggleInvite(friend.id)}
            >
              <Text style={[styles.inviteButtonText, friend.invited && styles.invitedButtonText]}>
                {friend.invited ? 'Invited' : 'Invite'}
              </Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    marginLeft: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 24,
  },
  friendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  friendPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  inviteButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#3B82F6',
    minWidth: 84,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  invitedButton: {
    backgroundColor: '#FFFFFF',
  },
  invitedButtonText: {
    color: '#3B82F6',
  },
});
