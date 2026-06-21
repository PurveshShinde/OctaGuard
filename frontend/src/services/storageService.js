const SCANS_KEY = 'octaguard_scans';
const SETTINGS_KEY = 'octaguard_settings';

export const storageService = {
  getScans: () => {
    try {
      const data = localStorage.getItem(SCANS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  
  saveScan: (scan) => {
    const scans = storageService.getScans();
    const updatedScans = [scan, ...scans];
    localStorage.setItem(SCANS_KEY, JSON.stringify(updatedScans));
    return updatedScans;
  },

  getSettings: () => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : { monitoringEnabled: false, lastScanDate: null, nextScanDate: null };
    } catch (e) {
      return { monitoringEnabled: false, lastScanDate: null, nextScanDate: null };
    }
  },

  saveSettings: (settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  },
  
  clearAll: () => {
    localStorage.removeItem(SCANS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  }
};
