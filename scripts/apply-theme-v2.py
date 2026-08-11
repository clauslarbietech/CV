#!/usr/bin/env python3
"""Replace all Pix Bible graphics with cinematic theme-v2 heroes."""

from __future__ import annotations

import hashlib
from pathlib import Path

from PIL import Image

ROOT = Path("/workspace")
SRC = Path("/opt/cursor/artifacts/assets")
ASSETS = ROOT / "assets"

HEROES = {
    "void": SRC / "genesis-1-1-theme-trial-c.png",
    "cosmic_hand": SRC / "genesis-1-1-theme-trial-a.png",
    "throne": SRC / "genesis-1-1-theme-trial-b.png",
    "day2": SRC / "theme-v2-g1-day2.png",
    "day3": SRC / "theme-v2-g1-day3.png",
    "day4": SRC / "theme-v2-g1-day4.png",
    "day5": SRC / "theme-v2-g1-day5.png",
    "day6_animals": SRC / "theme-v2-g1-day6-animals.png",
    "day6_adam": SRC / "theme-v2-g1-day6-adam.png",
    "day7": SRC / "theme-v2-g1-day7.png",
    "eden": SRC / "theme-v2-eden.png",
    "fall": SRC / "theme-v2-fall-fruit.png",
    "exile": SRC / "theme-v2-exile.png",
    "cain": SRC / "theme-v2-cain-abel.png",
    "enoch": SRC / "theme-v2-enoch.png",
    "ark": SRC / "theme-v2-ark.png",
    "flood": SRC / "theme-v2-flood.png",
    "dove": SRC / "theme-v2-dove.png",
    "rainbow": SRC / "theme-v2-rainbow.png",
    "babel": SRC / "theme-v2-babel.png",
    "abraham": SRC / "theme-v2-abraham-stars.png",
    "covenant": SRC / "theme-v2-covenant.png",
    "moriah": SRC / "theme-v2-moriah.png",
    "bethel": SRC / "theme-v2-bethel.png",
    "peniel": SRC / "theme-v2-peniel.png",
    "joseph_coat": SRC / "theme-v2-joseph-coat.png",
    "joseph_egypt": SRC / "theme-v2-joseph-egypt.png",
    "joseph_reunion": SRC / "theme-v2-joseph-reunion.png",
    "oppression": SRC / "theme-v2-exodus-oppression.png",
    "baby_moses": SRC / "theme-v2-baby-moses.png",
    "bush": SRC / "theme-v2-burning-bush.png",
    "plagues": SRC / "theme-v2-plagues.png",
    "passover": SRC / "theme-v2-passover.png",
    "red_sea": SRC / "theme-v2-red-sea.png",
    "manna": SRC / "theme-v2-manna.png",
    "sinai": SRC / "theme-v2-sinai.png",
    "commandments": SRC / "theme-v2-commandments.png",
    "calf": SRC / "theme-v2-golden-calf.png",
    "tabernacle": SRC / "theme-v2-tabernacle.png",
    "glory": SRC / "theme-v2-glory.png",
    "cover_genesis": SRC / "theme-v2-cover-genesis.png",
    "cover_exodus": SRC / "theme-v2-cover-exodus.png",
    "hagar": SRC / "theme-v2-hagar.png",
    "rebekah": SRC / "theme-v2-rebekah.png",
    "sodom": SRC / "theme-v2-sodom.png",
    "caravan": SRC / "theme-v2-caravan.png",
    "prison": SRC / "theme-v2-prison.png",
    "water_rock": SRC / "theme-v2-water-rock.png",
    "stew": SRC / "theme-v2-stew.png",
    "melchizedek": SRC / "theme-v2-melchizedek.png",
}

# Cache converted RGB images
_cache: dict[str, Image.Image] = {}


def load_hero(key: str) -> Image.Image:
    if key not in _cache:
        path = HEROES[key]
        if not path.exists():
            raise FileNotFoundError(path)
        _cache[key] = Image.open(path).convert("RGB")
    return _cache[key]


def write_jpg(dest: Path, key: str, quality: int = 88) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img = load_hero(key)
    img.save(dest, "JPEG", quality=quality, optimize=True)


