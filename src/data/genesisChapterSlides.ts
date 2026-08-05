/**
 * Scripture-matched story slides for every Genesis chapter.
 * Images + narration lines stay tied to the same ESV references
 * so chapter audio and comics tell the same story.
 */

import type { GenesisChapterMeta } from "./genesisChapters";
import { GENESIS_CHAPTERS } from "./genesisChapters";

export type GenesisChapterSlide = {
  title: string;
  scriptureRef: string;
  /** Exact or short ESV wording for this beat (read aloud). */
  scriptureText: string;
  /** Kid-friendly bridge line before the verse. */
  narration: string;
  image: number;
};

const IMAGES = {
  g10_nations: require("../../assets/webtoon/genesis-10/01-nations.jpg"),
  g11_babel: require("../../assets/webtoon/genesis-11/01-babel.jpg"),
  g12_stars: require("../../assets/webtoon/genesis-12/01-stars.jpg"),
  g13_parting: require("../../assets/webtoon/genesis-13/01-parting.jpg"),
  g14_melch: require("../../assets/webtoon/genesis-14/01-melchizedek.jpg"),
  g15_covenant: require("../../assets/webtoon/genesis-15/01-covenant.jpg"),
  g16_hagar: require("../../assets/webtoon/genesis-16/01-hagar.jpg"),
  g18_mamre: require("../../assets/webtoon/genesis-18/01-mamre.jpg"),
  g19_flight: require("../../assets/webtoon/genesis-19/01-flight.jpg"),
  g1_adam: require("../../assets/webtoon/genesis-1/09-day6-adam.jpg"),
  g1_day3: require("../../assets/webtoon/genesis-1/05-day3-land.jpg"),
  g1_light: require("../../assets/webtoon/genesis-1/02-light.jpg"),
  g21_isaac: require("../../assets/webtoon/genesis-21/01-isaac-born.jpg"),
  g22_moriah: require("../../assets/webtoon/genesis-22/01-moriah.jpg"),
  g23_mach: require("../../assets/webtoon/genesis-23/01-machpelah.jpg"),
  g24_rebekah: require("../../assets/webtoon/genesis-24/01-rebekah.jpg"),
  g25_stew: require("../../assets/webtoon/genesis-25/01-stew.jpg"),
  g27_bless: require("../../assets/webtoon/genesis-27/01-blessing.jpg"),
  g28_bethel: require("../../assets/webtoon/genesis-28/01-bethel.jpg"),
  g29_rachel: require("../../assets/webtoon/genesis-29/01-rachel.jpg"),
  g2_eve: require("../../assets/webtoon/genesis-2/02-eve-bush.jpg"),
  g2_rib: require("../../assets/webtoon/genesis-2/01-adam-rib-bush.jpg"),
  g2_together: require("../../assets/webtoon/genesis-2/02-eden-together.jpg"),
  g32_peniel: require("../../assets/webtoon/genesis-32/01-peniel.jpg"),
  g33_embrace: require("../../assets/webtoon/genesis-33/01-embrace.jpg"),
  g35_bethel: require("../../assets/webtoon/genesis-35/01-bethel.jpg"),
  g37_caravan: require("../../assets/webtoon/genesis-37/02-caravan.jpg"),
  g37_coat: require("../../assets/webtoon/genesis-37/01-coat.jpg"),
  g38_judah: require("../../assets/webtoon/genesis-38/01-judah-tamar.jpg"),
  g39_potiphar: require("../../assets/webtoon/genesis-39/01-potiphar.jpg"),
  g3_bites: require("../../assets/webtoon/genesis-3/03-eve-bites.jpg"),
  g3_serpent: require("../../assets/webtoon/genesis-3/05-serpent.jpg"),
  g3_whisper: require("../../assets/webtoon/genesis-3/02-whisper.jpg"),
  g40_prison: require("../../assets/webtoon/genesis-40/01-prison.jpg"),
  g41_dreams: require("../../assets/webtoon/genesis-41/01-dreams.jpg"),
  g42_brothers: require("../../assets/webtoon/genesis-42/01-brothers.jpg"),
  g44_cup: require("../../assets/webtoon/genesis-44/01-cup.jpg"),
  g45_reunion: require("../../assets/webtoon/genesis-45/01-reunion.jpg"),
  g4_brothers: require("../../assets/webtoon/genesis-4/02-brothers.jpg"),
  g4_offer: require("../../assets/webtoon/genesis-4/01-offerings.jpg"),
  g50_forgive: require("../../assets/webtoon/genesis-50/01-forgiveness.jpg"),
  g5_enoch: require("../../assets/webtoon/genesis-5/01-enoch.jpg"),
  g6_ark: require("../../assets/webtoon/genesis-6/01-ark.jpg"),
  g7_flood: require("../../assets/webtoon/genesis-7/01-flood.jpg"),
  g8_recede: require("../../assets/webtoon/genesis-8/01-recede.jpg"),
  g9_rainbow: require("../../assets/webtoon/genesis-9/01-rainbow.jpg"),
} as const;

type SlideDef = {
  title: string;
  scriptureRef: string;
  scriptureText: string;
  narration: string;
  imageKey: keyof typeof IMAGES;
};

