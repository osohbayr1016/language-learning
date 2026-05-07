import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HelpCenterScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'FAQ' | 'Contact us'>('FAQ');
  const [activeFilter, setActiveFilter] = useState('General');

  const renderFAQ = () => (
    <View style={styles.tabContent}>
      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
        {['General', 'Account', 'Course', 'Payment'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterPill, activeFilter === filter && styles.activeFilterPill]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#3B82F6" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Why I"
          value="Why I"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* FAQ List Mockup */}
      <View style={styles.faqList}>
        {[
          "Why did my payment didn't working?",
          "Why are the course prices different?",
          "Why can't I play the course video?",
          "Why didn't I get the course certificate?",
        ].map((question, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{question}</Text>
            {index < 3 && <View style={styles.divider} />}
          </View>
        ))}
        
        {/* Expanded Mockup */}
        <View style={styles.faqItemExpanded}>
          <Text style={styles.faqQuestionExpanded}>How to use Elera?</Text>
          <Ionicons name="caret-down" size={16} color="#3B82F6" />
        </View>
      </View>
    </View>
  );

  const renderContact = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity style={styles.contactItem} onPress={() => router.push('/profile/customer-service')}>
        <Ionicons name="headset" size={24} color="#3B82F6" style={styles.contactIcon} />
        <Text style={styles.contactText}>Customer Service</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.contactItem}>
        <Ionicons name="logo-whatsapp" size={24} color="#3B82F6" style={styles.contactIcon} />
        <Text style={styles.contactText}>WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactItem}>
        <Ionicons name="globe-outline" size={24} color="#3B82F6" style={styles.contactIcon} />
        <Text style={styles.contactText}>Website</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactItem}>
        <Ionicons name="logo-facebook" size={24} color="#3B82F6" style={styles.contactIcon} />
        <Text style={styles.contactText}>Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactItem}>
        <Ionicons name="logo-twitter" size={24} color="#3B82F6" style={styles.contactIcon} />
        <Text style={styles.contactText}>Twitter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactItem}>
        <Ionicons name="logo-instagram" size={24} color="#3B82F6" style={styles.contactIcon} />
        <Text style={styles.contactText}>Instagram</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'FAQ' && styles.activeTab]}
          onPress={() => setActiveTab('FAQ')}
        >
          <Text style={[styles.tabText, activeTab === 'FAQ' && styles.activeTabText]}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Contact us' && styles.activeTab]}
          onPress={() => setActiveTab('Contact us')}
        >
          <Text style={[styles.tabText, activeTab === 'Contact us' && styles.activeTabText]}>Contact us</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabBorder} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'FAQ' ? renderFAQ() : renderContact()}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  tabBorder: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: -1,
    marginHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  tabContent: {
    paddingHorizontal: 24,
  },
  filterScroll: {
    marginBottom: 20,
  },
  filterContainer: {
    gap: 12,
  },
  filterPill: {
    paddingHorizontal: 20,
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
    fontSize: 16,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF', // Very light blue
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  faqList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  faqItem: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  faqQuestion: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  faqItemExpanded: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  faqQuestionExpanded: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  contactIcon: {
    marginRight: 16,
  },
  contactText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
});
