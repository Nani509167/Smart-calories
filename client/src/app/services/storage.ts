import { Preferences } from '@capacitor/preferences';

const KEYS = {
    USER_PROFILE: 'user_profile',
    MEAL_LOGS: 'meal_logs',
};

export interface UserProfile {
    name: string;
    age: number;
    gender: 'male' | 'female';
    height: number;
    weight: number;
    activity_level: string;
    goal_type: 'loss' | 'maintain' | 'gain';
    caloric_goal: number;
}

export interface MealLog {
    id: number;
    food_name: string;
    calories: number;
    quantity: string;
    cooking_method: string;
    timestamp: string;
    meal_type: string;
    macros?: {
        protein: string;
        fat: string;
        carbs: string;
    };
}

export const StorageService = {
    async saveProfile(profile: UserProfile): Promise<void> {
        await Preferences.set({
            key: KEYS.USER_PROFILE,
            value: JSON.stringify(profile),
        });
    },

    async getProfile(): Promise<UserProfile | null> {
        const { value } = await Preferences.get({ key: KEYS.USER_PROFILE });
        return value ? JSON.parse(value) : null;
    },

    async saveLog(log: Omit<MealLog, 'id' | 'timestamp'>): Promise<void> {
        const logs = await this.getLogs(new Date().toISOString().split('T')[0]);
        const newLog: MealLog = {
            ...log,
            id: Date.now(),
            timestamp: new Date().toISOString(),
        };
        const allLogs = await this.getAllLogs();
        allLogs.push(newLog);
        await Preferences.set({
            key: KEYS.MEAL_LOGS,
            value: JSON.stringify(allLogs),
        });
    },

    async deleteLog(id: number): Promise<void> {
        const allLogs = await this.getAllLogs();
        const updatedLogs = allLogs.filter(log => log.id !== id);
        await Preferences.set({
            key: KEYS.MEAL_LOGS,
            value: JSON.stringify(updatedLogs),
        });
    },

    async getAllLogs(): Promise<MealLog[]> {
        const { value } = await Preferences.get({ key: KEYS.MEAL_LOGS });
        return value ? JSON.parse(value) : [];
    },

    async getLogs(date: string): Promise<MealLog[]> {
        const allLogs = await this.getAllLogs();
        return allLogs.filter(log => log.timestamp.startsWith(date));
    }
};
