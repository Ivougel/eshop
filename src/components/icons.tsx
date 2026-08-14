type IconProps = {
  className?: string;
};

export function PlatformIcon({
  icon,
  className = "h-8 w-8",
}: {
  icon: string;
  className?: string;
}) {
  switch (icon) {
    case "apple":
      return <AppleIcon className={className} />;
    case "nintendo":
      return <NintendoIcon className={className} />;
    case "roblox":
      return <RobloxIcon className={className} />;
    case "playstation":
      return <PlayStationIcon className={className} />;
    case "steam":
      return <SteamIcon className={className} />;
    default:
      return <span className={className} />;
  }
}

function AppleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.7 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9s-1.9-1-3.1-1c-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8 2.1-1.2 2.9-2.4c.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.6-3.7zM14.6 5.8c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z" />
    </svg>
  );
}

function NintendoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <rect x="3" y="5" width="7" height="14" rx="3.5" />
      <rect x="14" y="5" width="7" height="14" rx="3.5" />
      <circle cx="6.5" cy="12" r="1.3" fill="#1c1c1f" />
      <circle cx="17.5" cy="12" r="1.3" fill="#1c1c1f" />
    </svg>
  );
}

function RobloxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8.2 3.5 20.5 7.4l-3.9 13.1L4.3 16.6 8.2 3.5zm1.7 4.4-1.6 5.4 5.4 1.6 1.6-5.4-5.4-1.6z" />
    </svg>
  );
}

function PlayStationIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8.3 14.7c-1.8.6-3.4 0-3.4 0v2.3s1.9.8 4 .3V8.6l3.3-1.1v12.2c-2.1.7-4.1.3-4.1.3v-2.2s1.2.3 2.3 0V14c0 .1-.8.4-2.1.7zm6.5-9.2v11.7c1.7.8 3.3.6 3.3.6V15s-1.1.3-2.1 0V7.4c0-.7.3-1 .8-.8.6.2.8.8.8 1.4v1.7c1.1.4 2.1.3 2.1.3V7.2c0-1.6-1-2.6-2.6-3.1-1.5-.4-2.3.3-2.3 1.4z" />
    </svg>
  );
}

function SteamIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-10 9.2l5.4 2.2a2.7 2.7 0 0 1 2.7-1.4l3.9-5.6a3.6 3.6 0 1 1 3.1 3.2l-5.5 4a2.7 2.7 0 0 1-2.7 2.6l-3.8-1.6A10 10 0 1 0 12 2zm7.2 5.6a2.2 2.2 0 1 0-2.1 3l.1-.1a2.2 2.2 0 0 0 2-2.9zM8.9 14.3a1.5 1.5 0 1 0-1.4 2l1.8.8a1.5 1.5 0 0 0-.4-2.8z" />
    </svg>
  );
}

export function SbpIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#fff" />
      <path
        d="M7 8.2h6.2c1.7 0 2.8 1 2.8 2.4 0 1-.5 1.8-1.4 2.2L17 16h-2.3l-2.1-3H9.2V16H7V8.2zm2.2 1.7v1.8h3.6c.7 0 1.1-.3 1.1-.9s-.4-.9-1.1-.9H9.2z"
        fill="#1a1a1a"
      />
    </svg>
  );
}
