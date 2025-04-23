"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  MoreHorizontal,
  Star,
  Edit,
  Save,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Send,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddLeadDialog } from "@/components/add-lead-dialog"
import { cn } from "@/lib/utils"

// Pipeline stages
const stages = [
  { id: "inquiries", name: "Inquiries" },
  { id: "discovery", name: "Discovery" },
  { id: "review", name: "Review" },
  { id: "scheduled", name: "Scheduled" },
  { id: "contract", name: "Contract" },
  { id: "paid", name: "Paid" },
]

// Sample data
const initialLeads = [
  {
    id: 1,
    name: "Johnson Wedding",
    type: "Wedding",
    budget: "$25,000",
    stage: "inquiries",
    progress: 0,
    priority: true,
    contact: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "(555) 123-4567",
    },
    notes: "Interested in a summer wedding for 150 guests. Prefers outdoor ceremony.",
    requirements: "Outdoor ceremony space, indoor reception with dance floor, full catering.",
    proposedPackage: "Premium Wedding Package with outdoor ceremony setup, 5-hour reception, and premium bar service.",
  },
  {
    id: 2,
    name: "Acme Inc. Retreat",
    type: "Corporate",
    budget: "$15,000",
    stage: "discovery",
    progress: 0,
    priority: false,
    contact: {
      name: "John Smith",
      email: "john@acme.com",
      phone: "(555) 987-6543",
    },
    notes: "Annual team retreat for 50 employees. Needs meeting spaces and team-building activities.",
    requirements: "2 meeting rooms, outdoor team building space, lunch and dinner catering.",
    proposedPackage: "Corporate Retreat Package with AV equipment, catered meals, and access to golf course.",
  },
  {
    id: 3,
    name: "Thompson Birthday",
    type: "Social",
    budget: "$5,000",
    stage: "review",
    progress: 0,
    priority: false,
    contact: {
      name: "Mike Thompson",
      email: "mike@example.com",
      phone: "(555) 456-7890",
    },
    notes: "50th birthday celebration. Looking for a private dining room for 30 guests.",
    requirements: "Private dining room, custom cake, wine service.",
    proposedPackage: "Social Event Package with private dining room, custom menu, and 3-hour bar service.",
  },
  {
    id: 4,
    name: "Annual Golf Tournament",
    type: "Golf",
    budget: "$30,000",
    stage: "scheduled",
    progress: 50,
    priority: true,
    contact: {
      name: "David Wilson",
      email: "david@example.com",
      phone: "(555) 234-5678",
    },
    notes: "Corporate golf tournament for 72 players. Needs catering and awards ceremony.",
    requirements: "Full course rental, catering for lunch and dinner, awards ceremony space.",
    proposedPackage: "Tournament Package with exclusive course access, catered meals, and private awards ceremony.",
  },
  {
    id: 5,
    name: "Smith Anniversary",
    type: "Social",
    budget: "$10,000",
    stage: "contract",
    progress: 50,
    priority: false,
    contact: {
      name: "Robert Smith",
      email: "robert@example.com",
      phone: "(555) 345-6789",
    },
    notes: "25th wedding anniversary. Needs private dining room for 50 guests with dance floor.",
    requirements: "Private dining room with dance floor, champagne toast, custom menu.",
    proposedPackage: "Anniversary Package with private dining room, custom 4-course menu, and champagne toast.",
  },
  {
    id: 6,
    name: "Tech Corp Conference",
    type: "Corporate",
    budget: "$45,000",
    stage: "paid",
    progress: 100,
    priority: true,
    contact: {
      name: "Jennifer Lee",
      email: "jennifer@techcorp.com",
      phone: "(555) 567-8901",
    },
    notes: "Annual company conference for 200 attendees. Full venue rental with breakout rooms.",
    requirements: "Main conference room, 4 breakout rooms, full AV setup, catering for 2 days.",
    proposedPackage: "Conference Package with exclusive venue access, full AV support, and premium catering.",
  },
]

