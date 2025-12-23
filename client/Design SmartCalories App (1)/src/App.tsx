import React, { useState } from 'react';
import { ProfileSetup } from './components/ProfileSetup';
import { HomeScreen } from './components/HomeScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { HistoryScreen } from './components/HistoryScreen';

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
}

export interface FoodEntry {
  id: string;
  foodName: string;
  quantity: string;
  cookingMethod: string;
  oilType?: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  confidence: 'Low' | 'Medium' | 'High';
  insight: string;
  timestamp: Date;
}

type Screen = 'profile' | 'home' | 'results' | 'history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentFoodEntry, setCurrentFoodEntry] = useState<FoodEntry | null>(null);
  const [foodHistory, setFoodHistory] = useState<FoodEntry[]>([]);
  const [dailyCalories, setDailyCalories] = useState(0);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentScreen('home');
  };

  const handleFoodAnalyzed = (entry: FoodEntry) => {
    setCurrentFoodEntry(entry);
    setFoodHistory(prev => [entry, ...prev]);
    setDailyCalories(prev => prev + entry.calories);
    setCurrentScreen('results');
  };

  const handleAnalyzeAnother = () => {
    setCurrentScreen('home');
  };

  const handleViewHistory = () => {
    setCurrentScreen('history');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleDeleteEntry = (entryId: string) => {
    const entryToDelete = foodHistory.find(entry => entry.id === entryId);
    if (entryToDelete) {
      setDailyCalories(prev => prev - entryToDelete.calories);
    }
    setFoodHistory(prev => prev.filter(entry => entry.id !== entryId));
  };

  // Calculate daily calorie target based on profile
  const calculateDailyTarget = () => {
    if (!userProfile) return 2000;
    
    // Basic BMR calculation (Mifflin-St Jeor)
    const bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    
    const activityMultipliers: { [key: string]: number } = {
      'Sedentary': 1.2,
      'Lightly active': 1.375,
      'Moderately active': 1.55,
      'Very active': 1.725
    };
    
    const goalAdjustments: { [key: string]: number } = {
      'Weight loss': -500,
      'Maintain weight': 0,
      'Weight gain': 500
    };
    
    const tdee = bmr * (activityMultipliers[userProfile.activityLevel] || 1.2);
    const adjustment = goalAdjustments[userProfile.goal] || 0;
    
    return Math.round(tdee + adjustment);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {currentScreen === 'profile' && (
        <ProfileSetup onComplete={handleProfileComplete} />
      )}
      
      {currentScreen === 'home' && (
        <HomeScreen
          userProfile={userProfile}
          dailyCalories={dailyCalories}
          dailyTarget={calculateDailyTarget()}
          onFoodAnalyzed={handleFoodAnalyzed}
          onViewHistory={handleViewHistory}
        />
      )}
      
      {currentScreen === 'results' && currentFoodEntry && (
        <ResultsScreen
          entry={currentFoodEntry}
          onAnalyzeAnother={handleAnalyzeAnother}
          onViewHistory={handleViewHistory}
        />
      )}
      
      {currentScreen === 'history' && (
        <HistoryScreen
          history={foodHistory}
          onBack={handleBackToHome}
          onDeleteEntry={handleDeleteEntry}
        />
      )}
    </div>
  );
}