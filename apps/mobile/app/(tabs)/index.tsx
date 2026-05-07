import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

// MOCK DATA
const MENTORS = [
  { id: '1', name: 'Jacob', avatar: 'https://i.pravatar.cc/150?u=jacob' },
  { id: '2', name: 'Claire', avatar: 'https://i.pravatar.cc/150?u=claire' },
  { id: '3', name: 'Priscilla', avatar: 'https://i.pravatar.cc/150?u=priscilla' },
  { id: '4', name: 'Wade', avatar: 'https://i.pravatar.cc/150?u=wade' },
  { id: '5', name: 'Kathryn', avatar: 'https://i.pravatar.cc/150?u=kathryn' },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🔥', active: true },
  { id: '3d', label: '3D Design', icon: '💡', active: false },
  { id: 'business', label: 'Business', icon: '💰', active: false },
  { id: 'seo', label: 'SEO', icon: '🎯', active: false },
];

const COURSES = [
  {
    id: '1',
    title: '3D Design Illustration',
    category: '3D Design',
    price: '$48',
    originalPrice: '$80',
    rating: '4.8',
    students: '8,289',
    image: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: '2',
    title: 'Digital Entrepreneur...',
    category: 'Entrepreneurship',
    price: '$39',
    originalPrice: null,
    rating: '4.9',
    students: '6,182',
    image: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: '3',
    title: 'Learn UX User Persona',
    category: 'UI/UX Design',
    price: '$42',
    originalPrice: '$75',
    rating: '4.7',
    students: '7,938',
    image: 'https://picsum.photos/400/300?random=3',
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { signOut } = useAuth(); // Keeping signOut here for testing purposes

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* You can wrap this Avatar in a TouchableOpacity to trigger signOut for testing */}
            <TouchableOpacity onPress={signOut}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?u=andrew' }} 
                style={styles.userAvatar} 
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Good Morning 👋</Text>
              <Text style={styles.userName}>Andrew Ainsley</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="bookmark-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoDiscount}>40% OFF</Text>
          <Text style={styles.promoTitle}>Today's Special</Text>
          <Text style={styles.promoDesc}>
            Get a discount for every course order!{'\n'}Only valid for today!
          </Text>
          
          <View style={styles.promoDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          
          {/* Abstract background shapes could go here as absolute positioned views */}
          <View style={styles.promoShape1} />
          <View style={styles.promoShape2} />
        </View>

        {/* Top Mentors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Mentors</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.mentorsScroll}
          contentContainerStyle={{ gap: 20 }}
        >
          {MENTORS.map((mentor) => (
            <View key={mentor.id} style={styles.mentorItem}>
              <Image source={{ uri: mentor.avatar }} style={styles.mentorAvatar} />
              <Text style={styles.mentorName}>{mentor.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Most Popular Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Most Popular Courses</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.chipsScroll}
          contentContainerStyle={{ gap: 12 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.chip, cat.active && styles.chipActive]}
            >
              <Text style={styles.chipIcon}>{cat.icon}</Text>
              <Text style={[styles.chipText, cat.active && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Course List */}
        <View style={styles.courseList}>
          {COURSES.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseCard}>
              <Image source={{ uri: course.image }} style={styles.courseImage} />
              
              <View style={styles.courseInfo}>
                <View style={styles.courseCategoryRow}>
                  <Text style={styles.courseCategory}>{course.category}</Text>
                  <Ionicons name="bookmark" size={20} color="#3B82F6" />
                </View>
                
                <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
                
                <View style={styles.coursePriceRow}>
                  <Text style={styles.coursePrice}>{course.price}</Text>
                  {course.originalPrice && (
                    <Text style={styles.originalPrice}>{course.originalPrice}</Text>
                  )}
                </View>

                <View style={styles.courseStatsRow}>
                  <Ionicons name="star" size={14} color="#FBBF24" />
                  <Text style={styles.courseRating}>{course.rating}</Text>
                  <Text style={styles.courseStudents}>  |  {course.students} students</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  promoBanner: {
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  promoDiscount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 8,
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  promoDesc: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.9,
    marginBottom: 20,
  },
  promoDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 16,
    backgroundColor: '#FFFFFF',
  },
  // Abstract background shapes for the promo banner
  promoShape1: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  promoShape2: {
    position: 'absolute',
    bottom: -50,
    right: 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  mentorsScroll: {
    marginBottom: 30,
    marginHorizontal: -24, // Break out of container padding
    paddingHorizontal: 24, // Add padding inside scroll
  },
  mentorItem: {
    alignItems: 'center',
    gap: 8,
  },
  mentorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  mentorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  chipsScroll: {
    marginBottom: 24,
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  chipActive: {
    backgroundColor: '#3B82F6',
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  courseList: {
    gap: 20,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    gap: 16,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  courseImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  courseCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseCategory: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B82F6',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  coursePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  courseStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseRating: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4B5563',
    marginLeft: 4,
  },
  courseStudents: {
    fontSize: 13,
    color: '#6B7280',
  },
});
