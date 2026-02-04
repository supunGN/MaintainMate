import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

/**
 * Registers for push notifications gracefully.
 * Checks for existing permissions, asks if not granted.
 * Returns true if granted, false otherwise.
 */
export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return false;
    }
    return true;
}

/**
 * Schedules a local notification for a specific date at 9:00 AM.
 * @param dateStr Date string in "MM - DD - YYYY" format
 * @param title Notification title
 * @param body Notification body
 * @returns The notification identifier string, or null if scheduling failed/was in past.
 */
export async function scheduleServiceReminder(
    dateStr: string,
    title: string,
    body: string
): Promise<string | null> {
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) return null;

    try {
        const [month, day, year] = dateStr.split(' - ').map(Number);
        // Create date object for 9:00 AM on that day
        const triggerDate = new Date(year, month - 1, day, 9, 0, 0);

        // If date is in the past, don't schedule
        if (triggerDate < new Date()) {
            return null;
        }

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
            },
        });

        return id;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return null;
    }
}

/**
 * Cancels a scheduled notification by ID.
 */
export async function cancelServiceReminder(identifier: string) {
    try {
        await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
        console.error('Error cancelling notification:', error);
    }
}
