

const Store = (() => {

  
  
  const DEFAULTS = {
    theme:      'dark',         
    accent:     'indigo',       
    fontSize:   'md',           
    sidebar:    'expanded',     
    animations: 'on',           
    lastPage:   'dashboard',    
  };

  
  const STORAGE_KEY = 'ppd_prefs';

  
  function loadAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch (e) {
      
      return { ...DEFAULTS };
    }
  }

  
  function saveAll(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Store: Could not save to localStorage.', e);
    }
  }

  
  function get(key) {
    return loadAll()[key] ?? DEFAULTS[key];
  }

  
  function set(key, value) {
    const prefs = loadAll();
    prefs[key] = value;
    saveAll(prefs);
  }

  
  function reset() {
    saveAll({ ...DEFAULTS });
  }

  
  function getAll() {
    return loadAll();
  }

  
  return { get, set, reset, getAll, DEFAULTS };

})(); 
