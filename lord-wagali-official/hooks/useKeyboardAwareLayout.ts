import { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useKeyboardAwareLayout(extraBottomPadding = 32, extraTopOffset = 0) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const contentBottomPadding = useMemo(
    () => Math.max(24, keyboardHeight + insets.bottom + extraBottomPadding),
    [extraBottomPadding, insets.bottom, keyboardHeight]
  );

  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.top + extraTopOffset : 0;

  return {
    contentBottomPadding,
    keyboardVerticalOffset,
    dismissKeyboard: Keyboard.dismiss,
  };
}
