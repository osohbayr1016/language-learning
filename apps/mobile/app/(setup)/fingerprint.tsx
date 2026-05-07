import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

export default function SetFingerprintScreen() {
  const router = useRouter();
  const { completeSetup } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleContinue = () => {
    setShowModal(true);
  };

  const handleSkip = () => {
    // If they skip, they still completed the setup flow
    completeSetup();
    router.replace('/(tabs)');
  };

  // Effect to handle auto-redirect when modal is shown
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        completeSetup();
        router.replace('/(tabs)');
      }, 2000); // Wait 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Set Your Fingerprint</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          Add a fingerprint to make your account{'\n'}more secure.
        </Text>

        <View style={styles.iconContainer}>
          <Ionicons name="finger-print" size={160} color="#3B82F6" />
        </View>

        <Text style={styles.bottomInfoText}>
          Please put your finger on the fingerprint{'\n'}scanner to get started.
        </Text>

        <View style={{ flex: 1 }} />

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* Success Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="person" size={50} color="#FFF" />
              {/* Confetti dots simulation */}
              <View style={[styles.dot, { top: -10, left: 10 }]} />
              <View style={[styles.dot, { top: 10, right: -20, backgroundColor: '#9CA3AF' }]} />
              <View style={[styles.dot, { bottom: 20, left: -15, width: 6, height: 6 }]} />
              <View style={[styles.dot, { bottom: -10, right: 20, width: 4, height: 4 }]} />
            </View>

            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalDesc}>
              Your account is ready to use. You will{'\n'}be redirected to the Home page in a{'\n'}few seconds..
            </Text>

            <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  infoText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 60,
  },
  bottomInfoText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    height: 58,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  continueButton: {
    flex: 1,
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    width: '100%',
  },
  modalIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    opacity: 0.7,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 16,
  },
  modalDesc: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 10,
  },
});
