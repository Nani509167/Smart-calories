import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { analyzeText } from '../services/api';
import { Input } from './figma/Input';
import { Chip } from './figma/Chip';
import { Button } from './figma/Button';

interface AddFoodTextProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function AddFoodText({ onNavigate }: AddFoodTextProps) {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('100'); // Default to 100g
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const cookingMethods = [
    'Grilled',
    'Fried',
    'Boiled',
    'Baked',
    'Steamed',
    'Raw',
    'Roasted',
    'Sautéed',
  ];

  const handleAnalyze = async () => {
    if (foodName && quantity && selectedMethod) {
      setIsAnalyzing(true);
      try {
        const result = await analyzeText({
          food_name: foodName,
          quantity: `${quantity} grams`,
          cooking_method: selectedMethod
        });

        // Add metadata for results screen
        const finalResult = {
          ...result,
          foodName,
          quantity: `${quantity} grams`,
          cookingMethod: selectedMethod,
        };

        onNavigate('results', finalResult);
      } catch (error: any) {
        console.error("Analysis failed", error);
        toast.error('AI Analysis failed.', {
          description: error?.message || 'Check connection'
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <h1 className="text-[32px] font-semibold text-foreground tracking-tight">Add Food</h1>
        <p className="text-muted-foreground mt-1 text-base">Tell us what you ate</p>
      </div>

      <div className="px-6 space-y-8">
        {/* Food Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Input
            label="Food Name"
            value={foodName}
            onChange={setFoodName}
            placeholder="e.g., Chicken Biryani"
          />
        </motion.div>

        {/* Quantity (Grams) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Input
            label="Quantity (Grams)"
            value={quantity}
            onChange={setQuantity}
            type="number"
            placeholder="100"
            unit="g"
          />
        </motion.div>

        {/* Cooking Method */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-foreground mb-3 font-medium ml-1">Cooking Method</label>
          <div className="flex flex-wrap gap-3">
            {cookingMethods.map((method) => (
              <Chip
                key={method}
                label={method}
                selected={selectedMethod === method}
                onClick={() => setSelectedMethod(method)}
              />
            ))}
          </div>
        </motion.div>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <Button
            onClick={handleAnalyze}
            fullWidth
            disabled={!foodName || !quantity || !selectedMethod || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Calories'}
          </Button>
        </motion.div>

        <div className="text-center text-sm text-muted-foreground pt-2">
          AI will estimate calories based on grams & cooking method
        </div>
      </div>
    </div>
  );
}