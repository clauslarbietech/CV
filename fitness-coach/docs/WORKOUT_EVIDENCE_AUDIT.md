# FitLife Workout & Nutrition — Evidence Audit

**Date:** August 2026  
**Scope:** All four workout programs, express missions, nutrition/fuel content, and research claims in the app.

This audit separates what is **supported by legitimate exercise/nutrition science**, what is **supported with caveats**, and what **needs revision** before you present it as effective programming.

---

## Executive summary

| Area | Verdict |
|------|---------|
| **Core exercises** (push-ups, squats, lunges, planks, bridges, dips) | ✅ Evidence-supported |
| **Circuit / HIIT structure** (rounds, 45–90s rest, 20–45 min sessions) | ✅ Supported with caveats |
| **Progressive overload** (weekly rep/hold bumps) | ✅ Supported for beginners |
| **Weekly recovery days** | ✅ Supported |
| **Jump squats & burpee volume (Easy tier, heavy users)** | ⚠️ Needs revision — plyometric progression |
| **“Bodyweight Basics” for wall / skill athletes** | ⚠️ Needs revision — wrong level of training |
| **5-day sardine + egg protocol** | ❌ Not evidence-based (already labeled) |
| **3-day viral “military diet”** | ❌ Not evidence-based; too low-cal for training |
| **Food Scan macro guesses** | ❌ Not research-backed (beta heuristic) |
| **Default 16:8 IF for muscle-building users** | ⚠️ Mixed evidence — revise messaging |
| **Research milestone copy** (VO₂max, fat loss rates) | ⚠️ Cited but can read as promises |

---

## Workout programs — what holds up

### Shared exercise library (~25 movements)

All programs use **compound, multi-joint bodyweight patterns** that align with:

- **ACSM 2026 Resistance Training Position Stand** — bodyweight and home-based training produce meaningful strength, hypertrophy, and function when effort and consistency are high; ≥2 sessions/week per major muscle group matters more than “perfect” programming.
- **Circuit training systematic reviews** — circuit formats improve muscular strength, endurance, and body composition over multi-week blocks (often >30 sessions).

**Exercises that are well-supported:**

| Exercise | Role | Notes |
|----------|------|-------|
| Push-Ups | Horizontal push | Regress to incline/knee push-ups as needed |
| Bodyweight Squats | Lower-body strength | Chair squat regression valid |
| Reverse / Walking Lunges | Unilateral leg work | Balance + quad/glute stimulus |
| Glute Bridges | Hip extension | Low injury risk, good for beginners |
| Plank / Side Plank / Hollow Hold | Core isometric | Duration progressions are standard |
| Chair Dips | Triceps push | Use stable chair; regress range if shoulder pain |
| Mountain Climbers / High Knees | Conditioning | Metabolic demand appropriate in circuits |
| Wall Sit | Isometric quad endurance | Low impact |

### Program-by-program

#### 1. 2-Week Starter (`operation-iron-14`) — **Supported with caveats**

- **Works:** 14-day condensed block; explicit day-by-day progression; recovery on Day 7; rep schemes appropriate for muscular endurance (e.g. 10–20 push-ups × 5 rounds).
- **Caveats:** Week 2 jumps volume quickly — fine for active users, hard for sedentary starters on **Easy** tier.
- **Revision:** Soften goal copy (“start losing fat gently”) to habit/capacity language.

#### 2. 30-Day Home Plan (`operation-iron-30`) — **Supported with caveats**

- **Works:** Template rotation (push/upper/lower/full/cardio/endurance); +2 reps / +5s holds per week; recovery every 7th day; final test as optional benchmark.
- **Caveats:** **6 training days / week** is high for deconditioned users — recovery days and Easy tier are critical.
- **Revision:** **Jump Squats** on Lower Body days — see plyometric section below.

#### 3. 12-Week Steady Plan (`operation-long-train`) — **Supported with caveats**

- **Works:** 84-day phased progression; adds sit-ups, leg raises, calf raises, walking lunges; weekly recovery; endurance march for aerobic base.
- **Caveats:** BCT/PRT phase names are **motivational metaphor only** — not official military programming.
- **Revision:** Keep “inspired by, not identical to” disclaimer visible on program detail.

#### 4. Bodyweight Basics (`operation-calisthenics`) — **Supported with caveats**

- **Works:** 21-day push/squat/core split; ~15% weekly rep scaling; benchmark days; exercise selection is valid for **beginners → intermediate**.
- **Caveats:** **Not a wall-athlete or skill-calisthenics program.** No muscle-ups, handstands, levers, or wall-specific progressions. Auto-enrolling “advanced” users here overpromises.
- **Revision:** Either rename/reposition for advanced users, or build a true skills track.

---

## ⚠️ Flagged for revision — workouts

### 1. Jump Squats (Iron 14, Iron 30 — Lower Body days)

**Issue:** Plyometric literature recommends:

- Ability to perform **5 controlled bodyweight squats** before jumping
- **Lower volume** for beginners (often 10–15 jumps/session, 2×/week with 48–72h recovery)
- **Extra caution above ~110 kg (240 lb)** due to landing forces

Current programming: **6–12 jump squats × 5 rounds** in a circuit — can exceed safe weekly plyometric volume for beginners and heavier athletes (e.g. 300 lb muscle-builder persona).

**Recommended revision:**

- **Easy tier:** Replace with **pause squats** or **squat-to-stand from chair** (same rep count).
- Add exercise note: *“Skip jumps if knees hurt or you’re new to plyometrics — do extra squats instead.”*
- Limit jump squats to **Standard/Challenging** tiers after Week 1.

### 2. Burpee volume on cardio days

