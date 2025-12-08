"use-client";

export default function WindowScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex-1 min-h-0 overflow-auto custom-scrollbar bg-black ${className}`}>
      {children}
    </div>
  );
}
