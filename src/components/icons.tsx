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
    case "xbox":
      return <XboxIcon className={className} />;
    case "ai":
      return <AiIcon className={className} />;
    case "telegram":
      return <TelegramIcon className={className} />;
    case "chat":
      return <ChatIcon className={className} />;
    case "star":
      return <StarIcon className={className} />;
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

export function XboxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M7.2 4.4C8.6 3.5 10.2 3 12 3c1.8 0 3.4.5 4.8 1.4C15.2 6.6 13.5 9.4 12 11.8 10.5 9.4 8.8 6.6 7.2 4.4zM4.2 7.1C3.4 8.5 3 10.2 3 12c0 3.6 2.1 6.7 5.1 8.1C6.6 17 5.2 12.8 5.2 9.4c0-.8.1-1.5.3-2.3h-1.3zm15.6 0h-1.3c.2.8.3 1.5.3 2.3 0 3.4-1.4 7.6-2.9 10.7 3-1.4 5.1-4.5 5.1-8.1 0-1.8-.4-3.5-1.2-4.9zM12 13.6c1.4 2.2 3.3 5.2 4.4 7.1-1.4.6-2.9.9-4.4.9s-3-.3-4.4-.9c1.1-1.9 3-4.9 4.4-7.1z" />
    </svg>
  );
}

function AiIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.4 3.1 15 8.4l5.7.5-4.3 3.8 1.3 5.6-5.3-3.1-5.3 3.1 1.3-5.6L4 8.9l5.7-.5 2.7-5.3z" />
    </svg>
  );
}

function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.7 4.3 3.8 10.8c-1.1.4-1.1 1.1-.2 1.4l4.3 1.3 10.4-6.6c.5-.3.9-.1.6.2l-8.4 7.6-.3 4.4c.4 0 .6-.2.8-.4l2.1-2 4.3 3.2c.8.4 1.4.2 1.6-.7l2.8-13.3c.3-1.2-.4-1.8-1.1-1.6z" />
    </svg>
  );
}

function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z" />
    </svg>
  );
}

function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3.2 14.4 8l5.3.8-3.8 3.7.9 5.3L12 15.3 7.2 17.8l.9-5.3L4.3 8.8 9.6 8 12 3.2z" />
    </svg>
  );
}

export function NavGlobeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 3.8 6 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-6-3.8-9s1.3-6.2 3.8-9z" />
    </svg>
  );
}

export function NavHomeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
    </svg>
  );
}

export function NavSearchIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function NavHeartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export function NavCartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="18" cy="20" r="1.2" />
      <path d="M3 4h2.2l2.1 11h11.2l1.8-7H7" />
    </svg>
  );
}

export function NavProfileIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c.8-3 3.4-5 7-5s6.2 2 7 5" />
    </svg>
  );
}

export function ChevronIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function BitcoinIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#f7931a" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path
        d="M13.2 7.1c1.6.3 2.6 1.3 2.6 2.7 0 1.1-.6 1.9-1.6 2.3 1.3.4 2.1 1.3 2.1 2.7 0 1.8-1.4 2.9-3.5 3.2v1.5h-1.5v-1.4h-1.2v1.4H8.6v-1.5H6.8v-1.3h1.2V8.6H6.8V7.3h1.8V5.9h1.5v1.3h1.2V5.9h1.5v1.2zm-3.1 4.4h1.9c1.1 0 1.7-.5 1.7-1.3s-.6-1.3-1.8-1.3h-1.8v2.6zm0 1.4v2.9h2.1c1.2 0 1.9-.6 1.9-1.5s-.8-1.4-2.1-1.4h-1.9z"
        fill="#fff"
      />
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
