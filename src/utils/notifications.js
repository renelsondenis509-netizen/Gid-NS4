import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL_ID = "gidns4_default";

async function ensureChannel() {
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: "Gid NS4",
      description: "Notifikasyon Gid NS4",
      importance: 3,
      sound: null,
      vibration: true,
      visibility: 1,
    });
  } catch {}
}

export async function requestNotificationPermission() {
  try {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleDailyReminder(hour = 18) {
  try {
    await ensureChannel();
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
    await LocalNotifications.schedule({
      notifications: [{
        id: 1,
        title: "Gid NS4 — Prof Lakay",
        body: "Kontinye travay ! Ouvri app la epi poze yon kesyon.",
        schedule: { on: { hour, minute: 0 }, repeats: true, allowWhileIdle: true },
        sound: null,
        smallIcon: "ic_stat_notify",
        channelId: CHANNEL_ID,
      }]
    });
  } catch {}
}

export async function scheduleExpiryReminder(daysRemaining) {
  if (daysRemaining > 7) return;
  try {
    await ensureChannel();
    await LocalNotifications.cancel({ notifications: [{ id: 2 }] });
    await LocalNotifications.schedule({
      notifications: [{
        id: 2,
        title: "Abonman ou ap ekspire !",
        body: `Kòd lekòl ou a ekspire nan ${daysRemaining} jou. Kontakte direksyon lekòl ou.`,
        schedule: { at: new Date(Date.now() + 1000) },
        sound: null,
        smallIcon: "ic_stat_notify",
        channelId: CHANNEL_ID,
      }]
    });
  } catch {}
}

export async function cancelAllNotifications() {
  try {
    await LocalNotifications.cancelAll();
  } catch {}
}
