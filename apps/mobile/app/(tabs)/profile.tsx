import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Switch, 
  ScrollView,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

  const handleLogout = () => {
    setShowLogoutModal(false);
    signOut();
  };

  const renderMenuItem = (
    iconName: keyof typeof Ionicons.glyphMap, 
    title: string, 
    rightElement?: React.ReactNode, 
    isDestructive?: boolean,
    onPress?: () => void
  ) => {
    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress}>
        <View style={styles.menuItemLeft}>
          <Ionicons 
            name={iconName} 
            size={24} 
            color={isDestructive ? '#EF4444' : '#1F2937'} 
            style={styles.menuIcon} 
          />
          <Text style={[styles.menuTitle, isDestructive && styles.destructiveText]}>
            {title}
          </Text>
        </View>
        <View style={styles.menuItemRight}>
          {rightElement || (
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>e</Text>
            </View>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=andrew' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Andrew Ainsley</Text>
          <Text style={styles.userEmail}>andrew_ainsley@yourdomain.com</Text>
        </View>

        <View style={styles.divider} />

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {renderMenuItem('person-outline', 'Edit Profile', undefined, false, () => router.push('/profile/edit'))}
          {renderMenuItem('notifications-outline', 'Notification', undefined, false, () => router.push('/profile/notification'))}
          {renderMenuItem('wallet-outline', 'Payment', undefined, false, () => router.push('/profile/payment'))}
          {renderMenuItem('shield-checkmark-outline', 'Security', undefined, false, () => router.push('/profile/security'))}
          
          {renderMenuItem('globe-outline', 'Language', (
            <View style={styles.rightWithText}>
              <Text style={styles.rightText}>English (US)</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          ))}

          {renderMenuItem('eye-outline', 'Dark Mode', (
            <Switch
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E5E7EB"
              onValueChange={toggleSwitch}
              value={isDarkMode}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          ))}

          {renderMenuItem('lock-closed-outline', 'Privacy Policy', undefined, false, () => router.push('/profile/privacy'))}
          {renderMenuItem('information-circle-outline', 'Help Center', undefined, false, () => router.push('/profile/help-center'))}
          {renderMenuItem('people-outline', 'Invite Friends', undefined, false, () => router.push('/profile/invite'))}
          
          {renderMenuItem('log-out-outline', 'Logout', <View />, true, () => setShowLogoutModal(true))}
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowLogoutModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            {/* Drag Handle */}
            <View style={styles.dragHandle} />
            
            <Text style={styles.logoutTitle}>Logout</Text>
            
            <Text style={styles.logoutMessage}>Are you sure you want to log out?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 30,
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
    color: '#000000',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  menuContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 28,
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  destructiveText: {
    color: '#EF4444',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  dragHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  logoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 16,
  },
  logoutMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 40,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  confirmButton: {
    flex: 1,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
