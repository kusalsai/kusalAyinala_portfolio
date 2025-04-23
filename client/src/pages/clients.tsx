import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AvatarInitial from "@/components/ui/avatar-initial";
import { formatDate } from "@/lib/utils";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["/api/clients"],
  });

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search clients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="bg-accent hover:bg-indigo-700 text-white"
            onClick={() => setIsAddClientModalOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            <span>Add Client</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            Manage your client relationships and view their meeting history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Clients</TabsTrigger>
              <TabsTrigger value="recent">Recently Active</TabsTrigger>
              <TabsTrigger value="potential">Potential Clients</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Last Meeting</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contacts</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No clients found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <AvatarInitial 
                                  name={client.name} 
                                  bgColorClass={client.avatarBg || "bg-indigo-100"}
                                  textColorClass={client.avatarColor || "text-accent"}
                                />
                                <div>
                                  <div className="font-medium">{client.name}</div>
                                  <div className="text-sm text-gray-500">{client.company}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {client.lastMeeting ? formatDate(client.lastMeeting) : "No meetings yet"}
                            </TableCell>
                            <TableCell>
                              {client.status === "active" ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Active
                                </span>
                              ) : client.status === "inactive" ? (
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                  Inactive
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                  Potential
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{client.contacts.length}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="link" className="text-accent h-8">
                                View
                              </Button>
                              <Button variant="link" className="text-accent h-8">
                                Schedule
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="p-20 flex items-center justify-center text-gray-500">
                Recently active clients view coming soon
              </div>
            </TabsContent>
            
            <TabsContent value="potential">
              <div className="p-20 flex items-center justify-center text-gray-500">
                Potential clients view coming soon
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isAddClientModalOpen} onOpenChange={setIsAddClientModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Add a new client to your directory to schedule meetings and track interactions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input id="client-name" placeholder="Enter client name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Enter company name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter email address" type="email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClientModalOpen(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-indigo-700 text-white">Add Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
