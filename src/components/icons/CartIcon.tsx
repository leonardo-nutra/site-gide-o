/** Solid, lattice-style shopping cart glyph (handle, grid basket, two wheels). */
export function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      {/* Handle */}
      <rect x="1" y="1.5" width="5.5" height="2.4" rx="1.2" />
      {/* Diagonal connector from handle to basket */}
      <polygon points="6,1.9 8.2,7.6 5.9,8.4 3.7,2.7" />
      {/* Basket grid: outer frame + 3 internal dividers each way */}
      <rect x="5" y="7" width="17.5" height="1.6" rx="0.4" />
      <rect x="5" y="11.2" width="17.5" height="1.6" rx="0.4" />
      <rect x="5" y="15.4" width="17.5" height="1.6" rx="0.4" />
      <rect x="5" y="17" width="17.5" height="1.6" rx="0.4" />
      <rect x="5" y="7" width="1.6" height="11.6" rx="0.4" />
      <rect x="9.1" y="7" width="1.6" height="11.6" rx="0.4" />
      <rect x="13.2" y="7" width="1.6" height="11.6" rx="0.4" />
      <rect x="17.3" y="7" width="1.6" height="11.6" rx="0.4" />
      <rect x="20.9" y="7" width="1.6" height="11.6" rx="0.4" />
      {/* Wheels */}
      <circle cx="9" cy="21.3" r="1.9" />
      <circle cx="18.5" cy="21.3" r="1.9" />
    </svg>
  );
}
