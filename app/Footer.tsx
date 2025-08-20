import { Github, Twitter, Instagram, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="w-full py-4">
      <div className="container px-4">
        <div className="glass glass-hover rounded-xl p-4 flex flex-col items-center text-center space-y-6">
          
          {/* Brand Name */}
          <h3 className="text-2xl font-bold tracking-wide">AZMTH</h3>
          
          {/* Tagline */}
          <p className="text-sm text-muted-foreground max-w-md">
            AI-powered call management that never misses an opportunity.
          </p>
          
          {/* Social Media */}
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon">
              <Instagram className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Globe className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Twitter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Github className="w-5 h-5" />
            </Button>
          </div>

          {/* Copyright */}
          <div className=" border-t border-white/10 w-full">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 The Future Network LLP. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
