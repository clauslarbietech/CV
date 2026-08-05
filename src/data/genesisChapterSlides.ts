/**
 * Scripture-matched story slideshow for every Genesis chapter.
 * Each slide pairs an image with ESV wording; audio reads only ESV.
 * Every chapter has multiple story beats with chapter-matched art.
 */

import type { GenesisChapterMeta } from "./genesisChapters";
import { GENESIS_CHAPTERS } from "./genesisChapters";

export type GenesisChapterSlide = {
  title: string;
  scriptureRef: string;
  /** Exact ESV wording for this beat (shown + read aloud). */
  scriptureText: string;
  image: number;
};

const IMAGES = {
  g1_darkness: require("../../assets/webtoon/genesis-1/01-darkness.jpg"),
  g1_day2_expanse: require("../../assets/webtoon/genesis-1/04-day2-expanse.jpg"),
  g1_day3_land: require("../../assets/webtoon/genesis-1/05-day3-land.jpg"),
  g1_day4_lights: require("../../assets/webtoon/genesis-1/06-day4-lights.jpg"),
  g1_day5_creatures: require("../../assets/webtoon/genesis-1/07-day5-creatures.jpg"),
  g1_day6_adam: require("../../assets/webtoon/genesis-1/09-day6-adam.jpg"),
  g1_day6_animals: require("../../assets/webtoon/genesis-1/08-day6-animals.jpg"),
  g1_day7_rest: require("../../assets/webtoon/genesis-1/10-day7-rest.jpg"),
  g1_day_night: require("../../assets/webtoon/genesis-1/03-day-night.jpg"),
  g1_light: require("../../assets/webtoon/genesis-1/02-light.jpg"),
  g2_adam_rib_bush: require("../../assets/webtoon/genesis-2/01-adam-rib-bush.jpg"),
  g2_eden_together: require("../../assets/webtoon/genesis-2/02-eden-together.jpg"),
  g2_eve_bush: require("../../assets/webtoon/genesis-2/02-eve-bush.jpg"),
  g2_naming: require("../../assets/webtoon/genesis-2/03-naming.jpg"),
  g3_eve_bites: require("../../assets/webtoon/genesis-3/03-eve-bites.jpg"),
  g3_exile: require("../../assets/webtoon/genesis-3/06-exile.jpg"),
  g3_garden: require("../../assets/webtoon/genesis-3/01-garden.jpg"),
  g3_offer: require("../../assets/webtoon/genesis-3/04-offer.jpg"),
  g3_serpent: require("../../assets/webtoon/genesis-3/05-serpent.jpg"),
  g3_whisper: require("../../assets/webtoon/genesis-3/02-whisper.jpg"),
  g4_brothers: require("../../assets/webtoon/genesis-4/02-brothers.jpg"),
  g4_mark: require("../../assets/webtoon/genesis-4/03-mark.jpg"),
  g4_offerings: require("../../assets/webtoon/genesis-4/01-offerings.jpg"),
  g5_enoch: require("../../assets/webtoon/genesis-5/01-enoch.jpg"),
  g5_line: require("../../assets/webtoon/genesis-5/03-line.jpg"),
  g5_taken: require("../../assets/webtoon/genesis-5/02-taken.jpg"),
  g6_animals: require("../../assets/webtoon/genesis-6/02-animals.jpg"),
  g6_ark: require("../../assets/webtoon/genesis-6/01-ark.jpg"),
  g7_flood: require("../../assets/webtoon/genesis-7/01-flood.jpg"),
  g7_rain: require("../../assets/webtoon/genesis-7/02-rain.jpg"),
  g8_dove: require("../../assets/webtoon/genesis-8/02-dove.jpg"),
  g8_land: require("../../assets/webtoon/genesis-8/03-land.jpg"),
  g8_recede: require("../../assets/webtoon/genesis-8/01-recede.jpg"),
  g9_altar: require("../../assets/webtoon/genesis-9/02-altar.jpg"),
  g9_rainbow: require("../../assets/webtoon/genesis-9/01-rainbow.jpg"),
  g10_nations: require("../../assets/webtoon/genesis-10/01-nations.jpg"),
  g10_peoples: require("../../assets/webtoon/genesis-10/02-peoples.jpg"),
  g11_babel: require("../../assets/webtoon/genesis-11/01-babel.jpg"),
  g11_scatter: require("../../assets/webtoon/genesis-11/02-scatter.jpg"),
  g12_journey: require("../../assets/webtoon/genesis-12/02-journey.jpg"),
  g12_stars: require("../../assets/webtoon/genesis-12/01-stars.jpg"),
  g13_jordan: require("../../assets/webtoon/genesis-13/02-jordan.jpg"),
  g13_parting: require("../../assets/webtoon/genesis-13/01-parting.jpg"),
  g14_melchizedek: require("../../assets/webtoon/genesis-14/01-melchizedek.jpg"),
  g14_rescue: require("../../assets/webtoon/genesis-14/02-rescue.jpg"),
  g15_covenant: require("../../assets/webtoon/genesis-15/01-covenant.jpg"),
  g15_firepot: require("../../assets/webtoon/genesis-15/02-firepot.jpg"),
  g16_hagar: require("../../assets/webtoon/genesis-16/01-hagar.jpg"),
  g16_spring: require("../../assets/webtoon/genesis-16/02-spring.jpg"),
  g17_names: require("../../assets/webtoon/genesis-17/01-names.jpg"),
  g17_promise: require("../../assets/webtoon/genesis-17/02-promise.jpg"),
  g18_mamre: require("../../assets/webtoon/genesis-18/01-mamre.jpg"),
  g18_sarah: require("../../assets/webtoon/genesis-18/02-sarah.jpg"),
  g19_flight: require("../../assets/webtoon/genesis-19/01-flight.jpg"),
  g19_pillar: require("../../assets/webtoon/genesis-19/02-pillar.jpg"),
  g20_abimelech: require("../../assets/webtoon/genesis-20/01-abimelech.jpg"),
  g20_peace: require("../../assets/webtoon/genesis-20/02-peace.jpg"),
  g21_isaac_born: require("../../assets/webtoon/genesis-21/01-isaac-born.jpg"),
  g21_well: require("../../assets/webtoon/genesis-21/02-well.jpg"),
  g22_moriah: require("../../assets/webtoon/genesis-22/01-moriah.jpg"),
  g22_ram: require("../../assets/webtoon/genesis-22/02-ram.jpg"),
  g23_cave: require("../../assets/webtoon/genesis-23/02-cave.jpg"),
  g23_machpelah: require("../../assets/webtoon/genesis-23/01-machpelah.jpg"),
  g24_camels: require("../../assets/webtoon/genesis-24/02-camels.jpg"),
  g24_rebekah: require("../../assets/webtoon/genesis-24/01-rebekah.jpg"),
  g25_stew: require("../../assets/webtoon/genesis-25/01-stew.jpg"),
  g25_twins: require("../../assets/webtoon/genesis-25/02-twins.jpg"),
  g26_promise: require("../../assets/webtoon/genesis-26/02-promise.jpg"),
  g26_wells: require("../../assets/webtoon/genesis-26/01-wells.jpg"),
  g27_blessing: require("../../assets/webtoon/genesis-27/01-blessing.jpg"),
  g27_flee: require("../../assets/webtoon/genesis-27/02-flee.jpg"),
  g28_bethel: require("../../assets/webtoon/genesis-28/01-bethel.jpg"),
  g28_ladder: require("../../assets/webtoon/genesis-28/02-ladder.jpg"),
  g29_leah: require("../../assets/webtoon/genesis-29/02-leah.jpg"),
  g29_rachel: require("../../assets/webtoon/genesis-29/01-rachel.jpg"),
  g30_children: require("../../assets/webtoon/genesis-30/01-children.jpg"),
  g30_flocks: require("../../assets/webtoon/genesis-30/02-flocks.jpg"),
  g31_mizpah: require("../../assets/webtoon/genesis-31/01-mizpah.jpg"),
  g31_search: require("../../assets/webtoon/genesis-31/02-search.jpg"),
  g32_gifts: require("../../assets/webtoon/genesis-32/02-gifts.jpg"),
  g32_peniel: require("../../assets/webtoon/genesis-32/01-peniel.jpg"),
  g33_embrace: require("../../assets/webtoon/genesis-33/01-embrace.jpg"),
  g33_meet: require("../../assets/webtoon/genesis-33/02-meet.jpg"),
  g34_grief: require("../../assets/webtoon/genesis-34/02-grief.jpg"),
  g34_shechem: require("../../assets/webtoon/genesis-34/01-shechem.jpg"),
  g35_bethel: require("../../assets/webtoon/genesis-35/01-bethel.jpg"),
  g35_rachel: require("../../assets/webtoon/genesis-35/02-rachel.jpg"),
  g36_edom: require("../../assets/webtoon/genesis-36/01-edom.jpg"),
  g36_seir: require("../../assets/webtoon/genesis-36/02-seir.jpg"),
  g37_caravan: require("../../assets/webtoon/genesis-37/02-caravan.jpg"),
  g37_coat: require("../../assets/webtoon/genesis-37/01-coat.jpg"),
  g37_dreams: require("../../assets/webtoon/genesis-37/03-dreams.jpg"),
  g38_judah_tamar: require("../../assets/webtoon/genesis-38/01-judah-tamar.jpg"),
  g38_twins: require("../../assets/webtoon/genesis-38/02-twins.jpg"),
  g39_flee: require("../../assets/webtoon/genesis-39/02-flee.jpg"),
  g39_potiphar: require("../../assets/webtoon/genesis-39/01-potiphar.jpg"),
  g40_dreams: require("../../assets/webtoon/genesis-40/02-dreams.jpg"),
  g40_prison: require("../../assets/webtoon/genesis-40/01-prison.jpg"),
  g41_dreams: require("../../assets/webtoon/genesis-41/01-dreams.jpg"),
  g41_exalted: require("../../assets/webtoon/genesis-41/02-exalted.jpg"),
  g42_brothers: require("../../assets/webtoon/genesis-42/01-brothers.jpg"),
  g42_money: require("../../assets/webtoon/genesis-42/02-money.jpg"),
  g43_benjamin: require("../../assets/webtoon/genesis-43/01-benjamin.jpg"),
  g43_feast: require("../../assets/webtoon/genesis-43/02-feast.jpg"),
  g44_cup: require("../../assets/webtoon/genesis-44/01-cup.jpg"),
  g44_planted: require("../../assets/webtoon/genesis-44/02-planted.jpg"),
  g45_reunion: require("../../assets/webtoon/genesis-45/01-reunion.jpg"),
  g45_wagons: require("../../assets/webtoon/genesis-45/02-wagons.jpg"),
  g46_goshen: require("../../assets/webtoon/genesis-46/02-goshen.jpg"),
  g46_vision: require("../../assets/webtoon/genesis-46/01-vision.jpg"),
  g47_grain: require("../../assets/webtoon/genesis-47/02-grain.jpg"),
  g47_pharaoh: require("../../assets/webtoon/genesis-47/01-pharaoh.jpg"),
  g48_blessing: require("../../assets/webtoon/genesis-48/01-blessing.jpg"),
  g48_joseph: require("../../assets/webtoon/genesis-48/02-joseph.jpg"),
  g49_scepter: require("../../assets/webtoon/genesis-49/02-scepter.jpg"),
  g49_sons: require("../../assets/webtoon/genesis-49/01-sons.jpg"),
  g50_burial: require("../../assets/webtoon/genesis-50/03-burial.jpg"),
  g50_coffin: require("../../assets/webtoon/genesis-50/02-coffin.jpg"),
  g50_forgiveness: require("../../assets/webtoon/genesis-50/01-forgiveness.jpg"),
} as const;

