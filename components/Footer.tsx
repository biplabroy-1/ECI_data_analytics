import { Github, Twitter, Instagram, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-12 bg-white border-t border-gray-100">
      <div className="container px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center space-y-6">
          
          {/* Brand Name */}
          <div className="flex items-center space-x-3">
            <h3 className="text-2xl font-semiboldbold text-gray-900">azmth</h3>
          </div>
          
          {/* Tagline */}
          <p className="text-gray-600 max-w-md">
            AI-powered electoral data analysis that ensures transparency and accuracy in democratic processes.
          </p>
          
          {/* Social Media */}
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-blue-50">
              <Instagram className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-blue-50">
              <Globe className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-blue-50">
              <Twitter className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-blue-50">
              <Github className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-gray-100 w-full">
            <p className="text-sm text-gray-500 text-center">
              © 2025 The Future Network LLP. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;