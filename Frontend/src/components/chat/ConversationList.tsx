import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import { Conversation } from "./ChatLayout";
import { ConversationItem } from "./ConversationItem";
import { Search, UserPlus } from "lucide-react"; 

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const ConversationList = ({ conversations, selectedId, onSelect }: ConversationListProps) => {
  const handleAddPerson = () => {
    alert("Add new person functionality to be implemented.");
  };

  return (
    <Card className="w-1/3 border-r h-full flex flex-col rounded-none">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-800">Conversations</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleAddPerson}>
            <UserPlus className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={selectedId === conv.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};