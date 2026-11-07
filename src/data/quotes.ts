export interface VocabularyItem {
  word: string;
  meaning: string;
  exampleSentence: string;
}

export interface DailyQuote {
  day: number;
  quote: string;
  author: string;
  theme: string;
  bracket: 1 | 2 | 3 | 4;
  targetSeconds: number;
  cues: [string, string, string];
  modelAnswer: string;
  spokenLines?: string[];
  keyVocabulary: VocabularyItem[];
}

export const ALL_60_QUOTES: DailyQuote[] = [
  // --- PHASE 1: Days 1-15 (Target: 1 minute, Foundations & Confidence, Cues Visible) ---
  {
    day: 1,
    quote: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    theme: "Confidence",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "What this quote means is that even the biggest, most intimidating goals in our life start with one simple, small action. This is true because nobody can jump straight to the finish line; progress only happens when we actually start. For example, when I decided to practice speaking English, I felt nervous on day one. But taking this single step right now is how my confidence will grow day after day.",
    spokenLines: [
      "Today's quote says: 'The journey of a thousand miles begins with a single step' by Lao Tzu.",
      "What does this quote mean in simple words?",
      "It means that every big goal starts with one small, simple action.",
      "Nobody can jump straight to the finish line.",
      "Real progress only happens when you actually get started.",
      "Why is this idea true in our everyday life?",
      "Because when we delay and wait, our doubts get bigger and bigger.",
      "Taking one small step right now destroys hesitation.",
      "Let me give you a simple real-life example.",
      "When I decided to practice speaking English, I felt nervous on day one.",
      "I worried about grammar mistakes, pauses, and vocabulary.",
      "So I decided to speak out loud for just one minute every morning.",
      "That single small step is how my speaking confidence is growing today.",
      "Do not wait for perfect conditions to speak up.",
      "Take your single step today, speak out loud, and keep going!",
    ],
    keyVocabulary: [
      { word: "Intimidating", meaning: "Frightening or making someone feel hesitant", exampleSentence: "Big projects can feel intimidating at first." },
      { word: "Progress", meaning: "Movement toward a refined goal", exampleSentence: "Consistent daily effort leads to steady progress." },
    ],
  },
  {
    day: 2,
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    theme: "Perseverance",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "This quote reminds us that facing a hard challenge often feels overwhelming at the start. It is true because our doubts magnify difficulties until we actually complete the work. For example, remembering when you first learned to ride a bicycle—balancing seemed impossible until one afternoon you realized you were pedaling on your own.",
    keyVocabulary: [
      { word: "Overwhelming", meaning: "Very great in amount or intensity", exampleSentence: "A new language can feel overwhelming before you practice." },
      { word: "Magnify", meaning: "To make something appear larger than it is", exampleSentence: "Fear can magnify small hurdles into giant barriers." },
    ],
  },
  {
    day: 3,
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    theme: "Learning",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "Einstein tells us that tough situations are not just problems; they are hidden chances to grow and invent better solutions. This is true because smooth times rarely force us to adapt or learn new skills. For instance, when a project unexpectedly falls apart at work, redesigning it from scratch often leads to a much more creative result.",
    keyVocabulary: [
      { word: "Opportunity", meaning: "A set of circumstances making something possible", exampleSentence: "Every mistake is an opportunity to improve." },
      { word: "Adapt", meaning: "To adjust or modify to fit new conditions", exampleSentence: "Successful speakers adapt to unexpected questions." },
    ],
  },
  {
    day: 4,
    quote: "Kindness is a language which the deaf can hear and the blind can see.",
    author: "Mark Twain",
    theme: "Kindness",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "Twain means that genuine kindness transcends physical senses and spoken words—everyone feels it in their heart. This is true because compassion is universal and connects all human beings regardless of background. For example, offering your seat on a crowded train to an elderly person requires zero conversation, yet both people instantly feel mutual warmth.",
    keyVocabulary: [
      { word: "Transcend", meaning: "To go beyond the normal limits of something", exampleSentence: "Kindness transcends language barriers." },
      { word: "Compassion", meaning: "Sympathetic concern for the sufferings of others", exampleSentence: "Showing compassion makes any conversation safer." },
    ],
  },
  {
    day: 5,
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    theme: "Action",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "This quote urges us not to wait for perfect conditions before taking action. It is true because waiting for ideal resources is often just an excuse for procrastination. For instance, you don't need a professional studio to speak English fluently; you can start speaking right here with your phone for 60 seconds every morning.",
    keyVocabulary: [
      { word: "Procrastination", meaning: "The act of delaying or postponing something", exampleSentence: "Daily speaking exercises defeat procrastination." },
      { word: "Resources", meaning: "Assets or supplies that can be drawn on", exampleSentence: "Use the resources currently available to you." },
    ],
  },
  {
    day: 6,
    quote: "Failure is simply the opportunity to begin again, this time more intelligently.",
    author: "Henry Ford",
    theme: "Failure",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "Henry Ford explains that a mistake is not a final stop, but useful feedback for your next attempt. This is true because failure reveals exact flaws that theory cannot predict. For example, if you stumble over a specific word while talking, you now know exactly what word to pronounce again tomorrow.",
    keyVocabulary: [
      { word: "Intelligently", meaning: "In a sensible and well-thought-out manner", exampleSentence: "Plan your second attempt intelligently using previous lessons." },
      { word: "Stumble", meaning: "To make a mistake or hesitate while speaking", exampleSentence: "It is natural to stumble when building vocal stamina." },
    ],
  },
  {
    day: 7,
    quote: "Time you enjoy wasting is not wasted time.",
    author: "Marthe Troly-Curtin",
    theme: "Time",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "This means that moments dedicated to recharging your soul and enjoying life have real value, even if they produce no tangible work. This is true because constant productivity without rest causes burnout. For example, sitting quietly in a sunny park reading a book might look unproductive, but it restores your mental energy for the week ahead.",
    keyVocabulary: [
      { word: "Productivity", meaning: "The effectiveness of productive effort", exampleSentence: "Rest is a necessary foundation for long-term productivity." },
      { word: "Burnout", meaning: "State of emotional, physical, and mental exhaustion", exampleSentence: "Taking regular breaks prevents cognitive burnout." },
    ],
  },
  {
    day: 8,
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    theme: "Confidence",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "This quote reminds us that staying silent or refusing to try guarantees zero chance of success. This is true because only by participating do the laws of probability work in your favor. For example, in an international meeting, if you never raise your hand to speak, no one will ever hear your great ideas.",
    keyVocabulary: [
      { word: "Guarantees", meaning: "Provides a formal promise or certainty", exampleSentence: "Silence guarantees that your perspective stays unheard." },
      { word: "Probability", meaning: "The extent to which something is likely to happen", exampleSentence: "Taking regular shots raises the probability of a win." },
    ],
  },
  {
    day: 9,
    quote: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    theme: "Learning",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "Da Vinci teaches us that making complex ideas simple and clear requires the highest level of mastery. This is true because anyone can complicate an explanation, but clarity demands deep understanding. For example, the best public speakers use short, punchy sentences instead of complicated jargon so everyone in the room understands.",
    keyVocabulary: [
      { word: "Sophistication", meaning: "Refinement, elegance, or advanced development", exampleSentence: "True sophistication lies in clear, unpretentious speech." },
      { word: "Jargon", meaning: "Special words or expressions difficult for others to understand", exampleSentence: "Avoid confusing jargon when explaining your thoughts." },
    ],
  },
  {
    day: 10,
    quote: "Courage is not the absence of fear, but the triumph over it.",
    author: "Nelson Mandela",
    theme: "Courage",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "Mandela explains that brave people still feel nervousness and fear, but they decide to step forward regardless. This is true because fear is a natural biological reaction to unfamiliar situations. For instance, your hands might tremble before giving a presentation in English, but pressing the microphone button and speaking anyway is true courage.",
    keyVocabulary: [
      { word: "Triumph", meaning: "A great victory or achievement", exampleSentence: "Speaking in public is a personal triumph over doubt." },
      { word: "Absence", meaning: "The state of being away or nonexistent", exampleSentence: "Courage does not mean the absence of natural worry." },
    ],
  },
  {
    day: 11,
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant (summarizing Aristotle)",
    theme: "Hard Work",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "This quote shows that greatness is built through small daily rituals, not by a single rare stroke of genius. It is true because consistency compounds over time to reshape our brain and skills. For example, speaking out loud for just sixty seconds every single morning will make you far more fluent than studying grammar for hours once a month.",
    keyVocabulary: [
      { word: "Excellence", meaning: "The quality of being outstanding or extremely good", exampleSentence: "Fluency is excellence achieved through daily repetition." },
      { word: "Compounds", meaning: "Increases or builds up at an accelerating rate", exampleSentence: "Small daily practice compounds into effortless speech." },
    ],
  },
  {
    day: 12,
    quote: "A person who never made a mistake never tried anything new.",
    author: "Albert Einstein",
    theme: "Learning",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "Einstein tells us that errors are proof of exploration and ambition. This is true because entering unfamiliar territory always leads to unexpected missteps. For example, when you mispronounce a new English phrase, it simply proves you are expanding your vocabulary beyond your comfort zone.",
    keyVocabulary: [
      { word: "Missteps", meaning: "Clumsy or wrong steps; minor mistakes", exampleSentence: "Early missteps are an essential part of learning." },
      { word: "Exploration", meaning: "The action of traveling through or learning an unfamiliar area", exampleSentence: "Spoken exploration unlocks conversational fluency." },
    ],
  },
  {
    day: 13,
    quote: "Gratitude turns what we have into enough.",
    author: "Melody Beattie",
    theme: "Gratitude",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "This quote teaches that being thankful for our current blessings brings peace and contentment. It is true because constantly craving what we lack leaves us perpetually dissatisfied. For instance, appreciating your current ability to speak two languages changes your mindset from frustration into genuine celebration.",
    keyVocabulary: [
      { word: "Contentment", meaning: "A state of happiness and satisfaction", exampleSentence: "Daily gratitude fosters mental calmness and contentment." },
      { word: "Perpetually", meaning: "In a way that continues without stopping", exampleSentence: "Comparing yourself to others leaves you perpetually stressed." },
    ],
  },
  {
    day: 14,
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    theme: "Confidence",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "Roosevelt suggests that our own self-doubt holds us back far more than any external barrier. This is true because when our mind expects failure, we hold back our genuine effort. For example, if you believe you will never be fluent, you won't bother speaking; but when you discard that doubt, you discover rapid improvement.",
    keyVocabulary: [
      { word: "Realization", meaning: "The fulfillment or achievement of something planned", exampleSentence: "Self-belief accelerates the realization of your speaking potential." },
      { word: "External", meaning: "Belonging to or forming the outer surface or outside", exampleSentence: "Do not let external opinions define your internal goals." },
    ],
  },
  {
    day: 15,
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    theme: "Action",
    bracket: 1,
    targetSeconds: 60,
    cues: [
      "What does this quote mean?",
      "Why is it true?",
      "Give a real-life example.",
    ],
    modelAnswer:
      "Picasso highlights that thinking, planning, and dreaming are completely meaningless without physical execution. This is true because only action interacts with reality and creates results. For example, you can read ten grammar textbooks, but speaking words out loud into this microphone is the real action that builds muscle memory.",
    keyVocabulary: [
      { word: "Foundational", meaning: "Serving as a basic and essential foundation", exampleSentence: "Speaking aloud is the foundational habit of language learning." },
      { word: "Execution", meaning: "The carrying out or performance of something", exampleSentence: "Great ideas mean nothing without consistent daily execution." },
    ],
  },

  // --- PHASE 2: Days 16-30 (Target: 2 minutes, Stamina Building, Cues Hidden by Default) ---
  {
    day: 16,
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    theme: "Perseverance",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "What is the deeper meaning?",
      "Why does speed matter less than persistence?",
      "How does this apply to your own goals?",
    ],
    modelAnswer:
      "Confucius reminds us of a fundamental truth: consistency always outperforms erratic speed. In our fast-paced modern world, people often get discouraged when they don't see overnight transformations. But whether you run a marathon or learn a new language, the real victory comes from moving forward a few inches every single day. Even when you are tired or make grammatical errors, keeping up the momentum guarantees that you will eventually reach your destination.",
    keyVocabulary: [
      { word: "Erratic", meaning: "Not even or regular in pattern or movement", exampleSentence: "Consistent calm practice is better than erratic bursts of study." },
      { word: "Momentum", meaning: "The strength or force gained through development", exampleSentence: "Completing each day maintains positive momentum." },
    ],
  },
  {
    day: 17,
    quote: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    author: "Buddha",
    theme: "Focus",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "What does this quote advise about attention?",
      "Why do regrets and anxieties drain our energy?",
      "Give an example of present-moment focus while speaking.",
    ],
    modelAnswer:
      "Buddha points our attention to the only moment we ever have actual control over: right now. When we dwell on past mistakes, we feel shame; when we obsess over future uncertainties, we feel anxiety. Both steal our mental clarity. When speaking in a foreign tongue, if you keep worrying about a mistake you made three seconds ago, you stumble on your next sentence. Instead, staying fully immersed in the word you are speaking right now unlocks spontaneous fluency.",
    keyVocabulary: [
      { word: "Immersed", meaning: "Deeply involved or absorbed in something", exampleSentence: "Stay immersed in the present conversation without distraction." },
      { word: "Spontaneous", meaning: "Performed or occurring as a result of a sudden impulse", exampleSentence: "Present-moment focus enables spontaneous, natural speech." },
    ],
  },
  {
    day: 18,
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    theme: "Confidence",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "Why is self-belief considered half the battle?",
      "How does psychology affect vocal delivery?",
      "Share an experience where confidence shifted the outcome.",
    ],
    modelAnswer:
      "Roosevelt captures the psychological truth of human performance: confidence sets the ceiling for what your skills can achieve. When you walk into a room doubting your own voice, your body tenses, your breathing becomes shallow, and you hesitate before speaking. But when you foster quiet self-belief, your posture opens, your vocal resonance expands, and listeners naturally trust your message. Believing in your ability is the spark that turns knowledge into effective communication.",
    keyVocabulary: [
      { word: "Resonance", meaning: "A deep, full, and reverberating sound", exampleSentence: "Calm breathing gives your voice richer resonance." },
      { word: "Foster", meaning: "Encourage the development of something desirable", exampleSentence: "Daily speaking exercises foster genuine self-assurance." },
    ],
  },
  {
    day: 19,
    quote: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    theme: "Learning",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "Why is humility essential for learning?",
      "How does intellectual pride block growth?",
      "How can an English learner embrace not knowing everything?",
    ],
    modelAnswer:
      "Socrates emphasizes intellectual humility as the true gateway to wisdom. When someone believes they already know everything, their ears close and curiosity dies. But when we acknowledge our limitations, we stay receptive to new vocabulary, pronunciation corrections, and fresh cultural viewpoints. As language learners, accepting that we will sometimes misuse a word frees us from perfectionism and invites rapid personal expansion.",
    keyVocabulary: [
      { word: "Humility", meaning: "A modest or low view of one's own importance", exampleSentence: "Humility allows you to welcome constructive feedback." },
      { word: "Receptive", meaning: "Willing to consider or accept new suggestions and ideas", exampleSentence: "An open mind remains receptive to corrective feedback." },
    ],
  },
  {
    day: 20,
    quote: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    theme: "Courage",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "What lies beyond our comfort zone?",
      "Why is fear often a signpost toward growth?",
      "Describe a personal breakthrough that followed a scary step.",
    ],
    modelAnswer:
      "This quote reminds us that comfort rarely leads to extraordinary accomplishments. Fear is not necessarily a warning to turn back; often, it is a compass pointing toward the exact challenge we must embrace. Whether it is asking for a promotion, moving to a new country, or speaking in public, the temporary discomfort is the price of admission for long-term mastery.",
    keyVocabulary: [
      { word: "Accomplishment", meaning: "Something that has been achieved successfully", exampleSentence: "Mastering spoken English is a lifelong accomplishment." },
      { word: "Admission", meaning: "The fee, permission, or willingness required to enter", exampleSentence: "Willingness to feel nervous is the price of admission to fluency." },
    ],
  },
  {
    day: 21,
    quote: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    theme: "Action",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "How do daily choices shape tomorrow's reality?",
      "Why is passive hoping ineffective?",
      "What action are you taking today for your future self?",
    ],
    modelAnswer:
      "Gandhi underscores the direct causal link between current actions and future outcomes. Many people spend years daydreaming about becoming articulate speakers, yet they do not practice a single sentence today. Tomorrow is never an independent event—it is the direct harvest of the seeds planted this afternoon. By showing up and speaking right now, you are building the articulate person you will be months from today.",
    keyVocabulary: [
      { word: "Articulate", meaning: "Having or showing the ability to speak fluently and coherently", exampleSentence: "She grew into an articulate and persuasive presenter." },
      { word: "Harvest", meaning: "The result or consequence of a period of activity", exampleSentence: "Fluent speech is the harvest of daily vocal practice." },
    ],
  },
  {
    day: 22,
    quote: "Hardships often prepare ordinary people for an extraordinary destiny.",
    author: "C.S. Lewis",
    theme: "Perseverance",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "How do obstacles build resilience?",
      "Why does smooth sailing fail to build character?",
      "Give an example of someone whose struggles created greatness.",
    ],
    modelAnswer:
      "C.S. Lewis offers comfort and perspective for difficult seasons in life. Setbacks, failures, and hardships are not pointless suffering; they are the crucible where mental toughness and deep empathy are forged. Just as muscles grow stronger under resistance, our communication skills sharpen when we push through stuttering, nervous sweat, and self-doubt until eloquence becomes natural.",
    keyVocabulary: [
      { word: "Crucible", meaning: "A situation of severe trial leading to something new", exampleSentence: "Challenging speaking environments are the crucible of poise." },
      { word: "Eloquence", meaning: "Fluent or persuasive speaking or writing", exampleSentence: "True eloquence emerges when clarity meets genuine passion." },
    ],
  },
  {
    day: 23,
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    theme: "Learning",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "Why is self-education the highest-yielding asset?",
      "How does learning a global language open doors?",
      "Give an example of how knowledge created opportunities for you.",
    ],
    modelAnswer:
      "Franklin uses financial terminology to illustrate a profound life principle: money and material possessions can be lost or stolen, but knowledge and communicative skills remain yours forever. Investing time into English fluency pays continuous dividends—it grants access to global literature, international job opportunities, and enriching friendships across borders.",
    keyVocabulary: [
      { word: "Dividends", meaning: "Benefits or gains from an expenditure of effort", exampleSentence: "Daily speaking exercises pay dividends in every job interview." },
      { word: "Enriching", meaning: "Improving or enhancing the quality or value of something", exampleSentence: "Cross-cultural friendships are among life's most enriching gifts." },
    ],
  },
  {
    day: 24,
    quote: "Be kind whenever possible. It is always possible.",
    author: "Dalai Lama",
    theme: "Kindness",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "Why is kindness always an available choice?",
      "How does kindness de-escalate workplace conflict?",
      "Give an example of a moment where choosing kindness was hard but powerful.",
    ],
    modelAnswer:
      "The Dalai Lama challenges the common excuse that stressful circumstances excuse rude behavior. While we cannot always control external chaos, our response to other human beings remains entirely in our hands. Choosing kindness does not mean weakness or surrender; it requires immense inner discipline and emotional maturity, especially when resolving disagreements.",
    keyVocabulary: [
      { word: "De-escalate", meaning: "Reduce the intensity of a conflict or crisis", exampleSentence: "A calm, kind tone de-escalates heated workplace arguments." },
      { word: "Maturity", meaning: "The state of being mature and emotionally developed", exampleSentence: "Patience with language mistakes displays genuine maturity." },
    ],
  },
  {
    day: 25,
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    theme: "Action",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "Why do endless plans become a trap?",
      "How does immediate execution clear mental clutter?",
      "Share an example of when taking action unlocked progress.",
    ],
    modelAnswer:
      "Walt Disney was a master creator who knew that the world is filled with brilliant ideas that never leave the drawing board. Talking about doing something gives a false dopamine reward that tricks the mind into feeling productive. True breakthroughs only occur when you silence the theoretical debates and take the first concrete action.",
    keyVocabulary: [
      { word: "Execution", meaning: "The carrying out of a plan or course of action", exampleSentence: "Execution matters infinitely more than endless brainstorming." },
      { word: "Breakthrough", meaning: "A sudden, dramatic, and important development", exampleSentence: "Daily voice practice leads to an unexpected speaking breakthrough." },
    ],
  },
  {
    day: 26,
    quote: "If you want to lift yourself up, lift up someone else.",
    author: "Booker T. Washington",
    theme: "Kindness",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "How does helping others elevate our own state?",
      "Why is mutual support superior to solitary competition?",
      "Describe a time you felt fulfilled by encouraging another person.",
    ],
    modelAnswer:
      "Booker T. Washington presents an inspiring antidote to self-absorbed ambition. When we encourage a peer, share helpful advice, or cheer on a nervous teammate, our own self-worth and confidence naturally rise. Great communicators do not use words to dominate a room; they use their speech to make others feel seen, heard, and empowered.",
    keyVocabulary: [
      { word: "Antidote", meaning: "Something that counteracts an unpleasant feeling", exampleSentence: "Generosity is the best antidote to anxiety." },
      { word: "Empowered", meaning: "Made stronger and more confident in controlling life", exampleSentence: "Encouraging speech leaves listeners feeling empowered." },
    ],
  },
  {
    day: 27,
    quote: "What we achieve inwardly will change outer reality.",
    author: "Plutarch",
    theme: "Confidence",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "How does internal mindset shape the physical world?",
      "Why must internal clarity precede external eloquence?",
      "Share how working on self-talk improved your daily performance.",
    ],
    modelAnswer:
      "Plutarch highlights that external reality is largely a mirror of our internal state of being. If you cultivate clarity, resilience, and calm inside your mind, your speech and body language will naturally radiate authority and warmth. Master your inner thoughts first, and your spoken words will command attention and respect.",
    keyVocabulary: [
      { word: "Eloquence", meaning: "Fluent, graceful, and persuasive expression", exampleSentence: "Inner calm is the prerequisite for spoken eloquence." },
      { word: "Radiate", meaning: "To clearly emit or show an emotion or quality", exampleSentence: "Confident posture radiates calm reassurance to an audience." },
    ],
  },
  {
    day: 28,
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    theme: "Hard Work",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "Why is starting the most friction-filled part of any journey?",
      "How does micro-action dissolve overwhelm?",
      "What simple task did you conquer by just starting today?",
    ],
    modelAnswer:
      "Mark Twain points out that the heaviest weight of any task is overcoming initial inertia. Once a flywheel starts turning, maintaining motion requires much less effort than starting from a dead stop. Break your ambitious English speaking goal into a tiny micro-action—sixty seconds of speech each morning—and inertia turns into unstoppable forward momentum.",
    keyVocabulary: [
      { word: "Inertia", meaning: "A tendency to do nothing or to remain unchanged", exampleSentence: "Overcoming inertia is the hardest part of building any new habit." },
      { word: "Flywheel", meaning: "A revolving wheel used to store momentum", exampleSentence: "Each recorded speech spins your fluency flywheel faster." },
    ],
  },
  {
    day: 29,
    quote: "Do not let what you cannot do interfere with what you can do.",
    author: "John Wooden",
    theme: "Focus",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "Why is focusing on our locus of control so empowering?",
      "How can language learners avoid obsessing over accents?",
      "Give an example of choosing constructive action over useless worry.",
    ],
    modelAnswer:
      "Legendary coach John Wooden encourages us to focus exclusively on variables we control. You cannot control your native accent overnight, nor can you instantly absorb fifty thousand vocabulary words. But you CAN control your daily practice, your willingness to speak up in meetings, and your attitude toward mistakes. Focusing on actionable effort yields real power.",
    keyVocabulary: [
      { word: "Variables", meaning: "Factors or elements likely to change", exampleSentence: "Focus your energy solely on the variables within your control." },
      { word: "Locus", meaning: "A central place or position where something happens", exampleSentence: "Developing an internal locus of control builds lasting resilience." },
    ],
  },
  {
    day: 30,
    quote: "Small deeds done are better than great deeds planned.",
    author: "Peter Marshall",
    theme: "Action",
    bracket: 2,
    targetSeconds: 120,
    cues: [
      "Why is a small reality superior to a magnificent fantasy?",
      "How does consistent small output create mastery?",
      "Reflect on completing Phase 2 and 30 days of consistent effort.",
    ],
    modelAnswer:
      "Peter Marshall delivers a refreshing reminder of the superiority of humble reality over grand intentions. Planning to read ten novels or deliver a TED talk is meaningless if left unfinished. But completing 30 days of spoken English reflections right here represents a real, tangible transformation. Small daily deeds compound into extraordinary lifelong competence.",
    keyVocabulary: [
      { word: "Competence", meaning: "The ability to do something successfully or efficiently", exampleSentence: "Daily vocal practice produces conversational competence." },
      { word: "Tangible", meaning: "Perceptible by touch; clear, definite, and real", exampleSentence: "Recorded audio files provide tangible proof of your vocal growth." },
    ],
  },

  // --- PHASE 3: Days 31-45 (Target: 3 minutes, Perspective, Opinions & Deeper Meaning) ---
  {
    day: 31,
    quote: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    theme: "Perseverance",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "What is the deeper philosophical premise behind this quote?",
      "How does a strong personal purpose fuel endurance through adversity?",
      "Share your core 'why' for mastering spoken English and public expression.",
    ],
    modelAnswer:
      "Nietzsche argues that human suffering and hardship become bearable when anchored in a profound sense of purpose. When someone lacks meaning, even trivial discomforts make them quit. But when your purpose is crystal clear—such as providing for your family, sharing a vital message with the world, or unlocking international career freedom—the friction of daily practice and awkward pauses becomes entirely worthwhile.",
    keyVocabulary: [
      { word: "Anchored", meaning: "Securely fastened or based strongly on something", exampleSentence: "A speaker anchored in core values projects undeniable sincerity." },
      { word: "Adversity", meaning: "Difficulties or misfortune", exampleSentence: "Purpose turns temporary adversity into purposeful character building." },
    ],
  },
  {
    day: 32,
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    theme: "Learning",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "Why is self-reflection necessary for conscious living?",
      "How do automatic assumptions trap people in unfulfilling routines?",
      "How has expanding quotes out loud shifted your own worldview?",
    ],
    modelAnswer:
      "Socrates challenged ancient Athens to stop sleepwalking through existing traditions and start examining their motives and beliefs. Living unconsciously means adopting the fears, opinions, and prejudices of whoever surrounds us. By stepping up to the microphone every day and articulating your thoughts on classic philosophy, you examine your mind and reclaim conscious ownership over your life.",
    keyVocabulary: [
      { word: "Articulating", meaning: "Expressing an idea or feeling fluently and coherently", exampleSentence: "Articulating complex thoughts aloud forces mental clarity." },
      { word: "Prejudices", meaning: "Preconceived opinions not based on reason or experience", exampleSentence: "Critical examination dissolves inherited prejudices." },
    ],
  },
  {
    day: 33,
    quote: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    theme: "Confidence",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "What does mortality teach us about living authentically?",
      "Why is people-pleasing a tragic misuse of time?",
      "Give an opinion on balancing societal expectations with personal ambition.",
    ],
    modelAnswer:
      "In his Stanford commencement address, Steve Jobs used the inevitability of death as an equalizer that strips away superficial vanity and societal expectations. Too many people spend their careers pursuing credentials, lifestyles, and titles merely to impress relatives or peers. Remembering our brief lifespan grants the courage to follow genuine curiosity and speak our honest truth without apology.",
    keyVocabulary: [
      { word: "Authentically", meaning: "In a way that is genuine and true to one's own personality", exampleSentence: "Speaking authentically resonates far deeper than polished scripts." },
      { word: "Superficial", meaning: "Existing or occurring at the surface; not thorough", exampleSentence: "Focus on real communication rather than superficial perfection." },
    ],
  },
  {
    day: 34,
    quote: "Waste no more time arguing what a good man should be. Be one.",
    author: "Marcus Aurelius",
    theme: "Action",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "Why do moral debates often substitute for real moral courage?",
      "How does Stoic philosophy emphasize immediate character demonstration?",
      "Give an example where exemplary action resolved a conflict better than debate.",
    ],
    modelAnswer:
      "Roman Emperor Marcus Aurelius was writing to himself in his private journal, reprimanding his mind for over-intellectualizing ethics instead of embodying them. It is easy to write social media essays about virtue, integrity, and diligence. It is much harder to walk into a room, treat a difficult person with kindness, and do the necessary work without seeking praise. Embody your principles through daily deeds.",
    keyVocabulary: [
      { word: "Embodying", meaning: "Giving a tangible or visible form to an idea or concept", exampleSentence: "Embodying patience is more convincing than lecturing about it." },
      { word: "Diligence", meaning: "Careful and persistent work or effort", exampleSentence: "Quiet diligence speaks louder than boastful promises." },
    ],
  },
  {
    day: 35,
    quote: "Comparison is the thief of joy.",
    author: "Theodore Roosevelt",
    theme: "Confidence",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "Why does comparing our behind-the-scenes to others' highlight reels rob peace?",
      "How does comparison hinder personal development in public speaking?",
      "What is the healthiest benchmark against which to measure yourself?",
    ],
    modelAnswer:
      "Roosevelt identifies comparison as a toxic habit that destroys gratitude and self-worth. When we compare our beginner stages to someone else's tenth year of public speaking, we inevitably feel inadequate. The only rational benchmark in life is comparing yourself today against who you were yesterday. If your English is clearer today than it was thirty days ago, you are winning your own race.",
    keyVocabulary: [
      { word: "Inadequate", meaning: "Lacking the quality or quantity required; insufficient", exampleSentence: "Unfair comparisons make capable people feel inadequate." },
      { word: "Benchmark", meaning: "A standard or point of reference against which things may be compared", exampleSentence: "Use your own past recordings as the primary benchmark." },
    ],
  },
  {
    day: 36,
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    theme: "Focus",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "How does distinguishing between internal and external events create calm?",
      "Why is emotional sovereignty crucial when speaking under pressure?",
      "Share a situation where shifting your perspective neutralized panic.",
    ],
    modelAnswer:
      "This Stoic principle lies at the core of emotional resilience. We cannot dictate flight delays, market crashes, or how an interviewer evaluates our accent. But we possess total authority over our internal narrative, our breath, and our chosen response. When you step onto a stage or join an important call, anchoring your mind in this realization replaces stage fright with serene poise.",
    keyVocabulary: [
      { word: "Sovereignty", meaning: "Supreme power or autonomous authority", exampleSentence: "Emotional sovereignty means outside criticism cannot shatter your composure." },
      { word: "Serene", meaning: "Calm, peaceful, and untroubled", exampleSentence: "A serene tone of voice reassures everyone in the meeting." },
    ],
  },
  {
    day: 37,
    quote: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    theme: "Learning",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "Why must self-knowledge precede worldly mastery?",
      "How does understanding your personal communication blind spots help you improve?",
      "Give an example of an insight about your speaking style gained this month.",
    ],
    modelAnswer:
      "Aristotle asserts that true intelligence begins with self-awareness. Without knowing your strengths, triggers, cognitive biases, and communication tendencies, external knowledge remains superficial. By listening to your own recorded voice and tracking filler words, you cultivate honest self-awareness that transforms you into a conscious, persuasive communicator.",
    keyVocabulary: [
      { word: "Awareness", meaning: "Knowledge or perception of a situation or fact", exampleSentence: "Self-awareness is the first step toward eliminating filler words." },
      { word: "Persuasive", meaning: "Good at convincing someone to do or believe something", exampleSentence: "Clear, grounded speech makes your arguments persuasive." },
    ],
  },
  {
    day: 38,
    quote: "To improve is to change; to be perfect is to change often.",
    author: "Winston Churchill",
    theme: "Hard Work",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "Why is willingness to evolve essential for sustained excellence?",
      "How does rigid thinking doom organizations and individuals?",
      "Describe how your approach to spoken English has adapted over time.",
    ],
    modelAnswer:
      "Churchill challenges the human instinct to cling to familiar routines. Stagnation is comfortable, but true mastery requires continuous iteration, feedback, and refinement. When you welcome corrections to your pronunciation and experiment with new cadence and storytelling techniques, you evolve toward genuine mastery.",
    keyVocabulary: [
      { word: "Stagnation", meaning: "The state of not flowing or moving; lack of growth", exampleSentence: "Repeating the same routine without challenge breeds stagnation." },
      { word: "Iteration", meaning: "The repetition of a process in order to generate improvements", exampleSentence: "Each speaking session is an iteration toward conversational ease." },
    ],
  },
  {
    day: 39,
    quote: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    theme: "Focus",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "Why does chasing external validation never produce lasting peace?",
      "How does vocal calmness influence an entire room?",
      "Share how you cultivate internal equilibrium before important conversations.",
    ],
    modelAnswer:
      "Buddha teaches that searching for contentment in applause, promotions, or external approval is a perpetual wild goose chase. Circumstances constantly shift. Lasting composure must be generated from an internal reservoir of self-acceptance and quiet purpose. When you speak from that centered space, your voice naturally carries weight and calming authority.",
    keyVocabulary: [
      { word: "Equilibrium", meaning: "A state in which opposing forces or influences are balanced", exampleSentence: "Deep breathing maintains emotional equilibrium during tough interviews." },
      { word: "Reservoir", meaning: "A large or extra supply of something", exampleSentence: "Tap into an inner reservoir of calm before speaking." },
    ],
  },
  {
    day: 40,
    quote: "If you judge people, you have no time to love them.",
    author: "Mother Teresa",
    theme: "Kindness",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "Why is judgment the enemy of empathy and connection?",
      "How does an open, non-judgmental stance make you a better listener?",
      "Describe an instance where setting aside preconceptions uncovered a deep bond.",
    ],
    modelAnswer:
      "Mother Teresa reminds us of the emotional tax of constant criticism. When we look at colleagues, neighbors, or strangers through a lens of judgment, our heart closes and defensiveness takes over. The purpose of human speech is not to rank people, but to build bridges of understanding. Replacing judgment with curious empathy elevates our conversations from superficial banter to heartfelt dialogue.",
    keyVocabulary: [
      { word: "Empathy", meaning: "The ability to understand and share the feelings of another", exampleSentence: "Empathetic communication dissolves defensiveness." },
      { word: "Dialogue", meaning: "A conversation between two or more people", exampleSentence: "Genuine dialogue requires listening without premature judgment." },
    ],
  },
  {
    day: 41,
    quote: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
    theme: "Confidence",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "How does free will triumph over circumstance?",
      "Why is personal responsibility the ultimate liberation?",
      "What definitive decision have you made regarding your voice and future?",
    ],
    modelAnswer:
      "Emerson declares human agency as the supreme sculptor of character. Your birthplace, past failures, or native tongue do not constitute an unchangeable fate. You have the sovereign right every morning to decide how you will speak, how you will handle difficulty, and what values you will stand for. Destiny is not an accident—it is a daily choice.",
    keyVocabulary: [
      { word: "Sculptor", meaning: "An artist who shapes figures; one who molds", exampleSentence: "Daily discipline is the sculptor of lasting character." },
      { word: "Agency", meaning: "The capacity of individuals to act independently and make choices", exampleSentence: "Exercising your agency turns passive learners into active creators." },
    ],
  },
  {
    day: 42,
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    theme: "Perseverance",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "Why are both victory and defeat temporary impostors?",
      "What keeps someone stepping forward after a public setback?",
      "Reflect on a moment you bounced back stronger from disappointment.",
    ],
    modelAnswer:
      "Churchill lived through extraordinary geopolitical highs and catastrophic lows. He recognized that celebrating an achievement as final breeds complacency, while treating a mistake as fatal induces paralysis. True greatness lies solely in your willingness to lace up your shoes and step back into the arena tomorrow with undiminished resolve.",
    keyVocabulary: [
      { word: "Complacency", meaning: "A feeling of smug or uncritical satisfaction with achievements", exampleSentence: "Never let early success tempt you into complacency." },
      { word: "Resolve", meaning: "Firm determination to do something", exampleSentence: "Speaking daily solidifies your resolve to achieve vocal mastery." },
    ],
  },
  {
    day: 43,
    quote: "We do not see things as they are, we see them as we are.",
    author: "Anaïs Nin",
    theme: "Learning",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "How do our mental filters project onto external events?",
      "Why does cultivating self-understanding change our perception of reality?",
      "Share an opinion on how language shapes our cognitive worldview.",
    ],
    modelAnswer:
      "Anaïs Nin articulates how human perception is rarely objective reality—it is an internal projection colored by our fears, memories, and cultural lens. When someone criticizes your speech, hearing it as an attack or as a gift of feedback depends entirely on your own internal state. As you master new English phrases, you expand your perceptual vocabulary and see the world through richer perspectives.",
    keyVocabulary: [
      { word: "Projection", meaning: "The unconscious transfer of one's own desires or emotions onto another", exampleSentence: "Defensive reactions are often an internal projection of insecurity." },
      { word: "Perceptual", meaning: "Relating to the ability to interpret or become aware of something", exampleSentence: "Learning new vocabulary broadens your perceptual horizons." },
    ],
  },
  {
    day: 44,
    quote: "Simplicity is about subtracting the obvious and adding the meaningful.",
    author: "John Maeda",
    theme: "Learning",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "How does editing down words amplify communication power?",
      "Why is concise speech more respectful of an audience's time?",
      "Give an example of transforming a rambling explanation into a crisp statement.",
    ],
    modelAnswer:
      "Design pioneer John Maeda provides a masterclass formula for effective communication. Novice speakers often think fluency means using ten-dollar words and lengthy monologues. In truth, world-class speakers subtract empty filler, cut redundant adjectives, and elevate the core meaningful message. Brevity combined with emotional resonance creates unforgettable impact.",
    keyVocabulary: [
      { word: "Redundant", meaning: "Not or no longer needed or useful; superfluous", exampleSentence: "Cutting redundant filler words sharpens your verbal impact." },
      { word: "Brevity", meaning: "Concise and exact use of words in writing or speech", exampleSentence: "Brevity is the soul of memorable communication." },
    ],
  },
  {
    day: 45,
    quote: "The best preparation for tomorrow is doing your best today.",
    author: "H. Jackson Brown Jr.",
    theme: "Action",
    bracket: 3,
    targetSeconds: 180,
    cues: [
      "Why does future readiness come from today's diligence?",
      "How does this philosophy alleviate performance anxiety?",
      "Reflect on completing Phase 3 and building 3-minute speaking stamina.",
    ],
    modelAnswer:
      "Brown cuts through the fog of anxiety about future exams, presentations, and interviews. You cannot live in tomorrow, nor can you practice for events six months away in a single weekend. Your only honest preparation is pouring your full attention and vocal energy into the speech you are delivering right here today. That cumulative dedication will protect you in any future test.",
    keyVocabulary: [
      { word: "Cumulative", meaning: "Increasing or growing by accumulation or successive additions", exampleSentence: "Cumulative practice transforms hesitations into fluid speech." },
      { word: "Alleviate", meaning: "Make suffering, deficiency, or a problem less severe", exampleSentence: "Focusing on today's drill alleviates future presentation anxiety." },
    ],
  },

  // --- PHASE 4: Days 46-60 (Target: 3-5 minutes, Mini Speeches: Opening, Main Points, Closing) ---
  {
    day: 46,
    quote: "In three words I can sum up everything I've learned about life: it goes on.",
    author: "Robert Frost",
    theme: "Time",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Hook your audience with Frost's three words.",
      "Main Points: Explain resilience through personal and global crises.",
      "Closing: Conclude with an inspiring call to keep moving forward.",
    ],
    modelAnswer:
      "Ladies and gentlemen, consider these three simple words from poet Robert Frost: 'It goes on.' Think about the worst heartbreak, the most embarrassing presentation, or the deepest global crisis you have witnessed. In that moment, the world felt like it had shattered to a halt. Yet the sun rose the following morning, the tides continued their cycle, and life marched on. This insight does not diminish our pain; rather, it offers us immense perspective and reassurance. No matter how deep your current valley, tomorrow brings a new dawn. Hold your head high, speak your truth, and keep marching forward.",
    keyVocabulary: [
      { word: "Diminish", meaning: "Make or become less", exampleSentence: "Perspective does not diminish your feelings, but gives you strength." },
      { word: "Reassurance", meaning: "The action of removing someone's doubts or fears", exampleSentence: "His calm delivery provided immense reassurance to the listeners." },
    ],
  },
  {
    day: 47,
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    theme: "Perseverance",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Challenge the myth of the flawless, unblemished life.",
      "Main Points: Contrast fragile perfectionism with anti-fragile resilience.",
      "Closing: Challenge your listeners to wear their scars as badges of honor.",
    ],
    modelAnswer:
      "Society often glorifies people who appear to glide through life without a single stumble. But Nelson Mandela teaches us that true glory does not belong to the sheltered soul who never tasted defeat. Real glory belongs to the person who has been knocked flat onto the floor, tasted dust, wiped away tears, and stood back up on trembling legs to fight again. Resilience is not about avoiding mistakes; it is about building the psychological muscle that refuses to stay down. Whatever setback you face today, rise once more.",
    keyVocabulary: [
      { word: "Unblemished", meaning: "Not damaged or marked in any way; flawless", exampleSentence: "An unblemished record is often proof of a life lived too cautiously." },
      { word: "Resilience", meaning: "The capacity to recover quickly from difficulties", exampleSentence: "Vocal resilience allows you to recover gracefully from a slip of the tongue." },
    ],
  },
  {
    day: 48,
    quote: "To live is the rarest thing in the world. Most people exist, that is all.",
    author: "Oscar Wilde",
    theme: "Confidence",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Contrast merely existing versus fully, vibrantly living.",
      "Main Points: Discuss fear of social judgment and the beauty of authentic passion.",
      "Closing: Call your listeners to make bold, conscious choices today.",
    ],
    modelAnswer:
      "Oscar Wilde poses an uncomfortable question to every one of us: Are you truly living, or are you merely existing on autopilot? Existing means waking up, scrolling through social media, complying with other people's expectations, and carefully hiding your authentic voice so you never offend anyone. But living requires courage. Living means singing when you want to sing, speaking out loud in a language you love, pursuing bold dreams, and tasting every sensation of this finite existence. Choose to live boldly.",
    keyVocabulary: [
      { word: "Autopilot", meaning: "A state of mind where you act without conscious thought", exampleSentence: "Break out of autopilot by expressing yourself intentionally." },
      { word: "Finite", meaning: "Having limits or bounds; not infinite", exampleSentence: "Our time on earth is finite, so speak what truly matters." },
    ],
  },
  {
    day: 49,
    quote: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
    theme: "Action",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Identify the widespread habit of complaining about external problems.",
      "Main Points: Show how individual character is the only real lever for systemic change.",
      "Closing: Issue a personal challenge to model virtue in one tangible way today.",
    ],
    modelAnswer:
      "It is remarkably easy to criticize society, complain about politics, or point out how toxic conversations have become. Yet Gandhi reminds us that the world is not an abstract entity outside ourselves—it is the sum total of how you and I treat people every day. If you want a more compassionate workplace, start by offering genuine encouragement to your colleagues. If you want a more articulate community, model clear and respectful speech yourself. Transformation begins within.",
    keyVocabulary: [
      { word: "Systemic", meaning: "Relating to a system as a whole, rather than individual parts", exampleSentence: "Individual integrity is the foundation of systemic reform." },
      { word: "Abstract", meaning: "Existing in thought or as an idea but not having a concrete existence", exampleSentence: "Do not debate abstract ideals while neglecting daily kindness." },
    ],
  },
  {
    day: 50,
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    theme: "Learning",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Present the beautiful dual paradox of presence and lifelong learning.",
      "Main Points: Explain how urgency heightens love while curiosity enriches the intellect.",
      "Closing: Affirm that our minds remain forever young when we stay insatiably curious.",
    ],
    modelAnswer:
      "Gandhi offers us a master blueprint for a rich human life through two complementary instructions. The first half urges us to cherish every single hour, forgiving quickly and savoring human connections as if our time is short. The second half urges us never to close our minds or declare ourselves 'done learning.' Whether you are twenty or eighty years old, adopting a beginner's mind toward languages, sciences, and philosophies keeps your spirit vibrant and youthful.",
    keyVocabulary: [
      { word: "Blueprint", meaning: "A design plan or other technical drawing; a guiding framework", exampleSentence: "Curiosity is the blueprint for lifelong mental agility." },
      { word: "Insatiably", meaning: "In a way that cannot be satisfied; with an appetite for more", exampleSentence: "Stay insatiably curious about the world around you." },
    ],
  },
  {
    day: 51,
    quote: "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.",
    author: "Martin Luther King Jr.",
    theme: "Kindness",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Evoke King's timeless imagery of light versus darkness.",
      "Main Points: Demonstrate why retaliatory anger only amplifies destruction.",
      "Closing: Call for proactive love and measured, healing communication.",
    ],
    modelAnswer:
      "Dr. Martin Luther King Jr. articulated one of the most profound physical and spiritual laws of the universe. When a room is plunged into pitch darkness, you cannot swing a stick or shout to make the shadows disappear; you must strike a match. In the exact same way, meeting hostility with louder hostility only burns down the house. True strength lies in breaking the chain of bitterness and answering insult with steady, principled goodwill.",
    keyVocabulary: [
      { word: "Retaliatory", meaning: "Characterized by a desire for revenge or counter-attack", exampleSentence: "Resist the urge to make retaliatory remarks in heated moments." },
      { word: "Principled", meaning: "Acting in accordance with morality and rules of conduct", exampleSentence: "A principled speaker maintains dignity even under attack." },
    ],
  },
  {
    day: 52,
    quote: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson",
    theme: "Courage",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Contrast the safe, well-worn highway with the untamed wilderness.",
      "Main Points: Explain the fear and exhilarating freedom of true original thought.",
      "Closing: Encourage your audience to trust their unique voice and carve their own way.",
    ],
    modelAnswer:
      "Emerson calls for the pioneer spirit inside each human soul. Following existing paths is comfortable—society rewards conformity with safety and predictable approval. But human history was never propelled forward by people who stayed on well-worn tracks. It was shaped by brave pioneers who stepped into the thicket, endured scratches and isolation, and cleared a new path for others to follow. Trust your own intuition, speak your unique perspective, and carve your own trail.",
    keyVocabulary: [
      { word: "Conformity", meaning: "Compliance with standards, rules, or laws; conventionality", exampleSentence: "Blind conformity suffocates creative breakthroughs." },
      { word: "Pioneer", meaning: "A person who is among the first to explore or settle a new area", exampleSentence: "Be a pioneer in your family by mastering a global tongue." },
    ],
  },
  {
    day: 53,
    quote: "Knowing is not enough; we must apply. Willing is not enough; we must do.",
    author: "Johann Wolfgang von Goethe",
    theme: "Action",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Address the widespread illusion of passive intellectual accumulation.",
      "Main Points: Contrast theoretical contemplation with active muscular implementation.",
      "Closing: Challenge listeners to turn one item of intellectual knowledge into action today.",
    ],
    modelAnswer:
      "Goethe skewers the modern intellectual trap: confusing passive consumption with true mastery. Millions of people buy workout programs they never perform, bookmark articles they never reread, and memorize grammar rules they never speak aloud. Knowledge is merely potential energy. It only becomes kinetic power when you open your mouth, take the risk of making an error, and physically apply it in the real world.",
    keyVocabulary: [
      { word: "Kinetic", meaning: "Relating to or resulting from motion", exampleSentence: "Daily voice drills transform potential ability into kinetic fluency." },
      { word: "Consumption", meaning: "The using up of a resource; passive taking in", exampleSentence: "Replace passive video consumption with active vocal creation." },
    ],
  },
  {
    day: 54,
    quote: "You must be the master of your mindset, or your mindset will master you.",
    author: "Unknown / Stoic Proverb",
    theme: "Focus",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Portray the human mind as either a loyal servant or a tyrannical master.",
      "Main Points: Discuss how unmonitored self-talk creates phantom anxieties.",
      "Closing: Present the daily habit of conscious mental training as the ultimate defense.",
    ],
    modelAnswer:
      "The human brain is a magnificent engine, but left untended, it defaults to catastrophizing and seeking comfort. If you do not actively curate your thoughts, feed your mind inspiring literature, and train your voice under pressure, negative narratives will dominate your identity. Mindset mastery is not a one-time revelation; it is daily mental hygiene, practiced every morning when you decide how to speak and carry yourself.",
    keyVocabulary: [
      { word: "Catastrophizing", meaning: "Presuming that the worst possible outcome will happen", exampleSentence: "Catch your brain before catastrophizing a small pronunciation slip." },
      { word: "Curate", meaning: "Select, organize, and look after items in a collection", exampleSentence: "Carefully curate the inputs and thoughts you allow into your mind." },
    ],
  },
  {
    day: 55,
    quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    theme: "Confidence",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Put past regrets and future anxieties into perspective.",
      "Main Points: Reveal the immense untapped human reservoir of courage and eloquence.",
      "Closing: Inspire your listeners to stand tall in the knowledge of their inner fortitude.",
    ],
    modelAnswer:
      "Emerson invites us to look inward rather than constantly obsessing over the past or trembling before the future. The mistakes you made in years past are done; the uncertainties of next year are completely unwritten. What matters infinitely more is the dormant courage, intellect, and resilience residing inside your chest right now. When you awaken that inner strength, no external storm can shake your foundation.",
    keyVocabulary: [
      { word: "Fortitude", meaning: "Courage in pain or adversity", exampleSentence: "True vocal presence is backed by quiet inner fortitude." },
      { word: "Dormant", meaning: "Having normal physical functions suspended or slowed down; asleep", exampleSentence: "Speaking challenges awaken dormant leadership qualities within you." },
    ],
  },
  {
    day: 56,
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    theme: "Hard Work",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Contrast the drudgery of obligation with the fire of genuine passion.",
      "Main Points: Show why love for a craft carries you through the boring plateau periods.",
      "Closing: Urge listeners to seek excellence through genuine affection for the craft.",
    ],
    modelAnswer:
      "Steve Jobs believed that true greatness requires an emotional investment far deeper than merely collecting a paycheck. Every worthwhile pursuit—whether building software, raising children, or mastering spoken English—involves months of tedious repetition and frustrating plateaus. If you don't genuinely love the process of learning and expressing yourself, you will inevitably quit. Fall in love with the craft of speaking, and excellence will take care of itself.",
    keyVocabulary: [
      { word: "Plateau", meaning: "A state of little or no change after a period of activity", exampleSentence: "Plateaus are normal; pushing through them unlocks the next level." },
      { word: "Tedious", meaning: "Too long, slow, or dull; tiresome or monotonous", exampleSentence: "Daily repetition may seem tedious, but it builds effortless fluency." },
    ],
  },
  {
    day: 57,
    quote: "Spread love everywhere you go. Let no one ever come to you without leaving better and happier.",
    author: "Mother Teresa",
    theme: "Kindness",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Define every human encounter as a sacred opportunity to elevate someone.",
      "Main Points: Discuss how words can either drain or energize an atmosphere.",
      "Closing: Challenge yourself to speak with warmth that leaves everyone uplifted.",
    ],
    modelAnswer:
      "Mother Teresa sets an extraordinary benchmark for human communication. Imagine if every conversation you entered left the other person feeling slightly more valued, hopeful, and energized. Your words carry immense weight. With a single thoughtful compliment or attentive, empathetic ear, you can alter the trajectory of someone's day. Use your spoken voice not as an instrument of vanity, but as a vehicle for light.",
    keyVocabulary: [
      { word: "Trajectory", meaning: "The path followed by a projectile or an object through space", exampleSentence: "A kind word can alter the entire emotional trajectory of someone's day." },
      { word: "Vehicle", meaning: "A thing used to express, embody, or fulfill something", exampleSentence: "Let your voice become a vehicle for encouragement and clarity." },
    ],
  },
  {
    day: 58,
    quote: "It is our choices that show what we truly are, far more than our abilities.",
    author: "J.K. Rowling (Albus Dumbledore)",
    theme: "Confidence",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Separate innate talent from moral and behavioral choices.",
      "Main Points: Explain why brilliant ability without courageous choice is wasted.",
      "Closing: Remind your audience that today's small choices define their character.",
    ],
    modelAnswer:
      "This famous line spoken by Professor Dumbledore cuts straight to the heart of human destiny. We are all born with varying natural gifts—some have photogenic smiles, others have musical ears, and some have quick reflexes. Yet raw talent is cheap and meaningless without character. What truly defines your legacy is the choices you make when tired, when frightened, and when nobody is watching. Choose discipline, choose kindness, and choose courage.",
    keyVocabulary: [
      { word: "Innate", meaning: "Inborn; natural; existing from birth", exampleSentence: "Hard work beats innate talent when talent fails to practice." },
      { word: "Legacy", meaning: "The long-lasting impact of particular events or actions", exampleSentence: "Your daily communicative choices create your professional legacy." },
    ],
  },
  {
    day: 59,
    quote: "Look deep into nature, and then you will understand everything better.",
    author: "Albert Einstein",
    theme: "Learning",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Paint the contrast between artificial digital noise and the rhythm of nature.",
      "Main Points: Discuss nature's lessons on seasons, patience, and effortless organic growth.",
      "Closing: Prepare to bridge from day 59's deep reflections into the Day 60 grand milestone.",
    ],
    modelAnswer:
      "Einstein frequently escaped the confines of equations to sail on the water and observe the natural universe. Nature never rushes, yet everything is accomplished. An oak tree does not panic during the winter frosts; a river does not debate whether to bypass an obstacle or wear it down over centuries. When we align our human effort with nature's patient rhythm, we stop demanding instant gratification and learn to trust our steady, organic growth into eloquence.",
    keyVocabulary: [
      { word: "Organic", meaning: "Characterized by continuous or natural development", exampleSentence: "Language acquisition is an organic process of adaptation." },
      { word: "Gratification", meaning: "Pleasure, especially when gained from the satisfaction of a desire", exampleSentence: "Reject instant gratification in favor of deep, lasting mastery." },
    ],
  },
  {
    day: 60,
    quote: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    theme: "Perseverance",
    bracket: 4,
    targetSeconds: 240,
    cues: [
      "Opening: Announce the triumphant completion of 60 days of spoken English practice.",
      "Main Points: Compare your voice on Day 1 with the confident speaker you have become on Day 60.",
      "Closing: Deliver a triumphant closing speech celebrating your vocal transformation.",
    ],
    modelAnswer:
      "Sixty days ago, on Day 1 of this challenge, we stood at the threshold of this exact quote: 'The journey of a thousand miles begins with a single step.' Back then, recording our voice felt nerve-wracking, our vocabulary felt stiff, and pauses felt terrifying. Yet day after day, we showed up. We spoke through hesitation, we confronted our grammar mistakes, and we built vocal stamina second by second. Today, on Day 60, look at what you have accomplished: you are no longer someone who merely dreams of fluency—you are an articulate, confident speaker who can express complex ideas with clarity and passion. Celebrate this milestone, and carry your powerful voice forward into the world!",
    keyVocabulary: [
      { word: "Threshold", meaning: "A point of entry or a beginning", exampleSentence: "You stood at the threshold of fluency and crossed it with courage." },
      { word: "Articulate", meaning: "Able to express thoughts and ideas clearly and effectively", exampleSentence: "Over sixty days of live speaking, you have become truly articulate." },
    ],
  },
];

