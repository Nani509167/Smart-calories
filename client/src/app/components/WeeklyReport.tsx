import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';
import { BarChart2, TrendingUp, Activity } from 'lucide-react';
import { StorageService, MealLog, UserProfile } from '../services/storage';

interface WeeklyReportProps {
    onNavigate: (screen: string) => void;
}

export function WeeklyReport({ onNavigate }: WeeklyReportProps) {
    const [reportData, setReportData] = useState<any[]>([]);
    const [weeklyAvg, setWeeklyAvg] = useState(0);
    const [totalMacros, setTotalMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadWeeklyData() {
            const [allLogs, userProfile] = await Promise.all([
                StorageService.getAllLogs(),
                StorageService.getProfile()
            ]);
            setProfile(userProfile);

            // Get last 7 days
            const days = [];
            const now = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                days.push(d.toISOString().split('T')[0]);
            }

            // Aggregate data
            let grandTotalCalories = 0;
            let grandMacros = { protein: 0, carbs: 0, fat: 0 };

            const chartData = days.map(date => {
                const dayLogs = allLogs.filter(log => log.timestamp.startsWith(date));
                const dailyCals = dayLogs.reduce((sum, log) => sum + log.calories, 0);

                dayLogs.forEach(log => {
                    if (log.macros) {
                        grandMacros.protein += parseInt(log.macros.protein) || 0;
                        grandMacros.carbs += parseInt(log.macros.carbs) || 0;
                        grandMacros.fat += parseInt(log.macros.fat) || 0;
                    }
                });

                grandTotalCalories += dailyCals;

                return {
                    date: new Date(date).toLocaleDateString([], { weekday: 'short' }),
                    fullDate: date,
                    calories: dailyCals,
                };
            });

            setReportData(chartData);
            setWeeklyAvg(Math.round(grandTotalCalories / 7));
            setTotalMacros(grandMacros);
            setLoading(false);
        }
        loadWeeklyData();
    }, []);

    if (loading) return <div className="p-6">Loading report...</div>;

    const caloricGoal = profile?.caloric_goal || 2000;

    return (
        <div className="min-h-screen bg-background pb-24 overflow-y-auto">
            {/* Header */}
            <div className="px-6 pt-12 pb-6">
                <h1 className="text-[32px] font-semibold text-foreground tracking-tight">
                    Weekly Overview
                </h1>
                <p className="text-muted-foreground mt-1">Your progress over the last 7 days</p>
            </div>

            {/* Main Chart Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mb-6"
            >
                <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-foreground">Calorie Intake</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Goal: {caloricGoal} kcal</div>
                    </div>

                    <div className="h-48 w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
                                    {reportData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.calories > caloricGoal ? '#FFB74D' : '#4CAF93'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                        <div>
                            <p className="text-sm text-muted-foreground">Weekly Average</p>
                            <p className="text-2xl font-bold text-foreground">{weeklyAvg} <span className="text-sm font-normal text-muted-foreground">kcal/day</span></p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${weeklyAvg <= caloricGoal ? 'bg-primary/20 text-primary' : 'bg-orange-100 text-orange-500'}`}>
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Macro Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mx-6 mb-6"
            >
                <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Macro Breakdown (Weekly)</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Protein */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Protein</span>
                                <span className="text-foreground font-semibold">{totalMacros.protein}g</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-[#4CAF93] rounded-full" style={{ width: '100%' }} />
                            </div>
                        </div>

                        {/* Carbs */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Carbs</span>
                                <span className="text-foreground font-semibold">{totalMacros.carbs}g</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-[#5DA9E9] rounded-full" style={{ width: '100%' }} />
                            </div>
                        </div>

                        {/* Fats */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Fats</span>
                                <span className="text-foreground font-semibold">{totalMacros.fat}g</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-[#FFB74D] rounded-full" style={{ width: '100%' }} />
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-6 text-center italic">
                        "Consistency is key. You're doing great!"
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
