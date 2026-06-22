type RenderDebugBadgeProps = {
  name: string;
  count: number;
};

export default function RenderDebugBadge({ name, count }: RenderDebugBadgeProps) {
  return (
    <p className="welcome-render-count">
      {name} render #{count}
    </p>
  );
}
