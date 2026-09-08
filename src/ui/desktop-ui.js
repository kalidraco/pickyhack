/**
 * PickyHack — Windows 98 Desktop Environment
 * Handles retro desktop icons, Start Menu, taskbar clock, and status indicators.
 */
(function(root) {
  'use strict';

  const DesktopUI = {
    init() {
      this.initIcons();
      this.initStartMenu();
      this.initClock();
    },

    initIcons() {
      const icons = document.querySelectorAll('.desktop-icon');
      icons.forEach(icon => {
        let clicks = 0;
        let timer = null;

        icon.addEventListener('click', (e) => {
          e.stopPropagation();
          icons.forEach(i => i.classList.remove('selected'));
          icon.classList.add('selected');

          clicks++;
          if (clicks === 1) {
            timer = setTimeout(() => { clicks = 0; }, 300);
          } else if (clicks === 2) {
            clearTimeout(timer);
            clicks = 0;
            const targetWin = icon.dataset.window;
            if (targetWin && root.WindowManager) {
              root.WindowManager.open(targetWin);
            }
          }
        });
      });

      document.getElementById('desktop')?.addEventListener('click', () => {
        icons.forEach(i => i.classList.remove('selected'));
      });
    },

    initStartMenu() {
      const startBtn = document.getElementById('start-button');
      const startMenu = document.getElementById('start-menu');

      if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          startBtn.classList.toggle('active');
          startMenu.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
          if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
            startBtn.classList.remove('active');
            startMenu.classList.remove('open');
          }
        });

        const items = startMenu.querySelectorAll('.start-menu-item');
        items.forEach(item => {
          item.addEventListener('click', () => {
            const winId = item.dataset.window;
            if (winId && root.WindowManager) {
              root.WindowManager.open(winId);
            }
            startBtn.classList.remove('active');
            startMenu.classList.remove('open');
          });
        });
      }
    },

    initClock() {
      const clockEl = document.getElementById('taskbar-clock');
      const update = () => {
        if (!clockEl) return;
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}`;
      };
      update();
      setInterval(update, 10000);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DesktopUI;
  } else {
    root.DesktopUI = DesktopUI;
  }
})(typeof window !== 'undefined' ? window : global);
