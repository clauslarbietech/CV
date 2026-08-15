type SpeedHeroLogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

/** Speed — HERO mascot mark: clear shapes, high contrast, no fine detail. */
export function SpeedHeroLogo({
  size = 96,
  className,
  title = "Speed, HERO reading hero",
}: SpeedHeroLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="speed-cape" x1="18%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#5b3cc4" />
          <stop offset="55%" stopColor="#8a3d7a" />
          <stop offset="100%" stopColor="#ff7a3d" />
        </linearGradient>
        <linearGradient id="speed-chest" x1="30%" y1="20%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#2a1b58" />
          <stop offset="100%" stopColor="#121214" />
        </linearGradient>
      </defs>

      {/* Soft disc — logo badge */}
      <circle cx="64" cy="64" r="60" fill="url(#speed-cape)" opacity="0.22" />
      <circle cx="64" cy="64" r="52" fill="#0a0a0c" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* Cape / speed trail */}
      <path
        d="M38 78c-10 6-18 16-20 26 14-4 28-6 42-4 8 1 16 4 22 8 2-12-2-24-10-32-6-6-14-8-22-6-4 1-8 4-12 8Z"
        fill="url(#speed-cape)"
        opacity="0.9"
      />

      {/* Body */}
      <ellipse cx="64" cy="78" rx="22" ry="26" fill="url(#speed-chest)" />
      <circle cx="64" cy="46" r="18" fill="#f5e6d3" />

      {/* Mask / visor — high contrast band */}
      <path
        d="M48 46c2-8 8-12 16-12s14 4 16 12c-4 2-10 3-16 3s-12-1-16-3Z"
        fill="#1c1c1e"
      />
      <path d="M52 45h8M68 45h8" stroke="#ffb347" strokeWidth="3" strokeLinecap="round" />

      {/* Letter S chest emblem — dyslexia-friendly bold mark */}
      <circle cx="64" cy="76" r="11" fill="#fff" />
      <path
        d="M69.5 71.2c-1.2-1.6-3-2.4-5.4-2.4-3.6 0-5.8 1.8-5.8 4.2 0 2.2 1.6 3.4 5.2 4.2l1.6.4c2.2.5 3.2 1.1 3.2 2.2 0 1.4-1.4 2.4-3.6 2.4-2.2 0-3.8-.8-4.8-2.2"
        fill="none"
        stroke="#5b3cc4"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Speed lines — calm, not flickering */}
      <path
        d="M18 52h14M14 62h12M20 72h10"
        stroke="#ff7a3d"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function SpeedHeroWordmark({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="speed-wordmark">Speed</p>
      <p className="speed-submark">HERO reading hero</p>
    </div>
  );
}
