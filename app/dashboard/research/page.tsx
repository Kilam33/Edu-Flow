import { PapersSearch } from "@/components/research/papers-search";

export default function ResearchPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Research Papers</h1>
        <p className="text-muted-foreground mt-1">
          Search for and access academic research papers to enhance your course content.
        </p>
      </div>
      
      <PapersSearch />
    </div>
  );
}