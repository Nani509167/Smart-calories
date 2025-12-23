import React from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { FoodEntry } from '../App';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

interface ResultsScreenProps {
  entry: FoodEntry;
  onAnalyzeAnother: () => void;
  onViewHistory: () => void;
}

export function ResultsScreen({ entry, onAnalyzeAnother, onViewHistory }: ResultsScreenProps) {
  const confidenceColors = {
    Low: '#F59E0B',
    Medium: '#8BA888',
    High: '#10B981'
  };

  const confidenceColor = confidenceColors[entry.confidence];

  return (
    <div className="min-h-screen p-6 pb-safe">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto space-y-6"
      >
        {/* Success Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#8BA888] rounded-full mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-[#2C2C2C] mb-2">Analysis Complete</h1>
          <p className="text-[#7A7A7A]">
            {entry.foodName} • {entry.quantity}g • {entry.cookingMethod}
          </p>
        </div>

        {/* Calorie Count */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center">
            <p className="text-[#7A7A7A] mb-2">Total Calories</p>
            <p className="text-6xl text-[#2C2C2C] mb-1">
              {entry.calories}
            </p>
            <p className="text-[#9E9E9E]">kcal</p>
          </Card>
        </motion.div>

        {/* Macronutrients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h2 className="text-[#2C2C2C] mb-4">Macronutrients</h2>
            <div className="space-y-4">
              <MacroBar
                label="Protein"
                value={entry.protein}
                color="#89CFF0"
                unit="g"
              />
              <MacroBar
                label="Fat"
                value={entry.fat}
                color="#F59E0B"
                unit="g"
              />
              <MacroBar
                label="Carbohydrates"
                value={entry.carbs}
                color="#8BA888"
                unit="g"
              />
            </div>
          </Card>
        </motion.div>

        {/* AI Confidence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[#2C2C2C]">AI Confidence</h2>
              <div 
                className="px-4 py-2 rounded-full text-white text-sm"
                style={{ backgroundColor: confidenceColor }}
              >
                {entry.confidence}
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[#F5F5F3] rounded-2xl">
              <TrendingUp className="w-5 h-5 text-[#8BA888] flex-shrink-0 mt-0.5" />
              <p className="text-[#6B6B6B]">
                {entry.insight}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={onAnalyzeAnother} fullWidth>
            Analyze Another Food
          </Button>
          <Button onClick={onViewHistory} variant="secondary" fullWidth>
            <Clock className="w-5 h-5 mr-2 inline" />
            View History
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

interface MacroBarProps {
  label: string;
  value: number;
  color: string;
  unit: string;
}

function MacroBar({ label, value, color, unit }: MacroBarProps) {
  const maxValue = 100;
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-[#4A4A4A]">{label}</span>
        <span className="text-[#2C2C2C]">
          {value}{unit}
        </span>
      </div>
      <div className="w-full h-2 bg-[#E8E6E0] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
