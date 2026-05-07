import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen() {
  const router = useRouter();

  const handleAddNewCard = () => {
    router.push('/profile/add-card');
  };

  const renderPaymentMethod = (iconName: keyof typeof Ionicons.glyphMap, title: string, color: string) => {
    return (
      <View style={styles.paymentCard}>
        <View style={styles.paymentLeft}>
          <Ionicons name={iconName} size={28} color={color} style={styles.paymentIcon} />
          <Text style={styles.paymentTitle}>{title}</Text>
        </View>
        <Text style={styles.connectedText}>Connected</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderPaymentMethod('logo-paypal', 'PayPal', '#00457C')}
        {renderPaymentMethod('logo-google', 'Google Pay', '#EA4335')}
        {renderPaymentMethod('logo-apple', 'Apple Pay', '#000000')}
        
        {/* Custom Mastercard row */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentLeft}>
            <View style={styles.mastercardIcon}>
              <View style={[styles.circle, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.circle, { backgroundColor: '#F79E1B', marginLeft: -10 }]} />
            </View>
            <Text style={styles.paymentTitle}>.... .... .... 4679</Text>
          </View>
          <Text style={styles.connectedText}>Connected</Text>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleAddNewCard}>
          <Text style={styles.buttonText}>Add New Card</Text>
        </TouchableOpacity>
      </View>
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
    gap: 16,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    height: 80,
    borderRadius: 20,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  connectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  mastercardIcon: {
    flexDirection: 'row',
    marginRight: 16,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
