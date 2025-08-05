import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, ExternalLink } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground mt-2">
            Access and organize your learning resources.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/resources/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for resources */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Sample Resource</CardTitle>
            </div>
            <CardDescription>
              PDF Document • 2.3 MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This is a sample resource to demonstrate the layout.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty state */}
        <Card className="border-dashed border-2 hover:border-solid transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add resources to organize your learning materials.
            </p>
            <Button asChild>
              <Link href="/dashboard/resources/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Resource
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 