/**
 * Genesis chapter metadata for Anime Audio Bible.
 * Scripture quotations marked as ESV are from the ESV® Bible
 * (The Holy Bible, English Standard Version®), © Crossway.
 * Short paraphrases are labeled and are not claimed as ESV wording.
 */

export type GenesisArc =
  | "Creation"
  | "Fall"
  | "Flood"
  | "Nations"
  | "Abraham"
  | "Isaac"
  | "Jacob"
  | "Joseph";

export type GenesisChapterMeta = {
  /** Chapter number 1–50 */
  number: number;
  /** Short story title */
  title: string;
  /** ESV API–style passage query */
  passageQuery: string;
  /** One-sentence chapter summary */
  summary: string;
  /** Key verse reference, e.g. "Genesis 1:1" */
  keyVerseRef: string;
  /**
   * Short key-verse text. Prefer exact ESV for well-known verses;
   * otherwise a faithful one-line paraphrase (not claimed as ESV).
   */
  keyVerseEsV: string;
  arc: GenesisArc;
};

/** Narrative arcs of Genesis in canonical order. */
export const GENESIS_ARCS: readonly GenesisArc[] = [
  "Creation",
  "Fall",
  "Flood",
  "Nations",
  "Abraham",
  "Isaac",
  "Jacob",
  "Joseph",
] as const;