const SLIDE_DEFS: Record<number, SlideDef[]> = {
  1: [
    {
      title: 'Day 1 · Light',
      scriptureRef: 'Genesis 1:1–3',
      scriptureText: 'In the beginning, God created the heavens and the earth… And God said, “Let there be light,” and there was light.',
      narration: 'God speaks light into the darkness.',
      imageKey: 'g1_light',
    },
    {
      title: 'Days 2–4 · Sky, land, lights',
      scriptureRef: 'Genesis 1:9–14',
      scriptureText: 'And God said, “Let the waters under the heavens be gathered together into one place, and let the dry land appear.” … And God said, “Let there be lights in the expanse of the heavens…”',
      narration: 'Land rises, and lights fill the sky.',
      imageKey: 'g1_day3',
    },
    {
      title: 'Days 5–6 · Life and humankind',
      scriptureRef: 'Genesis 1:26–27',
      scriptureText: 'Then God said, “Let us make man in our image, after our likeness.” … So God created man in his own image…',
      narration: 'God fills the world with living creatures — and makes humankind in His image.',
      imageKey: 'g1_adam',
    },
  ],
  2: [
    {
      title: 'Breath of life',
      scriptureRef: 'Genesis 2:7',
      scriptureText: 'then the Lord God formed the man of dust from the ground and breathed into his nostrils the breath of life, and the man became a living creature.',
      narration: 'From dust and breath — Adam lives.',
      imageKey: 'g2_rib',
    },
    {
      title: 'Eve from Adam’s side',
      scriptureRef: 'Genesis 2:21–22',
      scriptureText: 'So the Lord God caused a deep sleep to fall upon the man… And the rib that the Lord God had taken from the man he made into a woman and brought her to the man.',
      narration: 'God makes a helper fit for Adam.',
      imageKey: 'g2_eve',
    },
    {
      title: 'Together in Eden',
      scriptureRef: 'Genesis 2:25',
      scriptureText: 'And the man and his wife were both naked and were not ashamed.',
      narration: 'In the garden there is trust and peace.',
      imageKey: 'g2_together',
    },
  ],
  3: [
    {
      title: 'The serpent’s question',
      scriptureRef: 'Genesis 3:1',
      scriptureText: 'Now the serpent was more crafty than any other beast of the field that the Lord God had made. He said to the woman, “Did God actually say, ‘You shall not eat of any tree in the garden’?”',
      narration: 'A whisper twists God’s good word.',
      imageKey: 'g3_whisper',
    },
    {
      title: 'The fruit is taken',
      scriptureRef: 'Genesis 3:6',
      scriptureText: 'So when the woman saw that the tree was good for food… she took of its fruit and ate, and she also gave some to her husband who was with her, and he ate.',
      narration: 'Eve eats — and Adam eats too.',
      imageKey: 'g3_bites',
    },
    {
      title: 'Promise in the curse',
      scriptureRef: 'Genesis 3:15',
      scriptureText: 'I will put enmity between you and the woman, and between your offspring and her offspring; he shall bruise your head, and you shall bruise his heel.',
      narration: 'Even in judgment, God promises a Rescuer.',
      imageKey: 'g3_serpent',
    },
  ],
  4: [
    {
      title: 'Two offerings',
      scriptureRef: 'Genesis 4:3–4',
      scriptureText: 'In the course of time Cain brought to the Lord an offering of the fruit of the ground, and Abel also brought of the firstborn of his flock… And the Lord had regard for Abel and his offering,',
      narration: 'Two brothers bring gifts — but hearts differ.',
      imageKey: 'g4_offer',
    },
    {
      title: 'Sin crouches',
      scriptureRef: 'Genesis 4:7',
      scriptureText: 'If you do well, will you not be accepted? And if you do not do well, sin is crouching at the door. Its desire is contrary to you, but you must rule over it.',
      narration: 'God warns Cain before jealousy hardens.',
      imageKey: 'g4_brothers',
    },
  ],
  5: [
    {
      title: 'From Adam to Noah',
      scriptureRef: 'Genesis 5:1–2',
      scriptureText: 'This is the book of the generations of Adam. When God created man, he made him in the likeness of God. Male and female he created them…',
      narration: 'A long line of fathers and sons walks through time.',
      imageKey: 'g5_enoch',
    },
    {
      title: 'Enoch walked with God',
      scriptureRef: 'Genesis 5:24',
      scriptureText: 'Enoch walked with God, and he was not, for God took him.',
      narration: 'One life shines — Enoch walks with God and is taken.',
      imageKey: 'g1_adam',
    },
  ],
  6: [
    {
      title: 'Wickedness fills the earth',
      scriptureRef: 'Genesis 6:5–6',
      scriptureText: 'The Lord saw that the wickedness of man was great in the earth… And the Lord regretted that he had made man on the earth, and it grieved him to his heart.',
      narration: 'God’s heart grieves over a broken world.',
      imageKey: 'g6_ark',
    },
    {
      title: 'Build an ark',
      scriptureRef: 'Genesis 6:13–14',
      scriptureText: 'And God said to Noah, “I have determined to make an end of all flesh… Make yourself an ark of gopher wood.”',
      narration: 'Noah finds favor and begins to build.',
      imageKey: 'g7_flood',
    },
  ],
  7: [
    {
      title: 'The Lord shuts him in',
      scriptureRef: 'Genesis 7:16',
      scriptureText: 'And those that entered, male and female of all flesh, went in as God had commanded him. And the Lord shut him in.',
      narration: 'Noah’s family and the animals enter — God closes the door.',
      imageKey: 'g7_flood',
    },
    {
      title: 'Waters prevail',
      scriptureRef: 'Genesis 7:17–18',
      scriptureText: 'The flood continued forty days on the earth. The waters increased and bore up the ark, and it rose high above the earth.',
      narration: 'Rain falls, and the ark floats on the deep.',
      imageKey: 'g6_ark',
    },
  ],
  8: [
    {
      title: 'God remembers Noah',
      scriptureRef: 'Genesis 8:1',
      scriptureText: 'But God remembered Noah and all the beasts and all the livestock that were with him in the ark. And God made a wind blow over the earth, and the waters subsided.',
      narration: 'God sends a wind — the waters begin to fall.',
      imageKey: 'g8_recede',
    },
    {
      title: 'New beginning',
      scriptureRef: 'Genesis 8:20–21',
      scriptureText: 'Then Noah built an altar to the Lord… And when the Lord smelled the pleasing aroma, the Lord said in his heart, “I will never again curse the ground because of man…”',
      narration: 'Worship rises, and God promises mercy.',
      imageKey: 'g9_rainbow',
    },
  ],
  9: [
    {
      title: 'Bow in the cloud',
      scriptureRef: 'Genesis 9:12–13',
      scriptureText: 'And God said, “This is the sign of the covenant that I make between me and you… I have set my bow in the cloud, and it shall be a sign of the covenant between me and the earth.”',
      narration: 'A rainbow seals God’s promise.',
      imageKey: 'g9_rainbow',
    },
    {
      title: 'Be fruitful',
      scriptureRef: 'Genesis 9:1',
      scriptureText: 'And God blessed Noah and his sons and said to them, “Be fruitful and multiply and fill the earth.”',
      narration: 'Life begins again under God’s blessing.',
      imageKey: 'g8_recede',
    },
  ],
  10: [
    {
      title: 'Clans and nations',
      scriptureRef: 'Genesis 10:32',
      scriptureText: 'These are the clans of the sons of Noah, according to their genealogies, in their nations, and from these the nations spread abroad on the earth after the flood.',
      narration: 'From one family, many peoples spread across the earth.',
      imageKey: 'g10_nations',
    },
    {
      title: 'The earth is filled',
      scriptureRef: 'Genesis 10:5',
      scriptureText: 'From these the coastland peoples spread in their lands, each with his own language, by their clans, in their nations.',
      narration: 'Languages and lands begin to take shape.',
      imageKey: 'g11_babel',
    },
  ],
  11: [
    {
      title: 'One language, one tower',
      scriptureRef: 'Genesis 11:4',
      scriptureText: 'Then they said, “Come, let us build ourselves a city and a tower with its top in the heavens, and let us make a name for ourselves…”',
      narration: 'People reach upward to make their own name.',
      imageKey: 'g11_babel',
    },
    {
      title: 'Scattered',
      scriptureRef: 'Genesis 11:9',
      scriptureText: 'Therefore its name was called Babel, because there the Lord confused the language of all the earth. And from there the Lord dispersed them…',
      narration: 'God confuses language and scatters the nations.',
      imageKey: 'g10_nations',
    },
  ],
  12: [
    {
      title: 'Go from your country',
      scriptureRef: 'Genesis 12:1–2',
      scriptureText: 'Now the Lord said to Abram, “Go from your country and your kindred and your father’s house to the land that I will show you. And I will make of you a great nation…”',
      narration: 'God calls Abram to leave home with a promise.',
      imageKey: 'g12_stars',
    },
    {
      title: 'Blessing for the world',
      scriptureRef: 'Genesis 12:3',
      scriptureText: 'I will bless those who bless you, and him who dishonors you I will curse, and in you all the families of the earth shall be blessed.',
      narration: 'Through Abram, blessing will reach every family.',
      imageKey: 'g15_covenant',
    },
  ],
  13: [
    {
      title: 'Lot chooses the plain',
      scriptureRef: 'Genesis 13:10–11',
      scriptureText: 'And Lot lifted up his eyes and saw that the Jordan Valley was well watered everywhere… So Lot chose for himself all the Jordan Valley…',
      narration: 'Lot picks what looks best — near Sodom.',
      imageKey: 'g13_parting',
    },
    {
      title: 'Look from this place',
      scriptureRef: 'Genesis 13:14–15',
      scriptureText: 'The Lord said to Abram… “Lift up your eyes and look from the place where you are… for all the land that you see I will give to you and to your offspring forever.”',
      narration: 'God renews the land promise to Abram.',
      imageKey: 'g12_stars',
    },
  ],
  14: [
    {
      title: 'Abram rescues Lot',
      scriptureRef: 'Genesis 14:16',
      scriptureText: 'Then he brought back all the possessions, and also brought back his kinsman Lot with his possessions, and the women and the people.',
      narration: 'Abram pursues the kings and brings Lot home.',
      imageKey: 'g14_melch',
    },
    {
      title: 'Blessed by Melchizedek',
      scriptureRef: 'Genesis 14:19–20',
      scriptureText: 'And he blessed him and said, “Blessed be Abram by God Most High, Possessor of heaven and earth; and blessed be God Most High, who has delivered your enemies into your hand!”',
      narration: 'A priest-king blesses Abram after the victory.',
      imageKey: 'g12_stars',
    },
  ],
  15: [
    {
      title: 'Look toward heaven',
      scriptureRef: 'Genesis 15:5–6',
      scriptureText: 'And he brought him outside and said, “Look toward heaven, and number the stars, if you are able to number them.” … And he believed the Lord, and he counted it to him as righteousness.',
      narration: 'Abram believes — and God counts it as righteousness.',
      imageKey: 'g15_covenant',
    },
    {
      title: 'A covenant cut',
      scriptureRef: 'Genesis 15:18',
      scriptureText: 'On that day the Lord made a covenant with Abram, saying, “To your offspring I give this land…”',
      narration: 'God seals the promise with a solemn covenant.',
      imageKey: 'g12_stars',
    },
  ],
  16: [
    {
      title: 'God of seeing',
      scriptureRef: 'Genesis 16:13',
      scriptureText: 'So she called the name of the Lord who spoke to her, “You are a God of seeing,” for she said, “Truly here I have seen him who looks after me.”',
      narration: 'Hagar meets the God who sees and cares.',
      imageKey: 'g16_hagar',
    },
    {
      title: 'Ishmael is born',
      scriptureRef: 'Genesis 16:11',
      scriptureText: 'And the angel of the Lord said to her, “Behold, you are pregnant and shall bear a son. You shall call his name Ishmael, because the Lord has listened to your affliction.”',
      narration: 'God hears Hagar’s affliction.',
      imageKey: 'g21_isaac',
    },
  ],
  17: [
    {
      title: 'Abraham’s new name',
      scriptureRef: 'Genesis 17:5',
      scriptureText: 'No longer shall your name be called Abram, but your name shall be Abraham, for I have made you the father of a multitude of nations.',
      narration: 'God renames Abram — father of many nations.',
      imageKey: 'g15_covenant',
    },
    {
      title: 'Isaac promised',
      scriptureRef: 'Genesis 17:19',
      scriptureText: 'God said, “No, but Sarah your wife shall bear you a son, and you shall call his name Isaac. I will establish my covenant with him…”',
      narration: 'The covenant son will be Isaac.',
      imageKey: 'g21_isaac',
    },
  ],
  18: [
    {
      title: 'Is anything too hard?',
      scriptureRef: 'Genesis 18:14',
      scriptureText: 'Is anything too hard for the Lord? At the appointed time I will return to you, about this time next year, and Sarah shall have a son.',
      narration: 'Visitors announce Isaac’s birth to laughing Sarah.',
      imageKey: 'g18_mamre',
    },
    {
      title: 'Abraham intercedes',
      scriptureRef: 'Genesis 18:32',
      scriptureText: 'Then he said, “Oh let not the Lord be angry, and I will speak again but this once. Suppose ten are found there.” He answered, “For the sake of ten I will not destroy it.”',
      narration: 'Abraham pleads for Sodom — down to ten righteous.',
      imageKey: 'g21_isaac',
    },
  ],
  19: [
    {
      title: 'Merciful rescue',
      scriptureRef: 'Genesis 19:16',
      scriptureText: 'But he lingered. So the men seized him and his wife and his two daughters by the hand, the Lord being merciful to him, and they brought him out and set him outside the city.',
      narration: 'Angels pull Lot’s family out by the hand.',
      imageKey: 'g19_flight',
    },
    {
      title: 'Do not look back',
      scriptureRef: 'Genesis 19:17',
      scriptureText: 'And as they brought them out, one said, “Escape for your life. Do not look back or stop anywhere in the valley. Escape to the hills, lest you be swept away.”',
      narration: 'Judgment falls — escape without looking back.',
      imageKey: 'g18_mamre',
    },
  ],
  20: [
    {
      title: 'God keeps Sarah',
      scriptureRef: 'Genesis 20:6',
      scriptureText: 'Then God said to him in the dream, “Yes, I know that you have done this in the integrity of your heart, and it was I who kept you from sinning against me.”',
      narration: 'God protects the promised line in Gerar.',
      imageKey: 'g12_stars',
    },
    {
      title: 'Abraham prays',
      scriptureRef: 'Genesis 20:17',
      scriptureText: 'Then Abraham prayed to God, and God healed Abimelech, and also healed his wife and female slaves so that they bore children.',
      narration: 'Prayer and honesty restore the household.',
      imageKey: 'g15_covenant',
    },
  ],
  21: [
    {
      title: 'Isaac is born',
      scriptureRef: 'Genesis 21:1–2',
      scriptureText: 'The Lord visited Sarah as he had said, and the Lord did to Sarah as he had promised. And Sarah conceived and bore Abraham a son in his old age…',
      narration: 'Laughter becomes joy — Isaac is born.',
      imageKey: 'g21_isaac',
    },
    {
      title: 'God hears the boy',
      scriptureRef: 'Genesis 21:17',
      scriptureText: 'And God heard the voice of the boy, and the angel of God called to Hagar from heaven… “Fear not, for God has heard the voice of the boy where he is.”',
      narration: 'Ishmael is preserved in the wilderness.',
      imageKey: 'g16_hagar',
    },
  ],
  22: [
    {
      title: 'God will provide',
      scriptureRef: 'Genesis 22:8',
      scriptureText: 'Abraham said, “God will provide for himself the lamb for a burnt offering, my son.” So they went both of them together.',
      narration: 'Father and son climb Moriah in trust.',
      imageKey: 'g22_moriah',
    },
    {
      title: 'The ram provided',
      scriptureRef: 'Genesis 22:13–14',
      scriptureText: 'And Abraham lifted up his eyes and looked, and behold, behind him was a ram, caught in a thicket by his horns… So Abraham called the name of that place, “The Lord will provide.”',
      narration: 'God provides a ram — and swears the blessing.',
      imageKey: 'g21_isaac',
    },
  ],
  23: [
    {
      title: 'Sarah dies',
      scriptureRef: 'Genesis 23:1–2',
      scriptureText: 'Sarah lived 127 years… And Sarah died at Kiriath-arba (that is, Hebron) in the land of Canaan, and Abraham went in to mourn for Sarah and to weep for her.',
      narration: 'Abraham mourns Sarah in the land of promise.',
      imageKey: 'g23_mach',
    },
    {
      title: 'A cave purchased',
      scriptureRef: 'Genesis 23:19',
      scriptureText: 'After this, Abraham buried Sarah his wife in the cave of the field of Machpelah east of Mamre (that is, Hebron) in the land of Canaan.',
      narration: 'The first owned piece of the promised land.',
      imageKey: 'g24_rebekah',
    },
  ],
  24: [
    {
      title: 'The Lord leads',
      scriptureRef: 'Genesis 24:27',
      scriptureText: 'Blessed be the Lord, the God of my master Abraham, who has not forsaken his steadfast love and his faithfulness toward my master.',
      narration: 'Abraham’s servant is guided to Rebekah.',
      imageKey: 'g24_rebekah',
    },
    {
      title: 'I will go',
      scriptureRef: 'Genesis 24:58',
      scriptureText: 'And they called Rebekah and said to her, “Will you go with this man?” She said, “I will go.”',
      narration: 'Rebekah chooses to leave and become Isaac’s wife.',
      imageKey: 'g21_isaac',
    },
  ],
  25: [
    {
      title: 'Two nations',
      scriptureRef: 'Genesis 25:23',
      scriptureText: 'And the Lord said to her, “Two nations are in your womb, and two peoples from within you shall be divided; the one shall be stronger than the other, the older shall serve the younger.”',
      narration: 'Esau and Jacob struggle even before birth.',
      imageKey: 'g25_stew',
    },
    {
      title: 'Birthright for stew',
      scriptureRef: 'Genesis 25:33–34',
      scriptureText: 'Jacob said, “Swear to me first.” So he swore to him and sold his birthright to Jacob. Then Jacob gave Esau bread and lentil stew… Thus Esau despised his birthright.',
      narration: 'A hungry choice sells a sacred birthright.',
      imageKey: 'g27_bless',
    },
  ],
  26: [
    {
      title: 'Promise renewed',
      scriptureRef: 'Genesis 26:4',
      scriptureText: 'I will multiply your offspring as the stars of heaven and will give to your offspring all these lands. And in your offspring all the nations of the earth shall be blessed.',
      narration: 'God repeats Abraham’s promise to Isaac.',
      imageKey: 'g22_moriah',
    },
    {
      title: 'Wells and peace',
      scriptureRef: 'Genesis 26:24',
      scriptureText: 'And the Lord appeared to him the same night and said, “I am the God of Abraham your father. Fear not, for I am with you…”',
      narration: 'In Gerar, God is with Isaac.',
      imageKey: 'g15_covenant',
    },
  ],
  27: [
    {
      title: 'The blessing given',
      scriptureRef: 'Genesis 27:28–29',
      scriptureText: 'May God give you of the dew of heaven and of the fatness of the earth… Let peoples serve you, and nations bow down to you…',
      narration: 'Jacob receives the blessing meant for Esau.',
      imageKey: 'g27_bless',
    },
    {
      title: 'Esau’s cry',
      scriptureRef: 'Genesis 27:34',
      scriptureText: 'As soon as Esau heard the words of his father, he cried out with an exceedingly great and bitter cry and said to his father, “Bless me, even me also, O my father!”',
      narration: 'Grief and anger follow the stolen blessing.',
      imageKey: 'g25_stew',
    },
  ],
  28: [
    {
      title: 'Ladder to heaven',
      scriptureRef: 'Genesis 28:12–13',
      scriptureText: 'And he dreamed, and behold, there was a ladder set up on the earth, and the top of it reached to heaven. And behold, the angels of God were ascending and descending on it!',
      narration: 'At Bethel, heaven opens over Jacob.',
      imageKey: 'g28_bethel',
    },
    {
      title: 'I am with you',
      scriptureRef: 'Genesis 28:15',
      scriptureText: 'Behold, I am with you and will keep you wherever you go, and will bring you back to this land. For I will not leave you until I have done what I have promised you.',
      narration: 'God promises presence on the journey.',
      imageKey: 'g32_peniel',
    },
  ],
  29: [
    {
      title: 'Love for Rachel',
      scriptureRef: 'Genesis 29:20',
      scriptureText: 'So Jacob served seven years for Rachel, and they seemed to him but a few days because of the love he had for her.',
      narration: 'Jacob serves for the one he loves.',
      imageKey: 'g29_rachel',
    },
    {
      title: 'Leah and Rachel',
      scriptureRef: 'Genesis 29:25',
      scriptureText: 'And in the morning, behold, it was Leah! And Jacob said to Laban, “What is this you have done to me? Did I not serve with you for Rachel?”',
      narration: 'Deception twists the wedding — yet God is still at work.',
      imageKey: 'g28_bethel',
    },
  ],
  30: [
    {
      title: 'God remembers Rachel',
      scriptureRef: 'Genesis 30:22',
      scriptureText: 'Then God remembered Rachel, and God listened to her and opened her womb.',
      narration: 'Rachel’s longing is heard.',
      imageKey: 'g29_rachel',
    },
    {
      title: 'Flocks multiply',
      scriptureRef: 'Genesis 30:43',
      scriptureText: 'Thus the man increased greatly and had large flocks, female servants and male servants, and camels and donkeys.',
      narration: 'God prospers Jacob’s household.',
      imageKey: 'g25_stew',
    },
  ],
  31: [
    {
      title: 'Return to your land',
      scriptureRef: 'Genesis 31:3',
      scriptureText: 'Then the Lord said to Jacob, “Return to the land of your fathers and to your kindred, and I will be with you.”',
      narration: 'God calls Jacob homeward.',
      imageKey: 'g28_bethel',
    },
    {
      title: 'The Lord watch',
      scriptureRef: 'Genesis 31:49',
      scriptureText: 'and Mizpah, for he said, “The Lord watch between you and me, when we are out of one another’s sight.”',
      narration: 'Jacob and Laban make a covenant of peace.',
      imageKey: 'g33_embrace',
    },
  ],
  32: [
    {
      title: 'I am unworthy',
      scriptureRef: 'Genesis 32:10',
      scriptureText: 'I am not worthy of the least of all the deeds of steadfast love and all the faithfulness that you have shown to your servant…',
      narration: 'Jacob prays in fear before meeting Esau.',
      imageKey: 'g32_peniel',
    },
    {
      title: 'Renamed Israel',
      scriptureRef: 'Genesis 32:28',
      scriptureText: 'Then he said, “Your name shall no longer be called Jacob, but Israel, for you have striven with God and with men, and have prevailed.”',
      narration: 'Jacob wrestles — and limps away blessed.',
      imageKey: 'g33_embrace',
    },
  ],
  33: [
    {
      title: 'Brotherly embrace',
      scriptureRef: 'Genesis 33:4',
      scriptureText: 'But Esau ran to meet him and embraced him and fell on his neck and kissed him, and they wept.',
      narration: 'Fear melts into forgiveness.',
      imageKey: 'g33_embrace',
    },
    {
      title: 'God has been gracious',
      scriptureRef: 'Genesis 33:11',
      scriptureText: 'Please accept my blessing that is brought to you, because God has dealt graciously with me, and because I have enough.” Thus he urged him, and he took it.',
      narration: 'Gifts and grace seal the reunion.',
      imageKey: 'g32_peniel',
    },
  ],
  34: [
    {
      title: 'An outrageous thing',
      scriptureRef: 'Genesis 34:7',
      scriptureText: 'The sons of Jacob had come in from the field as soon as they heard of it, and the men were indignant and very angry, because he had done an outrageous thing in Israel…',
      narration: 'Wrong done to Dinah brings fury and grief.',
      imageKey: 'g37_coat',
    },
    {
      title: 'Trouble among the peoples',
      scriptureRef: 'Genesis 34:30',
      scriptureText: 'Then Jacob said to Simeon and Levi, “You have brought trouble on me by making me stink to the inhabitants of the land…”',
      narration: 'Revenge leaves Jacob shaken among neighbors.',
      imageKey: 'g33_embrace',
    },
  ],
  35: [
    {
      title: 'Put away foreign gods',
      scriptureRef: 'Genesis 35:2–3',
      scriptureText: 'So Jacob said to his household… “Put away the foreign gods that are among you and purify yourselves… that I may make an altar to the God who answers me in the day of my distress.”',
      narration: 'The family returns to worship at Bethel.',
      imageKey: 'g35_bethel',
    },
    {
      title: 'A nation from you',
      scriptureRef: 'Genesis 35:11',
      scriptureText: 'And God said to him, “I am God Almighty: be fruitful and multiply. A nation and a company of nations shall come from you, and kings shall come from your own body.”',
      narration: 'God renews the promise to Israel.',
      imageKey: 'g28_bethel',
    },
  ],
  36: [
    {
      title: 'Esau is Edom',
      scriptureRef: 'Genesis 36:8',
      scriptureText: 'So Esau settled in the hill country of Seir. (Esau is Edom.)',
      narration: 'Esau’s line settles as a nation beside Israel.',
      imageKey: 'g10_nations',
    },
    {
      title: 'Chiefs of Edom',
      scriptureRef: 'Genesis 36:43',
      scriptureText: 'these are the chiefs of Edom (that is, Esau, the father of Edom), according to their dwelling places in the land of their possession.',
      narration: 'Clans and chiefs fill the hills of Seir.',
      imageKey: 'g11_babel',
    },
  ],
  37: [
    {
      title: 'Coat of many colors',
      scriptureRef: 'Genesis 37:3',
      scriptureText: 'Now Israel loved Joseph more than any other of his sons, because he was the son of his old age. And he made him a robe of many colors.',
      narration: 'Favoritism sparks jealousy.',
      imageKey: 'g37_coat',
    },
    {
      title: 'Sold to Egypt',
      scriptureRef: 'Genesis 37:28',
      scriptureText: 'Then Midianite traders passed by. And they drew Joseph up and lifted him out of the pit, and sold him to the Ishmaelites for twenty shekels of silver. They took Joseph to Egypt.',
      narration: 'Brothers sell Joseph — a caravan carries him away.',
      imageKey: 'g37_caravan',
    },
  ],
  38: [
    {
      title: 'She is more righteous',
      scriptureRef: 'Genesis 38:26',
      scriptureText: 'Then Judah identified them and said, “She is more righteous than I, since I did not give her to my son Shelah.” And he did not know her again.',
      narration: 'Judah confesses — the family line is preserved.',
      imageKey: 'g38_judah',
    },
    {
      title: 'A line continues',
      scriptureRef: 'Genesis 38:29–30',
      scriptureText: '…And he called his name Perez. Afterward his brother came out with the scarlet thread on his hand, and his name was called Zerah.',
      narration: 'Unexpected twins keep the promise moving forward.',
      imageKey: 'g37_coat',
    },
  ],
  39: [
    {
      title: 'The Lord was with Joseph',
      scriptureRef: 'Genesis 39:2',
      scriptureText: 'The Lord was with Joseph, and he became a successful man, and he was in the house of his Egyptian master.',
      narration: 'In Potiphar’s house, God prospers Joseph.',
      imageKey: 'g39_potiphar',
    },
    {
      title: 'Faithful in prison',
      scriptureRef: 'Genesis 39:21',
      scriptureText: 'But the Lord was with Joseph and showed him steadfast love and gave him favor in the sight of the keeper of the prison.',
      narration: 'Falsely accused — yet God still shows love.',
      imageKey: 'g40_prison',
    },
  ],
  40: [
    {
      title: 'Interpretations belong to God',
      scriptureRef: 'Genesis 40:8',
      scriptureText: 'They said to him, “We have had dreams, and there is no one to interpret them.” And Joseph said to them, “Do not interpretations belong to God? Please tell them to me.”',
      narration: 'In prison, Joseph points to God as the interpreter.',
      imageKey: 'g40_prison',
    },
    {
      title: 'Remember me',
      scriptureRef: 'Genesis 40:14',
      scriptureText: 'Only remember me, when it is well with you, and please do me the kindness to mention me to Pharaoh, and so get me out of this house.',
      narration: 'The cupbearer is restored — but forgets Joseph.',
      imageKey: 'g41_dreams',
    },
  ],
  41: [
    {
      title: 'God will answer',
      scriptureRef: 'Genesis 41:16',
      scriptureText: 'Joseph answered Pharaoh, “It is not in me; God will give Pharaoh a favorable answer.”',
      narration: 'Joseph stands before Pharaoh in humility.',
      imageKey: 'g41_dreams',
    },
    {
      title: 'Plenty and famine',
      scriptureRef: 'Genesis 41:29–30',
      scriptureText: 'There will come seven years of great plenty throughout all the land of Egypt, but after them there will arise seven years of famine…',
      narration: 'Dreams warn Egypt — and Joseph is raised to prepare.',
      imageKey: 'g40_prison',
    },
  ],
  42: [
    {
      title: 'Unrecognized',
      scriptureRef: 'Genesis 42:8',
      scriptureText: 'And Joseph recognized his brothers, but they did not recognize him.',
      narration: 'Brothers bow for grain — Joseph knows them.',
      imageKey: 'g42_brothers',
    },
    {
      title: 'Tested hearts',
      scriptureRef: 'Genesis 42:21',
      scriptureText: 'Then they said to one another, “In truth we are guilty concerning our brother, in that we saw the distress of his soul…”',
      narration: 'Guilt surfaces as Joseph tests them.',
      imageKey: 'g44_cup',
    },
  ],
  43: [
    {
      title: 'Judah’s pledge',
      scriptureRef: 'Genesis 43:9',
      scriptureText: 'I will be a pledge of his safety. From my hand you shall require him. If I do not bring him back to you and set him before you, then let me bear the blame forever.',
      narration: 'Judah stands surety for Benjamin.',
      imageKey: 'g42_brothers',
    },
    {
      title: 'Mercy before the man',
      scriptureRef: 'Genesis 43:14',
      scriptureText: 'May God Almighty grant you mercy before the man, and may he send back your other brother and Benjamin…',
      narration: 'Jacob releases Benjamin into God’s mercy.',
      imageKey: 'g45_reunion',
    },
  ],
  44: [
    {
      title: 'The cup is found',
      scriptureRef: 'Genesis 44:12',
      scriptureText: 'And he searched, beginning with the eldest and ending with the youngest. And the cup was found in Benjamin’s sack.',
      narration: 'A planted cup stops the journey home.',
      imageKey: 'g44_cup',
    },
    {
      title: 'Judah’s plea',
      scriptureRef: 'Genesis 44:33',
      scriptureText: 'Now therefore, please let your servant remain instead of the boy as a servant to my lord, and let the boy go back with his brothers.',
      narration: 'Judah offers himself in Benjamin’s place.',
      imageKey: 'g42_brothers',
    },
  ],
  45: [
    {
      title: 'I am Joseph',
      scriptureRef: 'Genesis 45:4–5',
      scriptureText: 'So Joseph said to his brothers, “Come near to me, please.” And they came near. And he said, “I am your brother, Joseph, whom you sold into Egypt. And now do not be distressed… for God sent me before you to preserve life.”',
      narration: 'Revelation and forgiveness fill the room.',
      imageKey: 'g45_reunion',
    },
    {
      title: 'God meant it for good',
      scriptureRef: 'Genesis 45:7–8',
      scriptureText: 'And God sent me before you to preserve for you a remnant on earth… So it was not you who sent me here, but God.',
      narration: 'Joseph sees God’s hand in the pain.',
      imageKey: 'g50_forgive',
    },
  ],
  46: [
    {
      title: 'Do not be afraid',
      scriptureRef: 'Genesis 46:3–4',
      scriptureText: 'Then he said, “I am God, the God of your father. Do not be afraid to go down to Egypt, for there I will make you into a great nation. I myself will go down with you…”',
      narration: 'Jacob hears God and takes the family to Egypt.',
      imageKey: 'g37_caravan',
    },
    {
      title: 'Joseph meets Israel',
      scriptureRef: 'Genesis 46:29',
      scriptureText: 'Then Joseph prepared his chariot and went up to meet Israel his father in Goshen. He presented himself to him and fell on his neck and wept on his neck a good while.',
      narration: 'Father and son reunite at last.',
      imageKey: 'g45_reunion',
    },
  ],
  47: [
    {
      title: 'Settle in Goshen',
      scriptureRef: 'Genesis 47:5–6',
      scriptureText: 'Then Pharaoh said to Joseph, “Your father and your brothers have come to you. The land of Egypt is before you. Settle your father and your brothers in the best of the land.”',
      narration: 'Pharaoh welcomes Israel’s family.',
      imageKey: 'g45_reunion',
    },
    {
      title: 'Joseph provides',
      scriptureRef: 'Genesis 47:12',
      scriptureText: 'And Joseph provided his father, his brothers, and all his father’s household with food, according to the number of their dependents.',
      narration: 'In famine, Joseph feeds his family.',
      imageKey: 'g41_dreams',
    },
  ],
  48: [
    {
      title: 'Ephraim and Manasseh',
      scriptureRef: 'Genesis 48:5',
      scriptureText: 'And now your two sons, who were born to you in the land of Egypt before I came to you in Egypt, are mine; Ephraim and Manasseh shall be mine…',
      narration: 'Jacob adopts Joseph’s sons as his own.',
      imageKey: 'g50_forgive',
    },
    {
      title: 'The younger first',
      scriptureRef: 'Genesis 48:19',
      scriptureText: 'But his father refused and said, “I know, my son, I know. He also shall become a people, and he also shall be great. Nevertheless, his younger brother shall be greater than he…”',
      narration: 'Crossing hands, Jacob blesses Ephraim first.',
      imageKey: 'g27_bless',
    },
  ],
  49: [
    {
      title: 'Gather and hear',
      scriptureRef: 'Genesis 49:1–2',
      scriptureText: 'Then Jacob called his sons and said, “Gather yourselves together, that I may tell you what shall happen to you in days to come. Assemble and listen, O sons of Jacob…”',
      narration: 'Jacob speaks a future over each son.',
      imageKey: 'g50_forgive',
    },
    {
      title: 'The scepter of Judah',
      scriptureRef: 'Genesis 49:10',
      scriptureText: 'The scepter shall not depart from Judah, nor the ruler’s staff from between his feet, until tribute comes to him; and to him shall be the obedience of the peoples.',
      narration: 'A king-promise shines from Judah’s line.',
      imageKey: 'g38_judah',
    },
  ],
  50: [
    {
      title: 'God meant it for good',
      scriptureRef: 'Genesis 50:20',
      scriptureText: 'As for you, you meant evil against me, but God meant it for good, to bring it about that many people should be kept alive, as they are today.',
      narration: 'Joseph comforts his brothers with God’s purpose.',
      imageKey: 'g50_forgive',
    },
    {
      title: 'Joseph’s last faith',
      scriptureRef: 'Genesis 50:24–25',
      scriptureText: 'And Joseph said to his brothers, “I am about to die, but God will visit you and bring you up out of this land to the land that he swore to Abraham, to Isaac, and to Jacob.”',
      narration: 'Genesis ends looking toward the promised land.',
      imageKey: 'g45_reunion',
    },
  ],
};

