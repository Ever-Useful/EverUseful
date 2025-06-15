import Freelancing from "@/pages/Freelancing";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Sparkles, ShoppingCart, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/signin");
  };
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <>
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
            <Badge variant="secondary" className="hidden w-10 h-6 text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">Beta</Badge>
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
          <Link to="/" className="text-slate-600 hover:text-cyan-500 transition-colors font-medium hover:scale-105 transform duration-200">
            Connect
          </Link>
        </nav>

        {/* Right-aligned Buttons */}
        <div className="hidden w-30 md:flex items-right space-x-3">
          <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
            <Link to="/cart">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
            </Link>
          </Button>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
            <Link to="/profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </Button>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
            <Link to="/admin">Admin</Link>
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-white text-base" asChild>
            <Link to="/signup">Join</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transform transition-all duration-300 hover:scale-110 text-slate-600 touch-manipulation"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </header>
        


      <div className={`lg:hidden fixed top-16 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg transition-all duration-300 ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}>
        <div className="container mx-auto px-4 py-6">
          <nav className="space-y-1">
            {/* Main Navigation */}
            <div className="space-y-1 mb-6">
              <Link
                to="/marketplace"
                className="flex items-center px-4 py-3 text-slate-700 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium touch-manipulation"
                onClick={closeMobileMenu}
              >
                <span className="ml-3">Market</span>
              </Link>
              <Link
                to="/freelancing"
                className="flex items-center px-4 py-3 text-slate-700 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium touch-manipulation"
                onClick={closeMobileMenu}
              >
                <span className="ml-3">Work</span>
              </Link>
              <Link
                to="/sustainable"
                className="flex items-center px-4 py-3 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium touch-manipulation"
                onClick={closeMobileMenu}
              >
                <span className="ml-3">Green</span>
              </Link>
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-slate-700 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all duration-200 font-medium touch-manipulation"
                onClick={closeMobileMenu}
              >
                <span className="ml-3">Connect</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 my-4"></div>

            {/* Account Actions */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-slate-700 hover:text-slate-900 hover:bg-slate-50 touch-manipulation"
                asChild
              >
                <Link to="/cart" onClick={closeMobileMenu}>
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  <span className="text-base">Cart</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-slate-700 hover:text-slate-900 hover:bg-slate-50 touch-manipulation"
                asChild
              >
                <Link to="/profile" onClick={closeMobileMenu}>
                  <User className="w-5 h-5 mr-3" />
                  <span className="text-base">Profile</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-slate-700 hover:text-slate-900 hover:bg-slate-50 touch-manipulation"
                asChild
              >
                <Link to="/admin" onClick={closeMobileMenu}>
                  <span className="text-base">Admin</span>
                </Link>
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                variant="outline"
                className="w-full h-12 text-slate-700 border-slate-300 hover:bg-slate-50 touch-manipulation"
                asChild
              >
                <Link to="/signin" onClick={closeMobileMenu}>
                  <span className="text-base font-medium">Sign In</span>
                </Link>
              </Button>

              <Button
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg touch-manipulation"
                asChild
              >
                <Link to="/signup" onClick={closeMobileMenu}>
                  <span className="text-base">Join AMOGH</span>
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};