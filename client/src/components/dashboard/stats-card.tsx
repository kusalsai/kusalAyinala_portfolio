import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  CalendarCheck, 
  CheckSquare, 
  LineChart, 
  RotateCw, 
  LucideIcon 
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  change?: string;
  icon: "calendar" | "checkbox" | "chart" | "refresh";
  iconColor?: string;
  valueClassName?: string;
}

const StatsCard = ({
  title,
  value,
  description,
  change,
  icon,
  iconColor = "text-accent",
  valueClassName,
}: StatsCardProps) => {
  const getIcon = (): JSX.Element => {
    switch (icon) {
      case "calendar":
        return <CalendarCheck className={cn("text-xl", iconColor)} />;
      case "checkbox":
        return <CheckSquare className={cn("text-xl", iconColor)} />;
      case "chart":
        return <LineChart className={cn("text-xl", iconColor)} />;
      case "refresh":
        return <RotateCw className={cn("text-xl", iconColor)} />;
      default:
        return <CalendarCheck className={cn("text-xl", iconColor)} />;
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          {getIcon()}
        </div>
        <div className="flex items-end">
          <p className={cn("text-2xl font-bold", valueClassName)}>{value}</p>
          {change && (
            <p className={cn(
              "text-sm ml-2", 
              change.includes("+") ? "text-success" : 
              change.includes("-") ? "text-destructive" : 
              "text-warning"
            )}>
              {change}
            </p>
          )}
        </div>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
