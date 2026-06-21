import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AppContext = createContext();

const initialState = {
  scans: [],
  settings: { monitoringEnabled: false, lastScanDate: null, nextScanDate: null },
  loading: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, scans: action.payload.scans, settings: action.payload.settings, loading: false };
    case 'ADD_SCAN':
      return { ...state, scans: [action.payload, ...state.scans] };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'CLEAR_DATA':
      return { ...state, scans: [], settings: { monitoringEnabled: false, lastScanDate: null, nextScanDate: null } };
    default:
      return state;
  }
}

export function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const scans = storageService.getScans();
    const settings = storageService.getSettings();
    dispatch({ type: 'INIT', payload: { scans, settings } });
  }, []);

  const addScan = (scan) => {
    storageService.saveScan(scan);
    dispatch({ type: 'ADD_SCAN', payload: scan });
  };

  const updateSettings = (updates) => {
    const newSettings = { ...state.settings, ...updates };
    storageService.saveSettings(newSettings);
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
  };

  const clearData = () => {
    storageService.clearAll();
    dispatch({ type: 'CLEAR_DATA' });
  }

  return (
    <AppContext.Provider value={{ state, dispatch, addScan, updateSettings, clearData }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
