import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

export default function FillProfileScreen() {
  const router = useRouter();
  const { token } = useAuth(); // Assume we get user data or email from here eventually

  const [fullName, setFullName] = useState('Andrew Ainsley');
  const [nickname, setNickname] = useState('Andrew');
  const [dob, setDob] = useState('12/27/1995');
  const [email, setEmail] = useState('andrew_ainsley@yourdomain.com');
  const [phone, setPhone] = useState('+1 111 467 378 399');
  const [gender, setGender] = useState('Male');

  const handleContinue = () => {
    router.push('/(setup)/pin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Fill Your Profile</Text>
            <View style={{ width: 28 }} /> {/* Spacer */}
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={60} color="#E5E7EB" />
            </View>
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="pencil" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Nickname */}
            <TextInput
              style={styles.input}
              placeholder="Nickname"
              placeholderTextColor="#9CA3AF"
              value={nickname}
              onChangeText={setNickname}
            />

            {/* Date of Birth */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Date of Birth"
                placeholderTextColor="#9CA3AF"
                value={dob}
                onChangeText={setDob}
              />
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            </View>

            {/* Email */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
            </View>

            {/* Phone Number */}
            <View style={styles.inputWithIcon}>
              <View style={styles.countryPicker}>
                <Text style={{ fontSize: 18 }}>🇺🇸</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" style={{ marginLeft: 4 }} />
              </View>
              <TextInput
                style={[styles.inputFlex, { marginLeft: 12 }]}
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Gender */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Gender"
                placeholderTextColor="#9CA3AF"
                value={gender}
                onChangeText={setGender}
              />
              <Ionicons name="caret-down" size={16} color="#6B7280" />
            </View>
          </View>

        </ScrollView>
        
        {/* Footer Button (Fixed at bottom) */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
    alignSelf: 'center',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  form: {
    gap: 20,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 16,
    height: 60,
    fontSize: 16,
    color: '#000',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 16,
    height: 60,
  },
  inputFlex: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#3B82F6',
    height: 58,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
