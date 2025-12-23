import { useState, useEffect } from 'react';
import { HomeDashboard } from './components/HomeDashboard';
import { AddFoodText } from './components/AddFoodText';
import { ScanFood } from './components/ScanFood';
import { ResultsScreen } from './components/ResultsScreen';
import { HealthCoach } from './components/HealthCoach';
import { WeeklyReport } from './components/WeeklyReport';
import { ProfileSetup } from './components/ProfileSetup';
import { BottomNav } from './components/BottomNav';
import { AppContainer } from './components/AppContainer';
import { Toaster } from './components/ui/sonner';
import { StorageService } from './services/storage';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('loading');
  const [resultsData, setResultsData] = useState<any>(null);

  useEffect(() => {
    async function checkProfile() {
      const profile = await StorageService.getProfile();
      if (!profile) {
        setActiveScreen('profile');
      } else {
        setActiveScreen('home');
      }
    }
    checkProfile();
  }, []);

  const handleNavigate = (screen: string, data?: any) => {
    if (data) {
      setResultsData(data);
    }
    setActiveScreen(screen);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'loading':
        return null; // Let AppContainer handle the splash
      case 'profile':
        return <ProfileSetup onComplete={() => handleNavigate('home')} />;
      case 'home':
        return <HomeDashboard onNavigate={handleNavigate} />;
      case 'add-text':
        return <AddFoodText onNavigate={handleNavigate} />;
      case 'scan':
        return <ScanFood onNavigate={handleNavigate} />;
      case 'results':
        return resultsData ? (
          <ResultsScreen data={resultsData} onNavigate={handleNavigate} />
        ) : (
          <HomeDashboard onNavigate={handleNavigate} />
        );
      case 'coach':
        return <HealthCoach onNavigate={handleNavigate} />;
      case 'report':
        return <WeeklyReport onNavigate={handleNavigate} />;
      default:
        return <HomeDashboard onNavigate={handleNavigate} />;
    }
  };

  const showNav = activeScreen !== 'loading' && activeScreen !== 'profile';

  return (
    <AppContainer>
      <div className="min-h-screen bg-background max-w-md mx-auto relative">
        {renderScreen()}
        {showNav && <BottomNav activeScreen={activeScreen} onNavigate={handleNavigate} />}
      </div>
      <Toaster />
    </AppContainer>
  );
}
