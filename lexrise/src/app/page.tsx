import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero-plane">
        <div className="hero-glow" aria-hidden />
        <div className="hero-letters" aria-hidden>
          <span>b</span>
          <span>d</span>
          <span>p</span>
          <span>q</span>
        </div>
        <div className="site-shell flex min-h-[min(100svh,860px)] flex-col justify-center py-20">
          <p className="rise font-display text-5xl font-semibold tracking-tight sm:text-7xl md:text-8xl">
            LexRise
          </p>
          <h1 className="rise rise-delay-1 mt-5 max-w-2xl text-2xl font-medium leading-snug text-[rgba(244,251,250,0.92)] sm:text-3xl">
            Reading tools, fonts, and phonics games for dyslexic minds.
          </h1>
          <p className="rise rise-delay-2 mt-4 max-w-xl text-lg text-[rgba(244,251,250,0.78)]">
            Practice clearer text, build sound–letter skills, and see what people with dyslexia have already
            achieved in the world.
          </p>
          <div className="rise rise-delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/accomplishments" className="btn btn-primary bg-[var(--amber)] text-[var(--ink)] hover:bg-[var(--amber-deep)]">
              See accomplishments
            </Link>
            <Link href="/games" className="btn btn-secondary border-[rgba(244,251,250,0.35)] text-[var(--foam)] hover:bg-[rgba(255,255,255,0.08)]">
              Play reading games
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-shell">
          <h2 className="section-title">One app. Three ways to rise.</h2>
          <p className="section-lead">
            LexRise starts with inspiration, then gives you practical reading supports grounded in research—not
            viral myths.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <Link href="/accomplishments" className="group block">
              <h3 className="font-display text-2xl text-[var(--bg-deep)] transition-colors group-hover:text-[var(--teal)]">
                Accomplishments
              </h3>
              <p className="mt-2 text-[var(--ink-soft)]">
                Entrepreneurs, scientists, athletes, and artists who thrived with dyslexia—proof that struggle with
                print is not a ceiling.
              </p>
            </Link>
            <Link href="/fonts" className="group block">
              <h3 className="font-display text-2xl text-[var(--bg-deep)] transition-colors group-hover:text-[var(--teal)]">
                Font Lab
              </h3>
              <p className="mt-2 text-[var(--ink-soft)]">
                Tune Lexend, OpenDyslexic, size, spacing, and contrast. Research says spacing often helps more than
                fancy letter shapes.
              </p>
            </Link>
            <Link href="/games" className="group block">
              <h3 className="font-display text-2xl text-[var(--bg-deep)] transition-colors group-hover:text-[var(--teal)]">
                Phonics games
              </h3>
              <p className="mt-2 text-[var(--ink-soft)]">
                Sound match, letter flip (b/d/p/q), word unscramble, and nonsense decoding—plus the scramble
                challenge with myth-busting.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
