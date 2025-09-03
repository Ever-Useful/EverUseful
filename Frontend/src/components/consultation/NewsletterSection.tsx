import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Leaf, Zap, Users } from "lucide-react";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing to our sustainability newsletter.",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="relative py-20 px-4 lg:px-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2070&q=80" 
          alt="Background" 
          className="w-full h-full object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-eco-green/30 backdrop-blur-sm" />
      </div>
      <div className="relative max-w-4xl mx-auto">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-primary/20 shadow-[var(--shadow-card)]">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-eco-green/20 rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-eco-green" />
                </div>
                <div className="w-16 h-16 bg-eco-blue/20 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-eco-blue" />
                </div>
                <div className="w-16 h-16 bg-eco-purple/20 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-eco-purple" />
                </div>
              </div>
              
              <h2 className="heading-section font-bold">
                <span className="text-eco-green glow-text">Stay Updated</span>
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Get the latest insights on renewable energy trends, sustainability best practices, 
                and exclusive tips delivered straight to your inbox.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-eco-green/20 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6 text-eco-green" />
                </div>
                <h3 className="font-semibold text-foreground">Weekly Insights</h3>
                <p className="text-sm text-muted-foreground">Latest trends and technologies</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-eco-blue/20 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-eco-blue" />
                </div>
                <h3 className="font-semibold text-foreground">Exclusive Content</h3>
                <p className="text-sm text-muted-foreground">Subscriber-only resources</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-eco-purple/20 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-eco-purple" />
                </div>
                <h3 className="font-semibold text-foreground">Community Access</h3>
                <p className="text-sm text-muted-foreground">Connect with like-minded individuals</p>
              </div>
            </div>

            {/* Subscription Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary h-12"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="eco-gradient hover:shadow-[var(--shadow-glow)] transition-all duration-300 group h-12 px-8"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground">
              By subscribing, you agree to receive marketing emails. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};