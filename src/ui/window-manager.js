/**
 * PickyHack — Windows 98 Window Manager
 * Provides draggable titlebars, 8-direction resizing, boundary clamping,
 * pre-maximize restore memory, and localStorage geometry persistence.
 */
(function(root) {
  'use strict';

  const STORAGE_KEY = 'pickyhack_win_states';

  const WindowManager = {
    windows: {},
    activeWindow: null,
    highestZ: 100,

    init() {
      const windowEls = document.querySelectorAll('.win-window');
      windowEls.forEach(win => {
        const id = win.dataset.windowId || win.id;
        this.windows[id] = {
          el: win,
          state: 'normal',
          isMinimized: false,
          isMaximized: false,
          prevRect: null
        };

        this.initDragging(win);
        this.attachResizers(win);
        this.initControls(win);

        win.addEventListener('mousedown', () => this.bringToFront(id));
      });

      this.loadWinStates();
    },

    attachResizers(winEl) {
      if (winEl.querySelector('.win-resizer')) return;
      const dirs = ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'];
      dirs.forEach(dir => {
        const resizer = document.createElement('div');
        resizer.className = `win-resizer resizer-${dir}`;
        resizer.dataset.dir = dir;
        winEl.appendChild(resizer);
        this.initResize(winEl, resizer, dir);
      });
    },

    initResize(winEl, resizerEl, dir) {
      let isResizing = false;
      let startX = 0, startY = 0;
      let startW = 0, startH = 0;
      let startTop = 0, startLeft = 0;

      const onMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = winEl.getBoundingClientRect();
        startW = rect.width;
        startH = rect.height;
        startTop = rect.top;
        startLeft = rect.left;

        this.bringToFront(winEl.dataset.windowId || winEl.id);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      const onMouseMove = (e) => {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newW = startW;
        let newH = startH;
        let newTop = startTop;
        let newLeft = startLeft;

        // Min dimensions
        const minW = 340;
        const minH = 220;

        if (dir.includes('e')) newW = Math.max(minW, startW + dx);
        if (dir.includes('s')) newH = Math.max(minH, startH + dy);

        if (dir.includes('w')) {
          const possibleW = startW - dx;
          if (possibleW >= minW) {
            newW = possibleW;
            newLeft = startLeft + dx;
          }
        }

        if (dir.includes('n')) {
          const possibleH = startH - dy;
          if (possibleH >= minH) {
            newH = possibleH;
            newTop = startTop + dy;
          }
        }

        winEl.style.width = `${newW}px`;
        winEl.style.height = `${newH}px`;
        winEl.style.top = `${newTop}px`;
        winEl.style.left = `${newLeft}px`;
      };

      const onMouseUp = () => {
        if (isResizing) {
          isResizing = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          this.saveWinState(winEl.dataset.windowId || winEl.id);
        }
      };

      resizerEl.addEventListener('mousedown', onMouseDown);
    },

    initDragging(winEl) {
      const handle = winEl.querySelector('.win-titlebar') || winEl;
      let isDragging = false;
      let offsetX = 0, offsetY = 0;

      handle.addEventListener('mousedown', (e) => {
        if (e.target.closest('.win-title-btn')) return;
        isDragging = true;
        const rect = winEl.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        this.bringToFront(winEl.dataset.windowId || winEl.id);

        const onMouseMove = (moveEvent) => {
          if (!isDragging) return;
          let newLeft = moveEvent.clientX - offsetX;
          let newTop = moveEvent.clientY - offsetY;

          // Boundary clamping
          newTop = Math.max(0, Math.min(window.innerHeight - 80, newTop));
          newLeft = Math.max(-100, Math.min(window.innerWidth - 100, newLeft));

          winEl.style.left = `${newLeft}px`;
          winEl.style.top = `${newTop}px`;
        };

        const onMouseUp = () => {
          if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            this.saveWinState(winEl.dataset.windowId || winEl.id);
          }
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    },

    initControls(winEl) {
      const id = winEl.dataset.windowId || winEl.id;
      const minBtn = winEl.querySelector('.btn-win-min');
      const maxBtn = winEl.querySelector('.btn-win-max');
      const closeBtn = winEl.querySelector('.btn-win-close');

      if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); this.minimize(id); });
      if (maxBtn) maxBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMaximize(id); });
      if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.close(id); });
    },

    bringToFront(id) {
      const win = this.windows[id];
      if (!win) return;
      this.highestZ += 2;
      win.el.style.zIndex = this.highestZ;
      this.activeWindow = id;

      document.querySelectorAll('.win-window').forEach(w => w.classList.remove('win-active'));
      win.el.classList.add('win-active');

      this.updateTaskbar();
    },

    open(id) {
      const win = this.windows[id];
      if (!win) return;
      win.el.style.display = 'flex';
      win.isMinimized = false;
      this.bringToFront(id);
      this.updateTaskbar();
    },

    close(id) {
      const win = this.windows[id];
      if (!win) return;
      win.el.style.display = 'none';
      this.updateTaskbar();
    },

    minimize(id) {
      const win = this.windows[id];
      if (!win) return;
      win.el.style.display = 'none';
      win.isMinimized = true;
      this.updateTaskbar();
    },

    toggleMaximize(id) {
      const win = this.windows[id];
      if (!win) return;

      if (!win.isMaximized) {
        // Save pre-maximize bounds
        const rect = win.el.getBoundingClientRect();
        win._preMaxRect = {
          top: win.el.style.top || `${rect.top}px`,
          left: win.el.style.left || `${rect.left}px`,
          width: win.el.style.width || `${rect.width}px`,
          height: win.el.style.height || `${rect.height}px`
        };

        win.el.style.top = '0px';
        win.el.style.left = '0px';
        win.el.style.width = '100vw';
        win.el.style.height = 'calc(100vh - 30px)';
        win.isMaximized = true;
      } else {
        // Restore pre-maximize bounds
        if (win._preMaxRect) {
          win.el.style.top = win._preMaxRect.top;
          win.el.style.left = win._preMaxRect.left;
          win.el.style.width = win._preMaxRect.width;
          win.el.style.height = win._preMaxRect.height;
        }
        win.isMaximized = false;
      }
      this.saveWinState(id);
    },

    saveWinState(id) {
      const win = this.windows[id];
      if (!win || win.isMaximized) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const states = raw ? JSON.parse(raw) : {};
        states[id] = {
          top: win.el.style.top,
          left: win.el.style.left,
          width: win.el.style.width,
          height: win.el.style.height
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
      } catch (e) {}
    },

    loadWinStates() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const states = JSON.parse(raw);
        Object.keys(states).forEach(id => {
          const win = this.windows[id];
          const st = states[id];
          if (win && st) {
            if (st.width) win.el.style.width = st.width;
            if (st.height) win.el.style.height = st.height;
            if (st.top) win.el.style.top = st.top;
            if (st.left) win.el.style.left = st.left;
          }
        });
      } catch (e) {}
    },

    updateTaskbar() {
      const taskbarTasks = document.getElementById('taskbar-tasks');
      if (!taskbarTasks) return;
      taskbarTasks.innerHTML = '';

      Object.keys(this.windows).forEach(id => {
        const win = this.windows[id];
        if (win.el.style.display !== 'none' || win.isMinimized) {
          const titleText = win.el.querySelector('.win-title-text')?.textContent || id;
          const iconText = win.el.querySelector('.win-title-left span:first-child')?.textContent || '🪟';
          const btn = document.createElement('button');
          const isActive = this.activeWindow === id && !win.isMinimized;
          btn.className = `taskbar-task-btn ${isActive ? 'active' : ''}`;
          btn.innerHTML = `<span>${iconText}</span> <span class="task-title">${titleText.substring(0, 18)}</span>`;

          btn.addEventListener('click', () => {
            if (win.isMinimized) {
              this.open(id);
            } else if (this.activeWindow === id) {
              this.minimize(id);
            } else {
              this.bringToFront(id);
            }
          });

          taskbarTasks.appendChild(btn);
        }
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WindowManager;
  } else {
    root.WindowManager = WindowManager;
  }
})(typeof window !== 'undefined' ? window : global);
