#!/usr/bin/env python3
"""Apply scripture-correct unique heroes to Genesis/Exodus webtoon scenes.

Every destination path is mapped explicitly to a source PNG so chapters
cannot silently reuse the wrong beat.
"""

from __future__ import annotations

import hashlib
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path("/workspace")
SRC = Path("/opt/cursor/artifacts/assets")
HERO_DIR = ROOT / "assets" / "_theme-heroes" / "scripture-audit"
WEBTOON = ROOT / "assets" / "webtoon"

# dest relative to WEBTOON -> source filename in SRC
MAP: dict[str, str] = {
    # Genesis 2
    "genesis-2/01-adam-rib-bush.jpg": "audit-g02-adam.png",
    "genesis-2/02-eden-together.jpg": "audit-g02-eden.png",
    "genesis-2/02-eve-bush.jpg": "audit-g02-eve.png",
    "genesis-2/03-naming.jpg": "audit-g02-naming.png",
    # Genesis 3 (keep existing fig-leaf beats; fix shared serpent/garden)
    "genesis-3/01-garden.jpg": "audit-g03-garden.png",
    "genesis-3/05-serpent.jpg": "audit-g03-serpent.png",
    # Genesis 5–36, 38, 40, 42–49 problem chapters
    "genesis-5/01-enoch.jpg": "audit-g05-enoch.png",
    "genesis-5/02-taken.jpg": "audit-g05-taken.png",
    "genesis-5/03-line.jpg": "audit-g05-line.png",
    "genesis-6/01-ark.jpg": "audit-g06-build.png",
    "genesis-6/02-animals.jpg": "audit-g06-animals.png",
    "genesis-7/01-flood.jpg": "audit-g07-flood.png",
    "genesis-7/02-rain.jpg": "audit-g07-rain.png",
    "genesis-8/01-recede.jpg": "audit-g08-recede.png",
    "genesis-8/02-dove.jpg": "audit-g08-dove.png",
    "genesis-8/03-land.jpg": "audit-g08-land.png",
    "genesis-9/01-rainbow.jpg": "audit-g09-rainbow.png",
    "genesis-9/02-altar.jpg": "audit-g09-altar.png",
    "genesis-10/01-nations.jpg": "audit-g10-nations.png",
    "genesis-10/02-peoples.jpg": "audit-g10-peoples.png",
    "genesis-11/01-babel.jpg": "audit-g11-babel.png",
    "genesis-11/02-scatter.jpg": "audit-g11-scatter.png",
    "genesis-12/01-stars.jpg": "audit-g12-stars.png",
    "genesis-12/02-journey.jpg": "audit-g12-journey.png",
    "genesis-13/01-parting.jpg": "audit-g13-parting.png",
    "genesis-13/02-jordan.jpg": "audit-g13-jordan.png",
    "genesis-14/01-melchizedek.jpg": "audit-g14-melchizedek.png",
    "genesis-14/02-rescue.jpg": "audit-g14-rescue.png",
    "genesis-15/01-covenant.jpg": "audit-g15-stars.png",
    "genesis-15/02-firepot.jpg": "audit-g15-firepot.png",
    "genesis-16/01-hagar.jpg": "audit-g16-hagar.png",
    "genesis-16/02-spring.jpg": "audit-g16-spring.png",
    "genesis-17/01-names.jpg": "audit-g17-names.png",
    "genesis-17/02-promise.jpg": "audit-g17-promise.png",
    "genesis-18/01-mamre.jpg": "audit-g18-mamre.png",
    "genesis-18/02-sarah.jpg": "audit-g18-sarah.png",
    "genesis-19/01-flight.jpg": "audit-g19-flight.png",
    "genesis-19/02-pillar.jpg": "audit-g19-pillar.png",
    "genesis-20/01-abimelech.jpg": "audit-g20-abimelech.png",
    "genesis-20/02-peace.jpg": "audit-g20-peace.png",
    "genesis-21/01-isaac-born.jpg": "audit-g21-isaac.png",
    "genesis-21/02-well.jpg": "audit-g21-hagar.png",
    "genesis-22/01-moriah.jpg": "audit-g22-walk.png",
    "genesis-22/02-ram.jpg": "audit-g22-ram.png",
    "genesis-23/01-machpelah.jpg": "audit-g23-sarah.png",
    "genesis-23/02-cave.jpg": "audit-g23-cave.png",
    "genesis-24/01-rebekah.jpg": "audit-g24-rebekah.png",
    "genesis-24/02-camels.jpg": "audit-g24-camels.png",
    "genesis-25/01-stew.jpg": "audit-g25-stew.png",
    "genesis-25/02-twins.jpg": "audit-g25-twins.png",
    "genesis-26/01-wells.jpg": "audit-g26-wells.png",
    "genesis-26/02-promise.jpg": "audit-g26-promise.png",
    "genesis-27/01-blessing.jpg": "audit-g27-blessing.png",
    "genesis-27/02-flee.jpg": "audit-g27-flee.png",
    "genesis-28/01-bethel.jpg": "audit-g28-bethel.png",
    "genesis-28/02-ladder.jpg": "audit-g28-ladder.png",
    "genesis-29/01-rachel.jpg": "audit-g29-rachel.png",
    "genesis-29/02-leah.jpg": "audit-g29-leah.png",
    "genesis-30/01-children.jpg": "audit-g30-children.png",
    "genesis-30/02-flocks.jpg": "audit-g30-flocks.png",
    "genesis-31/01-mizpah.jpg": "audit-g31-mizpah.png",
    "genesis-31/02-search.jpg": "audit-g31-search.png",
    "genesis-32/01-peniel.jpg": "audit-g32-peniel.png",
    "genesis-32/02-gifts.jpg": "audit-g32-gifts.png",
    "genesis-33/01-embrace.jpg": "audit-g33-embrace.png",
    "genesis-33/02-meet.jpg": "audit-g33-meet.png",
    "genesis-34/01-shechem.jpg": "audit-g34-shechem.png",
    "genesis-34/02-grief.jpg": "audit-g34-grief.png",
    "genesis-35/01-bethel.jpg": "audit-g35-bethel.png",
    "genesis-35/02-rachel.jpg": "audit-g35-rachel.png",
    "genesis-36/01-edom.jpg": "audit-g36-edom.png",
    "genesis-36/02-seir.jpg": "audit-g36-seir.png",
    "genesis-38/01-judah-tamar.jpg": "audit-g38-seal.png",
    "genesis-38/02-twins.jpg": "audit-g38-twins.png",
    "genesis-40/01-prison.jpg": "audit-g40-prison.png",
    "genesis-40/02-dreams.jpg": "audit-g40-dreams.png",
    "genesis-42/01-brothers.jpg": "audit-g42-bow.png",
    "genesis-42/02-money.jpg": "audit-g42-money.png",
    "genesis-43/01-benjamin.jpg": "audit-g43-benjamin.png",
    "genesis-43/02-feast.jpg": "audit-g43-feast.png",
    "genesis-44/01-cup.jpg": "audit-g44-cup.png",
    "genesis-44/02-planted.jpg": "audit-g44-planted.png",
    "genesis-45/01-reunion.jpg": "audit-g45-reveal.png",
    "genesis-45/02-wagons.jpg": "audit-g45-wagons.png",
    "genesis-46/01-vision.jpg": "audit-g46-vision.png",
    "genesis-46/02-goshen.jpg": "audit-g46-goshen.png",
    "genesis-47/01-pharaoh.jpg": "audit-g47-pharaoh.png",
    "genesis-47/02-grain.jpg": "audit-g47-grain.png",
    "genesis-48/01-blessing.jpg": "audit-g48-bless.png",
    "genesis-48/02-joseph.jpg": "audit-g48-joseph.png",
    "genesis-49/01-sons.jpg": "audit-g49-sons.png",
    "genesis-49/02-scepter.jpg": "audit-g49-scepter.png",
    # Exodus 1–40 (each chapter unique A/B)
    "exodus-1/01-scene.jpg": "audit-e01-bricks.png",
    "exodus-1/02-scene.jpg": "audit-e01-midwives.png",
    "exodus-2/01-scene.jpg": "audit-e02-basket.png",
    "exodus-2/02-scene.jpg": "audit-e02-prince.png",
    "exodus-3/01-scene.jpg": "audit-e03-bush.png",
    "exodus-3/02-scene.jpg": "audit-e03-sandals.png",
    "exodus-4/01-scene.jpg": "audit-e04-staff.png",
    "exodus-4/02-scene.jpg": "audit-e04-hand.png",
    "exodus-5/01-scene.jpg": "audit-e05-pharaoh.png",
    "exodus-5/02-scene.jpg": "audit-e05-bricks.png",
    "exodus-6/01-scene.jpg": "audit-e06-promise.png",
    "exodus-6/02-scene.jpg": "audit-e06-name.png",
    "exodus-7/01-scene.jpg": "audit-e07-blood.png",
    "exodus-7/02-scene.jpg": "audit-e07-staffs.png",
    "exodus-8/01-scene.jpg": "audit-e08-frogs.png",
    "exodus-8/02-scene.jpg": "audit-e08-flies.png",
    "exodus-9/01-scene.jpg": "audit-e09-hail.png",
    "exodus-9/02-scene.jpg": "audit-e09-cattle.png",
    "exodus-10/01-scene.jpg": "audit-e10-locusts.png",
    "exodus-10/02-scene.jpg": "audit-e10-dark.png",
    "exodus-11/01-scene.jpg": "audit-e11-warning.png",
    "exodus-11/02-scene.jpg": "audit-e11-silver.png",
    "exodus-12/01-scene.jpg": "audit-e12-passover.png",
    "exodus-12/02-scene.jpg": "audit-e12-depart.png",
    "exodus-13/01-scene.jpg": "audit-e13-pillar.png",
    "exodus-13/02-scene.jpg": "audit-e13-unleavened.png",
    "exodus-14/01-scene.jpg": "audit-e14-sea.png",
    "exodus-14/02-scene.jpg": "audit-e14-chariots.png",
    "exodus-15/01-scene.jpg": "audit-e15-song.png",
    "exodus-15/02-scene.jpg": "audit-e15-moses.png",
    "exodus-16/01-scene.jpg": "audit-e16-manna.png",
    "exodus-16/02-scene.jpg": "audit-e16-quail.png",
    "exodus-17/01-scene.jpg": "audit-e17-water.png",
    "exodus-17/02-scene.jpg": "audit-e17-arms.png",
    "exodus-18/01-scene.jpg": "audit-e18-jethro.png",
    "exodus-18/02-scene.jpg": "audit-e18-judges.png",
    "exodus-19/01-scene.jpg": "audit-e19-sinai.png",
    "exodus-19/02-scene.jpg": "audit-e19-prepare.png",
    "exodus-20/01-scene.jpg": "audit-e20-tablets.png",
    "exodus-20/02-scene.jpg": "audit-e20-awe.png",
    "exodus-21/01-scene.jpg": "audit-e21-laws.png",
    "exodus-21/02-scene.jpg": "audit-e21-care.png",
    "exodus-22/01-scene.jpg": "audit-e22-justice.png",
    "exodus-22/02-scene.jpg": "audit-e22-mercy.png",
    "exodus-23/01-scene.jpg": "audit-e23-angel.png",
    "exodus-23/02-scene.jpg": "audit-e23-feasts.png",
    "exodus-24/01-scene.jpg": "audit-e24-covenant.png",
    "exodus-24/02-scene.jpg": "audit-e24-blood.png",
    "exodus-25/01-scene.jpg": "audit-e25-ark.png",
    "exodus-25/02-scene.jpg": "audit-e25-lamp.png",
    "exodus-26/01-scene.jpg": "audit-e26-curtains.png",
    "exodus-26/02-scene.jpg": "audit-e26-clasps.png",
    "exodus-27/01-scene.jpg": "audit-e27-altar.png",
    "exodus-27/02-scene.jpg": "audit-e27-court.png",
    "exodus-28/01-scene.jpg": "audit-e28-priest.png",
    "exodus-28/02-scene.jpg": "audit-e28-breastplate.png",
    "exodus-29/01-scene.jpg": "audit-e29-consecrate.png",
    "exodus-29/02-scene.jpg": "audit-e29-offerings.png",
    "exodus-30/01-scene.jpg": "audit-e30-incense.png",
    "exodus-30/02-scene.jpg": "audit-e30-laver.png",
    "exodus-31/01-scene.jpg": "audit-e31-craftsmen.png",
    "exodus-31/02-scene.jpg": "audit-e31-sabbath.png",
    "exodus-32/01-scene.jpg": "audit-e32-calf.png",
    "exodus-32/02-scene.jpg": "audit-e32-tablets.png",
    "exodus-33/01-scene.jpg": "audit-e33-tent.png",
    "exodus-33/02-scene.jpg": "audit-e33-glory.png",
    "exodus-34/01-scene.jpg": "audit-e34-radiant.png",
    "exodus-34/02-scene.jpg": "audit-e34-tablets.png",
    "exodus-35/01-scene.jpg": "audit-e35-offerings.png",
    "exodus-35/02-scene.jpg": "audit-e35-spin.png",
    "exodus-36/01-scene.jpg": "audit-e36-build.png",
    "exodus-36/02-scene.jpg": "audit-e36-materials.png",
    "exodus-37/01-scene.jpg": "audit-e37-cherubim.png",
    "exodus-37/02-scene.jpg": "audit-e37-table.png",
    "exodus-38/01-scene.jpg": "audit-e38-bronze.png",
    "exodus-38/02-scene.jpg": "audit-e38-census.png",
    "exodus-39/01-scene.jpg": "audit-e39-garments.png",
    "exodus-39/02-scene.jpg": "audit-e39-inspect.png",
    "exodus-40/01-scene.jpg": "audit-e40-setup.png",
    "exodus-40/02-scene.jpg": "audit-e40-glory.png",
}


