import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Computer, Search, Webhook, Plus } from "lucide-react";

interface CrmIntegration {
  id: string;
  name: string;
  status: string;
  description: string;
  icon: string;
}

interface CrmIntegrationProps {
  integrations: CrmIntegration[];
  isLoading: boolean;
}

const CrmIntegration = ({ integrations, isLoading }: CrmIntegrationProps) => {
  const renderIcon = (icon: string) => {
    switch (icon) {
      case "salesforce":
        return <Database className="text-xl text-blue-600 mr-2" />;
      case "microsoft":
        return <Computer className="text-xl text-blue-700 mr-2" />;
      case "google":
        return <Search className="text-xl text-red-500 mr-2" />;
      case "hubspot":
        return <Webhook className="text-xl text-orange-500 mr-2" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">CRM Integration Status</h3>
        </CardHeader>
        <CardContent className="p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
          <Skeleton className="h-9 w-full mt-6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 border-b border-gray-100">
        <h3 className="font-semibold">CRM Integration Status</h3>
      </CardHeader>
      <CardContent className="p-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {renderIcon(integration.icon)}
                <p className="font-medium">{integration.name}</p>
              </div>
              <StatusBadge
                status={
                  integration.status === "connected"
                    ? "connected"
                    : integration.status === "pending"
                    ? "pending"
                    : "disconnected"
                }
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <p>{integration.description}</p>
              <Button variant="link" size="sm" className="text-accent p-0 h-auto">
                {integration.status === "connected"
                  ? "Configure"
                  : integration.status === "pending"
                  ? "Connect"
                  : "Connect"}
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          className="mt-6 w-full py-2 text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Connect Another Service
        </Button>
      </CardContent>
    </Card>
  );
};

export default CrmIntegration;
