"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddLead: (lead: any) => void
}

export function AddLeadDialog({ open, onOpenChange, onAddLead }: AddLeadDialogProps) {
  const [newLead, setNewLead] = useState({
    name: "",
    type: "Wedding",
    budget: "",
    stage: "inquiries",
    priority: false,
    contact: {
      name: "",
      email: "",
      phone: "",
    },
    notes: "",
    requirements: "",
    proposedPackage: "",
  })

  const handleSubmit = () => {
    // Validate required fields
    if (!newLead.name || !newLead.contact.name) {
      alert("Please fill in all required fields")
      return
    }

    // Format budget with $ if not already included
    let formattedBudget = newLead.budget
    if (formattedBudget && !formattedBudget.includes("$")) {
      formattedBudget = `$${formattedBudget}`
    }

    // Create the new lead with formatted data
    const leadToAdd = {
      ...newLead,
      id: Date.now(), // Generate a unique ID
      budget: formattedBudget,
      progress: 0,
    }

    onAddLead(leadToAdd)
    onOpenChange(false)

    // Reset form
    setNewLead({
      name: "",
      type: "Wedding",
      budget: "",
      stage: "inquiries",
      priority: false,
      contact: {
        name: "",
        email: "",
        phone: "",
      },
      notes: "",
      requirements: "",
      proposedPackage: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>Enter the details for the new lead</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name" className="text-right">
                Event Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="e.g. Johnson Wedding"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Event Type</Label>
              <Select value={newLead.type} onValueChange={(value) => setNewLead({ ...newLead, type: value })}>
                <SelectTrigger id="type" className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wedding">Wedding</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Golf">Golf</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Birthday">Birthday</SelectItem>
                  <SelectItem value="Anniversary">Anniversary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={newLead.budget}
                onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                placeholder="e.g. 25000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="stage">Initial Stage</Label>
              <Select value={newLead.stage} onValueChange={(value) => setNewLead({ ...newLead, stage: value })}>
                <SelectTrigger id="stage" className="mt-1">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inquiries">Inquiries</SelectItem>
                  <SelectItem value="discovery">Discovery</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <div className="flex items-center space-x-2 mt-3">
                <input
                  type="checkbox"
                  id="priority"
                  checked={newLead.priority}
                  onChange={(e) => setNewLead({ ...newLead, priority: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="priority" className="text-sm">
                  Mark as priority
                </label>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <h3 className="font-medium mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactName">
                  Contact Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactName"
                  value={newLead.contact.name}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      contact: { ...newLead.contact, name: e.target.value },
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={newLead.contact.email}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      contact: { ...newLead.contact, email: e.target.value },
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={newLead.contact.phone}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      contact: { ...newLead.contact, phone: e.target.value },
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="mt-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newLead.notes}
              onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
              placeholder="Enter any notes about this lead..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={newLead.requirements}
              onChange={(e) => setNewLead({ ...newLead, requirements: e.target.value })}
              placeholder="Enter any specific requirements..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="proposedPackage">Proposed Package</Label>
            <Textarea
              id="proposedPackage"
              value={newLead.proposedPackage}
              onChange={(e) => setNewLead({ ...newLead, proposedPackage: e.target.value })}
              placeholder="Enter details about the proposed package..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
