import React, { createContext, useContext, useState, useEffect } from 'react';
import { configService, PlatformSettings } from '@/services/configService';

interface ConfigContextType {
  settings: PlatformSettings;
  loading: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  currencySymbol: '$',
  currencyCode: 'USD',
  taxRate: 0,
  platformName: 'Vesta'
};

const ConfigContext = createContext<ConfigContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true
});

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = configService.subscribeToSettings((data) => {
      setSettings(data);
      setLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <ConfigContext.Provider value={{ settings, loading }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
