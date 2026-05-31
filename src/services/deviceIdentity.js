import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const DEVICE_ID_KEY = 'synox_device_id';

async function getPlatformStableId() {
  try {
    const Application = await import('expo-application');

    if (Platform.OS === 'android') {
      if (typeof Application.getAndroidId === 'function') {
        return Application.getAndroidId();
      }
      return Application.androidId ?? null;
    }

    if (Platform.OS === 'ios') {
      if (typeof Application.getIosIdForVendorAsync === 'function') {
        return await Application.getIosIdForVendorAsync();
      }
      return null;
    }
  } catch (error) {
    console.warn('expo-application not available, falling back to generated device id');
  }

  return null;
}

function buildFallbackDeviceId() {
  return `device_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 11)}`;
}

export async function getOrCreateDeviceId() {
  const existingDeviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (existingDeviceId) return existingDeviceId;

  const platformStableId = await getPlatformStableId();
  const nextDeviceId = platformStableId ? `stable_${platformStableId}` : buildFallbackDeviceId();

  await SecureStore.setItemAsync(DEVICE_ID_KEY, nextDeviceId);
  return nextDeviceId;
}
