import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { BookOpen, Zap, X, ChevronDown, Check } from 'lucide-react';

// --- UTILITY FOR DYNAMIC ACCENT COLORS ---
/**
 * Generates Tailwind CSS classes based on a base color (e.g., 'cyan', 'yellow').
 */
const getAccentClasses = (color) => {
  if (!color) return {};
  
  return {
    highlight: `bg-${color}-700/30 text-${color}-300 hover:bg-${color}-600/50`,
    header: `text-${color}-400`,
    button: `bg-${color}-600 hover:bg-${color}-500 text-gray-900 focus:ring-${color}-400 active:bg-${color}-700`,
    border: `border-${color}-500`,
    panelBg: `bg-${color}-900`,
    panelBorder: `border-${color}-500`,
    panelText: `text-${color}-300`,
    panelCloseBg: `bg-${color}-800 hover:bg-${color}-700`,
    panelContentBg: `bg-${color}-950/70`,
  };
};

// --- QUOTE DATA STRUCTURE ---
const AQA_QUOTES = [
  {
    poem: "Ozymandias",
    title: "Ozymandias - Shelley",
    accent: "cyan",
    quotes: [
      {
        id: 1,
        quoteText: "Half sunk, a shattered visage lies, whose frown...",
        segments: [
          { text: "Half sunk, a shattered ", type: "static" },
          {
            text: "visage",
            type: "interactive",
            analysis: "Meaning 'face'. Suggests the sculpture's identity is ruined, reflecting the ruin of Ozymandias's power and legacy. An archaic word for a forgotten ruler.",
          },
          { text: " lies, whose ", type: "static" },
          {
            text: "frown",
            type: "interactive",
            analysis: "The sculptor captured the ruler's arrogance and tyranny. This detail implies the artist's power endures while the ruler's authority does not. Tone of contempt.",
          },
          { text: "...", type: "static" },
        ],
      },
      {
        id: 2,
        quoteText: "The hand that mocked them, and the heart that fed:",
        segments: [
          { text: "The hand that ", type: "static" },
          {
            text: "mocked",
            type: "interactive",
            analysis: "Could mean both 'to imitate' (the sculptor) and 'to ridicule' (the irony of time). This ambiguity gives power to the artist over the subject.",
          },
          { text: " them, and the ", type: "static" },
          {
            text: "heart that fed",
            type: "interactive",
            analysis: "Refers to Ozymandias's passionate but ultimately cruel and self-obsessed personality, which the sculptor expertly captured.",
          },
          { text: ":", type: "static" },
        ],
      },
      {
        id: 3,
        quoteText: "Round the decay of that colossal wreck, boundless and bare",
        segments: [
          { text: "Round the decay / Of that ", type: "static" },
          {
            text: "colossal wreck",
            type: "interactive",
            analysis: "Juxtaposition: 'Colossal' suggests immense size and power, while 'wreck' emphasizes destruction and ruin. A powerful symbol of transience.",
          },
          { text: ", boundless and ", type: "static" },
          {
            text: "bare",
            type: "interactive",
            analysis: "The surrounding desert is empty, contrasting with the ruler's boast, highlighting nature's superiority over human civilization and ego.",
          },
        ],
      },
    ],
  },
  {
    poem: "My Last Duchess",
    title: "My Last Duchess - Browning",
    accent: "yellow",
    quotes: [
      {
        id: 4,
        quoteText: "That piece a wonder, now: Frà Pandolf's hands / Worked busily a day, and there she stands.",
        segments: [
          { text: "That piece a ", type: "static" },
          {
            text: "wonder, now",
            type: "interactive",
            analysis: "The Duke is proud of the art, not the woman. He reduces his deceased wife to an object of aesthetic admiration and control. The painting is perfect because it cannot talk back.",
          },
          { text: ": Frà Pandolf's hands / Worked busily a day, and there she stands.", type: "static" },
        ],
      },
      {
        id: 5,
        quoteText: "Sir, 'twas not / Her husband's presence only, called that spot / Of joy into the Duchess' cheek",
        segments: [
          { text: "Sir, 'twas not / Her husband's presence only, called that ", type: "static" },
          {
            text: "spot / Of joy",
            type: "interactive",
            analysis: "The Duke hated that the Duchess showed 'joy' for simple things like a branch of cherries, suggesting his jealousy and possessiveness. 'Spot' trivialises her emotion.",
          },
          { text: " into the Duchess' cheek", type: "static" },
        ],
      },
      {
        id: 6,
        quoteText: "Notice Neptune, though, / Taming a sea-horse, thought a rarity, / Which Claus of Innsbruck cast in bronze for me!",
        segments: [
          { text: "Notice Neptune, though, / Taming a ", type: "static" },
          {
            text: "sea-horse",
            type: "interactive",
            analysis: "The Duke uses the statue as a metaphor for control. Neptune (a god) taming a sea-horse (a beautiful, wild creature) parallels the Duke's need to 'tame' the Duchess.",
          },
          { text: ", thought a rarity, / Which Claus of Innsbruck cast in bronze for me!", type: "static" },
        ],
      },
    ],
  },
  {
    poem: "The Charge of the Light Brigade",
    title: "Charge of the Light Brigade - Tennyson",
    accent: "green",
    quotes: [
      {
        id: 7,
        quoteText: "Half a league, half a league, / Half a league onward",
        segments: [
          {
            text: "Half a league, half a league, / Half a league onward",
            type: "interactive",
            analysis: "Repetition and dactylic metre mimics the galloping horses, creating a sense of relentless, doomed motion and urgency at the start of the charge.",
          },
        ],
      },
      {
        id: 8,
        quoteText: "Theirs not to make reply, Theirs not to reason why, Theirs but to do and die:",
        segments: [
          { text: "Theirs not to make reply, Theirs not to ", type: "static" },
          {
            text: "reason why",
            type: "interactive",
            analysis: "Emphasizes the soldiers' absolute obedience and lack of agency. Their only duty is unquestioning action, regardless of command error. Establishes the theme of duty and sacrifice.",
          },
          { text: ", Theirs but to do and die:", type: "static" },
        ],
      },
      {
        id: 9,
        quoteText: "Honour the charge they made! / Honour the Light Brigade, / Noble six hundred!",
        segments: [
          {
            text: "Honour",
            type: "interactive",
            analysis: "The imperative verb 'Honour' acts as a command to the reader, ensuring the memory of their bravery and sacrifice lives on, despite the military failure. This is the poem's final purpose.",
          },
          { text: " the charge they made! / Honour the Light Brigade, / Noble six hundred!", type: "static" },
        ],
      },
    ],
  },
  {
    poem: "Exposure",
    title: "Exposure - Owen",
    accent: "gray",
    quotes: [
      {
        id: 10,
        quoteText: "Our brains ache, in the merciless iced east winds that knive us...",
        segments: [
          { text: "Our brains ache, in the ", type: "static" },
          {
            text: "merciless iced east winds that knive us",
            type: "interactive",
            analysis: "Sibilance and personification make the weather an active, hostile enemy, suggesting nature is more deadly than the German soldiers. The verb 'knive' creates a violent image.",
          },
          { text: "...", type: "static" },
        ],
      },
      {
        id: 11,
        quoteText: "Sudden successive flights of bullets streak the silence. / Less deadly than the air that shudders black with snow,",
        segments: [
          { text: "Sudden successive flights of bullets streak the silence. / ", type: "static" },
          {
            text: "Less deadly than the air that shudders black with snow",
            type: "interactive",
            analysis: "The paradoxical idea that the environment is more fatal than enemy fire emphasizes the sheer mental and physical exhaustion caused by the cold. 'Shudders black' suggests death and fear in the atmosphere.",
          },
          { text: ",", type: "static" },
        ],
      },
      {
        id: 12,
        quoteText: "All their eyes are ice, / But nothing happens.",
        segments: [
          { text: "All their eyes are ", type: "static" },
          {
            text: "ice",
            type: "interactive",
            analysis: "Metaphor suggests emotional numbness, exhaustion, and the freezing cold. It implies the soldiers have lost their humanity or are near death.",
          },
          { text: ", / But ", type: "static" },
          {
            text: "nothing happens",
            type: "interactive",
            analysis: "The final chilling anti-climax, repeated throughout the poem, highlights the futility and boredom of trench warfare, contrasting with the expectation of action.",
          },
          { text: ".", type: "static" },
        ],
      },
    ],
  },
  {
    poem: "Storm on the Island",
    title: "Storm on the Island - Heaney",
    accent: "blue",
    quotes: [
      {
        id: 13,
        quoteText: "We are prepared: we build our houses squat, / Sink walls in rock and roof them with good slate.",
        segments: [
          { text: "We are ", type: "static" },
          {
            text: "prepared",
            type: "interactive",
            analysis: "The assertive tone immediately establishes a sense of collective confidence and security, which is quickly undermined by the storm's power.",
          },
          { text: ": we build our houses squat, / Sink walls in rock and roof them with good slate.", type: "static" },
        ],
      },
      {
        id: 14,
        quoteText: "Spits like a tame cat / Turned savage. We just sit tight, / Listening to the thing you know that neither you nor I",
        segments: [
          { text: "Spits like a ", type: "static" },
          {
            text: "tame cat / Turned savage",
            type: "interactive",
            analysis: "Simile showing the wind's initial gentle appearance turning violently aggressive. The domestic image of a 'tame cat' makes the danger feel immediate and personal.",
          },
          { text: ". We just sit tight, / Listening to the thing you know that neither you nor I", type: "static" },
        ],
      },
      {
        id: 15,
        quoteText: "Strange, it is a huge nothing that we fear.",
        segments: [
          { text: "Strange, it is a ", type: "static" },
          {
            text: "huge nothing",
            type: "interactive",
            analysis: "Oxymoron captures the terrifying power of the unseen wind. It is physically nothing, yet the damage and terror it causes are immense ('huge'), relating to fear itself.",
          },
          { text: " that we fear.", type: "static" },
        ],
      },
    ],
  },
  {
    poem: "Bayonet Charge",
    title: "Bayonet Charge - Hughes",
    accent: "orange",
    quotes: [
      {
        id: 16,
        quoteText: "Suddenly he awoke and was running – raw / In raw-seamed hot khaki, his sweat heavy,",
        segments: [
          {
            text: "Suddenly he awoke",
            type: "interactive",
            analysis: "The adverb 'Suddenly' creates immediacy. 'Awoke' implies the soldier was in a daze, suggesting the shock and confusion of battle, where reality is nightmarish.",
          },
          { text: " and was running – ", type: "static" },
          {
            text: "raw / In raw-seamed",
            type: "interactive",
            analysis: "Repetition emphasizes the soldier's exposed, unprepared vulnerability, both physically (clothing) and mentally (emotionally stripped bare).",
          },
          { text: " hot khaki, his sweat heavy,", type: "static" },
        ],
      },
      {
        id: 17,
        quoteText: "King, honour, human dignity, etcetera / Dropped like luxuries in a yelling alarm",
        segments: [
          {
            text: "King, honour, human dignity, etcetera",
            type: "interactive",
            analysis: "The list contains abstract ideals, but 'etcetera' instantly trivializes them. This shows that patriotic concepts are meaningless when survival is the only priority.",
          },
          { text: " / Dropped like ", type: "static" },
          {
            text: "luxuries",
            type: "interactive",
            analysis: "A simile emphasizing the total loss of all civilized values. The only thing left is the primal instinct to survive the immediate danger.",
          },
          { text: " in a yelling alarm", type: "static" },
        ],
      },
      {
        id: 18,
        quoteText: "His terror's touchy dynamite.",
        segments: [
          { text: "His terror's ", type: "static" },
          {
            text: "touchy dynamite",
            type: "interactive",
            analysis: "Metaphor and alliteration. The soldier has been reduced to a weapon, a volatile explosive driven purely by fear. 'Touchy' suggests he is primed to detonate, a victim of uncontrollable primal instinct.",
          },
          { text: ".", type: "static" },
        ],
      },
    ],
  },
  {
    poem: "Remains",
    title: "Remains - Armitage",
    accent: "fuchsia",
    quotes: [
      {
        id: 19,
        quoteText: "On another occasion, / we got sent out to tackle a looter raiding a bank.",
        segments: [
          { text: "On another occasion, / we got ", type: "static" },
          {
            text: "sent out",
            type: "interactive",
            analysis: "Passive language ('got sent out') minimizes the soldier's personal responsibility and suggests they are merely agents following orders, reflecting the disconnect from the event.",
          },
          { text: " to tackle a looter raiding a bank.", type: "static" },
        ],
      },
      {
        id: 20,
        quoteText: "And I swear / I see every round as it rips through his life – / I see broad daylight on the other side.",
        segments: [
          { text: "And I swear / I see every round as it ", type: "static" },
          {
            text: "rips through his life",
            type: "interactive",
            analysis: "The violence of 'rips' is visceral. The speaker's ability to recall the event so vividly, even down to the detail of 'broad daylight', indicates PTSD and a haunting memory.",
          },
          { text: " – / I see broad daylight on the other side.", type: "static" },
        ],
      },
      {
        id: 21,
        quoteText: "his bloody life in my bloody hands.",
        segments: [
          { text: "his ", type: "static" },
          {
            text: "bloody life in my bloody hands",
            type: "interactive",
            analysis: "Double meaning of 'bloody': literally referring to the blood, and used as a swear word, expressing anger or desperation. The direct address 'my bloody hands' shows he is fully taking ownership of the guilt.",
          },
          { text: ".", type: "static" },
        ],
      },
    ],
  },
  {
    poem: "Poppies",
    title: "Poppies - Weir",
    accent: "pink",
    quotes: [
      {
        id: 22,
        quoteText: "Three days before Armistice Sunday / and poppies had already been placed",
        segments: [
          { text: "Three days before Armistice Sunday / and ", type: "static" },
          {
            text: "poppies had already been placed",
            type: "interactive",
            analysis: "Establishes a military context from the beginning, hinting at the subject matter (war/loss). The early placement of poppies foreshadows the mother's readiness to let go.",
          },
        ],
      },
      {
        id: 23,
        quoteText: "I listened, hoping to hear / your playground voice catching on the wind.",
        segments: [
          { text: "I listened, hoping to hear / your ", type: "static" },
          {
            text: "playground voice",
            type: "interactive",
            analysis: "Contrasts the innocence of childhood with the adult reality of war and loss. The mother clings to the memory of him as a child, showing the difficulty of accepting his adult decision.",
          },
          { text: " catching on the wind.", type: "static" },
        ],
      },
      {
        id: 24,
        quoteText: "a split second / and you were away, intoxicated.",
        segments: [
          { text: "a split second / and you were away, ", type: "static" },
          {
            text: "intoxicated",
            type: "interactive",
            analysis: "Suggests the son was overwhelmed by patriotism or excitement. The speed of the decision ('split second') contrasts with the lifelong grief of the mother.",
          },
          { text: ".", type: "static" },
        ],
      },
    ],
  },
  {
    poem: "War Photographer",
    title: "War Photographer - Duffy",
    accent: "indigo",
    quotes: [
      {
        id: 25,
        quoteText: "In his darkroom he is finally alone / with spools of suffering set out in ordered rows.",
        segments: [
          { text: "In his darkroom he is finally ", type: "static" },
          {
            text: "alone",
            type: "interactive",
            analysis: "Suggests a necessary isolation for processing trauma. The darkroom acts as a sanctuary, but also a prison of memory.",
          },
          { text: " / with spools of ", type: "static" },
          {
            text: "suffering set out in ordered rows",
            type: "interactive",
            analysis: "Metaphor suggests the photographer attempts to impose order on the chaos of war, but also reduces human pain to simple, interchangeable objects (like graves).",
          },
          { text: ".", type: "static" },
        ],
      },
      {
        id: 26,
        quoteText: "Belfast. Beirut. Phnom Penh. All flesh is grass.",
        segments: [
          {
            text: "Belfast. Beirut. Phnom Penh.",
            type: "interactive",
            analysis: "List of global conflict zones showing the universal nature of suffering. The use of full stops creates a stark, abrupt rhythm, like shots being fired or photos being taken.",
          },
          { text: " ", type: "static" },
          {
            text: "All flesh is grass",
            type: "interactive",
            analysis: "Biblical phrase (from Isaiah). Emphasizes the fragility and transience of human life; everyone dies. The photographer sees this truth more clearly than others.",
          },
          { text: ".", type: "static" },
        ],
      },
      {
        id: 27,
        quoteText: "A hundred agonies in black and white / from which his editor will pick out five or six.",
        segments: [
          { text: "A hundred ", type: "static" },
          {
            text: "agonies",
            type: "interactive",
            analysis: "Hyperbole showing the sheer volume of pain captured. 'Agonies' reminds the reader these are real, intense human experiences.",
          },
          { text: " in black and white / from which his editor will ", type: "static" },
          {
            text: "pick out five or six",
            type: "interactive",
            analysis: "The final casual selection process highlights the indifference and limited impact of the photos on the general public. Suffering is reduced to a disposable commodity.",
          },
          { text: ".", type: "static" },
        ],
      },
    ],
  },
  {
    poem: "Tis