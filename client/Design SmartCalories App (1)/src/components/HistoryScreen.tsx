import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { FoodEntry } from '../App';
import { ArrowLeft, Utensils, Trash2 } from 'lucide-react';

interface HistoryScreenProps {
  history: FoodEntry[];
  onBack: () => void;
  onDeleteEntry: (entryId: string) => void;
}

export function HistoryScreen({ history, onBack, onDeleteEntry }: HistoryScreenProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const groupByDate = (entries: FoodEntry[]) => {
    const groups: { [key: string]: FoodEntry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });
    
    return groups;
  };

  const groupedHistory = groupByDate(history);

  return (
    <div className="min-h-screen p-6 pb-safe bg-[#FAF8F3]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-[#8BA888]" />
          </motion.button>
          <div>
            <h1 className="text-[#2C2C2C]">History</h1>
            <p className="text-[#7A7A7A]">
              {history.length} {history.length === 1 ? 'entry' : 'entries'}
            </p>
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <Card className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5F5F3] rounded-full mb-4">
              <Utensils className="w-8 h-8 text-[#9E9E9E]" />
            </div>
            <h2 className="text-[#2C2C2C] mb-2">No entries yet</h2>
            <p className="text-[#7A7A7A] mb-6">
              Start analyzing foods to see them here
            </p>
            <Button onClick={onBack}>
              Add Your First Food
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHistory).map(([date, entries]) => (
              <div key={date} className="space-y-3">
                <h2 className="text-[#6B6B6B] ml-1">{date}</h2>
                <div className="space-y-3">
                  {entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <HistoryCard entry={entry} formatTime={formatTime} onDeleteEntry={onDeleteEntry} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface HistoryCardProps {
  entry: FoodEntry;
  formatTime: (date: Date) => string;
  onDeleteEntry: (entryId: string) => void;
}

function HistoryCard({ entry, formatTime, onDeleteEntry }: HistoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDeleteEntry(entry.id);
    }, 300);
  };

  return (
    <motion.div
      animate={isDeleting ? { opacity: 0, x: 100, scale: 0.8 } : { opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[#2C2C2C] truncate">{entry.foodName}</h3>
              <span className="text-[#9E9E9E] text-sm">•</span>
              <span className="text-[#9E9E9E] text-sm whitespace-nowrap">{entry.quantity}g</span>
            </div>
            <p className="text-[#7A7A7A] text-sm mb-3">
              {entry.cookingMethod}
              {entry.oilType && ` with ${entry.oilType}`}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-[#7A7A7A]">P:</span>
                <span className="text-[#2C2C2C]">{entry.protein}g</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#7A7A7A]">F:</span>
                <span className="text-[#2C2C2C]">{entry.fat}g</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#7A7A7A]">C:</span>
                <span className="text-[#2C2C2C]">{entry.carbs}g</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-2xl text-[#8BA888]">{entry.calories}</p>
              <p className="text-[#9E9E9E] text-sm">kcal</p>
              <p className="text-[#B0B0B0] text-xs mt-1">
                {formatTime(entry.timestamp)}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleDelete}
              className="mt-1 p-2 bg-[#FFE5E5] rounded-xl hover:bg-[#FFCCCC] transition-colors group"
              title="Delete entry"
            >
              <Trash2 className="w-4 h-4 text-[#E53E3E] group-hover:text-[#C53030]" />
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}