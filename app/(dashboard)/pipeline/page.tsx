"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import { PipelineBoard } from "@/components/pipeline-board"
import { useState } from "react"

export default function PipelinePage() {
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
        <Button className="flex items-center gap-2" onClick={() => setShowAddLeadDialog(true)}>
          <PlusCircle className="h-4 w-4" />
          Add New Lead
        </Button>
      </div>

      <Tabs defaultValue="board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="space-y-4">
          <PipelineBoard showAddLeadDialog={showAddLeadDialog} setShowAddLeadDialog={setShowAddLeadDialog} />
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <PipelineBoard
            viewMode="list"
            showAddLeadDialog={showAddLeadDialog}
            setShowAddLeadDialog={setShowAddLeadDialog}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
