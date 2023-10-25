// This is a named export

export function register(): void {

    if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch((registrationError: any) => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }

}


