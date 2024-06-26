import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const Sidebar = ({users}: any) => {
  return (
    <div className="w-1/4 relative">
      <Tabs defaultValue="your_chats" className="w-full flex flex-col h-full">
        <TabsList className="w-full flex-none space-x-16">
          <TabsTrigger value="your_chats">Your chats</TabsTrigger>
          <TabsTrigger value="active_users">Active users</TabsTrigger>
        </TabsList>
        <TabsContent value="your_chats" className="flex-1 overflow-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="mt-8 text-4xl font-bold">
                Your chats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 mt-16">
                <div>
                  <p>User 1</p>
                  <p>You: Hello</p>
                </div>
                <div>
                  <p>User 2</p>
                  <p>You: Hello</p>
                </div>
                <div>
                  <p>User 3</p>
                  <p>You: Hello</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active_users" className="flex-1 overflow-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="mt-8 text-4xl font-bold">
                Active users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 mt-16">
                <div>
                  <p>User 1</p>
                </div>
                <div>
                  <p>User 2</p>
                </div>
                <div>
                  <p>User 3</p>
                </div>
              </div>
              {users.map((user: any) => <div key={user._id}>{user.username}</div>)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
