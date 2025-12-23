import { CheckCircle2, Flame, Activity, Droplets, Pizza } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { saveMealLog } from '../services/api';

interface ResultsScreenProps {
  data: {
    foodName: string;
    quantity: string;
    cookingMethod: string;
    calories: number;
    macros: {
      protein: string;
      fat: string;
      carbs: string;
    };
    confidence: 'low' | 'medium' | 'high';
    ai_insight: string;
  };
  onNavigate: (screen: string) => void;
}

export function ResultsScreen({ data, onNavigate }: ResultsScreenProps) {
  const macroItems = [
    { label: 'Protein', value: data.macros.protein, icon: Activity, color: '#4CAF93' },
    { label: 'Carbs', value: data.macros.carbs, icon: Pizza, color: '#5DA9E9' },
    { label: 'Fat', value: data.macros.fat, icon: Droplets, color: '#FFB74D' },
  ];

  const handleSave = async () => {
    try {
      await saveMealLog({
        food_name: data.foodName,
        calories: data.calories,
        quantity: data.quantity,
        cooking_method: data.cookingMethod,
        meal_type: 'Other',
        macros: data.macros, // Save the AI-calculated macros
      });

      toast.success('Food saved to diary!', {
        description: `${data.calories} calories added to today's total`,
        duration: 3000,
      });

      setTimeout(() => {
        onNavigate('home');
      }, 500);
    } catch (error) {
      toast.error('Failed to save meal');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-[32px] font-semibold text-foreground tracking-tight text-center">
          Analysis Complete
        </h1>
        <p className={`mt-1 text-center font-medium capitalize ${data.confidence === 'high' ? 'text-green-500' :
          data.confidence === 'medium' ? 'text-yellow-500' : 'text-red-500'
          }`}>
          {data.confidence} confidence
        </p>
      </div>

      <div className="px-6 space-y-6">
        {/* Food Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 shadow-sm border border-border"
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-foreground">{data.foodName || 'Estimated Meal'}</h3>
            <p className="text-muted-foreground mt-1">
              {data.quantity} • {data.cookingMethod || 'Analyzed by AI'}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Calories</div>
              <div className="text-3xl font-semibold text-foreground">{data.calories}</div>
            </div>
            <div className="text-muted-foreground ml-auto">kcal</div>
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/5 rounded-2xl p-5 border border-primary/10"
        >
          <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            SmartCalories Insight
          </h4>
          <p className="text-sm text-foreground leading-relaxed">
            {data.ai_insight}
          </p>
        </motion.div>

        {/* Macronutrients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">Macronutrients</h3>
          <div className="space-y-3">
            {macroItems.map((macro, index) => {
              const Icon = macro.icon;
              return (
                <motion.div
                  key={macro.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card rounded-2xl p-5 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${macro.color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: macro.color }} />
                      </div>
                      <div>
                        <div className="text-muted-foreground">{macro.label}</div>
                        <div className="text-2xl font-semibold text-foreground mt-1">
                          {macro.value}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 pt-4"
        >
          <button
            onClick={handleSave}
            className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Save to Diary
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-5 rounded-2xl bg-card text-foreground font-semibold border border-border shadow-sm"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    </div>
  );
}