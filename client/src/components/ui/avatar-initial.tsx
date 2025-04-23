import { cn, getInitials } from "@/lib/utils";

interface AvatarInitialProps {
  name: string;
  className?: string;
  bgColorClass?: string;
  textColorClass?: string;
}

const AvatarInitial = ({
  name,
  className,
  bgColorClass = "bg-indigo-100",
  textColorClass = "text-accent",
}: AvatarInitialProps) => {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "flex-shrink-0 h-8 w-8 rounded flex items-center justify-center font-medium",
        bgColorClass,
        textColorClass,
        className
      )}
    >
      {initials}
    </div>
  );
};

export default AvatarInitial;
