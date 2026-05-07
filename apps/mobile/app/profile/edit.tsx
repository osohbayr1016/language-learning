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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('Andrew Ainsley');
  const [nickname, setNickname] = useState('Andrew');
  const [dob, setDob] = useState('12/27/1995');
  const [email, setEmail] = useState('andrew_ainsley@yourdomain.com');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('+1 111 467 378 399');
  const [gender, setGender] = useState('Male');
  const [occupation, setOccupation] = useState('Student');

  const handleUpdate = () => {
    router.back();
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
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Nickname */}
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
            />

            {/* Date of Birth */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                value={dob}
                onChangeText={setDob}
              />
              <Ionicons name="calendar-outline" size={20} color="#000" />
            </View>

            {/* Email */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Ionicons name="mail-outline" size={20} color="#000" />
            </View>

            {/* Country */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                value={country}
                onChangeText={setCountry}
              />
              <Ionicons name="caret-down" size={16} color="#000" />
            </View>

            {/* Phone Number */}
            <View style={styles.inputWithIcon}>
              <View style={styles.countryPicker}>
                <Text style={{ fontSize: 18 }}>🇺🇸</Text>
                <Ionicons name="chevron-down" size={16} color="#000" style={{ marginLeft: 4 }} />
              </View>
              <TextInput
                style={[styles.inputFlex, { marginLeft: 12 }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Gender */}
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                value={gender}
                onChangeText={setGender}
              />
              <Ionicons name="caret-down" size={16} color="#000" />
            </View>

            {/* Occupation */}
            <TextInput
              style={styles.input}
              value={occupation}
              onChangeText={setOccupation}
            />
          </View>

        </ScrollView>
        
        {/* Footer Button (Fixed at bottom) */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
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
    flex: 1,
    marginLeft: 16,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    fontSize: 16,
    color: '#000',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
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