export function getQuoteForDay(day: number): DailyQuote {
  const normalized = Math.min(60, Math.max(1, day));
  return ALL_60_QUOTES[normalized - 1] || ALL_60_QUOTES[0];
}

/**
 * Returns 10 to 15 simple, easy-to-pronounce spoken lines for reading aloud
 */
export function getSpokenLines(quote: DailyQuote): string[] {
  if (quote.spokenLines && quote.spokenLines.length >= 8) {
    return quote.spokenLines;
  }

  // Generate 10-15 clean spoken lines from model answer
  const rawSentences = quote.modelAnswer
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const lines: string[] = [];
  lines.push(`Today's quote says: "${quote.quote}" by ${quote.author}.`);
  lines.push(`What does this really mean in simple words?`);

  for (const sentence of rawSentences) {
    if (sentence.length > 70 && sentence.includes(',')) {
      const parts = sentence.split(/,\s*/);
      parts.forEach((p, idx) => {
        const clean = p.trim();
        if (clean) {
          lines.push(clean + (idx === parts.length - 1 ? '.' : ','));
        }
      });
    } else {
      lines.push(sentence);
    }
  }

  lines.push(`Why is this idea true in our daily lives?`);
  lines.push(`Because taking action gives us clarity, strength, and momentum.`);
  lines.push(`Always remember this lesson whenever you face a new challenge.`);
  lines.push(`Keep speaking with confidence, and practice every single day!`);

  // Clamp strictly to 10-15 lines
  const finalLines = lines.filter(Boolean);
  if (finalLines.length > 15) {
    return finalLines.slice(0, 15);
  }
  return finalLines;
}
