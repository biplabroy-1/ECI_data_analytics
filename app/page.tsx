"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomDropzone from "@/components/CustomDropzone";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main layout */}
      <div className="flex flex-1 w-full max-w-6xl mx-auto p-6 gap-6">
        {/* Right section: Dropzone + Select */}

        <div className="flex flex-col flex-1 gap-6">
          <CustomDropzone />

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
            </SelectContent>
          </Select>
        </div>


                {/* Separator */}
        <Separator orientation="vertical" className="h-auto" />



        {/* Left section: Buttons */}
        <div className="flex flex-col flex-1 items-center justify-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-40">Open Box 1</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Box 1 Content</DialogTitle>
              </DialogHeader>
              <p>This is the content of the first dialog.</p>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-40">Open Box 2</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Box 2 Content</DialogTitle>
              </DialogHeader>
              <p>This is the content of the second dialog.</p>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-40">Open Box 3</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Box 3 Content</DialogTitle>
              </DialogHeader>
              <p>This is the content of the third dialog.</p>
            </DialogContent>
          </Dialog>
        </div>


      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
