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

export default function AddCardScreen() {
  const router = useRouter();

  const [cardName, setCardName] = useState('Andrew Ainsley');
  const [cardNumber, setCardNumber] = useState('2672 4738 7837 7285');
  const [expiryDate, setExpiryDate] = useState('09/07/26');
  const [cvv, setCvv] = useState('699');

  const handleAddNewCard = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Card</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          
          {/* Card Mockup */}
          <View style={styles.cardMockup}>
            {/* Abstract Background Elements */}
            <View style={styles.abstractShape1} />
            <View style={styles.abstractShape2} />
            
            <View style={styles.cardTopRow}>
              <Text style={styles.cardLogo}>Mocard</Text>
              <Text style={styles.amazonLogo}>amazon</Text>
            </View>

            <Text style={styles.cardNumberDisplay}>
              {cardNumber ? cardNumber : '.... .... .... ....'}
            </Text>

            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.cardLabel}>Card Holder name</Text>
                <Text style={styles.cardValue}>{cardName ? cardName : '.... ....'}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expiry date</Text>
                <Text style={styles.cardValue}>{expiryDate ? expiryDate : '..../....'}</Text>
              </View>
              <View style={styles.mastercardIcon}>
                <View style={[styles.circle, { backgroundColor: 'rgba(255,255,255,0.6)' }]} />
                <View style={[styles.circle, { backgroundColor: 'rgba(255,255,255,0.3)', marginLeft: -12 }]} />
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.inputLabel}>Card Name</Text>
            <TextInput
              style={styles.input}
              value={cardName}
              onChangeText={setCardName}
            />

            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
            />

            <View style={styles.rowInputs}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.inputFlex}
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                  />
                  <Ionicons name="calendar-outline" size={20} color="#000" />
                </View>
              </View>

              <View style={{ width: 16 }} />

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  secureTextEntry
                />
              </View>
            </View>
          </View>

        </ScrollView>
        
        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleAddNewCard}>
            <Text style={styles.buttonText}>Add New Card</Text>
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
  },
  cardMockup: {
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    padding: 24,
    height: 220,
    justifyContent: 'space-between',
    marginBottom: 30,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  abstractShape1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  abstractShape2: {
    position: 'absolute',
    bottom: -60,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  cardLogo: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  amazonLogo: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardNumberDisplay: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
    zIndex: 1,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 1,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginBottom: 4,
  },
  cardValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mastercardIcon: {
    flexDirection: 'row',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  form: {
    gap: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    fontSize: 16,
    color: '#000',
  },
  rowInputs: {
    flexDirection: 'row',
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
