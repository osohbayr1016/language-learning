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

export default function SecurityScreen() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    rememberMe: true,
    faceId: false,
    biometricId: true,
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
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderToggle('Remember me', 'rememberMe')}
        {renderToggle('Face ID', 'faceId')}
        {renderToggle('Biometric ID', 'biometricId')}

        <TouchableOpacity style={styles.linkRow}>
          <Text style={styles.toggleLabel}>Google Authenticator</Text>
          <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.lightButton}>
            <Text style={styles.lightButtonText}>Change PIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lightButton}>
            <Text style={styles.lightButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 30,
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
    gap: 32,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '500',
  },
  lightButton: {
    backgroundColor: '#EEF2FF',
    height: 58,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lightButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
});