export function getGenesisChapterSlides(
  chapterNumber: number
): GenesisChapterSlide[] {
  const defs = SLIDE_DEFS[chapterNumber] ?? [];
  return defs.map((def) => ({
    title: def.title,
    scriptureRef: def.scriptureRef,
    scriptureText: def.scriptureText,
    narration: def.narration,
    image: IMAGES[def.imageKey],
  }));
}

/** Audio guide lines: intro + each slide (narration then scripture). */
export function buildGenesisGuideScript(meta: GenesisChapterMeta): string[] {
  const slides = getGenesisChapterSlides(meta.number);
  const lines: string[] = [
    `Welcome to ${meta.passageQuery} — ${meta.title}.`,
    meta.summary,
  ];
  for (const slide of slides) {
    lines.push(slide.narration);
    lines.push(`${slide.scriptureRef}. ${slide.scriptureText}`);
  }
  lines.push(
    "Pause anytime to read the full chapter, then keep going tomorrow."
  );
  return lines;
}

export function buildGenesisComicPanels(chapterNumber: number) {
  return getGenesisChapterSlides(chapterNumber).map((slide, index) => ({
    id: `g${chapterNumber}-s${index + 1}`,
    title: `${slide.title} · ${slide.scriptureRef}`,
    caption: `${slide.narration} ${slide.scriptureText}`,
    image: slide.image,
    scriptureRef: slide.scriptureRef,
  }));
}

/** Ensure every chapter 1–50 has at least two slides. */
export function assertGenesisSlidesComplete(): void {
  for (const meta of GENESIS_CHAPTERS) {
    const slides = getGenesisChapterSlides(meta.number);
    if (slides.length < 2) {
      throw new Error(`Genesis ${meta.number} needs story slides`);
    }
  }
}

