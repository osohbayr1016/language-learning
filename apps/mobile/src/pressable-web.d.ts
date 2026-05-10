import 'react-native';

declare module 'react-native' {
  interface PressableStateCallbackType {
    /** Set on react-native-web when the control has keyboard focus */
    readonly focused?: boolean;
  }
}
