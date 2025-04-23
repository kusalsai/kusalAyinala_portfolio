import { cn } from "@/lib/utils";

type StatusType = 
  | "completed" 
  | "pending" 
  | "cancelled" 
  | "rescheduled" 
  | "confirmed" 
  | "in-progress" 
  | "overdue" 
  | "connected" 
  | "disconnected";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const statusConfig = {
    completed: {
      className: "bg-green-100 text-green-800",
      defaultLabel: "Completed",
    },
    pending: {
      className: "bg-yellow-100 text-yellow-800",
      defaultLabel: "Pending",
    },
    cancelled: {
      className: "bg-red-100 text-red-800",
      defaultLabel: "Cancelled",
    },
    rescheduled: {
      className: "bg-yellow-100 text-yellow-800",
      defaultLabel: "Rescheduled",
    },
    confirmed: {
      className: "bg-success bg-opacity-10 text-success",
      defaultLabel: "Confirmed",
    },
    "in-progress": {
      className: "bg-accent bg-opacity-10 text-accent",
      defaultLabel: "In Progress",
    },
    overdue: {
      className: "bg-destructive bg-opacity-10 text-destructive",
      defaultLabel: "Overdue",
    },
    connected: {
      className: "bg-success bg-opacity-10 text-success",
      defaultLabel: "Connected",
    },
    disconnected: {
      className: "bg-gray-200 text-gray-600",
      defaultLabel: "Not Connected",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "px-2 py-1 text-xs rounded-full font-medium",
        config.className,
        className
      )}
    >
      {label || config.defaultLabel}
    </span>
  );
};

export default StatusBadge;