def write_png(dest: Path, key: str) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img = load_hero(key)
    img.save(dest, "PNG", optimize=True)


def genesis_chapter_hero(chapter: int, name: str) -> str:
    n = name.lower()
    # Genesis 1 creation days
    if chapter == 1:
        if "dark" in n:
            return "void"
        if "light" in n and "day" not in n:
            return "cosmic_hand"
        if "day-night" in n or "day_night" in n:
            return "throne"
        if "day2" in n or "expanse" in n:
            return "day2"
        if "day3" in n or "land" in n:
            return "day3"
        if "day4" in n or "lights" in n:
            return "day4"
        if "day5" in n or "creature" in n:
            return "day5"
        if "animal" in n:
            return "day6_animals"
        if "adam" in n:
            return "day6_adam"
        if "day7" in n or "rest" in n:
            return "day7"
        return "cosmic_hand"
    if chapter == 2:
        if "naming" in n:
            return "day6_animals"
        # Eden pair — modest leafy coverings (pre-Fall / garden scenes)
        return "eden"
    if chapter == 3:
        # Gen 3:7 fig leaves after sin; Gen 3:21–24 skins at exile
        if "exile" in n:
            return "exile"
        return "fall"
    if chapter == 4:
        return "cain"
    if chapter == 5:
        return "enoch"
    if chapter in (6, 7):
        if "flood" in n or "rain" in n:
            return "flood"
        return "ark"
    if chapter == 8:
        if "dove" in n:
            return "dove"
        if "land" in n:
            return "rainbow"
        return "dove"
    if chapter == 9:
        return "rainbow"
    if chapter in (10, 11):
        return "babel"
    if chapter == 12:
        return "abraham"
    if chapter == 13:
        return "abraham"
    if chapter == 14:
        return "melchizedek"
    if chapter == 15:
        return "covenant"
    if chapter == 16:
        return "hagar"
    if chapter in (17, 18):
        return "abraham"
    if chapter in (19,):
        return "sodom"
    if chapter == 20:
        return "abraham"
    if chapter == 21:
        return "rebekah" if "well" in n else "abraham"
    if chapter == 22:
        return "moriah"
    if chapter == 23:
        return "moriah"
    if chapter == 24:
        return "rebekah"
    if chapter == 25:
        return "stew"
    if chapter == 26:
        return "abraham"
    if chapter == 27:
        return "stew"
    if chapter == 28:
        return "bethel"
    if chapter in (29, 30, 31):
        return "rebekah"
    if chapter == 32:
        return "peniel"
    if chapter == 33:
        return "joseph_reunion"
    if chapter in (34, 35, 36):
        return "peniel"
    if chapter == 37:
        if "caravan" in n:
            return "caravan"
        if "dream" in n:
            return "joseph_egypt"
        return "joseph_coat"
    if chapter == 38:
        return "joseph_coat"
    if chapter == 39:
        return "joseph_egypt"
    if chapter == 40:
        return "prison"
    if chapter in (41, 42, 43, 44):
        return "joseph_egypt"
    if chapter in (45, 46, 47, 48, 49, 50):
        if "coffin" in n or "burial" in n:
            return "joseph_reunion"
        return "joseph_reunion"
    return "cover_genesis"


def exodus_chapter_hero(chapter: int) -> tuple[str, str]:
    """Return (scene_a, scene_b) heroes for an Exodus chapter."""
    if chapter <= 2:
        return ("oppression", "baby_moses")
    if chapter <= 6:
        return ("bush", "bush")
    if chapter <= 11:
        return ("plagues", "plagues")
    if chapter <= 13:
        return ("passover", "passover")
    if chapter <= 15:
        return ("red_sea", "red_sea")
    if chapter <= 18:
        return ("manna", "water_rock")
    if chapter == 20:
        return ("commandments", "sinai")
    if chapter <= 24:
        return ("sinai", "commandments")
    if chapter <= 31:
        return ("tabernacle", "tabernacle")
    if chapter <= 33:
        return ("calf", "calf")
    if chapter == 34:
        return ("sinai", "glory")
    return ("tabernacle", "glory")