export const GENESIS_CHAPTERS: GenesisChapterMeta[] = [
  {
    number: 1,
    title: "Creation of the World",
    passageQuery: "Genesis 1",
    summary:
      "God speaks the heavens and the earth into being over six days, forming light, sky, land, lights, living creatures, and humankind in His image.",
    keyVerseRef: "Genesis 1:1",
    keyVerseEsV: "In the beginning, God created the heavens and the earth.",
    arc: "Creation",
  },
  {
    number: 2,
    title: "The Garden of Eden",
    passageQuery: "Genesis 2",
    summary:
      "God forms Adam from dust, plants Eden, gives the man work and a command, then makes Eve from his side as a fitting helper.",
    keyVerseRef: "Genesis 2:7",
    keyVerseEsV:
      "then the Lord God formed the man of dust from the ground and breathed into his nostrils the breath of life, and the man became a living creature.",
    arc: "Creation",
  },
  {
    number: 3,
    title: "The Fall",
    passageQuery: "Genesis 3",
    summary:
      "The serpent deceives Eve; Adam and Eve eat the forbidden fruit, shame and exile follow, yet God promises an offspring who will crush the serpent.",
    keyVerseRef: "Genesis 3:15",
    keyVerseEsV:
      "I will put enmity between you and the woman, and between your offspring and her offspring; he shall bruise your head, and you shall bruise his heel.",
    arc: "Fall",
  },
  {
    number: 4,
    title: "Cain and Abel",
    passageQuery: "Genesis 4",
    summary:
      "Cain murders Abel in jealousy, is marked and driven out, and a restless line of violence grows while Seth’s line begins to call on the Lord.",
    keyVerseRef: "Genesis 4:7",
    keyVerseEsV:
      "If you do well, will you not be accepted? And if you do not do well, sin is crouching at the door. Its desire is contrary to you, but you must rule over it.",
    arc: "Fall",
  },
  {
    number: 5,
    title: "From Adam to Noah",
    passageQuery: "Genesis 5",
    summary:
      "The genealogy from Adam through Seth to Noah traces long lives ending in death—except Enoch, who walked with God and was taken.",
    keyVerseRef: "Genesis 5:24",
    keyVerseEsV: "Enoch walked with God, and he was not, for God took him.",
    arc: "Fall",
  },
  {
    number: 6,
    title: "Corruption and the Ark",
    passageQuery: "Genesis 6",
    summary:
      "Human wickedness grieves God; He announces a flood judgment, yet Noah finds favor and is told to build an ark for his family and the animals.",
    keyVerseRef: "Genesis 6:8",
    keyVerseEsV: "But Noah found favor in the eyes of the Lord.",
    arc: "Flood",
  },
  {
    number: 7,
    title: "The Flood Waters",
    passageQuery: "Genesis 7",
    summary:
      "Noah, his family, and the animals enter the ark; rain and the deep burst forth for forty days until every living thing on land is blotted out.",
    keyVerseRef: "Genesis 7:16",
    keyVerseEsV:
      "And those that entered, male and female of all flesh, went in as God had commanded him. And the Lord shut him in.",
    arc: "Flood",
  },
  {
    number: 8,
    title: "The Waters Recede",
    passageQuery: "Genesis 8",
    summary:
      "God remembers Noah; the waters recede, the ark rests on Ararat, and Noah offers a burnt offering as God promises never again to curse the ground by flood.",
    keyVerseRef: "Genesis 8:1",
    keyVerseEsV:
      "But God remembered Noah and all the beasts and all the livestock that were with him in the ark. And God made a wind blow over the earth, and the waters subsided.",
    arc: "Flood",
  },
  {
    number: 9,
    title: "Covenant and the Rainbow",
    passageQuery: "Genesis 9",
    summary:
      "God blesses Noah, sets the rainbow as the sign of His covenant, and a later episode with Canaan’s curse foreshadows future nations.",
    keyVerseRef: "Genesis 9:13",
    keyVerseEsV:
      "I have set my bow in the cloud, and it shall be a sign of the covenant between me and the earth.",
    arc: "Flood",
  },
  {
    number: 10,
    title: "The Table of Nations",
    passageQuery: "Genesis 10",
    summary:
      "The descendants of Japheth, Ham, and Shem spread into the clans and languages that fill the known world after the flood.",
    keyVerseRef: "Genesis 10:32",
    keyVerseEsV:
      "These are the clans of the sons of Noah, according to their genealogies, in their nations, and from these the nations spread abroad on the earth after the flood.",
    arc: "Nations",
  },
  {
    number: 11,
    title: "Babel and the Line to Abram",
    passageQuery: "Genesis 11",
    summary:
      "Humanity builds a tower to make a name for itself; God confuses their language and scatters them, then traces Shem’s line down to Abram.",
    keyVerseRef: "Genesis 11:9",
    keyVerseEsV:
      "Therefore its name was called Babel, because there the Lord confused the language of all the earth. And from there the Lord dispersed them over the face of all the earth.",
    arc: "Nations",
  },
  {
    number: 12,
    title: "The Call of Abram",
    passageQuery: "Genesis 12",
    summary:
      "God calls Abram to leave his country with a promise of nation, blessing, and worldwide good; Abram journeys to Canaan and sojourns in Egypt.",
    keyVerseRef: "Genesis 12:2–3",
    keyVerseEsV:
      "And I will make of you a great nation, and I will bless you and make your name great, so that you will be a blessing. I will bless those who bless you, and him who dishonors you I will curse, and in you all the families of the earth shall be blessed.",
    arc: "Abraham",
  },
  {
    number: 13,
    title: "Abram and Lot Separate",
    passageQuery: "Genesis 13",
    summary:
      "Abram and Lot part ways over crowded pasture; Lot chooses the Jordan plain near Sodom, and God reaffirms the land promise to Abram.",
    keyVerseRef: "Genesis 13:14–15",
    keyVerseEsV:
      "The Lord said to Abram… “Lift up your eyes and look from the place where you are… for all the land that you see I will give to you and to your offspring forever.”",
    arc: "Abraham",
  },
  {
    number: 14,
    title: "Abram Rescues Lot",
    passageQuery: "Genesis 14",
    summary:
      "When kings raid Sodom and capture Lot, Abram pursues, defeats them, and is blessed by Melchizedek, king of Salem and priest of God Most High.",
    keyVerseRef: "Genesis 14:19–20",
    keyVerseEsV:
      "And he blessed him and said, “Blessed be Abram by God Most High, Possessor of heaven and earth; and blessed be God Most High, who has delivered your enemies into your hand!”",
    arc: "Abraham",
  },
  {
    number: 15,
    title: "Covenant by Faith",
    passageQuery: "Genesis 15",
    summary:
      "God promises Abram countless offspring and the land; Abram believes, and the Lord cuts a solemn covenant with smoking fire between divided pieces.",
    keyVerseRef: "Genesis 15:6",
    keyVerseEsV:
      "And he believed the Lord, and he counted it to him as righteousness.",
    arc: "Abraham",
  },
  {
    number: 16,
    title: "Hagar and Ishmael",
    passageQuery: "Genesis 16",
    summary:
      "Sarai gives Hagar to Abram; Hagar flees harsh treatment, meets the Angel of the Lord, and bears Ishmael as God hears her affliction.",
    keyVerseRef: "Genesis 16:13",
    keyVerseEsV:
      "So she called the name of the Lord who spoke to her, “You are a God of seeing,” for she said, “Truly here I have seen him who looks after me.”",
    arc: "Abraham",
  },
  {
    number: 17,
    title: "Covenant of Circumcision",
    passageQuery: "Genesis 17",
    summary:
      "God renames Abram and Sarai, institutes circumcision as the covenant sign, and promises Isaac through Sarah within a year.",
    keyVerseRef: "Genesis 17:5",
    keyVerseEsV:
      "No longer shall your name be called Abram, but your name shall be Abraham, for I have made you the father of a multitude of nations.",
    arc: "Abraham",
  },
  {
    number: 18,
    title: "Visitors at Mamre",
    passageQuery: "Genesis 18",
    summary:
      "Three visitors announce Isaac’s birth; Abraham intercedes for Sodom, bargaining that the city be spared if even ten righteous are found.",
    keyVerseRef: "Genesis 18:14",
    keyVerseEsV: "Is anything too hard for the Lord?",
    arc: "Abraham",
  },
  {
    number: 19,
    title: "Sodom and Gomorrah",
    passageQuery: "Genesis 19",
    summary:
      "Angels rescue Lot from Sodom as fire falls on the cities; Lot’s wife becomes a pillar of salt, and his daughters later bear Moab and Ammon.",
    keyVerseRef: "Genesis 19:16",
    keyVerseEsV:
      "But he lingered. So the men seized him and his wife and his two daughters by the hand, the Lord being merciful to him, and they brought him out and set him outside the city.",
    arc: "Abraham",
  },
  {
    number: 20,
    title: "Abraham and Abimelech",
    passageQuery: "Genesis 20",
    summary:
      "Abraham again passes Sarah off as his sister in Gerar; God warns Abimelech in a dream and preserves Sarah for the promised child.",
    keyVerseRef: "Genesis 20:6",
    keyVerseEsV:
      "Then God said to him in the dream, “Yes, I know that you have done this in the integrity of your heart, and it was I who kept you from sinning against me.”",
    arc: "Abraham",
  },
  {
    number: 21,
    title: "Isaac Is Born",
    passageQuery: "Genesis 21",
    summary:
      "Sarah bears Isaac; Hagar and Ishmael are sent away yet preserved by God, and Abraham makes a treaty with Abimelech at Beersheba.",
    keyVerseRef: "Genesis 21:1–2",
    keyVerseEsV:
      "The Lord visited Sarah as he had said, and the Lord did to Sarah as he had promised. And Sarah conceived and bore Abraham a son in his old age…",
    arc: "Abraham",
  },
  {
    number: 22,
    title: "The Binding of Isaac",
    passageQuery: "Genesis 22",
    summary:
      "God tests Abraham by commanding Isaac’s offering; Abraham obeys, God provides a ram, and the promise of blessing is sworn by God’s own name.",
    keyVerseRef: "Genesis 22:8",
    keyVerseEsV:
      "Abraham said, “God will provide for himself the lamb for a burnt offering, my son.” So they went both of them together.",
    arc: "Abraham",
  },
  {
    number: 23,
    title: "Sarah’s Burial",
    passageQuery: "Genesis 23",
    summary:
      "Sarah dies at Hebron; Abraham buys the cave of Machpelah from the Hittites as a permanent burial place in the promised land.",
    keyVerseRef: "Genesis 23:19",
    keyVerseEsV:
      "After this, Abraham buried Sarah his wife in the cave of the field of Machpelah east of Mamre (that is, Hebron) in the land of Canaan.",
    arc: "Abraham",
  },
  {
    number: 24,
    title: "A Wife for Isaac",
    passageQuery: "Genesis 24",
    summary:
      "Abraham’s servant seeks a wife for Isaac in Mesopotamia; the Lord leads him to Rebekah, who willingly leaves to marry Isaac.",
    keyVerseRef: "Genesis 24:27",
    keyVerseEsV:
      "Blessed be the Lord, the God of my master Abraham, who has not forsaken his steadfast love and his faithfulness toward my master.",
    arc: "Abraham",
  },
  {
    number: 25,
    title: "Abraham’s Death; Esau and Jacob",
    passageQuery: "Genesis 25",
    summary:
      "Abraham dies and is buried with Sarah; Isaac fathers Esau and Jacob, and Esau sells his birthright to Jacob for a single meal.",
    keyVerseRef: "Genesis 25:23",
    keyVerseEsV:
      "And the Lord said to her, “Two nations are in your womb, and two peoples from within you shall be divided; the one shall be stronger than the other, the older shall serve the younger.”",
    arc: "Isaac",
  },
  {
    number: 26,
    title: "Isaac in Gerar",
    passageQuery: "Genesis 26",
    summary:
      "In famine Isaac sojourns in Gerar; God renews the Abrahamic promise, Isaac digs wells amid conflict, and he makes peace with Abimelech.",
    keyVerseRef: "Genesis 26:4",
    keyVerseEsV:
      "I will multiply your offspring as the stars of heaven and will give to your offspring all these lands. And in your offspring all the nations of the earth shall be blessed.",
    arc: "Isaac",
  },
  {
    number: 27,
    title: "The Stolen Blessing",
    passageQuery: "Genesis 27",
    summary:
      "Rebekah and Jacob deceive aging Isaac so Jacob receives the blessing meant for Esau; Esau vows revenge, and Jacob must flee.",
    keyVerseRef: "Genesis 27:28–29",
    keyVerseEsV:
      "May God give you of the dew of heaven and of the fatness of the earth… Let peoples serve you, and nations bow down to you. Be lord over your brothers…",
    arc: "Jacob",
  },
  {
    number: 28,
    title: "Jacob’s Ladder",
    passageQuery: "Genesis 28",
    summary:
      "Fleeing to Haran, Jacob dreams of a ladder between earth and heaven; God promises presence, land, and offspring, and Jacob vows at Bethel.",
    keyVerseRef: "Genesis 28:15",
    keyVerseEsV:
      "Behold, I am with you and will keep you wherever you go, and will bring you back to this land. For I will not leave you until I have done what I have promised you.",
    arc: "Jacob",
  },
  {
    number: 29,
    title: "Jacob, Leah, and Rachel",
    passageQuery: "Genesis 29",
    summary:
      "Jacob serves Laban, is given Leah instead of Rachel, then works seven more years for Rachel as the household begins to grow.",
    keyVerseRef: "Genesis 29:20",
    keyVerseEsV:
      "So Jacob served seven years for Rachel, and they seemed to him but a few days because of the love he had for her.",
    arc: "Jacob",
  },
  {
    number: 30,
    title: "Children and Flocks",
    passageQuery: "Genesis 30",
    summary:
      "Through Leah, Rachel, and their servants, Jacob’s sons are born; then Jacob prospers as God multiplies speckled and spotted flocks.",
    keyVerseRef: "Genesis 30:22",
    keyVerseEsV:
      "Then God remembered Rachel, and God listened to her and opened her womb.",
    arc: "Jacob",
  },
  {
    number: 31,
    title: "Flight from Laban",
    passageQuery: "Genesis 31",
    summary:
      "Jacob flees Laban with his family and flocks; Laban pursues, they make a covenant of peace at Mizpah, and each turns homeward.",
    keyVerseRef: "Genesis 31:49",
    keyVerseEsV:
      "and Mizpah, for he said, “The Lord watch between you and me, when we are out of one another’s sight.”",
    arc: "Jacob",
  },
  {
    number: 32,
    title: "Wrestling at Peniel",
    passageQuery: "Genesis 32",
    summary:
      "Fearing Esau, Jacob prepares gifts and prays; alone at night he wrestles with God, is renamed Israel, and limps toward reconciliation.",
    keyVerseRef: "Genesis 32:28",
    keyVerseEsV:
      "Then he said, “Your name shall no longer be called Jacob, but Israel, for you have striven with God and with men, and have prevailed.”",
    arc: "Jacob",
  },
  {
    number: 33,
    title: "Jacob Meets Esau",
    passageQuery: "Genesis 33",
    summary:
      "Esau runs to meet Jacob with unexpected grace; they reconcile, and Jacob settles near Shechem after buying land.",
    keyVerseRef: "Genesis 33:4",
    keyVerseEsV:
      "But Esau ran to meet him and embraced him and fell on his neck and kissed him, and they wept.",
    arc: "Jacob",
  },
  {
    number: 34,
    title: "Dinah and Shechem",
    passageQuery: "Genesis 34",
    summary:
      "Dinah is violated by Shechem; Simeon and Levi avenge her by deceit and slaughter, leaving Jacob troubled among the Canaanites.",
    keyVerseRef: "Genesis 34:7",
    keyVerseEsV:
      "The sons of Jacob had come in from the field as soon as they heard of it, and the men were indignant and very angry, because he had done an outrageous thing in Israel…",
    arc: "Jacob",
  },
  {
    number: 35,
    title: "Return to Bethel",
    passageQuery: "Genesis 35",
    summary:
      "Jacob purges idols, worships at Bethel, Rachel dies bearing Benjamin, and Isaac dies; the twelve sons of Israel stand complete.",
    keyVerseRef: "Genesis 35:11",
    keyVerseEsV:
      "And God said to him, “I am God Almighty: be fruitful and multiply. A nation and a company of nations shall come from you, and kings shall come from your own body.”",
    arc: "Jacob",
  },
  {
    number: 36,
    title: "The Generations of Esau",
    passageQuery: "Genesis 36",
    summary:
      "Esau’s descendants and chiefs are listed as Edom settles in Seir, setting the stage beside Israel’s unfolding story.",
    keyVerseRef: "Genesis 36:8",
    keyVerseEsV: "So Esau settled in the hill country of Seir. (Esau is Edom.)",
    arc: "Jacob",
  },
  {
    number: 37,
    title: "Joseph Sold into Egypt",
    passageQuery: "Genesis 37",
    summary:
      "Joseph’s dreams and favored coat stir jealousy; his brothers sell him into slavery and deceive Jacob with a bloodied robe.",
    keyVerseRef: "Genesis 37:28",
    keyVerseEsV:
      "Then Midianite traders passed by. And they drew Joseph up and lifted him out of the pit, and sold him to the Ishmaelites for twenty shekels of silver. They took Joseph to Egypt.",
    arc: "Joseph",
  },
  {
    number: 38,
    title: "Judah and Tamar",
    passageQuery: "Genesis 38",
    summary:
      "Judah’s family line falters until Tamar, denied justice, secures offspring through Judah—preserving the line toward future kings.",
    keyVerseRef: "Genesis 38:26",
    keyVerseEsV:
      "Then Judah identified them and said, “She is more righteous than I, since I did not give her to my son Shelah.” And he did not know her again.",
    arc: "Joseph",
  },
  {
    number: 39,
    title: "Joseph in Potiphar’s House",
    passageQuery: "Genesis 39",
    summary:
      "The Lord prospers Joseph in Potiphar’s house; falsely accused by Potiphar’s wife, he is cast into prison, yet God remains with him.",
    keyVerseRef: "Genesis 39:2",
    keyVerseEsV:
      "The Lord was with Joseph, and he became a successful man, and he was in the house of his Egyptian master.",
    arc: "Joseph",
  },
  {
    number: 40,
    title: "Dreams in Prison",
    passageQuery: "Genesis 40",
    summary:
      "Joseph interprets the dreams of Pharaoh’s cupbearer and baker; the cupbearer is restored but forgets Joseph.",
    keyVerseRef: "Genesis 40:8",
    keyVerseEsV:
      "They said to him, “We have had dreams, and there is no one to interpret them.” And Joseph said to them, “Do not interpretations belong to God? Please tell them to me.”",
    arc: "Joseph",
  },
  {
    number: 41,
    title: "Joseph before Pharaoh",
    passageQuery: "Genesis 41",
    summary:
      "Joseph interprets Pharaoh’s dreams of famine, is raised to rule Egypt, stores grain for seven lean years, and fathers Manasseh and Ephraim.",
    keyVerseRef: "Genesis 41:16",
    keyVerseEsV:
      "Joseph answered Pharaoh, “It is not in me; God will give Pharaoh a favorable answer.”",
    arc: "Joseph",
  },
  {
    number: 42,
    title: "Brothers to Egypt",
    passageQuery: "Genesis 42",
    summary:
      "Jacob’s sons come to Egypt for grain; Joseph recognizes them, tests them harshly, and keeps Simeon while sending the rest home for Benjamin.",
    keyVerseRef: "Genesis 42:8",
    keyVerseEsV:
      "And Joseph recognized his brothers, but they did not recognize him.",
    arc: "Joseph",
  },
  {
    number: 43,
    title: "Benjamin Goes Down",
    passageQuery: "Genesis 43",
    summary:
      "Judah pledges Benjamin’s safety; the brothers return to Egypt and dine with Joseph, astonished at his knowledge and favor.",
    keyVerseRef: "Genesis 43:14",
    keyVerseEsV:
      "May God Almighty grant you mercy before the man, and may he send back your other brother and Benjamin. And as for me, if I am bereaved of my children, I am bereaved.”",
    arc: "Joseph",
  },
  {
    number: 44,
    title: "Judah’s Plea",
    passageQuery: "Genesis 44",
    summary:
      "Joseph frames Benjamin with a silver cup; Judah offers himself in Benjamin’s place rather than break his father’s heart.",
    keyVerseRef: "Genesis 44:33",
    keyVerseEsV:
      "Now therefore, please let your servant remain instead of the boy as a servant to my lord, and let the boy go back with his brothers.",
    arc: "Joseph",
  },
  {
    number: 45,
    title: "Joseph Revealed",
    passageQuery: "Genesis 45",
    summary:
      "Joseph makes himself known, weeps with his brothers, and sends them to bring Jacob—seeing God’s hand in his path to Egypt.",
    keyVerseRef: "Genesis 45:5",
    keyVerseEsV:
      "And now do not be distressed or angry with yourselves because you sold me here, for God sent me before you to preserve life.",
    arc: "Joseph",
  },
  {
    number: 46,
    title: "Israel Goes to Egypt",
    passageQuery: "Genesis 46",
    summary:
      "God assures Jacob in a vision; the whole household of seventy goes down to Egypt and is reunited with Joseph in Goshen.",
    keyVerseRef: "Genesis 46:3–4",
    keyVerseEsV:
      "Then he said, “I am God, the God of your father. Do not be afraid to go down to Egypt, for there I will make you into a great nation. I myself will go down with you to Egypt, and I will also bring you up again…”",
    arc: "Joseph",
  },
  {
    number: 47,
    title: "Settled in Goshen",
    passageQuery: "Genesis 47",
    summary:
      "Pharaoh grants Goshen; Joseph manages the famine so Egypt and Canaan survive, and Jacob blesses Pharaoh and prepares for death.",
    keyVerseRef: "Genesis 47:9",
    keyVerseEsV:
      "And Jacob said to Pharaoh, “The days of the years of my sojourning are 130 years. Few and evil have been the days of the years of my life…”",
    arc: "Joseph",
  },
  {
    number: 48,
    title: "Ephraim and Manasseh Blessed",
    passageQuery: "Genesis 48",
    summary:
      "Jacob adopts Joseph’s sons and crosses his hands to give the greater blessing to younger Ephraim over Manasseh.",
    keyVerseRef: "Genesis 48:19",
    keyVerseEsV:
      "But his father refused and said, “I know, my son, I know. He also shall become a people, and he also shall be great. Nevertheless, his younger brother shall be greater than he…”",
    arc: "Joseph",
  },
  {
    number: 49,
    title: "Jacob Blesses His Sons",
    passageQuery: "Genesis 49",
    summary:
      "Jacob gathers his twelve sons, prophesying over each tribe—including Judah’s scepter—then dies and is gathered to his people.",
    keyVerseRef: "Genesis 49:10",
    keyVerseEsV:
      "The scepter shall not depart from Judah, nor the ruler’s staff from between his feet, until tribute comes to him; and to him shall be the obedience of the peoples.",
    arc: "Joseph",
  },
  {
    number: 50,
    title: "God Meant It for Good",
    passageQuery: "Genesis 50",
    summary:
      "Joseph buries Jacob in Canaan, reassures his fearful brothers of forgiveness, and dies in Egypt looking ahead to God’s promised return.",
    keyVerseRef: "Genesis 50:20",
    keyVerseEsV:
      "As for you, you meant evil against me, but God meant it for good, to bring it about that many people should be kept alive, as they are today.",
    arc: "Joseph",
  },
];

export function getGenesisChapter(n: number): GenesisChapterMeta | undefined {
  return GENESIS_CHAPTERS.find((chapter) => chapter.number === n);
}

export function listGenesisByArc(arc: GenesisArc): GenesisChapterMeta[] {
  return GENESIS_CHAPTERS.filter((chapter) => chapter.arc === arc);
}
