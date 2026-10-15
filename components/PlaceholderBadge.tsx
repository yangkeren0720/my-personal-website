export default function PlaceholderBadge({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <span className="placeholder-badge" title="Edit this in content/site.ts">
      placeholder
    </span>
  );
}
