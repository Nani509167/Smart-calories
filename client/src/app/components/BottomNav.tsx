import { Home, Plus, Camera, MessageCircle, BarChart2 } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'report', label: 'Report', icon: BarChart2 },
    { id: 'add-text', label: 'Add', icon: Plus },
    { id: 'scan', label: 'Scan', icon: Camera },
    { id: 'coach', label: 'Coach', icon: MessageCircle },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl"
    >
      <div className="max-w-md mx-auto px-6 py-4 safe-area-bottom">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center gap-1 relative"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-primary' : 'bg-transparent'
                    }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                  />
                </div>
                <span
                  className={`text-xs transition-colors ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
                    }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
