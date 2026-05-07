import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationSettingsScreen() {
  const router = useRouter();

  // Mock State for toggles
  const [settings, setSettings] = useState({
    general: true,
    sound: true,
    vibrate: false,
    specialOffers: true,
    promo: false,
    payments: true,
    cashback: false,
    updates: true,
    newService: false,
    newTips: false,
  });

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToggle = (label: string, key: keyof typeof settings) => {
    return (
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Switch
          trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#E5E7EB"
          onValueChange={() => toggleSwitch(key)}
          value={settings[key]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderToggle('General Notification', 'general')}
        {renderToggle('Sound', 'sound')}
        {renderToggle('Vibrate', 'vibrate')}
        {renderToggle('Special Offers', 'specialOffers')}
        {renderToggle('Promo & Discount', 'promo')}
        {renderToggle('Payments', 'payments')}
        {renderToggle('Cashback', 'cashback')}
        {renderToggle('App Updates', 'updates')}
        {renderToggle('New Service Available', 'newService')}
        {renderToggle('New Tips Available', 'newTips')}
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
    gap: 32, // Controls vertical spacing between rows
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '500',
  },
});
