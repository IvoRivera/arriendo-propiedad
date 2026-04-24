"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ensureConfigLoaded, getAllConfig, getConfig } from "@/lib/systemConfig";

interface ConfigContextType {
  config: Record<string, string>;
  isLoading: boolean;
  getValue: (key: string) => string | null;
  refresh: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadConfig = async (force = false) => {
    setIsLoading(true);
    try {
      await ensureConfigLoaded(force);
      setConfig(getAllConfig());
    } catch (error) {
      console.error("[ConfigProvider] Failed to load configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const getValue = (key: string) => {
    return config[key] || getConfig(key);
  };

  const refresh = async () => {
    await loadConfig(true);
  };

  return (
    <ConfigContext.Provider value={{ config, isLoading, getValue, refresh }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