def md5(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def write_jpg(src: Path, dest: Path, quality: int = 88) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(src).convert("RGB")
    # Normalize to consistent portrait canvas while preserving content
    img.save(dest, "JPEG", quality=quality, optimize=True)


def main() -> None:
    HERO_DIR.mkdir(parents=True, exist_ok=True)
    missing = []
    written = 0
    for rel, src_name in MAP.items():
        src = SRC / src_name
        if not src.exists():
            missing.append(src_name)
            continue
        # Keep a copy in-repo for future rebuilds
        hero_copy = HERO_DIR / src_name
        if not hero_copy.exists() or md5(hero_copy) != md5(src):
            shutil.copy2(src, hero_copy)
        dest = WEBTOON / rel
        write_jpg(src, dest)
        written += 1
        print(f"OK {rel} <- {src_name}")

    if missing:
        raise SystemExit(f"Missing sources ({len(missing)}): {missing}")

    # Verify uniqueness within each mapped chapter and no accidental MAP collisions
    src_hashes = {}
    collisions = []
    for rel, src_name in MAP.items():
        h = md5(SRC / src_name)
        if h in src_hashes and src_hashes[h] != src_name:
            collisions.append((src_hashes[h], src_name, h))
        src_hashes[h] = src_name
    if collisions:
        raise SystemExit(f"Source PNG collisions: {collisions}")

    print(f"\nWrote {written} chapter images. Heroes cached in {HERO_DIR}")


if __name__ == "__main__":
    main()
