import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Chip } from './ui/Chip';
import { Button } from './ui/Button';
import { UserProfile, FoodEntry } from '../App';
import { Camera, Image as ImageIcon, Clock, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  userProfile: UserProfile | null;
  dailyCalories: number;
  dailyTarget: number;
  onFoodAnalyzed: (entry: FoodEntry) => void;
  onViewHistory: () => void;
}

export function HomeScreen({ 
  userProfile, 
  dailyCalories, 
  dailyTarget, 
  onFoodAnalyzed,
  onViewHistory 
}: HomeScreenProps) {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cookingMethod, setCookingMethod] = useState('Boiled');
  const [oilType, setOilType] = useState('Sunflower oil');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const cookingMethods = ['Boiled', 'Steamed', 'Fried', 'Grilled', 'Air-fried'];
  const oilTypes = ['Sunflower oil', 'Olive oil', 'Butter', 'Ghee'];

  const showOilSelector = cookingMethod === 'Fried';
  const progress = Math.min((dailyCalories / dailyTarget) * 100, 100);

  const handleAnalyze = () => {
    if (!foodName || !quantity) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      // Mock calorie calculation based on food type
      const baseCalories = Math.floor(Math.random() * 300) + 150;
      const quantityMultiplier = parseFloat(quantity) || 1;
      const cookingMultiplier = cookingMethod === 'Fried' ? 1.5 : 1;
      
      const totalCalories = Math.round(baseCalories * quantityMultiplier * cookingMultiplier);
      const protein = Math.round(totalCalories * 0.25 / 4);
      const fat = Math.round(totalCalories * 0.3 / 9);
      const carbs = Math.round(totalCalories * 0.45 / 4);

      const confidenceLevels: ('Low' | 'Medium' | 'High')[] = ['Medium', 'High', 'High'];
      const confidence = confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];

      const insights = [
        'Great choice! This meal provides balanced macronutrients.',
        'Consider pairing this with vegetables for added fiber.',
        'This is a protein-rich option that supports muscle recovery.',
        'A wholesome meal with good nutritional value.',
        'This meal fits well within a balanced diet.'
      ];

      const entry: FoodEntry = {
        id: Date.now().toString(),
        foodName,
        quantity,
        cookingMethod,
        oilType: showOilSelector ? oilType : undefined,
        calories: totalCalories,
        protein,
        fat,
        carbs,
        confidence,
        insight: insights[Math.floor(Math.random() * insights.length)],
        timestamp: new Date()
      };

      setIsAnalyzing(false);
      onFoodAnalyzed(entry);
      
      // Reset form
      setFoodName('');
      setQuantity('');
    }, 1500);
  };

  const isFormValid = foodName && quantity;

  return (
    <div className="min-h-screen p-6 pb-safe">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#2C2C2C]">SmartCalories</h1>
            <p className="text-[#7A7A7A]">
              Hello, {userProfile?.name || 'there'}!
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onViewHistory}
            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow transition-shadow"
          >
            <Clock className="w-6 h-6 text-[#8BA888]" />
          </motion.button>
        </div>

        {/* Daily Progress Ring */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[#7A7A7A]">Today's Calories</p>
              <p className="text-[#2C2C2C]">
                <span className="text-3xl">{dailyCalories}</span>
                <span className="text-[#9E9E9E]"> / {dailyTarget} kcal</span>
              </p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#E8E6E0"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#8BA888"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progress / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#2C2C2C]">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Food Input Form */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#8BA888]" />
              <h2 className="text-[#2C2C2C]">Add Food</h2>
            </div>

            <Input
              label="Food Name"
              value={foodName}
              onChange={setFoodName}
              placeholder="e.g., Chicken breast"
            />

            <Input
              label="Quantity"
              value={quantity}
              onChange={setQuantity}
              placeholder="e.g., 150"
              unit="g"
            />

            <div className="space-y-3">
              <label className="text-[#4A4A4A] text-sm ml-1">
                Cooking Method
              </label>
              <div className="flex flex-wrap gap-2">
                {cookingMethods.map((method) => (
                  <Chip
                    key={method}
                    label={method}
                    selected={cookingMethod === method}
                    onClick={() => setCookingMethod(method)}
                  />
                ))}
              </div>
            </div>

            {showOilSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <label className="text-[#4A4A4A] text-sm ml-1">
                  Oil Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {oilTypes.map((oil) => (
                    <Chip
                      key={oil}
                      label={oil}
                      selected={oilType === oil}
                      onClick={() => setOilType(oil)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div className="pt-2">
              <label className="text-[#4A4A4A] text-sm ml-1 block mb-3">
                Food Image (Optional)
              </label>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 p-4 bg-[#F5F5F3] rounded-2xl border-2 border-dashed border-[#D0CEC8] hover:border-[#8BA888] transition-colors"
                >
                  <Camera className="w-5 h-5 text-[#8BA888]" />
                  <span className="text-[#6B6B6B]">Camera</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 p-4 bg-[#F5F5F3] rounded-2xl border-2 border-dashed border-[#D0CEC8] hover:border-[#8BA888] transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-[#8BA888]" />
                  <span className="text-[#6B6B6B]">Gallery</span>
                </motion.button>
              </div>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleAnalyze}
          disabled={!isFormValid || isAnalyzing}
          fullWidth
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Analyzing...
            </span>
          ) : (
            'Analyze Calories'
          )}
        </Button>
      </motion.div>
    </div>
  );
}
