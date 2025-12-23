import { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { analyzeImage } from '../services/api';

interface ScanFoodProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function ScanFood({ onNavigate }: ScanFoodProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  // ...

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        performAnalysis(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const data = await analyzeImage(file);
      setResult(data);
    } catch (error: any) {
      console.error("Analysis failed", error);
      toast.error('Scan Failed', {
        description: error?.message || 'Check your internet and API key.'
      });
      setImagePreview(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    if (!result) return;
    onNavigate('results', result);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-[32px] font-semibold text-foreground tracking-tight">Scan Food</h1>
        <p className="text-muted-foreground mt-1">Take a photo or upload image</p>
      </div>

      <div className="px-6 space-y-6">
        {/* Camera Interface */}
        {!imagePreview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <label
              htmlFor="image-upload"
              className="block relative aspect-square rounded-3xl bg-card border-2 border-dashed border-border cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Take a Photo</h3>
                <p className="text-muted-foreground text-center px-8">
                  Tap to capture or upload an image of your meal
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Image Preview */}
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg">
              <img
                src={imagePreview}
                alt="Food preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setImagePreview(null);
                  setResult(null);
                }}
                className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full text-foreground shadow-md"
              >
                Retake
              </button>
            </div>

            {/* Analyzing State */}
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl p-6 shadow-sm border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <ImageIcon className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Analyzing Image...</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI is detecting food items
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Analysis Results</h3>

                  {/* Insight Alert */}
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
                    <p className="text-sm text-foreground font-medium flex gap-2">
                      ✨ {result.ai_insight}
                    </p>
                  </div>

                  {/* Macros Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-background rounded-xl">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Carbs</div>
                      <div className="font-bold text-foreground">{result.macros.carbs}</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded-xl">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Protein</div>
                      <div className="font-bold text-foreground">{result.macros.protein}</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded-xl">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fat</div>
                      <div className="font-bold text-foreground">{result.macros.fat}</div>
                    </div>
                  </div>

                  {/* Calories & Confidence */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <div className="text-2xl font-bold text-primary">{result.calories}</div>
                      <div className="text-xs text-muted-foreground">Total Calories</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold capitalize ${result.confidence === 'high' ? 'text-green-500' :
                        result.confidence === 'medium' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                        {result.confidence} Confidence
                      </div>
                    </div>
                  </div>

                </div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Log This Meal
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        <div className="text-center text-sm text-muted-foreground px-8">
          Our AI will identify foods and estimate portions automatically
        </div>
      </div>
    </div>
  );
}
