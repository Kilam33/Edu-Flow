"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { searchAcademicPapers } from "@/lib/academic-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Search, 
  ExternalLink, 
  Users, 
  Calendar, 
  Award
} from "lucide-react";

export function PapersSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data: any) => {
    if (!data.query.trim()) return;
    
    try {
      setIsSearching(true);
      
      // In a real implementation, you'd need to get the CORE API key from somewhere
      const results = await searchAcademicPapers(
        data.query, 
        ['arxiv', 'semanticscholar']
      );
      
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info("No papers found matching your query");
      }
    } catch (error) {
      console.error('Error searching papers:', error);
      toast.error("Error searching academic papers");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Academic Paper Search</CardTitle>
          <CardDescription>
            Search for academic papers across multiple databases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search for research papers..."
                {...register("query", { required: true })}
                className="w-full"
              />
              {errors.query && (
                <p className="text-destructive text-sm mt-1">
                  Please enter a search query
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <Separator />
          
          <div className="grid gap-4 md:grid-cols-2">
            {searchResults.map((paper) => (
              <Card key={paper.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{paper.title}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>
                      {paper.authors.length > 3
                        ? `${paper.authors.slice(0, 3).join(", ")} et al.`
                        : paper.authors.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{paper.publishedDate}</span>
                    </div>
                    {paper.citations !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Award className="h-3 w-3" />
                        <span>{paper.citations} citations</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">
                    {paper.abstract || "No abstract available."}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 w-full"
                    asChild
                  >
                    <a href={paper.url} target="_blank" rel="noopener noreferrer">
                      View Paper
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}