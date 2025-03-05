import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import * as React from "react";

interface Sauce {
  id: number;
  name: string;
  tags: string[];
  ratings: number[];
  newTag: string;
  newRating: string;
  error: string;
}

const initialSauces: Sauce[] = [
  {
    id: 1,
    name: "Sriracha",
    tags: ["Spicy", "Asian"],
    ratings: [] as number[],
    newTag: "",
    newRating: "",
    error: "",
  },
  {
    id: 2,
    name: "Tabasco",
    tags: ["Vinegary", "Classic"],
    ratings: [] as number[],
    newTag: "",
    newRating: "",
    error: "",
  },
  {
    id: 3,
    name: "Frank's RedHot",
    tags: ["Mild", "Buffalo"],
    ratings: [] as number[],
    newTag: "",
    newRating: "",
    error: "",
  },
];

const App = () => {
  const [sauces, setSauces] = useState<Sauce[]>(initialSauces);
  const { toast } = useToast();

  const showNotification = (message: string, type: 'success' | 'error') => {
    toast({
      description: message,
      variant: type === 'success' ? 'default' : 'destructive',
    });
  };

  const handleRateSauce = (id: number) => {
    setSauces((prevSauces) =>
      prevSauces.map((sauce) => {
        if (sauce.id === id) {
          if (!sauce.newRating) {
            return {
              ...sauce,
              error: "Please select a rating before submitting!",
            };
          }
          showNotification("Rating submitted successfully!", "success");
          return {
            ...sauce,
            ratings: [...sauce.ratings, parseInt(sauce.newRating)],
            newRating: "",
            error: "",
          };
        }
        return sauce;
      })
    );
  };

  const handleAddTag = (id: number) => {
    setSauces((prevSauces) =>
      prevSauces.map((sauce) => {
        if (sauce.id === id) {
          if (!sauce.newTag.trim()) {
            return { ...sauce, error: "Please enter a tag before adding!" };
          }
          showNotification("Tag added successfully!", "success");
          return {
            ...sauce,
            tags: [...sauce.tags, sauce.newTag.trim()],
            newTag: "",
            error: "",
          };
        }
        return sauce;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <Toaster />
      
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Sauce Rating Platform
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Rate and tag your favorite sauces!
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        {sauces.map((sauce) => {
          const avgRating = sauce.ratings.length > 0
            ? (sauce.ratings.reduce((a, b) => a + b, 0) / sauce.ratings.length).toFixed(1)
            : "Not rated yet";

          return (
            <Card key={sauce.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">{sauce.name}</CardTitle>
                <div className="space-y-1">
                  <p className="text-gray-600">
                    Tags: {sauce.tags.map((tag, i) => (
                      <span key={i} className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-sm mr-1">
                        {tag}
                      </span>
                    ))}
                  </p>
                  <p className="text-gray-700 font-medium">
                    Average Rating: {" "}
                    <span className="text-lg font-bold text-blue-600">
                      {avgRating}
                    </span>
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor={`rating-${sauce.id}`} className="block font-medium">
                    Rate this sauce:
                  </label>
                  <Select
                    value={sauce.newRating}
                    onValueChange={(value) =>
                      setSauces((prevSauces) =>
                        prevSauces.map((s) =>
                          s.id === sauce.id
                            ? { ...s, newRating: value, error: "" }
                            : s
                        )
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1} {i + 1 === 10 ? "🔥" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => handleRateSauce(sauce.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Rating
                  </Button>
                </div>

                <div className="space-y-3">
                  <label htmlFor={`tag-${sauce.id}`} className="block font-medium">
                    Add a new tag:
                  </label>
                  <Input
                    id={`tag-${sauce.id}`}
                    placeholder="e.g., Sweet, Tangy, Hot..."
                    value={sauce.newTag}
                    onChange={(e) =>
                      setSauces((prevSauces) =>
                        prevSauces.map((s) =>
                          s.id === sauce.id
                            ? { ...s, newTag: e.target.value, error: "" }
                            : s
                        )
                      )
                    }
                    className="w-full"
                  />
                  <Button 
                    onClick={() => handleAddTag(sauce.id)}
                    variant="secondary"
                    className="w-full"
                  >
                    Add Tag
                  </Button>
                </div>

                {sauce.error && (
                  <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded">
                    {sauce.error}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default App;