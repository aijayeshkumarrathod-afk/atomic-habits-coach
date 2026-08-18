/**
 * Default Seed Data for Atomic Habits System
 * Derived from atomic_habits_framework.md
 */
const initialHabitsData = [
  {
    id: "habit-1",
    title: "Healthy Weight Gain Nutrition",
    icon: "🥛",
    category: "Nutrition & Health",
    color: "#10b981", // Emerald accent
    objective: "Gain +5 kg of healthy body weight via consistent daily high-density nutrition.",
    identity: {
      statement: "I am a healthy, nourished person who feeds my body with high-quality fuel every single day.",
      dailyVoteText: "Drink 1 high-calorie smoothie (500–600 kcal) every morning",
      totalVotesCast: 14
    },
    system: "Prepare and drink 1 high-calorie smoothie (500–600 kcal) every morning.",
    plateauMindset: "Weight compounding takes 3–4 weeks to reflect on the scale. Early effort builds energy reserves; results compound over time.",
    habitLoop: {
      cue: "Finishing morning chia seed + lemon water in the kitchen.",
      craving: "Desire to feel energized, well-nourished, and reach target weight.",
      response: "Blend and drink oats + banana + peanut butter + milk smoothie.",
      reward: "Full stomach, sustained morning energy, ticking off Daily Nutrition Vote."
    },
    implementationIntention: "I will prepare and drink my 500-calorie weight gain smoothie at 7:30 AM in the Kitchen.",
    habitStack: "After I finish drinking my chia seed + lemon water, I will immediately prepare and drink my 500-calorie smoothie in the Kitchen.",
    streak: 5,
    lastCompletedDate: null,
    gatewayHabit: "Put ingredients in blender & blend for 30 seconds.",
    commitmentDevice: "Automated recurring weekly grocery order for smoothie supplies.",
    neverMissTwiceRule: "If a smoothie is missed once due to travel/sickness, making the next morning's smoothie is mandatory.",
    accountabilityContract: "Pay $10 instant penalty to accountability partner if smoothie is skipped.",
    actionItems: [
      {
        id: "h1-action-1",
        chapter: "Ch 2: Identity Vote",
        text: "Cast Daily Identity Vote: Drink 500-600 kcal Morning Smoothie",
        completed: false,
        isIdentityVote: true
      },
      {
        id: "h1-action-2",
        chapter: "Ch 4: Pointing & Calling",
        text: "Say Antidote Statement: 'Overthinking doesn't add weight—calories do. Spend 2 mins making smoothie now.'",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-3",
        chapter: "Ch 5: Habit Stack",
        text: "Execute Stack: After morning chia water ➔ Prepare smoothie in kitchen",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-4",
        chapter: "Ch 6: Environment Design",
        text: "Keep blender, oats container & peanut butter on counter in plain sight; prime clean glass",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-5",
        chapter: "Ch 7: Cue Elimination",
        text: "Hide coffee pods & zero-calorie filler snacks until after smoothie is finished",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-6",
        chapter: "Ch 8: Temptation Bundle",
        text: "Watch 10 mins of favorite show/podcast ONLY while drinking smoothie",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-7",
        chapter: "Ch 9: Social Culture",
        text: "Share weekly smoothie streak or recipe photo with accountability buddy",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-8",
        chapter: "Ch 10: Mindset Reframe",
        text: "Reframe: 'I GET to nourish my body with premium fuel & build healthy energy reserves'",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-9",
        chapter: "Ch 11: Motion vs Action",
        text: "Action Over Motion: Execute daily smoothie blend repetition instead of browsing smoothie recipes",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-10",
        chapter: "Ch 12: Law of Least Effort",
        text: "Prime Environment: Pre-measure dry ingredients into blender jar night before (<60 sec morning prep)",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-11",
        chapter: "Ch 13: 2-Minute Rule",
        text: "2-Minute Gateway Habit: Stand at blender & blend ingredients for 30 seconds",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-12",
        chapter: "Ch 14: Commitment & Automation",
        text: "Automated Supply: Recurring weekly automated delivery for oats, peanut butter & frozen fruit",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-13",
        chapter: "Ch 15: Immediate Reward",
        text: "Immediate Reward: Transfer $2 to 'Strength Gear' savings fund immediately after drinking smoothie",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-14",
        chapter: "Ch 16: Habit Tracker & Rule",
        text: "Tracker & Rule: Mark visual daily log. NEVER MISS TWICE—if missed 1 day, next day is mandatory",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h1-action-15",
        chapter: "Ch 17: Habit Contract",
        text: "Habit Contract: Signed pledge with buddy—pay $10 instant penalty if smoothie is skipped without plan",
        completed: false,
        isIdentityVote: false
      }
    ]
  },
  {
    id: "habit-2",
    title: "Home Strength Workout",
    icon: "🏋️",
    category: "Fitness & Muscle",
    color: "#3b82f6", // Electric Blue accent
    objective: "Build muscle mass, strength, and a firm body shape.",
    identity: {
      statement: "I am an active, strong person who builds physical strength daily.",
      dailyVoteText: "Complete 15 minutes of home strength exercises (Push-ups, Squats, Lunges, Plank)",
      totalVotesCast: 11
    },
    system: "Perform a 15-minute bodyweight strength workout at home 4x per week.",
    plateauMindset: "Muscle definition lags behind workout effort. Trust the 15-minute system daily; physical changes compound visibly after 4 weeks.",
    habitLoop: {
      cue: "Finishing washroom reading in the morning.",
      craving: "Desire to feel strong, active, and physically energized.",
      response: "Step into the workout area and perform 15 minutes of strength exercises.",
      reward: "Post-workout muscle pump, energy surge, ticking off Daily Strength Vote."
    },
    implementationIntention: "I will perform my 15-minute home strength workout at 8:00 AM in my Workout Space.",
    habitStack: "After I finish my washroom reading, I will step into my workout space and complete my 15-minute strength routine.",
    gatewayHabit: "Put on workout clothes & execute 5 squats on mat.",
    commitmentDevice: "Smart plug turns on workout lights at 8 AM + calendar block.",
    neverMissTwiceRule: "Move 1 marble into jar after workout; never miss 2 planned sessions in a row.",
    accountabilityContract: "Send 20 penalty push-ups video or pay $10 penalty if workout missed.",
    streak: 3,
    lastCompletedDate: null,
    actionItems: [
      {
        id: "h2-action-1",
        chapter: "Ch 2: Identity Vote",
        text: "Cast Daily Identity Vote: Complete 15-min Home Strength Session",
        completed: false,
        isIdentityVote: true
      },
      {
        id: "h2-action-2",
        chapter: "Ch 4: Pointing & Calling",
        text: "Say Antidote Statement: 'Thinking doesn't build muscle—movement does. Do 2 mins of squats right now.'",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-3",
        chapter: "Ch 5: Habit Stack",
        text: "Execute Stack: After washroom reading ➔ Step into workout space for 15-min routine",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-4",
        chapter: "Ch 6: Environment Design",
        text: "Lay workout mat & clothes outside washroom door the night before; clear physical path",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-5",
        chapter: "Ch 7: Cue Elimination",
        text: "Quarantine phone in drawer on 'Do Not Disturb' before entering workout area",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-6",
        chapter: "Ch 8: Temptation Bundle",
        text: "Listen to high-energy workout playlist strictly while working out + post-workout hot shower",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-7",
        chapter: "Ch 9: Social Culture",
        text: "Share monthly push-up rep increases with gym partner for prestige vote",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-8",
        chapter: "Ch 10: Mindset Reframe",
        text: "Reframe & Ritual: Perform 3-sec ritual (clap hands twice) + 'I GET to build physical power & endorphins'",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-9",
        chapter: "Ch 11: Motion vs Action",
        text: "Action Over Motion: Step onto workout mat and move instead of watching fitness tutorials",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-10",
        chapter: "Ch 12: Law of Least Effort",
        text: "Prime Environment: Keep workout mat unrolled with shoes alongside for zero setup friction",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-11",
        chapter: "Ch 13: 2-Minute Rule",
        text: "2-Minute Gateway Habit: Put on workout gear and execute 5 squats on mat",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-12",
        chapter: "Ch 14: Commitment & Automation",
        text: "Commitment & Automation: Smart plug timer turns on workout lights at 8 AM + locked calendar slot",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-13",
        chapter: "Ch 15: Immediate Reward",
        text: "Immediate Reward: Take refreshing hot shower with premium wash & log post-workout pump photo",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-14",
        chapter: "Ch 16: Habit Tracker & Rule",
        text: "Tracker & Rule: Move 1 marble to 'Strength Built' jar. NEVER MISS TWICE rule enforced",
        completed: false,
        isIdentityVote: false
      },
      {
        id: "h2-action-15",
        chapter: "Ch 17: Habit Contract",
        text: "Habit Contract: Signed pledge—send 20 penalty push-ups video or pay $10 if session missed",
        completed: false,
        isIdentityVote: false
      }
    ]
  }
];
