type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
});

export const MenuIcon = ({ size = 22 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M3 6h18M3 12h13M3 18h18" />
    <path d="M19 15l3 3-3 3" strokeWidth={1.6} />
  </svg>
);

export const GlobeIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
  </svg>
);

export const ChevronDown = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const CloseIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const DocumentIcon = ({ size = 17 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M9.5 3.5h5V5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V3.5z" />
    <path d="M10 11h4M10 14.5h4" />
  </svg>
);

export const CalendarIcon = ({ size = 19 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const ClipIcon = ({ size = 17 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.7}>
    <path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-2.8-2.8l8.3-8.3" />
  </svg>
);

export const TrashIcon = ({ size = 17 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.7}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M9 7V4h6v3" />
  </svg>
);

export const CheckIcon = ({ size = 26 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const AlertIcon = ({ size = 26 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5h.01" />
  </svg>
);

export const SidebarIcon = ({ size = 20 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.7}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M10 4v16" />
  </svg>
);

export const PlusIcon = ({ size = 17 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const RefreshIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M20 11a8 8 0 1 0-.6 4" />
    <path d="M20 4v7h-7" />
  </svg>
);

export const ArrowLeft = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);
