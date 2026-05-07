import React from 'react';
import { Screen } from '../../primitives';
import { StudyHubHeader } from './StudyHubHeader';
import { StudyHero } from './StudyHero';
import { StudyModeGrid } from './StudyModeGrid';
import { StudyCourseSection } from './StudyCourseSection';
import { DueWordsSection } from './DueWordsSection';

export default function StudyHubScreen() {
  return (
    <Screen scroll scrollBottomInset={70}>
      <StudyHubHeader />
      <StudyHero />
      <StudyCourseSection />
      <StudyModeGrid />
      <DueWordsSection limit={5} />
    </Screen>
  );
}