def main() -> None:
    missing = [k for k, p in HEROES.items() if not p.exists()]
    if missing:
        raise SystemExit(f"Missing heroes: {missing}")

    written: list[str] = []

    # Covers & journeys
    mapping_fixed = {
        ASSETS / "covers/genesis.jpg": "cover_genesis",
        ASSETS / "covers/exodus.jpg": "cover_exodus",
        ASSETS / "journeys/start.jpg": "cover_genesis",
        ASSETS / "journeys/exodus-start.jpg": "cover_exodus",
        ASSETS / "panels/genesis-day1-light.jpg": "cosmic_hand",
        ASSETS / "panels/genesis-waters-dawn.jpg": "void",
        ASSETS / "panels/arc-fall-cain.jpg": "fall",
        ASSETS / "panels/arc-flood.jpg": "ark",
        ASSETS / "panels/arc-nations.jpg": "babel",
        ASSETS / "panels/arc-abraham.jpg": "abraham",
        ASSETS / "panels/arc-isaac.jpg": "moriah",
        ASSETS / "panels/arc-jacob.jpg": "bethel",
        ASSETS / "panels/arc-joseph.jpg": "joseph_coat",
        ASSETS / "panels/arc-exodus-oppression.jpg": "oppression",
        ASSETS / "panels/arc-exodus-call.jpg": "bush",
        ASSETS / "panels/arc-exodus-plagues.jpg": "plagues",
        ASSETS / "panels/arc-exodus-passover.jpg": "passover",
        ASSETS / "panels/arc-exodus-deliverance.jpg": "red_sea",
        ASSETS / "panels/arc-exodus-wilderness.jpg": "manna",
        ASSETS / "panels/arc-exodus-sinai.jpg": "sinai",
        ASSETS / "panels/arc-exodus-tabernacle.jpg": "tabernacle",
        ASSETS / "panels/arc-exodus-rebellion.jpg": "calf",
        ASSETS / "panels/arc-exodus-glory.jpg": "glory",
        ASSETS / "panels/fall-01-eve-bites.jpg": "fall",
        ASSETS / "panels/fall-02-eve-hands-adam.jpg": "fall",
        ASSETS / "panels/fall-03-serpent-smirk.jpg": "fall",
        ASSETS / "panels/ch-genesis-21.jpg": "abraham",
        ASSETS / "panels/ch-genesis-38.jpg": "joseph_coat",
        ASSETS / "panels/ch-genesis-39.jpg": "joseph_egypt",
    }

    for dest, key in mapping_fixed.items():
        write_jpg(dest, key)
        written.append(str(dest.relative_to(ROOT)))

    # Keep designed brand mark (not a story panel).

    # Genesis webtoon
    for chapter_dir in sorted((ASSETS / "webtoon").glob("genesis-*")):
        try:
            chapter = int(chapter_dir.name.split("-")[1])
        except (IndexError, ValueError):
            continue
        for img_path in sorted(chapter_dir.glob("*.jpg")):
            key = genesis_chapter_hero(chapter, img_path.stem)
            write_jpg(img_path, key)
            written.append(str(img_path.relative_to(ROOT)))

    # Exodus webtoon
    for chapter_dir in sorted((ASSETS / "webtoon").glob("exodus-*")):
        try:
            chapter = int(chapter_dir.name.split("-")[1])
        except (IndexError, ValueError):
            continue
        a, b = exodus_chapter_hero(chapter)
        files = sorted(chapter_dir.glob("*.jpg"))
        for i, img_path in enumerate(files):
            write_jpg(img_path, a if i == 0 else b)
            written.append(str(img_path.relative_to(ROOT)))

    # Any leftover jpgs under panels/slides
    slides = ASSETS / "panels/slides"
    if slides.exists():
        for img_path in slides.rglob("*.jpg"):
            write_jpg(img_path, "cover_genesis")
            written.append(str(img_path.relative_to(ROOT)))

    # Verify no old hashes remain among key covers (spot check)
    digest = hashlib.md5((ASSETS / "covers/genesis.jpg").read_bytes()).hexdigest()
    print(f"Wrote {len(written)} files")
    print(f"Genesis cover md5: {digest}")
    print("Sample:", *written[:8], sep="\n  ")


if __name__ == "__main__":
    main()
