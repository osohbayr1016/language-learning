import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { colors, spacing, typography } from '../../theme';

type Props = { uri: string };

export function MockExamAudioButton({ uri }: Props) {
  const ref = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      void (async () => {
        try {
          await ref.current?.unloadAsync();
        } catch {
          /* ignore */
        }
        ref.current = null;
      })();
    };
  }, []);

  const toggle = async () => {
    if (ref.current) {
      const st = await ref.current.getStatusAsync();
      if (st.isLoaded && st.isPlaying) {
        await ref.current.pauseAsync();
        setPlaying(false);
        return;
      }
      if (st.isLoaded && !st.isPlaying) {
        await ref.current.setPositionAsync(0);
        await ref.current.playAsync();
        setPlaying(true);
        return;
      }
    }
    try {
      await ref.current?.unloadAsync();
    } catch {
      /* ignore */
    }
    ref.current = null;
    const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
    ref.current = sound;
    setPlaying(true);
    sound.setOnPlaybackStatusUpdate((st2) => {
      if (st2.isLoaded && st2.didJustFinish) setPlaying(false);
    });
  };

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Pressable
        onPress={() => void toggle()}
        style={({ pressed }) => [
          {
            alignSelf: 'flex-start',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 10,
            backgroundColor: colors.brand.secondary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={{ ...typography.body.md, fontWeight: '600', color: '#fff' }}>{playing ? 'Зогсоох' : '▶ Сонсох'}</Text>
      </Pressable>
    </View>
  );
}
