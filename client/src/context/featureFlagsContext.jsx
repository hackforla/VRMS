import { createContext, useContext, useState, useEffect } from 'react';
import {fetchFeatureFlags} from '../api/featureFlagApiService';

const FeatureFlagContext = createContext();

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
  }

  return context;
};

export const FeatureFlagProvider = ({ children }) => {
  const [flags, setFlags] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFlags = async () => {
      try {
        const flags = await fetchFeatureFlags();
        setFlags(flags);
      } catch (err) {
        console.error('Failed to load feature flags', err);
      } finally {
        setLoading(false);
      }
    };

    getFlags();
  }, []);

  return (
    <FeatureFlagContext.Provider value={{flags, loading}}>
      {children}
    </FeatureFlagContext.Provider>
  );
};