interface PipelineBoardProps {
  viewMode?: "board" | "list"
  showAddLeadDialog?: boolean
  setShowAddLeadDialog?: (show: boolean) => void
}

export function PipelineBoard({
  viewMode = "board",
  showAddLeadDialog = false,
  setShowAddLeadDialog = () => {},
}: PipelineBoardProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedLead, setEditedLead] = useState<any | null>(null)
  const [showContractDialog, setShowContractDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [contractDetails, setContractDetails] = useState({
    eventDate: "",
    depositAmount: "",
    totalAmount: "",
    specialRequirements: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventTitle: "",
    eventType: "",
    eventLocation: "",
    depositDueDate: "",
    finalPaymentDate: "",
    termsAndConditions: [
      "Deposit is non-refundable and required to secure the date.",
      "Final payment is due 14 days prior to the event date.",
      "Cancellations must be made in writing at least 30 days prior to the event.",
      "Client is responsible for any damages to the venue during the event.",
      "ClubEventPro reserves the right to substitute equivalent services if necessary.",
    ],
  })

  // Function to handle drag and drop
  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    e.dataTransfer.setData("leadId", leadId.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    const leadId = Number.parseInt(e.dataTransfer.getData("leadId"))

    setLeads(
      leads.map((lead) => {
        if (lead.id === leadId) {
          // Update progress based on stage
          let progress = 0
          if (stageId === "scheduled") progress = 50
          if (stageId === "contract") progress = 50
          if (stageId === "paid") progress = 100

          return { ...lead, stage: stageId, progress }
        }
        return lead
      }),
    )
  }

  const togglePriority = (leadId: number) => {
    setLeads(
      leads.map((lead) => {
        if (lead.id === leadId) {
          return { ...lead, priority: !lead.priority }
        }
        return lead
      }),
    )
  }

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead)
    setEditedLead(null)
    setIsEditing(false)
  }

  const handleEditLead = () => {
    if (!selectedLead) return

    // Create a deep copy and ensure contact object exists
    setEditedLead({
      ...selectedLead,
      contact: {
        name: selectedLead.contact?.name || "",
        email: selectedLead.contact?.email || "",
        phone: selectedLead.contact?.phone || "",
      },
    })
    setIsEditing(true)
  }

  const handleSaveLead = () => {
    if (!editedLead) return

    setLeads(leads.map((lead) => (lead.id === editedLead.id ? editedLead : lead)))

    setSelectedLead(editedLead)
    setIsEditing(false)
    setEditedLead(null)
  }

  const handleAddLead = (newLead: any) => {
    setLeads([...leads, newLead])
  }

  const handleGenerateContract = () => {
    if (!selectedLead) return

    // Calculate dates
    const today = new Date()
    const eventDate = new Date(today)
    eventDate.setDate(today.getDate() + 30) // Default event date 30 days from now

    const depositDueDate = new Date(today)
    depositDueDate.setDate(today.getDate() + 7) // Deposit due in 7 days

    const finalPaymentDate = new Date(eventDate)
    finalPaymentDate.setDate(eventDate.getDate() - 14) // Final payment due 14 days before event

    // Calculate deposit (25% of total)
    const totalAmount = Number.parseInt(selectedLead.budget.replace(/\D/g, ""))
    const depositAmount = Math.round(totalAmount * 0.25)

    // Pre-fill contract details
    setContractDetails({
      clientName: selectedLead.contact?.name || "",
      clientEmail: selectedLead.contact?.email || "",
      clientPhone: selectedLead.contact?.phone || "",
      eventTitle: selectedLead.name,
      eventType: selectedLead.type,
      eventLocation: "Main Venue", // Default location
      eventDate: eventDate.toISOString().split("T")[0],
      depositAmount: depositAmount.toString(),
      totalAmount: totalAmount.toString(),
      depositDueDate: depositDueDate.toISOString().split("T")[0],
      finalPaymentDate: finalPaymentDate.toISOString().split("T")[0],
      specialRequirements: selectedLead.requirements || "",
      termsAndConditions: [
        "Deposit is non-refundable and required to secure the date.",
        "Final payment is due 14 days prior to the event date.",
        "Cancellations must be made in writing at least 30 days prior to the event.",
        "Client is responsible for any damages to the venue during the event.",
        "ClubEventPro reserves the right to substitute equivalent services if necessary.",
      ],
    })

    setShowContractDialog(true)
  }

  const handleSendContract = () => {
    // In a real app, this would send the contract to the client
    // For now, we'll just update the lead stage to "contract"
    if (!selectedLead) return

    setLeads(
      leads.map((lead) => {
        if (lead.id === selectedLead.id) {
          return { ...lead, stage: "contract", progress: 50 }
        }
        return lead
      }),
    )

    setShowContractDialog(false)
    setSelectedLead(null)
  }

  // Filter leads based on search query
  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      lead.name.toLowerCase().includes(searchLower) ||
      lead.type.toLowerCase().includes(searchLower) ||
      lead.contact?.name?.toLowerCase().includes(searchLower) ||
      lead.contact?.email?.toLowerCase().includes(searchLower)
    )
  })

  // Sort leads for list view
  const sortedLeads = React.useMemo(() => {
    const sortableLeads = [...filteredLeads]
    if (sortConfig !== null) {
      sortableLeads.sort((a, b) => {
        if (sortConfig.key === "contact.name") {
          if (!a.contact?.name) return sortConfig.direction === "ascending" ? -1 : 1
          if (!b.contact?.name) return sortConfig.direction === "ascending" ? 1 : -1
          return sortConfig.direction === "ascending"
            ? a.contact.name.localeCompare(b.contact.name)
            : b.contact.name.localeCompare(a.contact.name)
        }

        if (sortConfig.key === "budget") {
          const aValue = Number.parseInt(a[sortConfig.key].replace(/\D/g, "")) || 0
          const bValue = Number.parseInt(b[sortConfig.key].replace(/\D/g, "")) || 0
          return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableLeads
  }, [filteredLeads, sortConfig])

  // Request sort function
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sort direction icon
  const getSortDirectionIcon = (columnName: string) => {
    if (!sortConfig || sortConfig.key !== columnName) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  return (
    <div>
      {/* Search and filter bar for both views */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        {viewMode === "list" && (
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        )}
      </div>

      {/* Board View */}
      {viewMode === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{stage.name}</h3>
                <Badge variant="outline" className={`bg-pipeline-${stage.id} text-xs`}>
                  {filteredLeads.filter((lead) => lead.stage === stage.id).length}
                </Badge>
              </div>

              <div
                className="flex flex-col gap-2 min-h-[500px] p-2 rounded-lg bg-muted/30"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {filteredLeads
                  .filter((lead) => lead.stage === stage.id)
                  .map((lead) => (
                    <Card
                      key={lead.id}
                      className="pipeline-card card-hover cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => handleLeadClick(lead)}
                    >
                      <CardContent className="p-3 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <h4 className="font-medium text-sm">{lead.name}</h4>
                              {lead.priority && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {lead.type}
                              </Badge>
                              <span className="text-xs font-medium">{lead.budget}</span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  togglePriority(lead.id)
                                }}
                              >
                                {lead.priority ? "Remove Priority" : "Mark as Priority"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLeadClick(lead)
                                  handleEditLead()
                                }}
                              >
                                Edit Details
                              </DropdownMenuItem>
                              {lead.stage === "scheduled" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleLeadClick(lead)
                                    handleGenerateContract()
                                  }}
                                >
                                  Generate Contract
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Contact</DropdownMenuLabel>
                              <DropdownMenuItem className="flex flex-col items-start">
                                <span>{lead.contact?.name || "No name"}</span>
                                <span className="text-xs text-muted-foreground">
                                  {lead.contact?.email || "No email"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {lead.contact?.phone || "No phone"}
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {lead.progress > 0 && <Progress value={lead.progress} className="h-1" />}

                        <div className="flex items-center justify-between">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`/placeholder.svg?height=24&width=24&text=${lead.contact?.name?.charAt(0) || "?"}`}
                              alt={lead.contact?.name || "Contact"}
                            />
                            <AvatarFallback>{lead.contact?.name?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {lead.stage === "paid" ? "Completed" : "In Progress"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="rounded-md border">
          <div className="grid grid-cols-12 p-4 text-sm font-medium border-b bg-muted/50">
            <div
              className="col-span-3 flex items-center cursor-pointer hover:text-primary"
              onClick={() => requestSort("name")}
            >
              Event Name {getSortDirectionIcon("name")}
            </div>
            <div
              className="col-span-2 flex items-center cursor-pointer hover:text-primary"
              onClick={() => requestSort("type")}
            >
              Type {getSortDirectionIcon("type")}
            </div>
            <div
              className="col-span-2 flex items-center cursor-pointer hover:text-primary"
              onClick={() => requestSort("budget")}
            >
              Budget {getSortDirectionIcon("budget")}
            </div>
            <div
              className="col-span-2 flex items-center cursor-pointer hover:text-primary"
              onClick={() => requestSort("stage")}
            >
              Stage {getSortDirectionIcon("stage")}
            </div>
            <div
              className="col-span-2 flex items-center cursor-pointer hover:text-primary"
              onClick={() => requestSort("contact.name")}
            >
              Contact {getSortDirectionIcon("contact.name")}
            </div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y">
            {sortedLeads.map((lead) => (
              <div
                key={lead.id}
                className="grid grid-cols-12 p-4 text-sm items-center hover:bg-muted/30 cursor-pointer"
                onClick={() => handleLeadClick(lead)}
              >
                <div className="col-span-3 font-medium flex items-center gap-1">
                  {lead.name}
                  {lead.priority && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                </div>
                <div className="col-span-2">
                  <Badge variant="outline" className="text-xs">
                    {lead.type}
                  </Badge>
                </div>
                <div className="col-span-2 font-medium">{lead.budget}</div>
                <div className="col-span-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      lead.stage === "inquiries" ? "bg-pipeline-inquiries" : "",
                      lead.stage === "discovery" ? "bg-pipeline-discovery" : "",
                      lead.stage === "review" ? "bg-pipeline-review" : "",
                      lead.stage === "scheduled" ? "bg-pipeline-scheduled" : "",
                      lead.stage === "contract" ? "bg-pipeline-contract" : "",
                      lead.stage === "paid" ? "bg-pipeline-paid" : "",
                    )}
                  >
                    {stages.find((s) => s.id === lead.stage)?.name || lead.stage}
                  </Badge>
                </div>
                <div className="col-span-2 truncate">{lead.contact?.name || "No contact"}</div>
                <div className="col-span-1 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePriority(lead.id)
                        }}
                      >
                        {lead.priority ? "Remove Priority" : "Mark as Priority"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLeadClick(lead)
                          handleEditLead()
                        }}
                      >
                        Edit Details
                      </DropdownMenuItem>
                      {lead.stage === "scheduled" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLeadClick(lead)
                            handleGenerateContract()
                          }}
                        >
                          Generate Contract
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Details Dialog */}
      <Dialog
        open={!!selectedLead && !showContractDialog}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLead(null)
            setIsEditing(false)
            setEditedLead(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{isEditing ? "Edit Lead" : selectedLead?.name}</DialogTitle>
            <DialogDescription>{!isEditing && `${selectedLead?.type} • ${selectedLead?.budget}`}</DialogDescription>
          </DialogHeader>

          {selectedLead && !isEditing && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-4 w-4" /> Email
                  </h4>
                  <p className="font-medium">{selectedLead.contact?.email || "No email provided"}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="h-4 w-4" /> Phone
                  </h4>
                  <p className="font-medium">{selectedLead.contact?.phone || "No phone provided"}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Stage
                  </h4>
                  <p className="font-medium capitalize">{selectedLead.stage}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-4 w-4" /> Budget
                  </h4>
                  <p className="font-medium">{selectedLead.budget}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p>{selectedLead.notes}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Requirements</h4>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p>{selectedLead.requirements || "No specific requirements listed."}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Proposed Package</h4>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p>{selectedLead.proposedPackage || "No package proposed yet."}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleEditLead}>
                  <Edit className="h-4 w-4" />
                  Edit Details
                </Button>

                {selectedLead.stage === "scheduled" && (
                  <Button className="flex items-center gap-1" onClick={handleGenerateContract}>
                    <FileText className="h-4 w-4" />
                    Generate Contract
                  </Button>
                )}
              </div>
            </div>
          )}

          {isEditing && editedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input
                    id="name"
                    value={editedLead.name}
                    onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Input
                    id="type"
                    value={editedLead.type}
                    onChange={(e) => setEditedLead({ ...editedLead, type: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    value={editedLead.budget}
                    onChange={(e) => setEditedLead({ ...editedLead, budget: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={editedLead?.contact?.name || ""}
                    onChange={(e) =>
                      setEditedLead({
                        ...editedLead,
                        contact: { ...(editedLead?.contact || {}), name: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    value={editedLead?.contact?.email || ""}
                    onChange={(e) =>
                      setEditedLead({
                        ...editedLead,
                        contact: { ...(editedLead?.contact || {}), email: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={editedLead?.contact?.phone || ""}
                    onChange={(e) =>
                      setEditedLead({
                        ...editedLead,
                        contact: { ...(editedLead?.contact || {}), phone: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="priority"
                      checked={editedLead.priority}
                      onChange={(e) => setEditedLead({ ...editedLead, priority: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label htmlFor="priority" className="text-sm">
                      Mark as priority
                    </label>
                  </div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editedLead.notes}
                    onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={editedLead.requirements || ""}
                    onChange={(e) => setEditedLead({ ...editedLead, requirements: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="proposedPackage">Proposed Package</Label>
                  <Textarea
                    id="proposedPackage"
                    value={editedLead.proposedPackage || ""}
                    onChange={(e) => setEditedLead({ ...editedLead, proposedPackage: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedLead(null)
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex items-center gap-1" onClick={handleSaveLead}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contract Generation Dialog */}
      <Dialog open={showContractDialog} onOpenChange={setShowContractDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>Customize the contract for {selectedLead?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto pr-2">
            <div className="border rounded-md p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary">
                  <Input
                    value="EVENT CONTRACT"
                    className="text-center text-2xl font-bold text-primary border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </h2>
                <Input
                  value="ClubEventPro"
                  className="text-center text-muted-foreground border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Client Information:</h3>
                    <div className="space-y-2">
                      <Input
                        value={contractDetails.clientName}
                        onChange={(e) => setContractDetails({ ...contractDetails, clientName: e.target.value })}
                        placeholder="Client Name"
                        className="border-dashed"
                      />
                      <Input
                        value={contractDetails.clientEmail || selectedLead?.contact?.email || ""}
                        onChange={(e) => setContractDetails({ ...contractDetails, clientEmail: e.target.value })}
                        placeholder="Client Email"
                        className="border-dashed"
                      />
                      <Input
                        value={contractDetails.clientPhone || selectedLead?.contact?.phone || ""}
                        onChange={(e) => setContractDetails({ ...contractDetails, clientPhone: e.target.value })}
                        placeholder="Client Phone"
                        className="border-dashed"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Event Details:</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <strong className="whitespace-nowrap">Type:</strong>
                        <Input
                          value={contractDetails.eventType}
                          onChange={(e) => setContractDetails({ ...contractDetails, eventType: e.target.value })}
                          className="border-dashed"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="whitespace-nowrap">Date:</strong>
                        <Input
                          type="date"
                          value={contractDetails.eventDate}
                          onChange={(e) => setContractDetails({ ...contractDetails, eventDate: e.target.value })}
                          className="border-dashed"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="whitespace-nowrap">Venue:</strong>
                        <Input
                          value={contractDetails.eventLocation}
                          onChange={(e) => setContractDetails({ ...contractDetails, eventLocation: e.target.value })}
                          className="border-dashed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Proposed Package:</h3>
                  <Textarea
                    value={selectedLead?.proposedPackage || ""}
                    className="min-h-[80px] border-dashed"
                    onChange={(e) => {
                      if (selectedLead) {
                        const updatedLead = { ...selectedLead, proposedPackage: e.target.value }
                        setSelectedLead(updatedLead)
                        setLeads(leads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)))
                      }
                    }}
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Payment Terms:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <strong className="whitespace-nowrap">Total Amount:</strong>
                      <div className="flex items-center">
                        <span className="mr-1">$</span>
                        <Input
                          value={contractDetails.totalAmount}
                          onChange={(e) => {
                            const newTotal = e.target.value
                            const depositAmount = Math.round(Number.parseInt(newTotal || "0") * 0.25).toString()
                            setContractDetails({
                              ...contractDetails,
                              totalAmount: newTotal,
                              depositAmount: depositAmount,
                            })
                          }}
                          className="border-dashed"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="whitespace-nowrap">Deposit Amount:</strong>
                      <div className="flex items-center">
                        <span className="mr-1">$</span>
                        <Input
                          value={contractDetails.depositAmount}
                          onChange={(e) => setContractDetails({ ...contractDetails, depositAmount: e.target.value })}
                          className="border-dashed"
                        />
                        <span className="ml-2 whitespace-nowrap">(due by</span>
                        <Input
                          type="date"
                          value={contractDetails.depositDueDate}
                          onChange={(e) => setContractDetails({ ...contractDetails, depositDueDate: e.target.value })}
                          className="border-dashed mx-2 w-auto"
                        />
                        <span>)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="whitespace-nowrap">Final Payment:</strong>
                      <div className="flex items-center">
                        <span className="mr-1">$</span>
                        <Input
                          value={(
                            Number.parseInt(contractDetails.totalAmount || "0") -
                            Number.parseInt(contractDetails.depositAmount || "0")
                          ).toString()}
                          readOnly
                          className="border-dashed"
                        />
                        <span className="ml-2 whitespace-nowrap">(due by</span>
                        <Input
                          type="date"
                          value={contractDetails.finalPaymentDate}
                          onChange={(e) => setContractDetails({ ...contractDetails, finalPaymentDate: e.target.value })}
                          className="border-dashed mx-2 w-auto"
                        />
                        <span>)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Special Requirements:</h3>
                  <Textarea
                    value={contractDetails.specialRequirements}
                    onChange={(e) => setContractDetails({ ...contractDetails, specialRequirements: e.target.value })}
                    className="min-h-[80px] border-dashed"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Terms and Conditions:</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <Input
                        defaultValue="Deposit is non-refundable and required to secure the date."
                        className="border-dashed"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <Input
                        defaultValue="Final payment is due 14 days prior to the event date."
                        className="border-dashed"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <Input
                        defaultValue="Cancellations must be made in writing at least 30 days prior to the event."
                        className="border-dashed"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <Input
                        defaultValue="Client is responsible for any damages to the venue during the event."
                        className="border-dashed"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <Input
                        defaultValue="ClubEventPro reserves the right to substitute equivalent services if necessary."
                        className="border-dashed"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        // Add a new term field
                        // In a real app, you would track these in state
                        alert("In a production app, this would add a new term field")
                      }}
                    >
                      + Add Term
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="font-medium">Client Signature:</p>
                    <div className="h-12 border-b border-dashed mt-6"></div>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-muted-foreground mr-2">Date:</p>
                      <Input className="w-32 border-dashed" defaultValue="_____________" />
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">ClubEventPro Representative:</p>
                    <div className="h-12 border-b mt-6"></div>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-muted-foreground mr-2">Date:</p>
                      <Input className="w-32 border-dashed" defaultValue="_____________" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline">Download PDF</Button>
              <Button className="flex items-center gap-1" onClick={handleSendContract}>
                <Send className="h-4 w-4" />
                Send to Client
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Lead Dialog */}
      <AddLeadDialog open={showAddLeadDialog} onOpenChange={setShowAddLeadDialog} onAddLead={handleAddLead} />
    </div>
  )
}