**Issue:** Burpees are high-impact and technique-dependent. 6–12 × 5 rounds is acceptable for conditioned users but risky for obese/deconditioned users without regression (step-back burpees, no jump).

**Recommended revision:** Easy tier = **step-back burpee** or **squat + plank** alternative; note on exercise graphic.

### 3. Diamond Push-Ups early (Upper Body / Calisthenics)

**Issue:** Wrist/elbow stress for larger users or limited mobility.

**Recommended revision:** Coach cue: *“Use standard push-ups if wrists bother you.”*

### 4. Final test rep targets (Day 14 / 30 / 84)

**Issue:** 100–120 push-ups accumulated is an **aspirational test**, not evidence that everyone should hit it in 30 days.

**Status:** Acceptable as optional benchmark **if framed as “best effort, divide into sets”** (partially done).  
**Revision:** Add UI copy: *“Benchmark — not a pass/fail medical standard.”*

### 5. Advanced “wall athlete” → Bodyweight Basics enrollment

**Issue:** `personaFit.ts` sends advanced + build muscle users to `operation-calisthenics` at elite tier. Program content does not match skill expectations.

**Recommended revision:** Advanced users → **Long Train Challenging** or future **Skills** program; add disclaimer on PICKED FOR YOU card.

### 6. Express 8-min Tabata

**Issue:** HIIT science supports brief sessions **when intensity is genuinely high**. Deconditioned users may not safely reach that intensity without weeks of base work.

**Revision:** Require warm-up messaging; default express to 10–15 min for Easy tier users.

---

## Nutrition & fuel — what holds up

### Evidence-supported (with standard disclaimers)

| Content | Basis |
|---------|--------|
| Post-workout protein **15–30g** within ~2 hours | HPRC / sports nutrition consensus |
| **≥50g carbs** after long/hard sessions | HPRC nutrient timing |
| Hydration guidance | Military OneSource, HPRC |
| Lean protein + carbs around training | SOF Nutrition Guide (performance framing) |
| Sardines as low-mercury fish | FDA/EPA advice |

### ❌ Needs revision — nutrition

#### 1. 5-Day Sardine + Egg + Electrolytes

- **Verdict:** `not evidence-based` (correctly labeled in code)
- **Problem:** Still prominent on Nutrition tab — users may treat it as recommended
- **Action:** Move to collapsed “Experimental — not recommended” section; or remove from primary UI

#### 2. 3-Day Viral “Military Diet”

- **Verdict:** Not official military; **1,100–1,400 kcal/day** — inadequate for training days
- **Problem:** Listed as optional meal plan alongside legitimate fuel tracks
- **Action:** Remove or gate with strong warning; never suggest on workout days

#### 3. Default **Everyday 16:8** for 30-day / muscle goals

- **Verdict:** Mixed evidence for hypertrophy; **meal timing + protein** matter more than fasting window
- **Action:** For `build_muscle` persona, prioritize **Fuel to Build** balanced plates over IF-first defaults

#### 4. Food Scan

- **Verdict:** Filename heuristic, confidence scores are not validated
- **Action:** Keep beta label (done); do not expand claims until real vision model

#### 5. Digestion times (e.g. “Salmon: 45 minutes”)

- **Verdict:** Educational ranges only; gastric emptying is highly individual
- **Action:** Use ranges (45–90 min), keep disclaimer (partially done)

---

## Research citations — quality check

| Citation in app | Quality | Note |
|-----------------|---------|------|
| Tabata review (Springer 2019) | ✅ Peer-reviewed | Good |
| HIIT review (PMC8294064) | ✅ Peer-reviewed | Good |
| ACSM / FM 7-22 / HPRC | ✅ Authoritative | Good |
| JSCR calisthenics Tabata 2025 | ✅ Peer-reviewed DOI | Good |
| 12-week recruit DOI (10.70252/urnt4484) | ⚠️ Verify | Confirm journal legitimacy in next pass |
| ResearchGate mirrors | ⚠️ Weaker | Prefer DOI/PMC links in UI |
| Healthline military diet | ✅ OK for debunking | Appropriate as “what NOT to do” |
| ZOE sardine fast article | ⚠️ Blog | OK for “not evidence-based” label, not as proof |

---

## Recommended revision priority

### P0 — Safety / misleading

1. Jump squat regressions on Easy tier  
2. Demote or remove viral military diet from Nutrition main flow  
3. Honest advanced-user program matching (wall athlete ≠ Bodyweight Basics)  
4. Sardine protocol — keep off default path  

### P1 — Copy / expectations

5. Soften fat-loss outcome promises in program goals  
6. Final test = benchmark framing  
7. Build-muscle default fuel ≠ IF-first  
8. Burpee regression on Easy tier  

### P2 — Enhancement

9. True calisthenics skills track for advanced users  
10. Replace ResearchGate links with PMC/DOI where possible  
11. Real food vision model for Food Scan  

---

## Bottom line

**Your workouts are built on legitimate, mainstream exercise science** — bodyweight circuits, progressive overload, compound movements, and recovery days are all defensible.

**What does NOT hold up as “proven programming”** and needs your revision decision:

1. **Sardine 5-day protocol** — not evidence-based  
2. **Viral 3-day military diet** — not evidence-based; harmful on training days  
3. **Jump squats for Easy tier / heavy beginners** — safety progression gap  
4. **Bodyweight Basics as “wall athlete” programming** — level mismatch  
5. **Food Scan** — not research-backed yet  
6. **16:8 as default for muscle-building** — mixed evidence; messaging should change  

In-app **Research Basis** cards on each program detail screen reflect this audit. See `src/constants/research/programEvidence.ts`.
