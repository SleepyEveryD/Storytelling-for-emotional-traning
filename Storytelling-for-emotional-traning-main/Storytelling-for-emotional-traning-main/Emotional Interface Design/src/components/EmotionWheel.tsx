import { Button } from './ui/button';

interface EmotionWheelProps {
  emotions: string[];
  selectedEmotion: string | null;
  onSelectEmotion: (emotion: string) => void;
  disabled?: boolean;
}

const emotionEmojis: { [key: string]: string } = {
  // Joy family
  'Joy': '😊',
  'Excitement': '🤩',
  'Pride': '😌',
  'Relief': '😮‍💨',
  
  // Sadness family
  'Sadness': '😢',
  'Disappointment': '😞',
  'Hurt': '💔',
  'Loneliness': '😔',
  
  // Anger family
  'Anger': '😠',
  'Frustration': '😤',
  'Annoyance': '😒',
  'Resentment': '😡',
  
  // Fear family
  'Fear': '😨',
  'Anxiety': '😰',
  'Worry': '😟',
  'Nervousness': '😬',
  'Insecurity': '😓',
  'Stress': '😫',
  
  // Surprise family
  'Surprise': '😲',
  'Confusion': '😕',
  'Amazement': '😮',
  
  // Disgust family
  'Disgust': '🤢',
  'Contempt': '😤',
  
  // Trust/Love family
  'Love': '🥰',
  'Trust': '🤝',
  'Empathy': '🫂',
  'Understanding': '💭',
  
  // Complex emotions
  'Defensiveness': '🛡️',
  'Determination': '💪',
  'Self-doubt': '😶',
  'Guilt': '😣',
  'Shame': '😳',
  'Support': '🤗',
  'Compassion': '❤️',
  'Gratitude': '🙏',
  'Accountability': '✋',
};

const emotionColors: { [key: string]: string } = {
  // Joy family
  'Joy': 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200',
  'Excitement': 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200',
  'Pride': 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200',
  'Relief': 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200',
  
  // Sadness family
  'Sadness': 'bg-blue-100 border-blue-400 hover:bg-blue-200',
  'Disappointment': 'bg-blue-100 border-blue-400 hover:bg-blue-200',
  'Hurt': 'bg-blue-100 border-blue-400 hover:bg-blue-200',
  'Loneliness': 'bg-blue-100 border-blue-400 hover:bg-blue-200',
  
  // Anger family
  'Anger': 'bg-red-100 border-red-400 hover:bg-red-200',
  'Frustration': 'bg-red-100 border-red-400 hover:bg-red-200',
  'Annoyance': 'bg-red-100 border-red-400 hover:bg-red-200',
  'Resentment': 'bg-red-100 border-red-400 hover:bg-red-200',
  
  // Fear family
  'Fear': 'bg-purple-100 border-purple-400 hover:bg-purple-200',
  'Anxiety': 'bg-purple-100 border-purple-400 hover:bg-purple-200',
  'Worry': 'bg-purple-100 border-purple-400 hover:bg-purple-200',
  'Nervousness': 'bg-purple-100 border-purple-400 hover:bg-purple-200',
  'Insecurity': 'bg-purple-100 border-purple-400 hover:bg-purple-200',
  'Stress': 'bg-purple-100 border-purple-400 hover:bg-purple-200',
  
  // Surprise family
  'Surprise': 'bg-pink-100 border-pink-400 hover:bg-pink-200',
  'Confusion': 'bg-pink-100 border-pink-400 hover:bg-pink-200',
  'Amazement': 'bg-pink-100 border-pink-400 hover:bg-pink-200',
  
  // Disgust family
  'Disgust': 'bg-green-100 border-green-400 hover:bg-green-200',
  'Contempt': 'bg-green-100 border-green-400 hover:bg-green-200',
  
  // Trust/Love family
  'Love': 'bg-rose-100 border-rose-400 hover:bg-rose-200',
  'Trust': 'bg-teal-100 border-teal-400 hover:bg-teal-200',
  'Empathy': 'bg-teal-100 border-teal-400 hover:bg-teal-200',
  'Understanding': 'bg-teal-100 border-teal-400 hover:bg-teal-200',
  
  // Complex emotions
  'Defensiveness': 'bg-orange-100 border-orange-400 hover:bg-orange-200',
  'Determination': 'bg-indigo-100 border-indigo-400 hover:bg-indigo-200',
  'Self-doubt': 'bg-gray-100 border-gray-400 hover:bg-gray-200',
  'Guilt': 'bg-amber-100 border-amber-400 hover:bg-amber-200',
  'Shame': 'bg-amber-100 border-amber-400 hover:bg-amber-200',
  'Support': 'bg-green-100 border-green-400 hover:bg-green-200',
  'Compassion': 'bg-pink-100 border-pink-400 hover:bg-pink-200',
  'Gratitude': 'bg-purple-100 border-purple-400 hover:bg-purple-200',
  'Accountability': 'bg-blue-100 border-blue-400 hover:bg-blue-200',
};

export function EmotionWheel({ emotions, selectedEmotion, onSelectEmotion, disabled }: EmotionWheelProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {emotions.map((emotion) => {
        const isSelected = selectedEmotion === emotion;
        const colorClass = emotionColors[emotion] || 'bg-gray-100 border-gray-400 hover:bg-gray-200';
        const emoji = emotionEmojis[emotion] || '😐';
        
        return (
          <button
            key={emotion}
            onClick={() => onSelectEmotion(emotion)}
            disabled={disabled}
            className={`
              p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2
              ${colorClass}
              ${isSelected ? 'ring-4 ring-offset-2 ring-purple-500 scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-md'}
              ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer active:scale-95'}
            `}
          >
            <span className="text-4xl md:text-5xl">{emoji}</span>
            <span className="text-xs text-center text-gray-700 leading-tight">{emotion}</span>
          </button>
        );
      })}
    </div>
  );
}
