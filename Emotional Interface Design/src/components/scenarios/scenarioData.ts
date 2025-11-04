export const scenarioData: any = {
  'family-conflict': {
    title: 'Family Dinner Disagreement',
    story: [
      {
        id: 1,
        narrative: "It's Sunday evening, and your family is gathered around the dinner table. Your mother mentions that you haven't been helping with household chores lately.\n\n\"I've noticed you haven't done the dishes in over a week,\" she says, her voice slightly strained. \"Your siblings and I have been picking up the slack.\"",
        emotionRecognitionQuestion: "What emotion is your mother likely experiencing?",
        emotionOptions: ['Frustration', 'Joy', 'Confusion', 'Excitement', 'Fear', 'Sadness'],
        correctEmotion: 'Frustration',
        emotionExplanation: 'Your mother is expressing frustration. Notice the strained voice and the mention of having to compensate for your actions. Frustration often arises when expectations aren\'t met repeatedly.',
        imageUrl: 'https://images.unsplash.com/photo-1758524944783-0ec215baf777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBkaXNjdXNzaW9uJTIwc2VyaW91c3xlbnwxfHx8fDE3NjEzMTIwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 2,
        narrative: "Your first instinct is to feel defensive. You've been really busy with work and feel like you're being criticized in front of everyone.",
        characterEmotion: 'Defensiveness',
        emotionExplanation: 'Feeling defensive is natural when we perceive criticism. Notice how your body might tense up and you might want to justify or explain immediately.',
        imageUrl: 'https://images.unsplash.com/photo-1578496780896-7081cc23c111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBkaW5uZXIlMjB0YWJsZXxlbnwxfHx8fDE3NjEzMTE5NTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        choices: [
          {
            text: "\"That's not fair! I've been working overtime all week. You don't understand how tired I am.\"",
            emotionalResponse: 'Defensiveness and anger',
            isHealthy: false,
            feedback: 'While your feelings are valid, responding defensively can escalate the situation. Try acknowledging the concern first before explaining your perspective.'
          },
          {
            text: "\"You're right, I haven't been keeping up with my chores. I've been overwhelmed with work, but that's not an excuse. Can we talk about a better system?\"",
            emotionalResponse: 'Accountability and openness',
            isHealthy: true,
            feedback: 'Excellent! You acknowledged the concern, validated your mother\'s feelings, and opened up communication. This shows emotional maturity and problem-solving.'
          },
          {
            text: "Say nothing and leave the table.",
            emotionalResponse: 'Withdrawal and avoidance',
            isHealthy: false,
            feedback: 'Avoiding the conversation might feel safer in the moment, but it leaves the issue unresolved and may damage relationships. Staying engaged, even when uncomfortable, is important.'
          }
        ]
      },
      {
        id: 3,
        narrative: "Your mother responds: \"I appreciate you acknowledging that. I know you're working hard, and I'm proud of you. But we need everyone to contribute. Let's figure out a schedule that works for everyone.\"\n\nYour sibling adds, \"Yeah, we could rotate tasks weekly. That might be easier for everyone.\"",
        emotionRecognitionQuestion: "What emotion is your mother showing now?",
        emotionOptions: ['Empathy', 'Anger', 'Disappointment', 'Confusion', 'Pride', 'Relief'],
        correctEmotion: 'Empathy',
        emotionExplanation: 'Your mother is showing empathy - she acknowledges your hard work while maintaining her boundary. Empathy means understanding another\'s feelings while still addressing the issue at hand.',
        imageUrl: 'https://images.unsplash.com/photo-1526560244950-1a3c1ace48f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBoYXBweSUyMHRvZ2V0aGVyfGVufDF8fHx8MTc2MTMxMjA3NXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 4,
        narrative: "The conversation ends with your family agreeing on a new chore schedule. Everyone seems more relaxed now.\n\nAs you help clear the table, you notice you're feeling different than when the conversation started.",
        characterEmotion: 'Relief and connection',
        emotionExplanation: 'You might feel relief that the conflict was resolved constructively, and a renewed sense of connection with your family. Healthy conflict resolution often strengthens relationships rather than damaging them.',
        imageUrl: 'https://images.unsplash.com/photo-1526560244950-1a3c1ace48f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBoYXBweSUyMHRvZ2V0aGVyfGVufDF8fHx8MTc2MTMxMjA3NXww&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ]
  },

  'workplace-feedback': {
    title: 'Receiving Critical Feedback',
    story: [
      {
        id: 1,
        narrative: "Your manager, Sarah, asks to meet with you after the morning standup. You've been working on a major project for the past month.\n\n\"Thanks for meeting with me,\" she begins. \"I wanted to discuss the presentation you gave to the client yesterday. While the content was solid, I noticed the delivery wasn't as polished as it could have been. The client seemed confused at several points.\"",
        emotionRecognitionQuestion: "What emotion might you be experiencing right now?",
        emotionOptions: ['Anxiety', 'Defensiveness', 'Shame', 'Anger', 'Confusion', 'Pride'],
        correctEmotion: 'Defensiveness',
        emotionExplanation: 'Receiving unexpected criticism often triggers defensiveness. Your mind might immediately jump to justifications or feel like your competence is being questioned. This is a normal protective response.',
        imageUrl: 'https://images.unsplash.com/photo-1706618184116-425c7aaec79c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5hZ2VyJTIwZW1wbG95ZWUlMjBmZWVkYmFja3xlbnwxfHx8fDE3NjEzMTIwNzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 2,
        narrative: "You feel your heart rate increase and notice the urge to explain all the reasons why the presentation went the way it did. You spent weeks preparing!",
        characterEmotion: 'Defensiveness and hurt pride',
        emotionExplanation: 'When we invest significant effort into something, criticism can feel personal. Notice the physical sensations - increased heart rate, tension - these are signals of your emotional state.',
        imageUrl: 'https://images.unsplash.com/photo-1676276374429-3902f2666824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JrcGxhY2UlMjBtZWV0aW5nJTIwZmVlZGJhY2t8ZW58MXx8fHwxNzYxMzExOTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        choices: [
          {
            text: "\"I don't think that's fair. I worked really hard on that presentation, and I thought it went well. Maybe the client just wasn't prepared.\"",
            emotionalResponse: 'Defensiveness and blame-shifting',
            isHealthy: false,
            feedback: 'Deflecting feedback by blaming the client prevents you from learning and growing. It also may damage your professional relationship with your manager.'
          },
          {
            text: "\"Thank you for letting me know. That's disappointing to hear, but I want to understand better. Can you give me specific examples of where the confusion happened?\"",
            emotionalResponse: 'Disappointment with curiosity',
            isHealthy: true,
            feedback: 'Excellent response! You acknowledged your feelings while staying open to feedback. Asking for specifics shows professionalism and a genuine desire to improve.'
          },
          {
            text: "\"You're absolutely right. I'm terrible at presentations. I should probably not be doing client-facing work.\"",
            emotionalResponse: 'Shame and self-deprecation',
            isHealthy: false,
            feedback: 'This response swings too far in the opposite direction. One piece of constructive feedback doesn\'t mean you\'re terrible. Avoid catastrophizing or making sweeping negative judgments about yourself.'
          }
        ]
      },
      {
        id: 3,
        narrative: "Sarah provides specific examples: \"When you discussed the timeline, you mentioned several dates without showing them visually. Also, the technical jargon in section three lost them - they needed simpler language.\"\n\nShe continues, \"You have great technical knowledge and the content was thorough. With some adjustments to your delivery style, you'll be even more effective. Would you be interested in some presentation coaching?\"",
        emotionRecognitionQuestion: "What emotion is Sarah demonstrating toward you?",
        emotionOptions: ['Support', 'Contempt', 'Frustration', 'Disappointment', 'Anger', 'Confusion'],
        correctEmotion: 'Support',
        emotionExplanation: 'Sarah is showing support. She\'s offering specific, actionable feedback and resources to help you improve. Constructive feedback from a good manager comes from a place of wanting you to succeed.',
        imageUrl: 'https://images.unsplash.com/photo-1758691737182-d42aefd6dee8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBncm93dGglMjBsZWFybmluZ3xlbnwxfHx8fDE3NjEzMTIwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 4,
        narrative: "After the meeting, you reflect on the conversation. While it was initially uncomfortable, you recognize that Sarah's feedback will make you better at your job.\n\nYou feel ready to work on improving your presentation skills.",
        characterEmotion: 'Determination and growth mindset',
        emotionExplanation: 'You\'ve processed the initial defensive feelings and arrived at determination. This is emotional regulation in action - allowing yourself to feel the discomfort while not being controlled by it.',
        imageUrl: 'https://images.unsplash.com/photo-1758691737182-d42aefd6dee8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBncm93dGglMjBsZWFybmluZ3xlbnwxfHx8fDE3NjEzMTIwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ]
  },

  'friendship-betrayal': {
    title: 'Friend Breaks a Promise',
    story: [
      {
        id: 1,
        narrative: "You've been planning to see your favorite band with your best friend, Alex, for three months. You bought tickets together, and the concert is tonight.\n\nTwo hours before you're supposed to leave, Alex texts: \"Hey... I'm really sorry but I can't make it tonight. An old friend from college is in town and I haven't seen them in years. I know this is last minute. I hope you understand.\"",
        emotionRecognitionQuestion: "What emotion are you likely experiencing?",
        emotionOptions: ['Hurt', 'Joy', 'Confusion', 'Anger', 'Relief', 'Pride'],
        correctEmotion: 'Hurt',
        emotionExplanation: 'Hurt is a common response when someone we care about breaks a commitment, especially for something you\'ve both been looking forward to. The hurt comes from feeling deprioritized or less important.',
        imageUrl: 'https://images.unsplash.com/photo-1712839397054-f5bb6edd8fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMG1lc3NhZ2UlMjBzYWR8ZW58MXx8fHwxNzYxMzEyMDczfDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 2,
        narrative: "You stare at the message, feeling a mix of emotions. You're disappointed about missing out on experiencing the concert together, and you feel hurt that Alex is choosing someone else over your long-standing plans.",
        characterEmotion: 'Hurt and anger',
        emotionExplanation: 'It\'s normal to feel multiple emotions at once. The hurt stems from feeling let down, while anger might arise from the perceived unfairness of the situation.',
        imageUrl: 'https://images.unsplash.com/photo-1572265378468-61882cf551f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwY29uY2VydCUyMGV2ZW50fGVufDF8fHx8MTc2MTMxMTk2MHww&ixlib=rb-4.1.0&q=80&w=1080',
        choices: [
          {
            text: "\"Wow. Thanks for letting me know you value your college friend more than me. Have fun.\" [Don't reply to further messages]",
            emotionalResponse: 'Anger and passive-aggression',
            isHealthy: false,
            feedback: 'While your hurt feelings are valid, passive-aggressive responses can damage the friendship. Expressing hurt through sarcasm prevents real communication and resolution.'
          },
          {
            text: "\"I'm really hurt, Alex. We've been planning this for months. I understand wanting to see your friend, but the timing feels really inconsiderate. Can we talk about this?\"",
            emotionalResponse: 'Hurt expressed honestly',
            isHealthy: true,
            feedback: 'Excellent! You\'re expressing your feelings directly and honestly without attacking Alex. You\'re also opening the door for dialogue, which gives the friendship a chance to strengthen through this challenge.'
          },
          {
            text: "\"No worries! Hope you have a great time! 😊\" [But feel resentful inside]",
            emotionalResponse: 'People-pleasing and suppression',
            isHealthy: false,
            feedback: 'Suppressing your true feelings might avoid immediate conflict, but it creates resentment over time. Authentic friendships require honest (and kind) communication about hurt feelings.'
          }
        ]
      },
      {
        id: 3,
        narrative: "Alex calls you instead of texting back. \"I hear that you're hurt, and you're right to be. I messed up with my timing. I should have figured this out earlier or said no to my college friend. You've been looking forward to this, and I let you down.\"\n\nAlex continues, \"I can't undo canceling, but I want to make it up to you. Can I buy us tickets to their next show? And I promise I'll be there.\"",
        emotionRecognitionQuestion: "What is Alex demonstrating?",
        emotionOptions: ['Accountability', 'Defensiveness', 'Anger', 'Confusion', 'Indifference', 'Joy'],
        correctEmotion: 'Accountability',
        emotionExplanation: 'Alex is taking accountability - acknowledging the mistake, validating your feelings, and offering to make amends. This is a sign of emotional maturity and care for the relationship.',
        imageUrl: 'https://images.unsplash.com/photo-1759060413464-cb0c965d82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwaHVnJTIwc3VwcG9ydHxlbnwxfHx8fDE3NjEzMTIwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 4,
        narrative: "You decide to go to the concert alone and actually enjoy yourself. Later, you and Alex talk more about the situation and agree to be more communicative about conflicts in scheduling.\n\nYour friendship feels stronger for having worked through this disagreement honestly.",
        characterEmotion: 'Understanding and forgiveness',
        emotionExplanation: 'After processing the hurt and having honest communication, you\'re able to extend understanding and forgiveness. Healthy relationships involve navigating disappointments together and coming out stronger.',
        imageUrl: 'https://images.unsplash.com/photo-1759060413464-cb0c965d82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwaHVnJTIwc3VwcG9ydHxlbnwxfHx8fDE3NjEzMTIwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ]
  },

  'social-anxiety': {
    title: 'Meeting New People',
    story: [
      {
        id: 1,
        narrative: "You've just moved to a new neighborhood, and your neighbor invited you to a community barbecue. You've been isolated lately and know you should go, but as you approach the backyard full of strangers, your heart starts racing.\n\nYou see groups of people laughing and talking easily with each other. Everyone seems to already know each other.",
        emotionRecognitionQuestion: "What are you experiencing?",
        emotionOptions: ['Nervousness', 'Anger', 'Joy', 'Disgust', 'Sadness', 'Pride'],
        correctEmotion: 'Nervousness',
        emotionExplanation: 'Social nervousness is characterized by physical symptoms like racing heart, worries about being judged, and uncertainty about how to engage. This is a very common experience, especially in new social situations.',
        imageUrl: 'https://images.unsplash.com/photo-1562686686-10bff25dd2dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXJ2b3VzJTIwcGVyc29uJTIwY3Jvd2R8ZW58MXx8fHwxNzYxMzEyMDczfDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 2,
        narrative: "Your mind fills with anxious thoughts: \"What if I say something stupid? What if no one wants to talk to me? Maybe I should just leave.\"\n\nYou notice your palms are sweaty and you're standing awkwardly near the entrance.",
        characterEmotion: 'Social anxiety and self-doubt',
        emotionExplanation: 'Social anxiety often includes negative predictions about social interactions and heightened self-consciousness. Notice how the thoughts are making predictions about the future that may not be accurate.',
        imageUrl: 'https://images.unsplash.com/photo-1760275496441-2e6b427d7be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBnYXRoZXJpbmclMjBwZW9wbGV8ZW58MXx8fHwxNzYxMzAzODA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        choices: [
          {
            text: "Turn around and go home. Text your neighbor later saying you weren't feeling well.",
            emotionalResponse: 'Avoidance and relief (temporary)',
            isHealthy: false,
            feedback: 'Avoiding anxiety-provoking situations provides temporary relief but reinforces the anxiety long-term. Each time you avoid, the next social situation becomes harder.'
          },
          {
            text: "Take a few deep breaths and remind yourself: \"I'm nervous, and that's okay. I'll just start by saying hi to one person.\" Approach the nearest friendly-looking person.",
            emotionalResponse: 'Courage despite nervousness',
            isHealthy: true,
            feedback: 'Perfect! You\'re acknowledging the anxiety without letting it control your behavior. Taking small, manageable steps (talking to one person) is an excellent strategy for managing social anxiety.'
          },
          {
            text: "Stand in the corner alone and wait for someone to approach you while checking your phone.",
            emotionalResponse: 'Passive avoidance',
            isHealthy: false,
            feedback: 'While this keeps you at the event, hiding behind your phone signals unavailability and makes it harder for others to approach. Active engagement, even small, is more effective.'
          }
        ]
      },
      {
        id: 3,
        narrative: "You approach a woman who's refilling her drink. \"Hi, I'm new to the neighborhood,\" you manage to say, your voice a bit shaky.\n\nShe smiles warmly. \"Welcome! I'm Maria. I've lived here for five years. How are you settling in?\"\n\nThe conversation flows more easily than you expected. She introduces you to a few other neighbors, and you notice your anxiety decreasing.",
        emotionRecognitionQuestion: "What are you experiencing now?",
        emotionOptions: ['Relief', 'Anger', 'Confusion', 'Sadness', 'Fear', 'Disgust'],
        correctEmotion: 'Relief',
        emotionExplanation: 'Relief comes when a feared outcome doesn\'t materialize. The positive social interaction contradicted your anxious predictions, and your nervous system is calming down. This is evidence that you can challenge anxious thoughts with action.',
        imageUrl: 'https://images.unsplash.com/photo-1638953052562-21e347a142bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB0YWxraW5nJTIwc21pbGluZ3xlbnwxfHx8fDE3NjEzMTIwNzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 4,
        narrative: "By the end of the barbecue, you've talked to several people and even made plans to join a neighborhood book club. \n\nAs you walk home, you feel proud of yourself for pushing through the initial anxiety.",
        characterEmotion: 'Pride and confidence',
        emotionExplanation: 'You\'ve successfully challenged your social anxiety and created positive social experiences. Each time you face a fear and survive (or even thrive!), you build evidence against anxious predictions and develop confidence.',
        imageUrl: 'https://images.unsplash.com/photo-1638953052562-21e347a142bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB0YWxraW5nJTIwc21pbGluZ3xlbnwxfHx8fDE3NjEzMTIwNzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ]
  },

  'romantic-miscommunication': {
    title: 'Relationship Misunderstanding',
    story: [
      {
        id: 1,
        narrative: "Your partner, Jamie, has been quiet and distant for the past few days. Usually you text throughout the day, but recently responses have been short and infrequent.\n\nWhen you finally see Jamie in person, they seem distracted and don't make eye contact.\n\n\"Is everything okay?\" you ask.\n\n\"Yeah, fine,\" Jamie responds, but their tone suggests otherwise.",
        emotionRecognitionQuestion: "What might Jamie be feeling?",
        emotionOptions: ['Worry', 'Joy', 'Excitement', 'Anger', 'Hurt', 'Confusion'],
        correctEmotion: 'Worry',
        emotionExplanation: 'The withdrawn behavior and distraction suggest Jamie is preoccupied with something worrying. When people are dealing with anxiety or stress, they often become distant as they process internally.',
        imageUrl: 'https://images.unsplash.com/photo-1758524944783-0ec215baf777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBzZXJpb3VzJTIwY29udmVyc2F0aW9ufGVufDF8fHx8MTc2MTMxMjA3NHww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 2,
        narrative: "You feel a knot in your stomach. Your mind races with possibilities: \"Are they upset with me? Are they losing interest? Did I do something wrong?\"\n\nYou're feeling anxious and uncertain about where you stand.",
        characterEmotion: 'Anxiety and insecurity',
        emotionExplanation: 'When there\'s ambiguity in a close relationship, it\'s natural to feel anxious. Your attachment system is alerting you to potential disconnection. Notice how you\'re making assumptions without having all the information.',
        imageUrl: 'https://images.unsplash.com/photo-1758524054106-06b11aec385c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjByZWxhdGlvbnNoaXAlMjB0YWxrfGVufDF8fHx8MTc2MTMxMTk2MHww&ixlib=rb-4.1.0&q=80&w=1080',
        choices: [
          {
            text: "\"Obviously something's wrong. If you don't want to be with me anymore, just say it.\"",
            emotionalResponse: 'Fear expressed as accusation',
            isHealthy: false,
            feedback: 'When we\'re anxious, we sometimes jump to worst-case scenarios and express them as accusations. This can push the other person away and prevent them from opening up about what\'s actually wrong.'
          },
          {
            text: "\"Jamie, I notice you've been distant lately, and I'm feeling worried about us. I care about you, and I want to understand what's going on. Can we talk about it?\"",
            emotionalResponse: 'Vulnerability and openness',
            isHealthy: true,
            feedback: 'Excellent! You\'re sharing your feelings using "I" statements, expressing care, and inviting dialogue. This creates safety for Jamie to open up about what they\'re experiencing.'
          },
          {
            text: "Say nothing and become distant yourself to \"protect\" yourself from potential hurt.",
            emotionalResponse: 'Withdrawal and self-protection',
            isHealthy: false,
            feedback: 'Creating distance to protect yourself creates a negative cycle where both partners withdraw. This prevents resolution and increases disconnection.'
          }
        ]
      },
      {
        id: 3,
        narrative: "Jamie's eyes fill with tears. \"I'm sorry I've been distant. My mom has been really sick, and I've been terrified. I didn't want to burden you with it, but I've been a mess inside.\"\n\nJamie continues, \"I wasn't pulling away from you - I was just overwhelmed and didn't know how to talk about it.\"",
        emotionRecognitionQuestion: "What is Jamie experiencing?",
        emotionOptions: ['Fear', 'Anger', 'Joy', 'Disgust', 'Confusion', 'Pride'],
        correctEmotion: 'Fear',
        emotionExplanation: 'Jamie has been dealing with fear about their mother\'s health. Sometimes people withdraw when afraid because they\'re trying to manage overwhelming emotions. The distance wasn\'t about the relationship - it was about their own internal struggle.',
        imageUrl: 'https://images.unsplash.com/photo-1624139395404-2ba3f1274337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBlbWJyYWNlJTIwbG92ZXxlbnwxfHx8fDE3NjEzMTIwODB8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 4,
        narrative: "You hold Jamie as they share more about what's been happening. You realize that your anxiety about the relationship was based on incomplete information.\n\n\"I'm here for you,\" you say. \"You don't have to go through this alone.\"\n\nJamie looks relieved. \"Thank you for asking and not just assuming. I should have told you sooner.\"",
        characterEmotion: 'Compassion and connection',
        emotionExplanation: 'By approaching the situation with curiosity instead of assumption, you created space for truth and deeper connection. This experience can actually strengthen your relationship by building trust and emotional intimacy.',
        imageUrl: 'https://images.unsplash.com/photo-1624139395404-2ba3f1274337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBlbWJyYWNlJTIwbG92ZXxlbnwxfHx8fDE3NjEzMTIwODB8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 5,
        narrative: "You both agree to communicate more openly when stressed in the future. The conversation has brought you closer together, and you feel grateful that you chose to talk rather than assume the worst.",
        characterEmotion: 'Gratitude and love',
        emotionExplanation: 'Navigating difficult conversations successfully often deepens relationships. You\'ve learned more about each other\'s communication patterns and established a foundation for handling future challenges together.',
        imageUrl: 'https://images.unsplash.com/photo-1624139395404-2ba3f1274337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBlbWJyYWNlJTIwbG92ZXxlbnwxfHx8fDE3NjEzMTIwODB8MA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ]
  },

  'academic-pressure': {
    title: 'Exam Day Stress',
    story: [
      {
        id: 1,
        narrative: "It's the morning of your final exam - the one that counts for 40% of your grade. You've studied for weeks, but as you sit in your seat waiting for the exam to begin, your mind goes blank.\n\nYour heart is pounding. Your hands are shaking. You can't remember anything you studied.",
        emotionRecognitionQuestion: "What are you experiencing?",
        emotionOptions: ['Stress', 'Joy', 'Anger', 'Disgust', 'Excitement', 'Sadness'],
        correctEmotion: 'Stress',
        emotionExplanation: 'You\'re experiencing acute stress/anxiety. The physical symptoms (racing heart, shaking hands, mental fog) are signs that your stress response system is activated. This is your body\'s fight-or-flight response, which can interfere with memory and thinking.',
        imageUrl: 'https://images.unsplash.com/photo-1756032433560-56547efed550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZGVzayUyMHN0dWR5aW5nfGVufDF8fHx8MTc2MTMxMjA3NHww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 2,
        narrative: "Panicked thoughts race through your mind: \"I'm going to fail. I can't remember anything. Everyone else looks calm - what's wrong with me? My future is ruined.\"\n\nYou notice some classmates taking deep breaths, others reviewing their notes one last time.",
        characterEmotion: 'Panic and catastrophizing',
        emotionExplanation: 'When highly stressed, our thoughts often become catastrophic - predicting the worst possible outcomes. Notice how the thoughts are absolute ("I can\'t remember anything") and future-focused ("My future is ruined") rather than grounded in present reality.',
        imageUrl: 'https://images.unsplash.com/photo-1756032433560-56547efed550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZXhhbSUyMHN0cmVzc3xlbnwxfHx8fDE3NjEzMTE5NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        choices: [
          {
            text: "Continue panicking and let the catastrophic thoughts spiral. Start the exam in this heightened state.",
            emotionalResponse: 'Overwhelmed panic',
            isHealthy: false,
            feedback: 'Allowing panic to continue unchecked will make it harder to think clearly during the exam. Your stress response needs to be calmed before you can access your knowledge effectively.'
          },
          {
            text: "Take slow, deep breaths. Count to 4 breathing in, hold for 4, breathe out for 4. Remind yourself: \"I've prepared for this. The anxiety will pass. I can do this one question at a time.\"",
            emotionalResponse: 'Self-regulation and self-compassion',
            isHealthy: true,
            feedback: 'Perfect! You\'re using physiological calming (deep breathing) and cognitive reframing (realistic self-talk) to regulate your stress response. This will help you access your knowledge and perform better.'
          },
          {
            text: "Get up and leave. Decide to take the exam another time when you're less anxious.",
            emotionalResponse: 'Avoidance',
            isHealthy: false,
            feedback: 'While removing yourself from a stressful situation can sometimes be helpful, avoiding the exam reinforces the anxiety and doesn\'t build your capacity to manage stress in important situations.'
          }
        ]
      },
      {
        id: 3,
        narrative: "After a few minutes of deep breathing, you notice your heart rate slowing. Your mind starts to clear. You remember a study technique your friend taught you.\n\nWhen you look at the first exam question, you realize you know the answer. Then the second. Your confidence begins to build.",
        emotionRecognitionQuestion: "What are you feeling now?",
        emotionOptions: ['Determination', 'Fear', 'Sadness', 'Anger', 'Confusion', 'Disgust'],
        correctEmotion: 'Determination',
        emotionExplanation: 'As your stress decreases and you start successfully answering questions, determination emerges. You\'re focused on the task at hand and gaining confidence with each small success. This is your competence and preparation shining through.',
        imageUrl: 'https://images.unsplash.com/photo-1591655694472-cc751117d95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBzdHVkZW50JTIwc3VjY2Vzc3xlbnwxfHx8fDE3NjEzMTIwODB8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 4,
        narrative: "You complete the exam feeling reasonably confident. While there were a few challenging questions, you did your best.\n\nAs you leave the exam room, you feel proud of yourself - not just for the exam content, but for managing your anxiety effectively.",
        characterEmotion: 'Pride and relief',
        emotionExplanation: 'You\'ve successfully navigated a high-stress situation by regulating your emotions rather than being controlled by them. This is an important life skill that extends far beyond academics. The pride you feel is well-earned.',
        imageUrl: 'https://images.unsplash.com/photo-1591655694472-cc751117d95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjBzdHVkZW50JTIwc3VjY2Vzc3xlbnwxfHx8fDE3NjEzMTIwODB8MA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ]
  }
};
