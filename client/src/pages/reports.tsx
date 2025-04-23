import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Reports = () => {
  const [timeRange, setTimeRange] = useState("month");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["/api/reports", timeRange],
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold">{reportData?.summary.totalMeetings}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {reportData?.summary.totalMeetingsChange > 0 ? (
                    <span className="text-success">↑ {reportData?.summary.totalMeetingsChange}% vs previous</span>
                  ) : (
                    <span className="text-destructive">↓ {Math.abs(reportData?.summary.totalMeetingsChange)}% vs previous</span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold">{reportData?.summary.averageDuration} min</div>
                <p className="text-xs text-gray-500 mt-1">
                  {reportData?.summary.averageDurationChange > 0 ? (
                    <span className="text-success">↑ {reportData?.summary.averageDurationChange}% vs previous</span>
                  ) : (
                    <span className="text-destructive">↓ {Math.abs(reportData?.summary.averageDurationChange)}% vs previous</span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Meeting Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold">{reportData?.summary.completionRate}%</div>
                <p className="text-xs text-gray-500 mt-1">
                  {reportData?.summary.completionRateChange > 0 ? (
                    <span className="text-success">↑ {reportData?.summary.completionRateChange}% vs previous</span>
                  ) : (
                    <span className="text-destructive">↓ {Math.abs(reportData?.summary.completionRateChange)}% vs previous</span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meeting Analytics</CardTitle>
          <CardDescription>Analyze your meeting trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="byTime">
            <TabsList className="mb-4">
              <TabsTrigger value="byTime">By Time</TabsTrigger>
              <TabsTrigger value="byClient">By Client</TabsTrigger>
              <TabsTrigger value="byType">By Type</TabsTrigger>
            </TabsList>
            
            <TabsContent value="byTime">
              {isLoading ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <Skeleton className="h-60 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={reportData?.byTime || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scheduled" name="Scheduled" fill="#4f46e5" />
                    <Bar dataKey="completed" name="Completed" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
            
            <TabsContent value="byClient">
              {isLoading ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <Skeleton className="h-60 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={reportData?.byClient || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {reportData?.byClient.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
            
            <TabsContent value="byType">
              {isLoading ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <Skeleton className="h-60 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={reportData?.byType || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {reportData?.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Engagement</CardTitle>
          <CardDescription>View client engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-20 flex items-center justify-center text-gray-500">
            Client engagement metrics coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
