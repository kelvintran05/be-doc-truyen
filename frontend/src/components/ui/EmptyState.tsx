import { Button } from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = "🔍", title, description, action }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-[#4A3F35]/25 rounded-[28px] p-12 text-center bg-[#FAF6EE]/50 backdrop-blur-sm flex flex-col items-center gap-3">
      <span className="text-5xl">{icon}</span>
      <h3 className="font-serif text-lg font-bold">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary font-quicksand">{description}</p>
      )}
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