type SlideDef = {
  title: string;
  scriptureRef: string;
  scriptureText: string;
  imageKey: keyof typeof IMAGES;
};

const SLIDE_DEFS: Record<number, SlideDef[]> = {
  1: [
    {
      title: 'Darkness over the deep',
      scriptureRef: 'Genesis 1:1–2',
      scriptureText: 'In the beginning, God created the heavens and the earth. The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.',
      imageKey: 'g1_darkness',
    },
    {
      title: 'Let there be light',
      scriptureRef: 'Genesis 1:3–4',
      scriptureText: 'And God said, “Let there be light,” and there was light. And God saw that the light was good. And God separated the light from the darkness.',
      imageKey: 'g1_light',
    },
    {
      title: 'Day and night',
      scriptureRef: 'Genesis 1:5',
      scriptureText: 'God called the light Day, and the darkness he called Night. And there was evening and there was morning, the first day.',
      imageKey: 'g1_day_night',
    },
    {
      title: 'The expanse',
      scriptureRef: 'Genesis 1:6–8',
      scriptureText: 'And God said, “Let there be an expanse in the midst of the waters, and let it separate the waters from the waters.” And God made the expanse and separated the waters that were under the expanse from the waters that were above the expanse. And it was so. And God called the expanse Heaven. And there was evening and there was morning, the second day.',
      imageKey: 'g1_day2_expanse',
    },
    {
      title: 'Land and plants',
      scriptureRef: 'Genesis 1:9–13',
      scriptureText: 'And God said, “Let the waters under the heavens be gathered together into one place, and let the dry land appear.” And it was so. God called the dry land Earth, and the waters that were gathered together he called Seas. And God saw that it was good. And God said, “Let the earth sprout vegetation, plants yielding seed, and fruit trees bearing fruit in which is their seed, each according to its kind, on the earth.” And it was so.',
      imageKey: 'g1_day3_land',
    },
    {
      title: 'Sun, moon, and stars',
      scriptureRef: 'Genesis 1:14–19',
      scriptureText: 'And God said, “Let there be lights in the expanse of the heavens to separate the day from the night. And let them be for signs and for seasons, and for days and years, and let them be lights in the expanse of the heavens to give light upon the earth.” And it was so. And God made the two great lights—the greater light to rule the day and the lesser light to rule the night—and the stars.',
      imageKey: 'g1_day4_lights',
    },
    {
      title: 'Fish and birds',
      scriptureRef: 'Genesis 1:20–23',
      scriptureText: 'And God said, “Let the waters swarm with swarms of living creatures, and let birds fly above the earth across the expanse of the heavens.” So God created the great sea creatures and every living creature that moves, with which the waters swarm, according to their kinds, and every winged bird according to its kind. And God saw that it was good.',
      imageKey: 'g1_day5_creatures',
    },
    {
      title: 'Living creatures on the earth',
      scriptureRef: 'Genesis 1:24–25',
      scriptureText: 'And God said, “Let the earth bring forth living creatures according to their kinds—livestock and creeping things and beasts of the earth according to their kinds.” And it was so. And God made the beasts of the earth according to their kinds and the livestock according to their kinds, and everything that creeps on the ground according to its kind. And God saw that it was good.',
      imageKey: 'g1_day6_animals',
    },
    {
      title: 'Man in God’s image',
      scriptureRef: 'Genesis 1:26–27',
      scriptureText: 'Then God said, “Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth.” So God created man in his own image, in the image of God he created him; male and female he created them.',
      imageKey: 'g1_day6_adam',
    },
    {
      title: 'Behold, it was very good',
      scriptureRef: 'Genesis 1:31',
      scriptureText: 'And God saw everything that he had made, and behold, it was very good. And there was evening and there was morning, the sixth day.',
      imageKey: 'g1_day7_rest',
    },
  ],
  2: [
    {
      title: 'God rested',
      scriptureRef: 'Genesis 2:1–3',
      scriptureText: 'Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done. So God blessed the seventh day and made it holy, because on it God rested from all his work that he had done in creation.',
      imageKey: 'g1_day7_rest',
    },
    {
      title: 'Formed from the dust',
      scriptureRef: 'Genesis 2:7',
      scriptureText: 'then the Lord God formed the man of dust from the ground and breathed into his nostrils the breath of life, and the man became a living creature.',
      imageKey: 'g1_day6_adam',
    },
    {
      title: 'The garden of Eden',
      scriptureRef: 'Genesis 2:8–9',
      scriptureText: 'And the Lord God planted a garden in Eden, in the east, and there he put the man whom he had formed. And out of the ground the Lord God made to spring up every tree that is pleasant to the sight and good for food. The tree of life was in the midst of the garden, and the tree of the knowledge of good and evil.',
      imageKey: 'g2_eden_together',
    },
    {
      title: 'He named every living creature',
      scriptureRef: 'Genesis 2:19–20',
      scriptureText: 'Now out of the ground the Lord God had formed every beast of the field and every bird of the heavens and brought them to the man to see what he would call them. And whatever the man called every living creature, that was its name. The man gave names to all livestock and to the birds of the heavens and to every beast of the field. But for Adam there was not found a helper fit for him.',
      imageKey: 'g2_naming',
    },
    {
      title: 'A rib from the man',
      scriptureRef: 'Genesis 2:21–22',
      scriptureText: 'So the Lord God caused a deep sleep to fall upon the man, and while he slept took one of his ribs and closed up its place with flesh. And the rib that the Lord God had taken from the man he made into a woman and brought her to the man.',
      imageKey: 'g2_adam_rib_bush',
    },
    {
      title: 'One flesh',
      scriptureRef: 'Genesis 2:24–25',
      scriptureText: 'Therefore a man shall leave his father and his mother and hold fast to his wife, and they shall become one flesh. And the man and his wife were both naked and were not ashamed.',
      imageKey: 'g2_eve_bush',
    },
  ],
  3: [
    {
      title: 'The serpent',
      scriptureRef: 'Genesis 3:1',
      scriptureText: 'Now the serpent was more crafty than any other beast of the field that the Lord God had made. He said to the woman, “Did God actually say, ‘You shall not eat of any tree in the garden’?”',
      imageKey: 'g3_garden',
    },
    {
      title: 'The whisper',
      scriptureRef: 'Genesis 3:4–5',
      scriptureText: 'But the serpent said to the woman, “You will not surely die. For God knows that when you eat of it your eyes will be opened, and you will be like God, knowing good and evil.”',
      imageKey: 'g3_whisper',
    },
    {
      title: 'She took and ate',
      scriptureRef: 'Genesis 3:6',
      scriptureText: 'So when the woman saw that the tree was good for food, and that it was a delight to the eyes, and that the tree was to be desired to make one wise, she took of its fruit and ate, and she also gave some to her husband who was with her, and he ate.',
      imageKey: 'g3_eve_bites',
    },
    {
      title: 'She gave also to her husband',
      scriptureRef: 'Genesis 3:6',
      scriptureText: 'and she also gave some to her husband who was with her, and he ate.',
      imageKey: 'g3_offer',
    },
    {
      title: 'The promised offspring',
      scriptureRef: 'Genesis 3:15',
      scriptureText: 'I will put enmity between you and the woman, and between your offspring and her offspring; he shall bruise your head, and you shall bruise his heel.',
      imageKey: 'g3_serpent',
    },
    {
      title: 'Sent out from the garden',
      scriptureRef: 'Genesis 3:23–24',
      scriptureText: 'therefore the Lord God sent him out from the garden of Eden to work the ground from which he was taken. He drove out the man, and at the east of the garden of Eden he placed the cherubim and a flaming sword that turned every way to guard the way to the tree of life.',
      imageKey: 'g3_exile',
    },
  ],
  4: [
    {
      title: 'Offerings',
      scriptureRef: 'Genesis 4:3–5',
      scriptureText: 'In the course of time Cain brought to the Lord an offering of the fruit of the ground, and Abel also brought of the firstborn of his flock and of their fat portions. And the Lord had regard for Abel and his offering, but for Cain and his offering he had no regard. So Cain was very angry, and his face fell.',
      imageKey: 'g4_offerings',
    },
    {
      title: 'Sin crouching',
      scriptureRef: 'Genesis 4:6–7',
      scriptureText: 'The Lord said to Cain, “Why are you angry, and why has your face fallen? If you do well, will you not be accepted? And if you do not do well, sin is crouching at the door. Its desire is contrary to you, but you must rule over it.”',
      imageKey: 'g4_brothers',
    },
    {
      title: 'A mark of mercy',
      scriptureRef: 'Genesis 4:15–16',
      scriptureText: 'Then the Lord said to him, “Not so! If anyone kills Cain, vengeance shall be taken on him sevenfold.” And the Lord put a mark on Cain, lest any who found him should attack him. Then Cain went away from the presence of the Lord and settled in the land of Nod, east of Eden.',
      imageKey: 'g4_mark',
    },
  ],
  5: [
    {
      title: 'Generations of Adam',
      scriptureRef: 'Genesis 5:1–2',
      scriptureText: 'This is the book of the generations of Adam. When God created man, he made him in the likeness of God. Male and female he created them, and he blessed them and named them Man when they were created.',
      imageKey: 'g5_line',
    },
    {
      title: 'Enoch walked with God',
      scriptureRef: 'Genesis 5:24',
      scriptureText: 'Enoch walked with God, and he was not, for God took him.',
      imageKey: 'g5_taken',
    },
    {
      title: 'Noah is born',
      scriptureRef: 'Genesis 5:28–29',
      scriptureText: 'When Lamech had lived 182 years, he fathered a son and called his name Noah, saying, “Out of the ground that the Lord has cursed, this one shall bring us relief from our work and from the painful toil of our hands.”',
      imageKey: 'g5_enoch',
    },
  ],
  6: [
    {
      title: 'Noah found favor',
      scriptureRef: 'Genesis 6:8–9',
      scriptureText: 'But Noah found favor in the eyes of the Lord. These are the generations of Noah. Noah was a righteous man, blameless in his generation. Noah walked with God.',
      imageKey: 'g6_ark',
    },
    {
      title: 'Make yourself an ark',
      scriptureRef: 'Genesis 6:13–14',
      scriptureText: 'And God said to Noah, “I have determined to make an end of all flesh, for the earth is filled with violence through them. Behold, I will destroy them with the earth. Make yourself an ark of gopher wood. Make rooms in the ark, and cover it inside and out with pitch.”',
      imageKey: 'g6_ark',
    },
    {
      title: 'Two of every sort',
      scriptureRef: 'Genesis 6:19–20',
      scriptureText: 'And of every living thing of all flesh, you shall bring two of every sort into the ark to keep them alive with you. They shall be male and female. Of the birds according to their kinds, and of the animals according to their kinds, of every creeping thing of the ground according to its kind, two of every sort shall come in to you to keep them alive.',
      imageKey: 'g6_animals',
    },
  ],
  7: [
    {
      title: 'The Lord shut him in',
      scriptureRef: 'Genesis 7:1, 16',
      scriptureText: 'Then the Lord said to Noah, “Go into the ark, you and all your household, for I have seen that you are righteous before me in this generation.” And those that entered, male and female of all flesh, went in as God had commanded him. And the Lord shut him in.',
      imageKey: 'g6_animals',
    },
    {
      title: 'The flood continued',
      scriptureRef: 'Genesis 7:17–18',
      scriptureText: 'The flood continued forty days on the earth. The waters increased and bore up the ark, and it rose high above the earth. The waters prevailed and increased greatly on the earth, and the ark floated on the face of the waters.',
      imageKey: 'g7_rain',
    },
    {
      title: 'Only Noah was left',
      scriptureRef: 'Genesis 7:23',
      scriptureText: 'He blotted out every living thing that was on the face of the ground, man and animals and creeping things and birds of the heavens. They were blotted out from the earth. Only Noah was left, and those who were with him in the ark.',
      imageKey: 'g7_flood',
    },
  ],
  8: [
    {
      title: 'God remembered Noah',
      scriptureRef: 'Genesis 8:1',
      scriptureText: 'But God remembered Noah and all the beasts and all the livestock that were with him in the ark. And God made a wind blow over the earth, and the waters subsided.',
      imageKey: 'g8_recede',
    },
    {
      title: 'The dove and the olive leaf',
      scriptureRef: 'Genesis 8:11',
      scriptureText: 'And the dove came back to him in the evening, and behold, in her mouth was a freshly plucked olive leaf. So Noah knew that the waters had subsided from the earth.',
      imageKey: 'g8_dove',
    },
    {
      title: 'Go out from the ark',
      scriptureRef: 'Genesis 8:15–17',
      scriptureText: 'Then God said to Noah, “Go out from the ark, you and your wife, and your sons and your sons’ wives with you. Bring out with you every living thing that is with you of all flesh—birds and animals and every creeping thing that creeps on the earth—that they may swarm on the earth, and be fruitful and multiply on the earth.”',
      imageKey: 'g8_land',
    },
  ],
  9: [
    {
      title: 'Be fruitful and multiply',
      scriptureRef: 'Genesis 9:1',
      scriptureText: 'And God blessed Noah and his sons and said to them, “Be fruitful and multiply and fill the earth.”',
      imageKey: 'g8_land',
    },
    {
      title: 'The bow in the cloud',
      scriptureRef: 'Genesis 9:12–13',
      scriptureText: 'And God said, “This is the sign of the covenant that I make between me and you and every living creature that is with you, for all future generations: I have set my bow in the cloud, and it shall be a sign of the covenant between me and the earth.”',
      imageKey: 'g9_rainbow',
    },
    {
      title: 'I will remember my covenant',
      scriptureRef: 'Genesis 9:16',
      scriptureText: 'When the bow is in the clouds, I will see it and remember the everlasting covenant between God and every living creature of all flesh that is on the earth.',
      imageKey: 'g9_altar',
    },
  ],
  10: [
    {
      title: 'Nations from Noah’s sons',
      scriptureRef: 'Genesis 10:1',
      scriptureText: 'These are the generations of the sons of Noah, Shem, Ham, and Japheth. Sons were born to them after the flood.',
      imageKey: 'g10_nations',
    },
    {
      title: 'From these the nations spread',
      scriptureRef: 'Genesis 10:32',
      scriptureText: 'These are the clans of the sons of Noah, according to their genealogies, in their nations, and from these the nations spread abroad on the earth after the flood.',
      imageKey: 'g10_peoples',
    },
    {
      title: 'Mighty on the earth',
      scriptureRef: 'Genesis 10:8–9',
      scriptureText: 'Cush fathered Nimrod; he was the first on earth to be a mighty man. He was a mighty hunter before the Lord.',
      imageKey: 'g10_nations',
    },
  ],
  11: [
    {
      title: 'One language',
      scriptureRef: 'Genesis 11:1',
      scriptureText: 'Now the whole earth had one language and the same words.',
      imageKey: 'g11_babel',
    },
    {
      title: 'Let us build a tower',
      scriptureRef: 'Genesis 11:4',
      scriptureText: 'Then they said, “Come, let us build ourselves a city and a tower with its top in the heavens, and let us make a name for ourselves, lest we be dispersed over the face of the whole earth.”',
      imageKey: 'g11_babel',
    },
    {
      title: 'The Lord dispersed them',
      scriptureRef: 'Genesis 11:8–9',
      scriptureText: 'So the Lord dispersed them from there over the face of all the earth, and they left off building the city. Therefore its name was called Babel, because there the Lord confused the language of all the earth. And from there the Lord dispersed them over the face of all the earth.',
      imageKey: 'g11_scatter',
    },
  ],
  12: [
    {
      title: 'Go to the land I will show you',
      scriptureRef: 'Genesis 12:1–2',
      scriptureText: 'Now the Lord said to Abram, “Go from your country and your kindred and your father’s house to the land that I will show you. And I will make of you a great nation, and I will bless you and make your name great, so that you will be a blessing.”',
      imageKey: 'g12_journey',
    },
    {
      title: 'Abram went, as the Lord had told him',
      scriptureRef: 'Genesis 12:4',
      scriptureText: 'So Abram went, as the Lord had told him, and Lot went with him. Abram was seventy-five years old when he departed from Haran.',
      imageKey: 'g12_journey',
    },
    {
      title: 'To your offspring I will give this land',
      scriptureRef: 'Genesis 12:7',
      scriptureText: 'Then the Lord appeared to Abram and said, “To your offspring I will give this land.” So he built there an altar to the Lord, who had appeared to him.',
      imageKey: 'g12_stars',
    },
  ],
  13: [
    {
      title: 'Let there be no strife',
      scriptureRef: 'Genesis 13:8–9',
      scriptureText: 'Then Abram said to Lot, “Let there be no strife between you and me, and between your herdsmen and my herdsmen, for we are kinsmen. Is not the whole land before you? Separate yourself from me.”',
      imageKey: 'g13_parting',
    },
    {
      title: 'Lot chose the Jordan Valley',
      scriptureRef: 'Genesis 13:10–11',
      scriptureText: 'And Lot lifted up his eyes and saw that the Jordan Valley was well watered everywhere like the garden of the Lord. So Lot chose for himself all the Jordan Valley, and Lot journeyed east.',
      imageKey: 'g13_jordan',
    },
    {
      title: 'All the land that you see',
      scriptureRef: 'Genesis 13:14–15',
      scriptureText: 'The Lord said to Abram, after Lot had separated from him, “Lift up your eyes and look from the place where you are, northward and southward and eastward and westward, for all the land that you see I will give to you and to your offspring forever.”',
      imageKey: 'g13_parting',
    },
  ],
  14: [
    {
      title: 'Abram rescued Lot',
      scriptureRef: 'Genesis 14:14–16',
      scriptureText: 'When Abram heard that his kinsman had been taken captive, he led forth his trained men and went in pursuit. Then he brought back all the possessions, and also brought back his kinsman Lot with his possessions, and the women and the people.',
      imageKey: 'g14_rescue',
    },
    {
      title: 'Melchizedek blessed him',
      scriptureRef: 'Genesis 14:18–19',
      scriptureText: 'And Melchizedek king of Salem brought out bread and wine. He was priest of God Most High. And he blessed him and said, “Blessed be Abram by God Most High, Possessor of heaven and earth.”',
      imageKey: 'g14_melchizedek',
    },
    {
      title: 'I have lifted my hand to the Lord',
      scriptureRef: 'Genesis 14:22–23',
      scriptureText: 'But Abram said to the king of Sodom, “I have lifted my hand to the Lord, God Most High, Possessor of heaven and earth, that I would not take a thread or a sandal strap or anything that is yours.”',
      imageKey: 'g14_rescue',
    },
  ],
  15: [
    {
      title: 'Fear not, Abram',
      scriptureRef: 'Genesis 15:1',
      scriptureText: 'After these things the word of the Lord came to Abram in a vision: “Fear not, Abram, I am your shield; your reward shall be very great.”',
      imageKey: 'g15_covenant',
    },
    {
      title: 'So shall your offspring be',
      scriptureRef: 'Genesis 15:5–6',
      scriptureText: 'And he brought him outside and said, “Look toward heaven, and number the stars, if you are able to number them.” Then he said to him, “So shall your offspring be.” And he believed the Lord, and he counted it to him as righteousness.',
      imageKey: 'g12_stars',
    },
    {
      title: 'A smoking fire pot',
      scriptureRef: 'Genesis 15:17–18',
      scriptureText: 'When the sun had gone down and it was dark, behold, a smoking fire pot and a flaming torch passed between these pieces. On that day the Lord made a covenant with Abram.',
      imageKey: 'g15_firepot',
    },
  ],
  16: [
    {
      title: 'The angel found Hagar',
      scriptureRef: 'Genesis 16:7–8',
      scriptureText: 'The angel of the Lord found her by a spring of water in the wilderness. And he said, “Hagar, servant of Sarai, where have you come from and where are you going?”',
      imageKey: 'g16_spring',
    },
    {
      title: 'You shall call his name Ishmael',
      scriptureRef: 'Genesis 16:11',
      scriptureText: 'And the angel of the Lord said to her, “Behold, you are pregnant and shall bear a son. You shall call his name Ishmael, because the Lord has listened to your affliction.”',
      imageKey: 'g16_hagar',
    },
    {
      title: 'You are a God of seeing',
      scriptureRef: 'Genesis 16:13',
      scriptureText: 'So she called the name of the Lord who spoke to her, “You are a God of seeing,” for she said, “Truly here I have seen him who looks after me.”',
      imageKey: 'g16_spring',
    },
  ],
  17: [
    {
      title: 'Your name shall be Abraham',
      scriptureRef: 'Genesis 17:5',
      scriptureText: 'No longer shall your name be called Abram, but your name shall be Abraham, for I have made you the father of a multitude of nations.',
      imageKey: 'g17_names',
    },
    {
      title: 'Sarah shall be her name',
      scriptureRef: 'Genesis 17:15–16',
      scriptureText: 'And God said to Abraham, “As for Sarai your wife, you shall not call her name Sarai, but Sarah shall be her name. I will bless her, and moreover, I will give you a son by her.”',
      imageKey: 'g17_names',
    },
    {
      title: 'I will establish my covenant',
      scriptureRef: 'Genesis 17:7',
      scriptureText: 'And I will establish my covenant between me and you and your offspring after you throughout their generations for an everlasting covenant, to be God to you and to your offspring after you.',
      imageKey: 'g17_promise',
    },
  ],
  18: [
    {
      title: 'Three men stood before him',
      scriptureRef: 'Genesis 18:1–2',
      scriptureText: 'And the Lord appeared to him by the oaks of Mamre, as he sat at the door of his tent in the heat of the day. He lifted up his eyes and looked, and behold, three men were standing in front of him.',
      imageKey: 'g18_mamre',
    },
    {
      title: 'Sarah laughed',
      scriptureRef: 'Genesis 18:12–14',
      scriptureText: 'So Sarah laughed to herself, saying, “After I am worn out, and my lord is old, shall I have pleasure?” The Lord said to Abraham, “Why did Sarah laugh? Is anything too hard for the Lord?”',
      imageKey: 'g18_sarah',
    },
    {
      title: 'Shall I hide from Abraham',
      scriptureRef: 'Genesis 18:17–18',
      scriptureText: 'The Lord said, “Shall I hide from Abraham what I am about to do, seeing that Abraham shall surely become a great and mighty nation, and all the nations of the earth shall be blessed in him?”',
      imageKey: 'g18_mamre',
    },
  ],
  19: [
    {
      title: 'Escape for your life',
      scriptureRef: 'Genesis 19:17',
      scriptureText: 'And as they brought them out, one said, “Escape for your life. Do not look back or stop anywhere in the valley. Escape to the hills, lest you be swept away.”',
      imageKey: 'g19_flight',
    },
    {
      title: 'She became a pillar of salt',
      scriptureRef: 'Genesis 19:26',
      scriptureText: 'But Lot’s wife, behind him, looked back, and she became a pillar of salt.',
      imageKey: 'g19_pillar',
    },
    {
      title: 'God remembered Abraham',
      scriptureRef: 'Genesis 19:29',
      scriptureText: 'So it was that, when God destroyed the cities of the valley, God remembered Abraham and sent Lot out of the midst of the overthrow.',
      imageKey: 'g19_flight',
    },
  ],
  20: [
    {
      title: 'God came to Abimelech in a dream',
      scriptureRef: 'Genesis 20:3',
      scriptureText: 'But God came to Abimelech in a dream by night and said to him, “Behold, you are a dead man because of the woman whom you have taken, for she is a man’s wife.”',
      imageKey: 'g20_abimelech',
    },
    {
      title: 'Abraham prayed to God',
      scriptureRef: 'Genesis 20:17',
      scriptureText: 'Then Abraham prayed to God, and God healed Abimelech, and also healed his wife and female slaves so that they bore children.',
      imageKey: 'g20_peace',
    },
    {
      title: 'Take what you find',
      scriptureRef: 'Genesis 20:14–15',
      scriptureText: 'Then Abimelech took sheep and oxen, and male servants and female servants, and gave them to Abraham, and returned Sarah his wife to him. And Abimelech said, “Behold, my land is before you; dwell where it pleases you.”',
      imageKey: 'g20_peace',
    },
  ],
  21: [
    {
      title: 'Sarah bore Abraham a son',
      scriptureRef: 'Genesis 21:1–3',
      scriptureText: 'The Lord visited Sarah as he had said, and the Lord did to Sarah as he had promised. And Sarah conceived and bore Abraham a son in his old age. Abraham called the name of his son who was born to him Isaac.',
      imageKey: 'g21_isaac_born',
    },
    {
      title: 'God heard the voice of the boy',
      scriptureRef: 'Genesis 21:17–19',
      scriptureText: 'And God heard the voice of the boy, and the angel of God called to Hagar from heaven. Then God opened her eyes, and she saw a well of water. And she went and filled the skin with water and gave the boy a drink.',
      imageKey: 'g21_well',
    },
    {
      title: 'God was with the boy',
      scriptureRef: 'Genesis 21:20',
      scriptureText: 'And God was with the boy, and he grew up. He lived in the wilderness and became an expert with the bow.',
      imageKey: 'g21_well',
    },
  ],
  22: [
    {
      title: 'Take your son, your only son Isaac',
      scriptureRef: 'Genesis 22:2',
      scriptureText: 'He said, “Take your son, your only son Isaac, whom you love, and go to the land of Moriah, and offer him there as a burnt offering on one of the mountains of which I shall tell you.”',
      imageKey: 'g22_moriah',
    },
    {
      title: 'God will provide the lamb',
      scriptureRef: 'Genesis 22:8',
      scriptureText: 'Abraham said, “God will provide for himself the lamb for a burnt offering, my son.” So they went both of them together.',
      imageKey: 'g22_moriah',
    },
    {
      title: 'A ram caught in a thicket',
      scriptureRef: 'Genesis 22:13–14',
      scriptureText: 'And Abraham lifted up his eyes and looked, and behold, behind him was a ram, caught in a thicket by his horns. And Abraham went and took the ram and offered it up as a burnt offering instead of his son. So Abraham called the name of that place, “The Lord will provide.”',
      imageKey: 'g22_ram',
    },
  ],
  23: [
    {
      title: 'A burying place',
      scriptureRef: 'Genesis 23:4',
      scriptureText: '“I am a sojourner and foreigner among you; give me property among you for a burying place, that I may bury my dead out of my sight.”',
      imageKey: 'g23_machpelah',
    },
    {
      title: 'The cave of Machpelah',
      scriptureRef: 'Genesis 23:19–20',
      scriptureText: 'After this, Abraham buried Sarah his wife in the cave of the field of Machpelah east of Mamre (that is, Hebron) in the land of Canaan. The field and the cave that is in it were made over to Abraham as property for a burying place.',
      imageKey: 'g23_cave',
    },
    {
      title: 'Abraham buried Sarah',
      scriptureRef: 'Genesis 23:19',
      scriptureText: 'After this, Abraham buried Sarah his wife in the cave of the field of Machpelah east of Mamre (that is, Hebron) in the land of Canaan.',
      imageKey: 'g23_machpelah',
    },
  ],
  24: [
    {
      title: 'She said, “Drink, my lord”',
      scriptureRef: 'Genesis 24:18–19',
      scriptureText: 'She said, “Drink, my lord.” And she quickly let down her jar upon her hand and gave him a drink. When she had finished giving him a drink, she said, “I will draw water for your camels also.”',
      imageKey: 'g24_camels',
    },
    {
      title: 'Rebekah came out',
      scriptureRef: 'Genesis 24:15–16',
      scriptureText: 'Before he had finished speaking, behold, Rebekah came out with her water jar on her shoulder. The young woman was very attractive in appearance, a maiden whom no man had known.',
      imageKey: 'g24_rebekah',
    },
    {
      title: 'I will go',
      scriptureRef: 'Genesis 24:58',
      scriptureText: 'And they called Rebekah and said to her, “Will you go with this man?” She said, “I will go.”',
      imageKey: 'g24_rebekah',
    },
  ],
  25: [
    {
      title: 'Two nations are in your womb',
      scriptureRef: 'Genesis 25:23',
      scriptureText: 'And the Lord said to her, “Two nations are in your womb, and two peoples from within you shall be divided; the one shall be stronger than the other, the older shall serve the younger.”',
      imageKey: 'g25_twins',
    },
    {
      title: 'Esau and Jacob were born',
      scriptureRef: 'Genesis 25:25–26',
      scriptureText: 'The first came out red, all his body like a hairy cloak, so they called his name Esau. Afterward his brother came out with his hand holding Esau’s heel, so his name was called Jacob.',
      imageKey: 'g25_twins',
    },
    {
      title: 'Sell me your birthright',
      scriptureRef: 'Genesis 25:31–33',
      scriptureText: 'Jacob said, “Sell me your birthright now.” Esau said, “I am about to die; of what use is a birthright to me?” Jacob said, “Swear to me now.” So he swore to him and sold his birthright to Jacob.',
      imageKey: 'g25_stew',
    },
  ],
  26: [
    {
      title: 'I will be with you',
      scriptureRef: 'Genesis 26:2–3',
      scriptureText: 'And the Lord appeared to him and said, “Do not go down to Egypt; dwell in the land of which I shall tell you. Sojourn in this land, and I will be with you and will bless you.”',
      imageKey: 'g26_promise',
    },
    {
      title: 'Isaac dug again the wells',
      scriptureRef: 'Genesis 26:18',
      scriptureText: 'And Isaac dug again the wells of water that had been dug in the days of Abraham his father, which the Philistines had stopped after the death of Abraham.',
      imageKey: 'g26_wells',
    },
    {
      title: 'We have found water',
      scriptureRef: 'Genesis 26:32',
      scriptureText: 'That same day Isaac’s servants came and told him about the well that they had dug and said to him, “We have found water.”',
      imageKey: 'g26_wells',
    },
  ],
  27: [
    {
      title: 'The blessing of Isaac',
      scriptureRef: 'Genesis 27:27–29',
      scriptureText: 'So he came near and kissed him. And Isaac smelled the smell of his garments and blessed him and said, “See, the smell of my son is as the smell of a field that the Lord has blessed! May God give you of the dew of heaven and of the fatness of the earth.”',
      imageKey: 'g27_blessing',
    },
    {
      title: 'Esau cried out',
      scriptureRef: 'Genesis 27:34',
      scriptureText: 'As soon as Esau heard the words of his father, he cried out with an exceedingly great and bitter cry and said to his father, “Bless me, even me also, O my father!”',
      imageKey: 'g27_blessing',
    },
    {
      title: 'Flee to Laban',
      scriptureRef: 'Genesis 27:43–44',
      scriptureText: 'Now therefore, my son, obey my voice. Arise, flee to Laban my brother in Haran and stay with him a while, until your brother’s fury turns away.',
      imageKey: 'g27_flee',
    },
  ],
  28: [
    {
      title: 'A ladder set up on the earth',
      scriptureRef: 'Genesis 28:12',
      scriptureText: 'And he dreamed, and behold, there was a ladder set up on the earth, and the top of it reached to heaven. And behold, the angels of God were ascending and descending on it!',
      imageKey: 'g28_ladder',
    },
    {
      title: 'I am with you',
      scriptureRef: 'Genesis 28:15',
      scriptureText: 'Behold, I am with you and will keep you wherever you go, and will bring you back to this land. For I will not leave you until I have done what I have promised you.',
      imageKey: 'g28_ladder',
    },
    {
      title: 'This is the house of God',
      scriptureRef: 'Genesis 28:16–17',
      scriptureText: 'Then Jacob awoke from his sleep and said, “Surely the Lord is in this place, and I did not know it.” And he was afraid and said, “How awesome is this place! This is none other than the house of God, and this is the gate of heaven.”',
      imageKey: 'g28_bethel',
    },
  ],
  29: [
    {
      title: 'Rachel came with the sheep',
      scriptureRef: 'Genesis 29:9–10',
      scriptureText: 'While he was still speaking with them, Rachel came with her father’s sheep, for she was a shepherdess. When Jacob saw Rachel the daughter of Laban and the sheep of Laban his mother’s brother, Jacob came near and rolled the stone from the well’s mouth.',
      imageKey: 'g29_rachel',
    },
    {
      title: 'Jacob served seven years',
      scriptureRef: 'Genesis 29:20',
      scriptureText: 'So Jacob served seven years for Rachel, and they seemed to him but a few days because of the love he had for her.',
      imageKey: 'g29_rachel',
    },
    {
      title: 'It was Leah',
      scriptureRef: 'Genesis 29:25',
      scriptureText: 'And in the morning, behold, it was Leah! And Jacob said to Laban, “What is this you have done to me? Did I not serve with you for Rachel? Why then have you deceived me?”',
      imageKey: 'g29_leah',
    },
  ],
  30: [
    {
      title: 'God remembered Rachel',
      scriptureRef: 'Genesis 30:22–23',
      scriptureText: 'Then God remembered Rachel, and God listened to her and opened her womb. She conceived and bore a son and said, “God has taken away my reproach.”',
      imageKey: 'g30_children',
    },
    {
      title: 'The household grows',
      scriptureRef: 'Genesis 30:1',
      scriptureText: 'When Rachel saw that she bore Jacob no children, she envied her sister. She said to Jacob, “Give me children, or I shall die!”',
      imageKey: 'g30_children',
    },
    {
      title: 'Speckled and spotted',
      scriptureRef: 'Genesis 30:32',
      scriptureText: 'Let me pass through all your flock today, removing from it every speckled and spotted sheep and every black lamb, and the spotted and speckled among the goats, and they shall be my wages.',
      imageKey: 'g30_flocks',
    },
  ],
  31: [
    {
      title: 'The Lord said, “Return”',
      scriptureRef: 'Genesis 31:3',
      scriptureText: 'Then the Lord said to Jacob, “Return to the land of your fathers and to your kindred, and I will be with you.”',
      imageKey: 'g31_mizpah',
    },
    {
      title: 'Laban searched the tents',
      scriptureRef: 'Genesis 31:34–35',
      scriptureText: 'Now Rachel had taken the household gods and put them in the camel’s saddle and sat on them. Laban felt all about the tent, but did not find them.',
      imageKey: 'g31_search',
    },
    {
      title: 'The Lord watch between you and me',
      scriptureRef: 'Genesis 31:49',
      scriptureText: 'and Mizpah, for he said, “The Lord watch between you and me, when we are out of one another’s sight.”',
      imageKey: 'g31_mizpah',
    },
  ],
  32: [
    {
      title: 'A present for Esau',
      scriptureRef: 'Genesis 32:13–15',
      scriptureText: 'So he stayed there that night, and from what he had with him he took a present for his brother Esau, two hundred female goats and twenty male goats, two hundred ewes and twenty rams.',
      imageKey: 'g32_gifts',
    },
    {
      title: 'I will not let you go',
      scriptureRef: 'Genesis 32:26',
      scriptureText: 'Then he said, “Let me go, for the day has broken.” But Jacob said, “I will not let you go unless you bless me.”',
      imageKey: 'g32_peniel',
    },
    {
      title: 'I have seen God face to face',
      scriptureRef: 'Genesis 32:30',
      scriptureText: 'So Jacob called the name of the place Peniel, saying, “For I have seen God face to face, and yet my life has been delivered.”',
      imageKey: 'g32_peniel',
    },
  ],
  33: [
    {
      title: 'Esau ran to meet him',
      scriptureRef: 'Genesis 33:4',
      scriptureText: 'But Esau ran to meet him and embraced him and fell on his neck and kissed him, and they wept.',
      imageKey: 'g33_embrace',
    },
    {
      title: 'To see your face is like seeing the face of God',
      scriptureRef: 'Genesis 33:10',
      scriptureText: 'Jacob said, “No, please, if I have found favor in your sight, then accept my present from my hand. For I have seen your face, which is like seeing the face of God, and you have accepted me.”',
      imageKey: 'g33_meet',
    },
    {
      title: 'Jacob settled safely',
      scriptureRef: 'Genesis 33:18–20',
      scriptureText: 'And Jacob came safely to the city of Shechem, which is in the land of Canaan, and he camped before the city. There he erected an altar and called it El-Elohe-Israel.',
      imageKey: 'g33_embrace',
    },
  ],
  34: [
    {
      title: 'Dinah went out',
      scriptureRef: 'Genesis 34:1',
      scriptureText: 'Now Dinah the daughter of Leah, whom she had borne to Jacob, went out to see the women of the land.',
      imageKey: 'g34_shechem',
    },
    {
      title: 'Jacob held his peace',
      scriptureRef: 'Genesis 34:5',
      scriptureText: 'When Jacob heard that he had defiled Dinah his daughter, his sons were with his livestock in the field, so Jacob held his peace until they came.',
      imageKey: 'g34_grief',
    },
    {
      title: 'You have brought trouble on me',
      scriptureRef: 'Genesis 34:30',
      scriptureText: 'Then Jacob said to Simeon and Levi, “You have brought trouble on me by making me stink to the inhabitants of the land.”',
      imageKey: 'g34_grief',
    },
  ],
  35: [
    {
      title: 'Arise, go up to Bethel',
      scriptureRef: 'Genesis 35:1',
      scriptureText: 'God said to Jacob, “Arise, go up to Bethel and dwell there. Make an altar there to the God who appeared to you when you fled from your brother Esau.”',
      imageKey: 'g35_bethel',
    },
    {
      title: 'Israel shall be your name',
      scriptureRef: 'Genesis 35:10',
      scriptureText: 'And God said to him, “Your name is Jacob; no longer shall your name be called Jacob, but Israel shall be your name.” So he called his name Israel.',
      imageKey: 'g35_bethel',
    },
    {
      title: 'Rachel was buried',
      scriptureRef: 'Genesis 35:19–20',
      scriptureText: 'So Rachel died, and she was buried on the way to Ephrath (that is, Bethlehem), and Jacob set up a pillar over her tomb.',
      imageKey: 'g35_rachel',
    },
  ],
  36: [
    {
      title: 'These are the generations of Esau',
      scriptureRef: 'Genesis 36:1',
      scriptureText: 'These are the generations of Esau (that is, Edom).',
      imageKey: 'g36_edom',
    },
    {
      title: 'Esau settled in Seir',
      scriptureRef: 'Genesis 36:8',
      scriptureText: 'So Esau settled in the hill country of Seir. (Esau is Edom.)',
      imageKey: 'g36_seir',
    },
    {
      title: 'Chiefs of Edom',
      scriptureRef: 'Genesis 36:40',
      scriptureText: 'These are the names of the chiefs of Esau, according to their clans and their dwelling places, by their names.',
      imageKey: 'g36_edom',
    },
  ],
  37: [
    {
      title: 'Joseph had a dream',
      scriptureRef: 'Genesis 37:5–7',
      scriptureText: 'Now Joseph had a dream, and when he told it to his brothers they hated him even more. He said to them, “Behold, we were binding sheaves in the field, and behold, my sheaf arose and stood upright. And behold, your sheaves gathered around it and bowed down to my sheaf.”',
      imageKey: 'g37_dreams',
    },
    {
      title: 'A robe of many colors',
      scriptureRef: 'Genesis 37:3',
      scriptureText: 'Now Israel loved Joseph more than any other of his sons, because he was the son of his old age. And he made him a robe of many colors.',
      imageKey: 'g37_coat',
    },
    {
      title: 'Sold to the Ishmaelites',
      scriptureRef: 'Genesis 37:28',
      scriptureText: 'Then Midianite traders passed by. And they drew Joseph up and lifted him out of the pit, and sold him to the Ishmaelites for twenty shekels of silver. They took Joseph to Egypt.',
      imageKey: 'g37_caravan',
    },
  ],
  38: [
    {
      title: 'Judah and Tamar',
      scriptureRef: 'Genesis 38:26',
      scriptureText: 'Then Judah identified them and said, “She is more righteous than I, since I did not give her to my son Shelah.” And he did not know her again.',
      imageKey: 'g38_judah_tamar',
    },
    {
      title: 'Perez and Zerah',
      scriptureRef: 'Genesis 38:29–30',
      scriptureText: 'But as he drew back his hand, behold, his brother came out. And she said, “What a breach you have made for yourself!” Therefore his name was called Perez. Afterward his brother came out with the scarlet thread on his hand, and his name was called Zerah.',
      imageKey: 'g38_twins',
    },
    {
      title: 'It was said, “This one came out first”',
      scriptureRef: 'Genesis 38:28',
      scriptureText: 'And when she was in labor, one put out a hand, and the midwife took and tied a scarlet thread on his hand, saying, “This one came out first.”',
      imageKey: 'g38_twins',
    },
  ],
  39: [
    {
      title: 'The Lord was with Joseph',
      scriptureRef: 'Genesis 39:2–3',
      scriptureText: 'The Lord was with Joseph, and he became a successful man, and he was in the house of his Egyptian master. His master saw that the Lord was with him and that the Lord caused all that he did to succeed in his hands.',
      imageKey: 'g39_potiphar',
    },
    {
      title: 'How can I do this great wickedness',
      scriptureRef: 'Genesis 39:9',
      scriptureText: 'He is not greater in this house than I am, nor has he kept back anything from me except you, because you are his wife. How then can I do this great wickedness and sin against God?',
      imageKey: 'g39_flee',
    },
    {
      title: 'The Lord was with him in prison',
      scriptureRef: 'Genesis 39:21',
      scriptureText: 'But the Lord was with Joseph and showed him steadfast love and gave him favor in the sight of the keeper of the prison.',
      imageKey: 'g39_flee',
    },
  ],
  40: [
    {
      title: 'Interpretations belong to God',
      scriptureRef: 'Genesis 40:8',
      scriptureText: 'They said to him, “We have had dreams, and there is no one to interpret them.” And Joseph said to them, “Do not interpretations belong to God? Please tell them to me.”',
      imageKey: 'g40_prison',
    },
    {
      title: 'Within three days Pharaoh will lift up your head',
      scriptureRef: 'Genesis 40:12–13',
      scriptureText: 'Then Joseph said to him, “This is its interpretation: the three branches are three days. In three days Pharaoh will lift up your head and restore you to your office.”',
      imageKey: 'g40_dreams',
    },
    {
      title: 'Only remember me',
      scriptureRef: 'Genesis 40:14',
      scriptureText: 'Only remember me, when it is well with you, and please do me the kindness to mention me to Pharaoh, and so get me out of this house.',
      imageKey: 'g40_prison',
    },
  ],
  41: [
    {
      title: 'It is not in me; God will give Pharaoh a favorable answer',
      scriptureRef: 'Genesis 41:16',
      scriptureText: 'Joseph answered Pharaoh, “It is not in me; God will give Pharaoh a favorable answer.”',
      imageKey: 'g41_dreams',
    },
    {
      title: 'Seven years of plenty and famine',
      scriptureRef: 'Genesis 41:29–30',
      scriptureText: 'There will come seven years of great plenty throughout all the land of Egypt, but after them there will arise seven years of famine.',
      imageKey: 'g41_dreams',
    },
    {
      title: 'Pharaoh set Joseph over all Egypt',
      scriptureRef: 'Genesis 41:41–42',
      scriptureText: 'And Pharaoh said to Joseph, “See, I have set you over all the land of Egypt.” Then Pharaoh took his signet ring from his hand and put it on Joseph’s hand, and clothed him in garments of fine linen and put a gold chain about his neck.',
      imageKey: 'g41_exalted',
    },
  ],
  42: [
    {
      title: 'Joseph recognized his brothers',
      scriptureRef: 'Genesis 42:8',
      scriptureText: 'And Joseph recognized his brothers, but they did not recognize him.',
      imageKey: 'g42_brothers',
    },
    {
      title: 'In truth we are guilty',
      scriptureRef: 'Genesis 42:21',
      scriptureText: 'Then they said to one another, “In truth we are guilty concerning our brother, in that we saw the distress of his soul, when he begged us and we did not listen.”',
      imageKey: 'g42_brothers',
    },
    {
      title: 'Every man’s money was in his sack',
      scriptureRef: 'Genesis 42:35',
      scriptureText: 'As they emptied their sacks, behold, every man’s bundle of money was in his sack. And when they and their father saw their bundles of money, they were afraid.',
      imageKey: 'g42_money',
    },
  ],
  43: [
    {
      title: 'I will be a pledge of his safety',
      scriptureRef: 'Genesis 43:9',
      scriptureText: 'I will be a pledge of his safety. From my hand you shall require him. If I do not bring him back to you and set him before you, then let me bear the blame forever.',
      imageKey: 'g43_benjamin',
    },
    {
      title: 'Benjamin came with them',
      scriptureRef: 'Genesis 43:15–16',
      scriptureText: 'So the men took this present, and they took double the money with them, and Benjamin. They arose and went down to Egypt and stood before Joseph. When Joseph saw Benjamin with them, he said to the steward of his house, “Bring the men into the house.”',
      imageKey: 'g43_benjamin',
    },
    {
      title: 'They drank and were merry',
      scriptureRef: 'Genesis 43:34',
      scriptureText: 'Portions were taken to them from Joseph’s table, but Benjamin’s portion was five times as much as any of theirs. And they drank and were merry with him.',
      imageKey: 'g43_feast',
    },
  ],
  44: [
    {
      title: 'Put my cup in the sack',
      scriptureRef: 'Genesis 44:1–2',
      scriptureText: 'Then he commanded the steward of his house, “Fill the men’s sacks with food, as much as they can carry, and put each man’s money in the mouth of his sack, and put my cup, the silver cup, in the mouth of the sack of the youngest.”',
      imageKey: 'g44_planted',
    },
    {
      title: 'The cup was found',
      scriptureRef: 'Genesis 44:12',
      scriptureText: 'And he searched, beginning with the eldest and ending with the youngest. And the cup was found in Benjamin’s sack.',
      imageKey: 'g44_cup',
    },
    {
      title: 'Let your servant remain instead of the boy',
      scriptureRef: 'Genesis 44:33',
      scriptureText: 'Now therefore, please let your servant remain instead of the boy as a servant to my lord, and let the boy go back with his brothers.',
      imageKey: 'g44_cup',
    },
  ],
  45: [
    {
      title: 'I am Joseph',
      scriptureRef: 'Genesis 45:4–5',
      scriptureText: 'So Joseph said to his brothers, “Come near to me, please.” And they came near. And he said, “I am your brother, Joseph, whom you sold into Egypt. And now do not be distressed or angry with yourselves because you sold me here, for God sent me before you to preserve life.”',
      imageKey: 'g45_reunion',
    },
    {
      title: 'God sent me before you',
      scriptureRef: 'Genesis 45:7–8',
      scriptureText: 'And God sent me before you to preserve for you a remnant on earth, and to keep alive for you many survivors. So it was not you who sent me here, but God.',
      imageKey: 'g45_reunion',
    },
    {
      title: 'Take wagons from Egypt',
      scriptureRef: 'Genesis 45:19–20',
      scriptureText: 'And you, Joseph, are commanded to say, “Do this: take wagons from the land of Egypt for your little ones and for your wives, and bring your father, and come. Have no concern for your goods, for the best of all the land of Egypt is yours.”',
      imageKey: 'g45_wagons',
    },
  ],
  46: [
    {
      title: 'Do not be afraid to go down to Egypt',
      scriptureRef: 'Genesis 46:3–4',
      scriptureText: 'Then he said, “I am God, the God of your father. Do not be afraid to go down to Egypt, for there I will make you into a great nation. I myself will go down with you to Egypt, and I will also bring you up again.”',
      imageKey: 'g46_vision',
    },
    {
      title: 'All the persons of the house of Jacob',
      scriptureRef: 'Genesis 46:27',
      scriptureText: 'And the sons of Joseph, who were born to him in Egypt, were two. All the persons of the house of Jacob who came into Egypt were seventy.',
      imageKey: 'g46_goshen',
    },
    {
      title: 'Joseph fell on his father’s neck',
      scriptureRef: 'Genesis 46:29',
      scriptureText: 'Then Joseph prepared his chariot and went up to meet Israel his father in Goshen. He presented himself to him and fell on his neck and wept on his neck a good while.',
      imageKey: 'g46_goshen',
    },
  ],
  47: [
    {
      title: 'Settle in the best of the land',
      scriptureRef: 'Genesis 47:5–6',
      scriptureText: 'Then Pharaoh said to Joseph, “Your father and your brothers have come to you. The land of Egypt is before you. Settle your father and your brothers in the best of the land. Let them settle in the land of Goshen.”',
      imageKey: 'g47_pharaoh',
    },
    {
      title: 'Jacob blessed Pharaoh',
      scriptureRef: 'Genesis 47:7',
      scriptureText: 'Then Joseph brought in Jacob his father and stood him before Pharaoh, and Jacob blessed Pharaoh.',
      imageKey: 'g47_pharaoh',
    },
    {
      title: 'Joseph provided food',
      scriptureRef: 'Genesis 47:12',
      scriptureText: 'And Joseph provided his father, his brothers, and all his father’s household with food, according to the number of their dependents.',
      imageKey: 'g47_grain',
    },
  ],
  48: [
    {
      title: 'Ephraim and Manasseh are mine',
      scriptureRef: 'Genesis 48:5',
      scriptureText: 'And now your two sons, who were born to you in the land of Egypt before I came to you in Egypt, are mine; Ephraim and Manasseh shall be mine, as Reuben and Simeon are.',
      imageKey: 'g48_blessing',
    },
    {
      title: 'He crossed his hands',
      scriptureRef: 'Genesis 48:14',
      scriptureText: 'And Israel stretched out his right hand and laid it on the head of Ephraim, who was the younger, and his left hand on the head of Manasseh, crossing his hands (for Manasseh was the firstborn).',
      imageKey: 'g48_blessing',
    },
    {
      title: 'God will be with you',
      scriptureRef: 'Genesis 48:21',
      scriptureText: 'Then Israel said to Joseph, “Behold, I am about to die, but God will be with you and will bring you again to the land of your fathers.”',
      imageKey: 'g48_joseph',
    },
  ],
  49: [
    {
      title: 'Gather yourselves together',
      scriptureRef: 'Genesis 49:1–2',
      scriptureText: 'Then Jacob called his sons and said, “Gather yourselves together, that I may tell you what shall happen to you in days to come. Assemble and listen, O sons of Jacob, listen to Israel your father.”',
      imageKey: 'g49_sons',
    },
    {
      title: 'The scepter shall not depart from Judah',
      scriptureRef: 'Genesis 49:10',
      scriptureText: 'The scepter shall not depart from Judah, nor the ruler’s staff from between his feet, until tribute comes to him; and to him shall be the obedience of the peoples.',
      imageKey: 'g49_scepter',
    },
    {
      title: 'This is what their father said',
      scriptureRef: 'Genesis 49:28',
      scriptureText: 'All these are the twelve tribes of Israel. This is what their father said to them as he blessed them, blessing each with the blessing suitable to him.',
      imageKey: 'g49_sons',
    },
  ],
  50: [
    {
      title: 'God meant it for good',
      scriptureRef: 'Genesis 50:20',
      scriptureText: 'As for you, you meant evil against me, but God meant it for good, to bring it about that many people should be kept alive, as they are today.',
      imageKey: 'g50_forgiveness',
    },
    {
      title: 'Joseph’s bones',
      scriptureRef: 'Genesis 50:24–25',
      scriptureText: 'And Joseph said to his brothers, “I am about to die, but God will visit you and bring you up out of this land to the land that he swore to Abraham, to Isaac, and to Jacob.” Then Joseph made the sons of Israel swear, saying, “God will surely visit you, and you shall carry up my bones from here.”',
      imageKey: 'g50_coffin',
    },
    {
      title: 'They buried Jacob',
      scriptureRef: 'Genesis 50:12–13',
      scriptureText: 'Thus his sons did for him as he had commanded them, for his sons carried him to the land of Canaan and buried him in the cave of the field at Machpelah.',
      imageKey: 'g50_burial',
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
    image: IMAGES[def.imageKey],
  }));
}

/** Audio guide: strictly ESV scripture for each slide (no filler lines). */
export function buildGenesisGuideScript(meta: GenesisChapterMeta): string[] {
  const slides = getGenesisChapterSlides(meta.number);
  return slides.map(
    (slide) => `${slide.scriptureRef}. ${slide.scriptureText}`
  );
}

export function buildGenesisComicPanels(chapterNumber: number) {
  return getGenesisChapterSlides(chapterNumber).map((slide, index) => ({
    id: `g${chapterNumber}-s${index + 1}`,
    title: slide.title,
    caption: slide.scriptureText,
    image: slide.image,
    scriptureRef: slide.scriptureRef,
  }));
}

export function assertGenesisSlidesComplete(): void {
  for (const meta of GENESIS_CHAPTERS) {
    const slides = getGenesisChapterSlides(meta.number);
    if (slides.length < 3) {
      throw new Error(`Genesis ${meta.number} needs multi-image story slides`);
    }
  }
}

