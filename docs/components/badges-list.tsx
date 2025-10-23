export function BadgesList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row flex-wrap gap-x-2 items-center">
      {children}
    </div>
  );
}
