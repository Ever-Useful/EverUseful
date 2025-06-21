import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// NotificationSidebar component
type Notification = {
  id: string | number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

const NotificationSidebar = ({ notifications, onClose }: { 
  notifications: Notification[]; 
  onClose: () => void 
}) => {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] bg-white/95 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle className="text-left">All Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 overflow-y-auto h-[calc(100vh-100px)]">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border ${notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-800">{notification.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                  </div>
                  {notification.unread && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              No notifications available
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// MessagesSidebar component
type Message = {
  id: string | number;
  sender: string;
  message: string;
  time: string;
  unread: boolean;
};

const MessagesSidebar = ({ messages, onClose }: { 
  messages: Message[]; 
  onClose: () => void 
}) => {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] bg-white/95 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle className="text-left">Messages</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 overflow-y-auto h-[calc(100vh-100px)]">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 rounded-lg border ${message.unread ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-800">{message.sender}</h3>
                    <p className="text-sm text-slate-600 mt-1">{message.message}</p>
                  </div>
                  {message.unread && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      New
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-400">{message.time}</p>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Reply
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              No messages available
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};