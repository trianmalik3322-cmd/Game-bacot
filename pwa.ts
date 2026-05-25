// PWA Registration & Install Prompt Handler

let deferredPrompt: any = null;
let isInstalled = false;

// Check apakah udah diinstall
export function checkInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;
}

// Register Service Worker
export async function registerSW(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker tidak didukung browser ini');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('✅ Service Worker registered:', registration.scope);

    // Update SW kalau ada versi baru
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 Update tersedia! Refresh untuk update.');
            // Trigger update notification
            window.dispatchEvent(new CustomEvent('sw-update-available'));
          }
        });
      }
    });

  } catch (error) {
    console.error('❌ Service Worker registration gagal:', error);
  }
}

// Capture install prompt
export function setupInstallPrompt(callback: (canInstall: boolean) => void): void {
  isInstalled = checkInstalled();

  if (isInstalled) {
    callback(false);
    return;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    callback(true);
  });

  window.addEventListener('appinstalled', () => {
    isInstalled = true;
    deferredPrompt = null;
    callback(false);
    console.log('✅ App berhasil diinstall!');
  });
}

// Trigger install prompt
export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('Install prompt error:', error);
    return false;
  }
}

// Get install status
export function getInstallStatus(): { isInstalled: boolean; canInstall: boolean } {
  return {
    isInstalled: checkInstalled(),
    canInstall: !!deferredPrompt
  };
}
