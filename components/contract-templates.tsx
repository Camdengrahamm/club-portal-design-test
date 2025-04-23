"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FileText, Eye, Download, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample templates
const templates = [
  {
    id: 1,
    title: "Wedding Package",
    description: "Standard wedding event contract with catering and venue options",
    lastUpdated: "2 weeks ago",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Wedding+Template",
  },
  {
    id: 2,
    title: "Corporate Retreat",
    description: "Corporate event contract with meeting spaces and accommodation",
    lastUpdated: "1 month ago",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Corporate+Template",
  },
  {
    id: 3,
    title: "Golf Tournament",
    description: "Golf tournament contract with course rental and catering",
    lastUpdated: "3 weeks ago",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Golf+Template",
  },
  {
    id: 4,
    title: "Social Event",
    description: "Social gathering contract with venue and bar service options",
    lastUpdated: "1 week ago",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Social+Template",
  },
]

export function ContractTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden card-hover">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={template.thumbnail || "/placeholder.svg"}
              alt={template.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setSelectedTemplate(template)}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{template.title}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Updated {template.lastUpdated}</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Use Template
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{template.title}</DialogTitle>
                  <DialogDescription>Customize this template for your client</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center p-6 border rounded-md">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Template preview will appear here</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </Button>
                    <Button size="sm">Customize</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}

      {/* Template Preview Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.title}</DialogTitle>
            <DialogDescription>Preview of the contract template</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border rounded-md p-6 h-[400px] overflow-auto">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center">{selectedTemplate?.title} Agreement</h2>
                <p className="text-sm">
                  This Agreement is made and entered into as of [DATE], by and between [CLIENT NAME] ("Client") and
                  [CLUB NAME] ("Club").
                </p>

                <h3 className="text-lg font-medium">1. Event Details</h3>
                <p className="text-sm">Event Date: [DATE]</p>

                <h3 className="text-lg font-medium">2. Venue</h3>
                <p className="text-sm">
                  The Club agrees to reserve the [VENUE NAME] for the Client's exclusive use during the Event.
                </p>

                <h3 className="text-lg font-medium">3. Services</h3>
                <p className="text-sm">The Club agrees to provide the following services for the Event: [SERVICES]</p>

                <h3 className="text-lg font-medium">4. Payment Terms</h3>
                <p className="text-sm">
                  Total Event Cost: [AMOUNT]
                  <br />
                  Deposit Due: [AMOUNT] due by [DATE]
                  <br />
                  Final Payment: Remaining balance due [DATE]
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button size="sm">Use Template</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
