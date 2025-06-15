import Freelancing from "@/pages/Freelancing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Sparkles, ShoppingCart, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../lib/firebase";
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    checkLogin();

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // this signs the user out from Firebase
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-200/50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container h-14 w-full flex items-center justify-between">
        {/* Logo */}
        <div className="w-30 flex items-left space-x-2">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                AMOGH
              </span>
              <span className="text-xs text-slate-500 -mt-1">ever useful</span>
            </div>
            <Badge variant="secondary" className="hidden w-10 h-6 text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
              Beta
            </Badge>
          </Link>
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/marketplace" className="text-slate-600 hover:text-blue-500 transition-colors font-medium hover:scale-105 transform duration-200">
            Market
          </Link>
          <Link to="/freelancing" className="text-slate-600 hover:text-purple-500 transition-colors font-medium hover:scale-105 transform duration-200">
            Work
          </Link>
          <Link to="/sustainable" className="text-slate-600 hover:text-emerald-500 transition-colors font-medium hover:scale-105 transform duration-200">
            Green
          </Link>
          <Link to="/community" className="text-slate-600 hover:text-cyan-500 transition-colors font-medium hover:scale-105 transform duration-200">
            Connect
          </Link>
        </nav>

        {/* Right-aligned Buttons */}
        <div className="hidden w-30 md:flex items-right space-x-3">
          {!isLoggedIn ? (
            <>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-white text-base" asChild>
                <Link to="/signup">Join</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
                <Link to="/cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Link>
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
                <Link to="/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden transform transition-all duration-300 hover:scale-110 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link to="/marketplace" className="text-slate-600 hover:text-blue-500 transition-colors font-medium">Market</Link>
            <Link to="/freelancing" className="text-slate-600 hover:text-purple-500 transition-colors font-medium">Work</Link>
            <Link to="/sustainable" className="text-slate-600 hover:text-emerald-500 transition-colors font-medium">Green</Link>
            <Link to="/community" className="text-slate-600 hover:text-cyan-500 transition-colors font-medium">Connect</Link>

            <div className="flex flex-col space-y-2 pt-4">
              {!isLoggedIn ? (
                <>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600" asChild>
                    <Link to="/signup">Join</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                    <Link to="/cart">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                    </Link>
                  </Button>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                    <Link to="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
