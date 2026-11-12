const photos = [
  ["0F0A9805.JPG", "A little moment, a lot of love", "Akka and Bava sharing a sweet moment outdoors"],
  ["0F0A9810.JPG", "Side by side, wherever life takes you", "Akka and Bava walking hand in hand outdoors"],
  ["IMG_9469.JPG", "A sacred beginning, held close", "A tender moment from their wedding ceremony"],
  ["IMG_9484.JPG", "Love looks beautiful on you both", "Akka and Bava celebrating together"],
  ["IMG_9513.JPG", "A new little heartbeat, a bigger love", "Akka and Bava sharing a quiet moment together"],
  ["IMG_9529.JPG", "Every adventure is better together", "Akka and Bava enjoying a day outdoors"],
  ["IMG_9559.JPG", "The sweetest kind of together", "Akka and Bava sharing an affectionate moment"],
  ["KRI02133.JPG", "Dancing through every chapter", "Akka and Bava enjoying a dance together"],
  ["KRI02156.JPG", "My forever favourite team", "Akka and Bava standing together at a celebration"],
  ["KRI02187.JPG", "Surrounded by love, always", "Akka and Bava celebrating with family"],
  ["KRI02212.JPG", "A day straight out of a fairytale", "Akka and Bava at their wedding celebration"],
  ["KRI03186 2.JPG", "The day your forever began", "A moment from their traditional wedding ceremony"],
  ["KRI03377 2.JPG", "Hand in hand, heart to heart", "Akka and Bava holding hands in their wedding attire"],
  ["KRI03593 2.JPG", "Two hearts, one beautiful promise", "Akka and Bava celebrating their wedding"],
  ["SHA_8399.JPG", "A love surrounded by flowers", "Akka and Bava together on their wedding stage"],
  ["SHA_8403.JPG", "A lifetime of little celebrations", "Akka and Bava sharing their wedding day"],
  ["SHA_8927.JPG", "Together, through every season", "Akka and Bava during a traditional wedding ritual"],
  ["SHA_9564.JPG", "The beginning of your forever", "Akka and Bava at their wedding ceremony"],
  ["SHA_9666.JPG", "A promise, a partnership, a lifetime", "Akka and Bava on their wedding day"],
  ["SHRI0206.JPG", "Just you, just me, just us", "Akka and Bava smiling together in wedding clothes"],
  ["SHRI0211.JPG", "The way you look at each other", "Akka and Bava sharing an affectionate wedding moment"],
  ["SHRI0212.JPG", "Always finding your way back to each other", "Akka and Bava looking at each other lovingly"],
  ["SHRI0216.JPG", "A love that feels like home", "Akka and Bava together in their wedding attire"],
  ["SHRI9819.JPG", "Here is to every beautiful year ahead", "Akka and Bava standing together at a celebration"],
];

const memoryBase = `${import.meta.env.BASE_URL}memories/`;

export const initialMemories = photos.map(([filename, caption, alt], index) => ({
  id: `memory-${index}`,
  src: `${memoryBase}${encodeURIComponent(filename)}`,
  caption,
  alt,
}));

export const defaultTimeline = [
  { id: "met", title: "The Day They Met", date: "", description: "One hello that started a forever.", photo: "" },
  { id: "memory", title: "Their First Special Memory", date: "", description: "The first of so many little moments, made extraordinary together.", photo: "" },
  { id: "wedding", title: "Their Wedding Day", date: "", description: "Two hearts, one promise, one beautiful beginning.", photo: `${memoryBase}KRI02212.JPG` },
  { id: "journey", title: "Their Beautiful Journey", date: "", description: "Adventures, laughter, and all the in-between moments.", photo: `${memoryBase}0F0A9805.JPG` },
  { id: "today", title: "Today: Another Year of Love", date: "", description: "Another year of holding hands and choosing each other.", photo: "" },
  { id: "forever", title: "Forever and Always", date: "", description: "All the adventures and anniversaries still to come.", photo: "" },
];
