export const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender.toLowerCase() === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }
    return bmr;
};

export const calculateTDEE = (bmr: number, activityLevel: string) => {
    const multipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};

export const calculateCaloricGoal = (tdee: number, goalType: string) => {
    let goal = tdee;
    if (goalType === 'loss') goal -= 500;
    if (goalType === 'gain') goal += 500;
    return goal;
};
