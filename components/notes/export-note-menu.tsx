"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { FileDown } from "lucide-react";
import { exportContent } from "@/lib/export-utils";

interface ExportNoteMenuProps {
  content: any;
  title: string;
  disabled?: boolean;
}

export function ExportNoteMenu({ content, title, disabled }: ExportNoteMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format: 'pdf' | 'docx' | 'csv' | 'markdown') => {
    try {
      setIsExporting(true);
      await exportContent(content, format, title || 'notes');
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      toast.error(`Failed to export as ${format}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={disabled || isExporting}
        >
          <FileDown className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Notes</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          As PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('docx')}>
          As DOCX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('markdown')}>
          As Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          As CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}