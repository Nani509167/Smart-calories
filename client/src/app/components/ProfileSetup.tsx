import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './figma/Card';
import { Input } from './figma/Input';
import { Chip } from './figma/Chip';
import { Button } from './figma/Button';
import { Sparkles } from 'lucide-react';
import { StorageService, UserProfile } from '../services/storage';
import { calculateBMR, calculateTDEE, calculateCaloricGoal } from '../utils/calculations';

interface ProfileSetupProps {
    onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [goalType, setGoalType] = useState<'loss' | 'maintain' | 'gain'>('maintain');

    const activityLevels = [
        { id: 'sedentary', label: 'Sedentary' },
        { id: 'light', label: 'Light' },
        { id: 'moderate', label: 'Moderate' },
        { id: 'active', label: 'Active' },
        { id: 'very_active', label: 'Very Active' }
    ];

    const goals = [
        { id: 'loss', label: 'Weight Loss' },
        { id: 'maintain', label: 'Maintain' },
        { id: 'gain', label: 'Weight Gain' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !age || !height || !weight) return;

        const w = parseInt(weight);
        const h = parseInt(height);
        const a = parseInt(age);

        const bmr = calculateBMR(w, h, a, gender);
        const tdee = calculateTDEE(bmr, activityLevel);
        const caloric_goal = calculateCaloricGoal(tdee, goalType);

        const profile: UserProfile = {
            name,
            age: a,
            gender,
            height: h,
            weight: w,
            activity_level: activityLevel,
            goal_type: goalType,
            caloric_goal
        };

        await StorageService.saveProfile(profile);
        onComplete();
    };

    const isFormValid = name && age && height && weight;

    return (
        <div className="min-h-screen bg-background flex flex-col p-6 pb-24 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-auto"
            >
                <div className="text-center mb-8 pt-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-6">
                        <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-3">Welcome to SmartCalories</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Let's personalize your experience to get accurate results
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Basic Info</h3>
                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                value={name}
                                onChange={setName}
                                placeholder="John Doe"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Age"
                                    value={age}
                                    onChange={setAge}
                                    type="number"
                                    placeholder="25"
                                    unit="years"
                                />
                                <div className="space-y-2">
                                    <label className="text-muted-foreground text-sm ml-1 font-medium">Gender</label>
                                    <div className="flex bg-muted rounded-2xl p-1 border border-border">
                                        <button
                                            type="button"
                                            onClick={() => setGender('male')}
                                            className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${gender === 'male' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
                                        >
                                            Male
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGender('female')}
                                            className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${gender === 'female' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
                                        >
                                            Female
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                        </div>
                    </Card>

                    <Card>
                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-foreground">
                                Activity Level
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {activityLevels.map((level) => (
                                    <Chip
                                        key={level.id}
                                        label={level.label}
                                        selected={activityLevel === level.id}
                                        onClick={() => setActivityLevel(level.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-foreground">
                                Your Health Goal
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {goals.map((g) => (
                                    <Chip
                                        key={g.id}
                                        label={g.label}
                                        selected={goalType === g.id}
                                        onClick={() => setGoalType(g.id as any)}
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
                        Create Profile
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
