// geminiService.ts
import { supabase } from './supabase_client';

// 原有的模拟函数
export function analyzeWithFallback(context: string): string {
  const lowerContext = context.toLowerCase();
  
  if (lowerContext.includes('family') || lowerContext.includes('parent')) {
    return 'family-conflict';
  } else if (lowerContext.includes('work') || lowerContext.includes('job')) {
    return 'workplace-feedback';
  } else if (lowerContext.includes('friend') || lowerContext.includes('trust')) {
    return 'friendship-betrayal';
  } else if (lowerContext.includes('anxious') || lowerContext.includes('social')) {
    return 'social-anxiety';
  } else if (lowerContext.includes('relationship') || lowerContext.includes('partner')) {
    return 'romantic-miscommunication';
  } else if (lowerContext.includes('study') || lowerContext.includes('exam')) {
    return 'academic-pressure';
  }
  
  return 'family-conflict';
}

// 新增：从数据库获取推荐场景
export async function getRecommendedScenarioFromDB(context: string): Promise<string> {
  try {
    // 首先分析用户的问题内容
    const analysis = analyzeUserContext(context);
    
    // 从数据库查询匹配的场景
    const { data: scenarios, error } = await supabase
      .from('scenarios')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching scenarios from DB:', error);
      // 降级到本地逻辑
      return analyzeWithFallback(context);
    }

    if (!scenarios || scenarios.length === 0) {
      return analyzeWithFallback(context);
    }

    // 根据分析结果选择最合适的场景
    const recommendedScenario = findBestMatch(scenarios, analysis);
    return recommendedScenario.id;

  } catch (error) {
    console.error('Error in getRecommendedScenarioFromDB:', error);
    return analyzeWithFallback(context);
  }
}

// 分析用户上下文
function analyzeUserContext(context: string) {
  const lowerContext = context.toLowerCase();
  
  return {
    hasFamily: lowerContext.includes('family') || lowerContext.includes('parent'),
    hasWork: lowerContext.includes('work') || lowerContext.includes('job') || lowerContext.includes('colleague'),
    hasFriends: lowerContext.includes('friend') || lowerContext.includes('trust') || lowerContext.includes('betray'),
    hasSocialAnxiety: lowerContext.includes('anxious') || lowerContext.includes('social') || lowerContext.includes('crowd'),
    hasRelationship: lowerContext.includes('relationship') || lowerContext.includes('partner') || lowerContext.includes('romantic'),
    hasAcademic: lowerContext.includes('study') || lowerContext.includes('exam') || lowerContext.includes('school'),
    emotions: extractEmotions(lowerContext)
  };
}

// 提取情绪关键词
function extractEmotions(text: string): string[] {
  const emotions = [];
  const emotionKeywords = {
    'anger': ['angry', 'mad', 'frustrated', 'annoyed'],
    'sadness': ['sad', 'depressed', 'unhappy', 'disappointed'],
    'anxiety': ['anxious', 'nervous', 'worried', 'stressed'],
    'fear': ['scared', 'afraid', 'fearful'],
    'joy': ['happy', 'excited', 'joyful'],
    'trust': ['trust', 'betrayed', 'loyal'],
    'surprise': ['surprised', 'shocked']
  };

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      emotions.push(emotion);
    }
  }

  return emotions;
}

// 找到最佳匹配的场景
function findBestMatch(scenarios: any[], analysis: any): any {
  let bestMatch = scenarios[0];
  let highestScore = 0;

  for (const scenario of scenarios) {
    let score = 0;

    // 基于场景ID的关键词匹配
    if (analysis.hasFamily && scenario.id.includes('family')) score += 3;
    if (analysis.hasWork && scenario.id.includes('workplace')) score += 3;
    if (analysis.hasFriends && scenario.id.includes('friendship')) score += 3;
    if (analysis.hasSocialAnxiety && scenario.id.includes('social')) score += 3;
    if (analysis.hasRelationship && scenario.id.includes('romantic')) score += 3;
    if (analysis.hasAcademic && scenario.id.includes('academic')) score += 3;

    // 基于情绪标签匹配
    if (scenario.emotions && analysis.emotions.length > 0) {
      const matchingEmotions = scenario.emotions.filter((emotion: string) => 
        analysis.emotions.includes(emotion.toLowerCase())
      );
      score += matchingEmotions.length * 2;
    }

    // 基于难度匹配（简单问题用简单场景）
    if (analysis.emotions.includes('anxiety') || analysis.emotions.includes('fear')) {
      if (scenario.difficulty === 'Beginner') score += 1;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = scenario;
    }
  }

  return bestMatch;
}