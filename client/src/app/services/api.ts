import { StorageService, UserProfile, MealLog } from './storage';

// In a real production app, use a more secure way to handle keys.
// For individual local use, this constant is sufficient.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('CRITICAL: Gemini API Key is missing! Ensure VITE_GEMINI_API_KEY is set in .env');
}

// Fallback model list to try if primary fails (404)
const MODELS_TO_TRY = [
    'gemini-2.5-flash',       // Bleeding edge discovered
    'gemini-2.0-flash-exp',   // Discovered in user's account
    'gemini-1.5-flash',       // Standard latest alias
    'gemini-1.5-flash-001',   // Specific version
    'gemini-1.5-flash-8b',    // Lightweight version
    'gemini-1.5-pro',         // Higher tier
    'gemini-pro'              // Legacy fallback
];

// Direct API call helper with Fallback Strategy
const callGeminiAPI = async (payload: any): Promise<any> => {
    let firstError: any = null;
    let lastError: any = null;

    for (const model of MODELS_TO_TRY) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        try {
            console.log(`Attempting AI Request with model: ${model}`);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();

                // Capture the error of the FIRST model preferred (most likely the correct one)
                if (!firstError) {
                    firstError = new Error(`Primary Model (${model}) failed: ${response.status} - ${errorText}`);
                }

                // If 404/400 (model not found/supported), throw to try next model
                if (response.status === 404 || response.status === 400 || errorText.includes('not found')) {
                    console.warn(`Model ${model} failed (404/400). Trying next...`);
                    lastError = new Error(`Model ${model} not found: ${errorText}`);
                    continue;
                }
                // Other errors (500, 403, 429) might be fatal or rate limits, but for reliability we continue if possible
                // blocking on 401/403 (auth) is usually fatal
                if (response.status === 401 || response.status === 403) {
                    throw new Error(`Permission Denied (${response.status}). Check API Key.`);
                }

                lastError = new Error(`API Error ${response.status}: ${errorText}`);
                continue;
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                const err = new Error('Invalid AI Response (Empty)');
                if (!firstError) firstError = err;
                lastError = err;
                continue;
            }

            const jsonStr = text.replace(/```json|```/g, '').trim();
            console.log(`Success with model: ${model}`);
            return JSON.parse(jsonStr);

        } catch (error: any) {
            console.error(`Error with ${model}:`, error);
            if (!firstError) firstError = error;
            lastError = error;
            // logic to try next model in loop
        }
    }

    // If we land here, all models failed
    // Return the error from the PRIMARY model if it exists, as that's the most relevant one
    throw new Error(firstError?.message || lastError?.message || 'Unknown Network Error');
};

export interface FoodItem {
    calories: number;
    macros: {
        protein: string;
        fat: string;
        carbs: string;
    };
    confidence: 'low' | 'medium' | 'high';
    ai_insight: string;
}

// Helper to timeout any promise
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(errorMsg)), ms);
        promise.then(
            (val) => { clearTimeout(timer); resolve(val); },
            (err) => { clearTimeout(timer); reject(err); }
        );
    });
};

const getSystemInstruction = async (): Promise<string> => {
    // Add timeout to storage read prevents hanging if preferences plugin is broken
    const user = await withTimeout(
        StorageService.getProfile().catch(() => null),
        5000,
        "Storage Read Timeout"
    );

    let userContext = "";
    if (user) {
        userContext = `\nUser Profile:\n- Weight: ${user.weight}kg\n- Goal: ${user.goal_type}\n- Activity: ${user.activity_level}\n`;
    }

    return `
You are SmartCalories AI, an expert nutrition analysis assistant.${userContext}

Goal:
Estimate food calories accurately without manual calorie entry using AI reasoning.

Instructions:
1. Estimate calories realistically based on food type, quantity, cooking method, and oil usage.
2. Adjust estimation slightly based on user profile and goal (if provided).
3. If quantity is vague, infer a reasonable portion size.
4. If image is provided, cross-check food type and portion visually.
5. Avoid extreme or unrealistic values.
6. Be concise and factual.

Output:
Return ONLY valid JSON in the following format:
{
  "calories": number,
  "macros": {
    "protein": "X g",
    "fat": "X g",
    "carbs": "X g"
  },
  "confidence": "low | medium | high",
  "ai_insight": "One short helpful suggestion"
}
`;
};

export const analyzeImage = async (file: File): Promise<FoodItem> => {
    const systemInstruction = await getSystemInstruction();

    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    const base64Data = await base64Promise;

    // MERGE system instruction into the prompt to ensure compatibility with ALL models (even legacy gemini-pro)
    const fullPrompt = `${systemInstruction}\n\nUser Request: Analyze this food image. Return ONLY the JSON object.`;

    const payload = {
        contents: [{
            parts: [
                { text: fullPrompt },
                { inline_data: { mime_type: file.type, data: base64Data } }
            ]
        }]
        // removed system_instruction field to avoid 400/404 on unsupported models
    };

    return callGeminiAPI(payload);
};

export const analyzeText = async (data: {
    food_name: string;
    quantity: string;
    cooking_method: string;
    oil_type?: string;
}): Promise<FoodItem> => {
    const systemInstruction = await getSystemInstruction();

    const prompt = `Analyze this meal entry:
Food: ${data.food_name}
Quantity: ${data.quantity || "1 serving"}
Cooking Method: ${data.cooking_method || "standard"}
${data.oil_type ? `Oil used: ${data.oil_type}` : ""}

Return ONLY the JSON object.`;

    // MERGE system instruction
    const fullPrompt = `${systemInstruction}\n\nUser Request: ${prompt}`;

    const payload = {
        contents: [{ parts: [{ text: fullPrompt }] }]
        // removed system_instruction field
    };

    return callGeminiAPI(payload);
};

// Data methods redirected to StorageService
export const getUserProfile = () => StorageService.getProfile();
export const saveUserProfile = (profile: UserProfile) => StorageService.saveProfile(profile);
export const getMealLogs = (date: string) => StorageService.getLogs(date);
export const saveMealLog = (log: Omit<MealLog, 'id' | 'timestamp'>) => StorageService.saveLog(log);
export const getAllLogs = () => StorageService.getAllLogs();
