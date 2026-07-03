

const Utils = {

  

  
  qs(selector, scope = document) {
    return scope.querySelector(selector);
  },

  
  qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  },

  
  el(tag, cls = '', html = '') {
    const element = document.createElement(tag);
    if (cls)  element.className = cls;
    if (html) element.innerHTML = html;
    return element;
  },

  
  show(el) {
    el?.classList.remove('hidden');
  },

  
  hide(el) {
    el?.classList.add('hidden');
  },

  
  toggle(el, cls) {
    el?.classList.toggle(cls);
  },


  

  
  formatDate(dateStr, style = 'short') {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);

    if (style === 'long') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    }

    if (style === 'relative') {
      const now = new Date();
      const diff = now - date;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours   = Math.floor(minutes / 60);
      const days    = Math.floor(hours / 24);
      const months  = Math.floor(days / 30);
      const years   = Math.floor(days / 365);

      if (years  > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
      if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
      if (days   > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours  > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      return 'Just now';
    }

    
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  },

  
  getMonthYear(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  },


  

  
  truncate(str, maxLen = 100) {
    if (!str || str.length <= maxLen) return str;
    return str.slice(0, maxLen).trimEnd() + '...';
  },

  
  highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
  },

  
  slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  },

  
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },


  

  
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  
  animateCounter(el, target, dur = 1200, suffix = '') {
    if (!el) return;
    const start = performance.now();
    const startVal = 0;

    function step(now) {
      const progress = Math.min((now - start) / dur, 1);
      
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  },


  

  
  getTagColor(name) {
    const colors = [
      { bg: 'rgba(99,102,241,0.12)',  text: '#818cf8' }, 
      { bg: 'rgba(6,182,212,0.12)',   text: '#22d3ee' }, 
      { bg: 'rgba(16,185,129,0.12)',  text: '#34d399' }, 
      { bg: 'rgba(245,158,11,0.12)',  text: '#fbbf24' }, 
      { bg: 'rgba(244,63,94,0.12)',   text: '#fb7185' }, 
      { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa' }, 
      { bg: 'rgba(236,72,153,0.12)', text: '#f472b6' }, 
      { bg: 'rgba(20,184,166,0.12)', text: '#2dd4bf' }, 
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  
  getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },


  

  
  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },


  

  
  onVisible(el, callback, threshold = 0.1) {
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry.target);
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
  },


  

  
  getCSSVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name).trim();
  },


  

  
  toast(message, type = 'success', duration = 3000) {
    const container = document.querySelector('#toast-container');
    if (!container) return;

    const icons = {
      success: 'fa-solid fa-circle-check',
      warning: 'fa-solid fa-triangle-exclamation',
      error:   'fa-solid fa-circle-xmark',
      info:    'fa-solid fa-circle-info',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="${icons[type] || icons.info}"></i>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  },

};

