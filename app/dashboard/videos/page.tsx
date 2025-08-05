import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Video, Play } from "lucide-react";

export default function VideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Videos</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your video content.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/videos/upload">
            <Plus className="h-4 w-4 mr-2" />
            Upload Video
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for videos */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Sample Video</CardTitle>
            </div>
            <CardDescription>
              Duration: 15:30 • Uploaded: Jan 15, 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This is a sample video to demonstrate the layout.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty state */}
        <Card className="border-dashed border-2 hover:border-solid transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Upload videos to enhance your learning experience.
            </p>
            <Button asChild>
              <Link href="/dashboard/videos/upload">
                <Plus className="h-4 w-4 mr-2" />
                Upload Your First Video
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 