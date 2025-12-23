import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { StorageService, UserProfile, MealLog } from '../services/storage';

interface HomeDashboardProps {
  onNavigate: (screen: string) => void;
}

export function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const today = new Date().toISOString().split('T')[0];
      const [userProfile, todayLogs] = await Promise.all([
        StorageService.getProfile(),
        StorageService.getLogs(today)
      ]);
      setProfile(userProfile);
      setLogs(todayLogs);
      setLoading(false);
    }
    loadData();
  }, []);


  const handleDelete = async (id: number) => {
    try {
      await StorageService.deleteLog(id);
      setLogs(currentLogs => currentLogs.filter(log => log.id !== id));
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };

  const caloriesConsumed = logs.reduce((sum, log) => sum + log.calories, 0);
  const caloriesGoal = profile?.caloric_goal || 2000;
  const remaining = Math.max(0, caloriesGoal - caloriesConsumed);

  // Calculate real macros from logs
  const totalMacros = logs.reduce(
    (acc, log) => {
      if (log.macros) {
        acc.protein += parseInt(log.macros.protein) || 0;
        acc.fat += parseInt(log.macros.fat) || 0;
        acc.carbs += parseInt(log.macros.carbs) || 0;
      }
      return acc;
    },
    { protein: 0, fat: 0, carbs: 0 }
  );

  const macros = [
    { name: 'Protein', value: totalMacros.protein, color: '#4CAF93', grams: totalMacros.protein },
    { name: 'Carbs', value: totalMacros.carbs, color: '#5DA9E9', grams: totalMacros.carbs },
    { name: 'Fat', value: totalMacros.fat, color: '#FFB74D', grams: totalMacros.fat },
  ];

  // Handle empty state to avoid ugly chart
  if (macros.every(m => m.value === 0)) {
    macros.forEach(m => m.value = 1); // Mock equal distribution for empty chart
  }

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-[32px] font-semibold text-foreground tracking-tight">
          Hello, {profile?.name || 'User'}
        </h1>
        <p className="text-muted-foreground mt-1">Track smarter, live healthier</p>
      </div>

      {/* Calorie Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 mb-6"
      >
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Today's Progress</span>
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{caloriesConsumed > caloriesGoal ? 'Over goal' : 'On track'}</span>
            </div>
          </div>

          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-semibold text-foreground">{caloriesConsumed}</span>
            <span className="text-muted-foreground mb-2">/ {caloriesGoal} kcal</span>
          </div>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (caloriesConsumed / caloriesGoal) * 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-muted-foreground">Remaining</span>
            <span className="text-2xl font-semibold text-primary">{remaining} kcal</span>
          </div>
        </div>
      </motion.div>

      {/* Macros Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-6 mb-6"
      >
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Macronutrients</h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macros}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {macros.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-3">
              {macros.map((macro) => (
                <div key={macro.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: macro.color }}
                    />
                    <span className="text-foreground">{macro.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{macro.grams}g</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Meals */}
      <div className="mx-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">Recent Meals</h3>
        </div>

        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No meals logged yet today.</p>
          ) : (
            logs.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-card rounded-2xl p-4 shadow-sm border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{meal.food_name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-semibold text-primary">{meal.calories}</div>
                      <div className="text-xs text-muted-foreground">kcal</div>
                    </div>
                    <button
                      onClick={() => handleDelete(meal.id)}
                      className="p-2 -mr-2 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
