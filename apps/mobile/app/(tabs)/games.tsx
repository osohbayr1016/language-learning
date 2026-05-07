import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TxnTab = 'All' | 'Top Up' | 'Transfer' | 'Payment';

const ALL_TRANSACTIONS = [
  {
    id: '1',
    type: 'Payment',
    name: 'UI/UX Design Fundamentals',
    date: 'Nov 10, 2024 • 10:40 AM',
    amount: -24.99,
    icon: 'card-outline' as const,
    color: '#3B82F6',
  },
  {
    id: '2',
    type: 'Top Up',
    name: 'Wallet Top Up',
    date: 'Nov 08, 2024 • 09:15 AM',
    amount: +100.00,
    icon: 'wallet-outline' as const,
    color: '#10B981',
  },
  {
    id: '3',
    type: 'Payment',
    name: 'Leadership & Management',
    date: 'Nov 06, 2024 • 02:30 PM',
    amount: -19.99,
    icon: 'card-outline' as const,
    color: '#3B82F6',
  },
  {
    id: '4',
    type: 'Transfer',
    name: 'Transfer to Robert Fox',
    date: 'Nov 04, 2024 • 11:00 AM',
    amount: -50.00,
    icon: 'arrow-redo-outline' as const,
    color: '#8B5CF6',
  },
  {
    id: '5',
    type: 'Payment',
    name: '3D Design Illustration',
    date: 'Oct 28, 2024 • 04:00 PM',
    amount: -34.99,
    icon: 'card-outline' as const,
    color: '#3B82F6',
  },
  {
    id: '6',
    type: 'Top Up',
    name: 'Wallet Top Up',
    date: 'Oct 25, 2024 • 08:20 AM',
    amount: +200.00,
    icon: 'wallet-outline' as const,
    color: '#10B981',
  },
  {
    id: '7',
    type: 'Payment',
    name: 'Web Development Bootcamp',
    date: 'Oct 20, 2024 • 01:00 PM',
    amount: -49.99,
    icon: 'card-outline' as const,
    color: '#3B82F6',
  },
];

const TABS: TxnTab[] = ['All', 'Top Up', 'Transfer', 'Payment'];

export default function TransactionsScreen() {
  const [activeTab, setActiveTab] = useState<TxnTab>('All');

  const filteredTxns = activeTab === 'All'
    ? ALL_TRANSACTIONS
    : ALL_TRANSACTIONS.filter(t => t.type === activeTab);

  const totalBalance = ALL_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>e</Text>
          </View>
          <Text style={styles.headerTitle}>Transactions</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceAbstractCircle1} />
        <View style={styles.balanceAbstractCircle2} />
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          ${Math.abs(totalBalance).toFixed(2)}
        </Text>
        <View style={styles.balanceStats}>
          <View style={styles.balanceStat}>
            <View style={styles.statIcon}>
              <Ionicons name="arrow-down" size={14} color="#10B981" />
            </View>
            <View>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>$300.00</Text>
            </View>
          </View>
          <View style={styles.balanceStatDivider} />
          <View style={styles.balanceStat}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <Ionicons name="arrow-up" size={14} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>$179.96</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterPill, activeTab === tab && styles.activeFilterPill]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.filterText, activeTab === tab && styles.activeFilterText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transaction List */}
      <ScrollView
        contentContainerStyle={styles.txnList}
        showsVerticalScrollIndicator={false}
      >
        {filteredTxns.map((txn) => (
          <View key={txn.id} style={styles.txnRow}>
            <View style={[styles.txnIcon, { backgroundColor: txn.color + '15' }]}>
              <Ionicons name={txn.icon} size={22} color={txn.color} />
            </View>
            <View style={styles.txnInfo}>
              <Text style={styles.txnName} numberOfLines={1}>{txn.name}</Text>
              <Text style={styles.txnDate}>{txn.date}</Text>
            </View>
            <Text style={[
              styles.txnAmount,
              txn.amount > 0 ? styles.amountPositive : styles.amountNegative,
            ]}>
              {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
            </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 20,
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
    color: '#000',
  },
  // Balance Card
  balanceCard: {
    marginHorizontal: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  balanceAbstractCircle1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  balanceAbstractCircle2: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    zIndex: 1,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    zIndex: 1,
  },
  balanceStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    zIndex: 1,
  },
  balanceStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  balanceStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  // Filter Tabs
  filterScroll: {
    marginBottom: 16,
  },
  filterContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterPill: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
  },
  activeFilterPill: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 15,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  // Transaction list
  txnList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    gap: 16,
  },
  txnIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txnInfo: {
    flex: 1,
  },
  txnName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  txnDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountPositive: {
    color: '#10B981',
  },
  amountNegative: {
    color: '#EF4444',
  },
});
