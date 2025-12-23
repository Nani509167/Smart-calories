import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Chip } from './ui/Chip';
import { Button } from './ui/Button';
import { UserProfile } from '../App';
import { Sparkles } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('Lightly active');
  const [goal, setGoal] = useState('Maintain weight');

  const activityLevels = ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'];
  const goals = ['Weight loss', 'Maintain weight', 'Weight gain'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age || !height || !weight) return;
    
    onComplete({
      name,
      age: parseInt(age),
      height: parseInt(height),
      weight: parseInt(weight),
      activityLevel,
      goal
    });
  };

  const isFormValid = name && age && height && weight;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BA888] rounded-3xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[#2C2C2C] mb-2">Tell us about you</h1>
          <p className="text-[#7A7A7A]">
            Help us personalize your calorie tracking experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <div className="space-y-4">
              <Input
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Enter your name"
              />
              
              <Input
                label="Age"
                value={age}
                onChange={setAge}
                type="number"
                placeholder="25"
                unit="years"
              />
              
              <Input
                label="Height"
                value={height}
                onChange={setHeight}
                type="number"
                placeholder="170"
                unit="cm"
              />
              
              <Input
                label="Weight"
                value={weight}
                onChange={setWeight}
                type="number"
                placeholder="70"
                unit="kg"
              />
            </div>
          </Card>

          <Card>
            <div className="space-y-3">
              <label className="text-[#4A4A4A] text-sm ml-1">
                Activity Level
              </label>
              <div className="flex flex-wrap gap-2">
                {activityLevels.map((level) => (
                  <Chip
                    key={level}
                    label={level}
                    selected={activityLevel === level}
                    onClick={() => setActivityLevel(level)}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-3">
              <label className="text-[#4A4A4A] text-sm ml-1">
                Your Goal
              </label>
              <div className="flex flex-wrap gap-2">
                {goals.map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    selected={goal === g}
                    onClick={() => setGoal(g)}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            disabled={!isFormValid}
            fullWidth
          >
            Continue
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
