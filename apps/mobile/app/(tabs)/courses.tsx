import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CourseTab = 'Ongoing' | 'Completed';

const ONGOING_COURSES = [
  {
    id: '1',
    title: '3D Design Illustration',
    category: 'Design',
    instructor: 'Robert Fox',
    progress: 55,
    color: '#3B82F6',
    emoji: '🎨',
  },
  {
    id: '2',
    title: 'Leadership & Management',
    category: 'Business',
    instructor: 'Esther Howard',
    progress: 30,
    color: '#8B5CF6',
    emoji: '📊',
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    category: 'Design',
    instructor: 'Jenny Wilson',
    progress: 72,
    color: '#EC4899',
    emoji: '🖥️',
  },
  {
    id: '4',
    title: 'Web Development Bootcamp',
    category: 'Programming',
    instructor: 'Devon Lane',
    progress: 18,
    color: '#10B981',
    emoji: '💻',
  },
];

const COMPLETED_COURSES = [
  {
    id: '5',
    title: 'Digital Marketing Mastery',
    category: 'Marketing',
    instructor: 'Cameron Williamson',
    progress: 100,
    color: '#F59E0B',
    emoji: '📣',
  },
  {
    id: '6',
    title: 'Python for Beginners',
    category: 'Programming',
    instructor: 'Floyd Miles',
    progress: 100,
    color: '#3B82F6',
    emoji: '🐍',
  },
];

export default function CoursesScreen() {
  const [activeTab, setActiveTab] = useState<CourseTab>('Ongoing');

  const courses = activeTab === 'Ongoing' ? ONGOING_COURSES : COMPLETED_COURSES;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>e</Text>
          </View>
          <Text style={styles.headerTitle}>My Course</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['Ongoing', 'Completed'] as CourseTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.courseList}
        showsVerticalScrollIndicator={false}
      >
        {courses.map((course) => (
          <TouchableOpacity key={course.id} style={styles.courseCard}>
            {/* Icon Area */}
            <View style={[styles.courseIcon, { backgroundColor: course.color + '20' }]}>
              <Text style={styles.courseEmoji}>{course.emoji}</Text>
            </View>

            {/* Course Info */}
            <View style={styles.courseInfo}>
              <Text style={styles.courseCategory}>{course.category}</Text>
              <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>

              {/* Instructor */}
              <View style={styles.instructorRow}>
                <Image
                  source={{ uri: `https://i.pravatar.cc/40?u=${course.id}` }}
                  style={styles.instructorAvatar}
                />
                <Text style={styles.instructorName}>{course.instructor}</Text>
              </View>

              {/* Progress */}
              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${course.progress}%`, backgroundColor: course.color },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: course.color }]}>
                  {course.progress}%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
    marginBottom: 24,
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  courseList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    gap: 16,
  },
  courseIcon: {
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseEmoji: {
    fontSize: 32,
  },
  courseInfo: {
    flex: 1,
  },
  courseCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  instructorAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  instructorName: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressText: {
    fontSize: 13,
    fontWeight: 'bold',
    minWidth: 36,
    textAlign: 'right',
  },
});
