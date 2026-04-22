import { LocalNotifications } from '@capacitor/local-notifications';

export async function requestNotificationPermission() {
  const { display } = await LocalNotifications.requestPermissions();
  return display === 'granted';
}

export async function scheduleDailyReminder() {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: "📚 Gid NS4 — Prof Lakay",
        body: "Ou pa etidye jodi a ankò ! Ouvri app la epi poze yon kesyon.",
        schedule: {
          on: { hour: 18, minute: 0 },
          repeats: true,
          allowWhileIdle: true,
        },
        sound: null,
        smallIcon: "ic_launcher",
      }
    ]
  });
}

export async function scheduleExpiryReminder(daysRemaining) {
  if (daysRemaining > 7) return;
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 2,
        title: "⚠️ Abònman ou ap ekspire !",
        body: `Kòd lekòl ou a ekspire nan ${daysRemaining} jou. Kontakte direksyon lekòl ou.`,
        schedule: { at: new Date(Date.now() + 1000) },
        sound: null,
        smallIcon: "ic_launcher",
      }
    ]
  });
}

export async function cancelAllNotifications() {
  await LocalNotifications.cancelAll();
}
