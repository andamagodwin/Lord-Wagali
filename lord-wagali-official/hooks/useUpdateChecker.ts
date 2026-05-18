import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { apiRequest } from '@/lib/api';
import Constants from 'expo-constants';

interface AppConfig {
  downloadUrl: string;
  latestVersion: string;
}

function isNewerVersion(latest: string, current: string): boolean {
  const latestParts = latest.split('.').map(Number);
  const currentParts = current.split('.').map(Number);

  for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
    const l = latestParts[i] || 0;
    const c = currentParts[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
}

export function useUpdateChecker() {
  useEffect(() => {
    async function check() {
      try {
        const config = await apiRequest<AppConfig>('/api/v1/config');
        const currentVersion = Constants.expoConfig?.version || '1.0.0';

        if (config.latestVersion && isNewerVersion(config.latestVersion, currentVersion)) {
          Alert.alert(
            'Update Available',
            `A new version (v${config.latestVersion}) is available. Update now for the best experience.`,
            [
              { text: 'Later', style: 'cancel' },
              {
                text: 'Update',
                onPress: () => {
                  if (config.downloadUrl) {
                    Linking.openURL(config.downloadUrl);
                  }
                },
              },
            ]
          );
        }
      } catch {
        // silently ignore — don't block the app if config fetch fails
      }
    }

    check();
  }, []);
}
