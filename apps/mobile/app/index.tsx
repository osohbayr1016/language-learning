import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { colors } from '../src/theme';

export default function Index() {
  const { isAuthenticated, hasSeenOnboarding, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg.primary }}>
        <ActivityIndicator color={colors.accent.purple} />
      </View>
    );
  }

  if (isAuthenticated) return <Redirect href="/(tabs)/home" />;
  if (hasSeenOnboarding) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(onboarding)" />;
}
