import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PIN_LENGTH = 4;

export default function CreatePinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < PIN_LENGTH) {
      setPin((prev) => prev + key);
    }
  };

  const handleContinue = () => {
    router.push('/(setup)/fingerprint');
  };

  // Render the 4 PIN dots/boxes
  const renderPinIndicator = () => {
    const indicators = [];
    for (let i = 0; i < PIN_LENGTH; i++) {
      const isFilled = i < pin.length;
      const isCurrent = i === pin.length;
      
      indicators.push(
        <View
          key={i}
          style={[
            styles.pinBox,
            isCurrent && styles.pinBoxCurrent,
            isFilled && styles.pinBoxFilled,
          ]}
        >
          {isFilled ? (
            <View style={styles.pinDot} />
          ) : isCurrent ? (
            <Text style={styles.pinCurrentText}>{pin[i] || ''}</Text>
          ) : null}
        </View>
      );
    }
    return <View style={styles.pinContainer}>{indicators}</View>;
  };

  // Numpad data
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', 'backspace'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New PIN</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          Add a PIN number to make your account{'\n'}more secure.
        </Text>

        {/* PIN Indicators */}
        <View style={styles.pinWrapper}>
          {renderPinIndicator()}
        </View>

        <View style={{ flex: 1 }} />

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.button, pin.length < PIN_LENGTH && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={pin.length < PIN_LENGTH}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* Numpad */}
        <View style={styles.numpad}>
          {keys.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.keypadButton}
              onPress={() => handleKeyPress(key)}
              disabled={key === '*'} // * is usually disabled in this context
            >
              {key === 'backspace' ? (
                <Ionicons name="backspace-outline" size={32} color="#000" />
              ) : key === '*' ? (
                <Text style={styles.keypadText}>*</Text>
              ) : (
                <Text style={styles.keypadText}>{key}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

      </View>
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
    marginBottom: 50,
  },
  pinWrapper: {
    alignItems: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  pinBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinBoxCurrent: {
    borderColor: '#3B82F6',
    backgroundColor: '#EEF2FF',
  },
  pinBoxFilled: {
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#000000',
  },
  pinCurrentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  keypadButton: {
    width: (width - 48 - 40) / 3, // 3 columns
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 28,
    color: '#000000',
    fontWeight: '500',
  },
});
