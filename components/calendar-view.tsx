"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  DollarSign,
  CalendarIcon,
  Save,
  Send,
  Image,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Sample events data
const initialEvents = [
  {
    id: 1,
    title: "Johnson Wedding",
    date: new Date(2025, 3, 10), // April 10, 2025
    type: "wedding",
    status: "deposit",
    time: "4:00 PM - 10:00 PM",
    startTime: "16:00",
    endTime: "22:00",
    location: "Grand Ballroom",
    contact: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "(555) 123-4567",
    },
    budget: "$25,000",
    attendees: 150,
    notes: "Bride requested white floral arrangements and a champagne tower.",
    requirements: "Outdoor ceremony space, indoor reception with dance floor, full catering.",
    proposedPackage: "Premium Wedding Package with outdoor ceremony setup, 5-hour reception, and premium bar service.",
  },
  {
    id: 2,
    title: "Corporate Retreat: Acme Inc",
    date: new Date(2025, 3, 15), // April 15, 2025
    type: "corporate",
    status: "paid",
    time: "9:00 AM - 5:00 PM",
    startTime: "09:00",
    endTime: "17:00",
    location: "Conference Center",
    contact: {
      name: "John Smith",
      email: "john@acme.com",
      phone: "(555) 987-6543",
    },
    budget: "$15,000",
    attendees: 50,
    notes: "Need 5 breakout rooms and AV equipment for presentations.",
    requirements: "2 meeting rooms, outdoor team building space, lunch and dinner catering.",
    proposedPackage: "Corporate Retreat Package with AV equipment, catered meals, and access to golf course.",
  },
  {
    id: 3,
    title: "Annual Golf Tournament",
    date: new Date(2025, 3, 18), // April 18, 2025
    type: "golf",
    status: "scheduled",
    time: "8:00 AM - 4:00 PM",
    startTime: "08:00",
    endTime: "16:00",
    location: "Golf Course",
    contact: {
      name: "David Wilson",
      email: "david@example.com",
      phone: "(555) 234-5678",
    },
    budget: "$30,000",
    attendees: 72,
    notes: "Corporate golf tournament for 72 players. Needs catering and awards ceremony.",
    requirements: "Full course rental, catering for lunch and dinner, awards ceremony space.",
    proposedPackage: "Tournament Package with exclusive course access, catered meals, and private awards ceremony.",
  },
  {
    id: 4,
    title: "Smith Anniversary",
    date: new Date(2025, 3, 22), // April 22, 2025
    type: "wedding",
    status: "tentative",
    time: "6:00 PM - 11:00 PM",
    startTime: "18:00",
    endTime: "23:00",
    location: "Terrace Room",
    contact: {
      name: "Robert Smith",
      email: "robert@example.com",
      phone: "(555) 345-6789",
    },
    budget: "$10,000",
    attendees: 50,
    notes: "25th anniversary celebration. Requested a special cake and champagne toast.",
    requirements: "Private dining room with dance floor, champagne toast, custom menu.",
    proposedPackage: "Anniversary Package with private dining room, custom 4-course menu, and champagne toast.",
  },
  {
    id: 5,
    title: "Executive Board Meeting",
    date: new Date(2025, 3, 25), // April 25, 2025
    type: "corporate",
    status: "deposit",
    time: "10:00 AM - 2:00 PM",
    startTime: "10:00",
    endTime: "14:00",
    location: "Boardroom",
    contact: {
      name: "Jennifer Lee",
      email: "jennifer@techcorp.com",
      phone: "(555) 567-8901",
    },
    budget: "$5,000",
    attendees: 12,
    notes: "Catered lunch required. Confidential meeting, privacy needed.",
    requirements: "Private boardroom, AV equipment, catered lunch.",
    proposedPackage: "Executive Meeting Package with private boardroom, AV setup, and premium catering.",
  },
  {
    id: 6,
    title: "Morning Yoga Session",
    date: new Date(2025, 3, 18), // April 18, 2025
    type: "corporate",
    status: "paid",
    time: "6:00 AM - 7:30 AM",
    startTime: "06:00",
    endTime: "07:30",
    location: "Fitness Center",
    contact: {
      name: "Amy Chen",
      email: "amy@example.com",
      phone: "(555) 678-9012",
    },
    budget: "$1,500",
    attendees: 15,
    notes: "Complimentary yoga session for corporate retreat attendees.",
    requirements: "Yoga studio, mats, water station.",
    proposedPackage: "Wellness Add-on Package with instructor, mats, and refreshments.",
  },
  {
    id: 7,
    title: "Lunch Meeting with Vendors",
    date: new Date(2025, 3, 18), // April 18, 2025
    type: "corporate",
    status: "deposit",
    time: "12:00 PM - 2:00 PM",
    startTime: "12:00",
    endTime: "14:00",
    location: "Private Dining Room",
    contact: {
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "(555) 789-0123",
    },
    budget: "$2,000",
    attendees: 8,
    notes: "Discussing catering options for upcoming events.",
    requirements: "Private dining room, presentation equipment.",
    proposedPackage: "Business Lunch Package with private dining and AV setup.",
  },
]

const eventTypeColors = {
  wedding: "bg-event-wedding text-red-800",
  corporate: "bg-event-corporate text-white",
  golf: "bg-event-golf text-white",
}

const statusColors = {
  paid: "bg-status-paid text-white",
  deposit: "bg-status-deposit text-white",
  tentative: "bg-transparent border border-status-tentative text-status-tentative",
  scheduled: "bg-blue-500 text-white",
}

// Helper function to convert time string to minutes since midnight
const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

// Helper function to format time for display
const formatTimeDisplay = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Contract templates
const contractTemplates = [
  { id: "wedding", name: "Wedding Event Contract" },
  { id: "golf", name: "Golf Tournament Contract" },
  { id: "corporate", name: "Corporate Outing Contract" },
  { id: "social", name: "Social Event Contract" },
  { id: "custom", name: "Custom Event Contract" },
]

export function CalendarView() {
  const [events, setEvents] = useState(initialEvents)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedEvent, setEditedEvent] = useState<any | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showNewEventDialog, setShowNewEventDialog] = useState(false)
  const [showContractDialog, setShowContractDialog] = useState(false)
  const [selectedContractTemplate, setSelectedContractTemplate] = useState("wedding")
  const [contractDetails, setContractDetails] = useState({
    // Common fields
    clientName: "",
    eventTitle: "",
    eventDate: "",
    eventType: "",
    eventLocation: "",
    attendees: 0,
    totalAmount: "",
    depositAmount: "",
    depositDueDate: "",
    finalPaymentDate: "",
    specialRequirements: "",

    // Wedding specific
    coupleNames: "",
    ceremonyTime: "",
    receptionTime: "",
    venueCapacity: "",
    rainPlan: "",
    venueFee: "",
    fbMinimum: "",
    damageDeposit: "",
    cakeFee: "",

    // Golf specific
    organizationName: "",
    tournamentDate: "",
    startTime: "",
    endTime: "",
    playerCount: "",
    tournamentFormat: "Scramble",
    cartFee: "",
    greenFees: "",
    sponsorLevels: "",
    lastCallTime: "",
    rainDate: "",
    logoDeadline: "",

    // Corporate specific
    companyName: "",
    taxId: "",
    eventPurpose: "",
    avEquipment: "",
    roomAssignments: "",
    roomFee: "",
    overtimeRate: "",
    taxExempt: false,

    // Social specific
    hostName: "",
    eventType: "Birthday",
    theme: "",
    approvedDecorations: "",
    vendorList: "",
    cleaningFee: "",
    corkageFee: "",

    // Custom specific
    specialRequests: "",
    customClauses: "",
    insuranceDetails: "",

    // Branding
    clubLogo: "/placeholder.svg?height=100&width=200&text=Club+Logo",
    clubPrimaryColor: "#002366",
  })

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    type: "wedding",
    status: "tentative",
    time: "",
    startTime: "09:00",
    endTime: "17:00",
    location: "",
    contact: {
      name: "",
      email: "",
      phone: "",
    },
    budget: "",
    attendees: 0,
    notes: "",
    requirements: "",
    proposedPackage: "",
  })
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)

  const eventDetailsRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Update current month when date changes
  useEffect(() => {
    if (date) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }
  }, [date])

  // Navigate to previous period
  const prevPeriod = () => {
    // Week view - go back 7 days
    const newDate = new Date(date!.getTime() - 7 * 24 * 60 * 60 * 1000)
    setDate(newDate)
  }

  // Navigate to next period
  const nextPeriod = () => {
    // Week view - go forward 7 days
    const newDate = new Date(date!.getTime() + 7 * 24 * 60 * 60 * 1000)
    setDate(newDate)
  }

  // Function to handle contract details change
  const handleContractDetailsChange = (field: string, value: string | number | boolean) => {
    setContractDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Function to handle day hover
  const handleDayHover = (day: Date | undefined) => {
    if (!day) {
      setHoveredDay(null)
      return
    }
    setHoveredDay(day)
  }

  // Function to handle day click
  const handleDayClick = (day: Date | undefined) => {
    if (!day) return
    setDate(day)

    // Get events for the clicked day
    const dayEvents = events.filter((event) => event.date.toDateString() === day.toDateString())

    // If there are no events for this day, clear the selected event
    if (dayEvents.length === 0) {
      setSelectedEvent(null)
      setShowEventDetails(false)
    }
    // If there's only one event, select it
    else if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0])
      setShowEventDetails(true)
    }
    // Otherwise, don't select a specific event but ensure the day's events are shown
    else {
      setSelectedEvent(null)
      setShowEventDetails(true)
    }
  }

  // Function to handle event click
  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setEditedEvent(null)
    setIsEditing(false)
    setShowEventDetails(true)

    // Scroll to event details after a short delay to ensure state is updated
    setTimeout(() => {
      eventDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  // Function to start editing event
  const handleEditEvent = () => {
    setEditedEvent({ ...selectedEvent })
    setIsEditing(true)
  }

  // Function to save edited event
  const handleSaveEvent = () => {
    if (!editedEvent) return

    // Update the time field based on startTime and endTime
    const updatedEvent = {
      ...editedEvent,
      time: `${formatTimeDisplay(editedEvent.startTime)} - ${formatTimeDisplay(editedEvent.endTime)}`,
    }

    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))

    setSelectedEvent(updatedEvent)
    setIsEditing(false)
    setEditedEvent(null)
  }

  // Function to handle new event creation
  const handleCreateEvent = () => {
    const newId = Math.max(...events.map((e) => e.id)) + 1

    // Create the time field based on startTime and endTime
    const timeString = `${formatTimeDisplay(newEvent.startTime)} - ${formatTimeDisplay(newEvent.endTime)}`

    const createdEvent = {
      ...newEvent,
      id: newId,
      date: date || new Date(),
      time: timeString,
    }

    setEvents([...events, createdEvent])
    setShowNewEventDialog(false)
    setNewEvent({
      title: "",
      date: new Date(),
      type: "wedding",
      status: "tentative",
      time: "",
      startTime: "09:00",
      endTime: "17:00",
      location: "",
      contact: {
        name: "",
        email: "",
        phone: "",
      },
      budget: "",
      attendees: 0,
      notes: "",
      requirements: "",
      proposedPackage: "",
    })
  }

  // Function to handle contract generation
  const handleGenerateContract = () => {
    if (!selectedEvent) return

    // Calculate dates
    const eventDate = selectedEvent.date
    const today = new Date()
    const depositDueDate = new Date(today)
    depositDueDate.setDate(today.getDate() + 7) // Deposit due in 7 days

    const finalPaymentDate = new Date(eventDate)
    finalPaymentDate.setDate(eventDate.getDate() - 14) // Final payment due 14 days before event

    // Calculate deposit (25% of total)
    const totalAmount = Number.parseInt(selectedEvent.budget.replace(/\D/g, ""))
    const depositAmount = Math.round(totalAmount * 0.25)

    // Set contract template based on event type
    let templateType = "custom"
    if (selectedEvent.type === "wedding") templateType = "wedding"
    else if (selectedEvent.type === "golf") templateType = "golf"
    else if (selectedEvent.type === "corporate") templateType = "corporate"
    else if (selectedEvent.type === "social") templateType = "social"

    setSelectedContractTemplate(templateType)

    // Auto-populate contract details
    setContractDetails({
      // Common fields
      clientName: selectedEvent.contact.name,
      eventTitle: selectedEvent.title,
      eventDate: selectedEvent.date.toISOString().split("T")[0],
      eventType: selectedEvent.type,
      eventLocation: selectedEvent.location,
      attendees: selectedEvent.attendees,
      totalAmount: totalAmount.toString(),
      depositAmount: depositAmount.toString(),
      depositDueDate: depositDueDate.toISOString().split("T")[0],
      finalPaymentDate: finalPaymentDate.toISOString().split("T")[0],
      specialRequirements: selectedEvent.requirements || "",

      // Wedding specific
      coupleNames: selectedEvent.contact.name,
      ceremonyTime: selectedEvent.startTime,
      receptionTime: selectedEvent.endTime,
      venueCapacity: (selectedEvent.attendees + 50).toString(),
      rainPlan: "Indoor backup location available",
      venueFee: Math.round(totalAmount * 0.4).toString(),
      fbMinimum: Math.round(totalAmount * 0.5).toString(),
      damageDeposit: "1000",
      cakeFee: "250",

      // Golf specific
      organizationName: selectedEvent.contact.name,
      tournamentDate: selectedEvent.date.toISOString().split("T")[0],
      startTime: selectedEvent.startTime,
      endTime: selectedEvent.endTime,
      playerCount: selectedEvent.attendees.toString(),
      tournamentFormat: "Scramble",
      cartFee: "75",
      greenFees: Math.round(totalAmount * 0.6).toString(),
      sponsorLevels: "Gold, Silver, Bronze",
      lastCallTime: "9:00 PM",
      rainDate: new Date(selectedEvent.date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      logoDeadline: new Date(selectedEvent.date.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],

      // Corporate specific
      companyName: selectedEvent.contact.name,
      taxId: "XX-XXXXXXX",
      eventPurpose: "Business Meeting",
      avEquipment: "Projector, Screen, Microphone",
      roomAssignments: "Main Conference Room",
      roomFee: "500",
      overtimeRate: "150",
      taxExempt: false,

      // Social specific
      hostName: selectedEvent.contact.name,
      eventType: "Birthday",
      theme: "Elegant",
      approvedDecorations: "Flowers, Balloons, Table Centerpieces",
      vendorList: "DJ, Photographer",
      cleaningFee: "300",
      corkageFee: "25",

      // Custom specific
      specialRequests: selectedEvent.requirements || "",
      customClauses: "",
      insuranceDetails: "Standard liability coverage required",

      // Branding
      clubLogo: "/placeholder.svg?height=100&width=200&text=Club+Logo",
      clubPrimaryColor: "#002366",
    })

    // Show the contract dialog immediately
    setShowContractDialog(true)
  }

  // Function to send contract
  const handleSendContract = () => {
    // In a real app, this would send the contract to the client
    alert(`Contract for ${contractDetails.eventTitle} has been sent to ${contractDetails.clientName}!`)
    setShowContractDialog(false)
  }

  // Get events for the selected day
  const selectedDayEvents = date
    ? events
        .filter((event) => event.date.toDateString() === date.toDateString())
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
    : []

  // Generate time slots for the day view (6 AM to 11 PM)
  const timeSlots = []
  for (let hour = 6; hour <= 23; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`)
  }

  // Generate week days for week view
  const getWeekDays = () => {
    if (!date) return []

    const currentDate = new Date(date)
    const day = currentDate.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - day)

    // Generate array of 7 days
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push(day)
    }

    return weekDays
  }

  const weekDays = getWeekDays()

  // Get events for the hovered day
  const hoveredDayEvents = hoveredDay
    ? events.filter((event) => event.date.toDateString() === hoveredDay.toDateString())
    : []

  // Toggle event details panel
  const toggleEventDetails = () => {
    setShowEventDetails(!showEventDetails)
  }

  // Render contract template based on selected type
  const renderContractTemplate = () => {
    switch (selectedContractTemplate) {
      case "wedding":
        return (
          <div className="space-y-6">
            <div className="text-center" style={{ color: contractDetails.clubPrimaryColor }}>
              <div className="flex justify-center mb-2">
                <img src={contractDetails.clubLogo || "/placeholder.svg"} alt="Club Logo" className="h-16" />
              </div>
              <h1 className="text-2xl font-bold">WEDDING EVENT CONTRACT</h1>
              <p className="text-lg font-medium">CLUBEVENTPRO & {contractDetails.coupleNames}</p>
              <p>
                Date: {new Date(contractDetails.eventDate).toLocaleDateString()} | Location:{" "}
                {contractDetails.eventLocation}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  1. Event Details
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="ceremonyTime">Ceremony Time</Label>
                    <Input
                      id="ceremonyTime"
                      value={contractDetails.ceremonyTime}
                      onChange={(e) => handleContractDetailsChange("ceremonyTime", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="receptionTime">Reception Time</Label>
                    <Input
                      id="receptionTime"
                      value={contractDetails.receptionTime}
                      onChange={(e) => handleContractDetailsChange("receptionTime", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="attendees">Guest Count</Label>
                    <Input
                      id="attendees"
                      value={contractDetails.attendees}
                      onChange={(e) => handleContractDetailsChange("attendees", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="venueCapacity">Maximum Capacity</Label>
                    <Input
                      id="venueCapacity"
                      value={contractDetails.venueCapacity}
                      onChange={(e) => handleContractDetailsChange("venueCapacity", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="rainPlan">Rain Backup Plan</Label>
                    <Input
                      id="rainPlan"
                      value={contractDetails.rainPlan}
                      onChange={(e) => handleContractDetailsChange("rainPlan", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  2. Financial Terms
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="venueFee">Venue Fee ($)</Label>
                    <Input
                      id="venueFee"
                      value={contractDetails.venueFee}
                      onChange={(e) => handleContractDetailsChange("venueFee", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">(50% non-refundable deposit due upon signing)</p>
                  </div>
                  <div>
                    <Label htmlFor="fbMinimum">Food & Beverage Minimum ($)</Label>
                    <Input
                      id="fbMinimum"
                      value={contractDetails.fbMinimum}
                      onChange={(e) => handleContractDetailsChange("fbMinimum", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="finalPaymentDate">Final Payment Due</Label>
                    <Input
                      id="finalPaymentDate"
                      type="date"
                      value={contractDetails.finalPaymentDate}
                      onChange={(e) => handleContractDetailsChange("finalPaymentDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  3. Key Clauses
                </h2>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Cancellation: If canceled within 90 days of event, 100% of deposit is forfeited.</li>
                  <li>
                    Damages: Client responsible for damage exceeding $
                    <Input
                      value={contractDetails.damageDeposit}
                      onChange={(e) => handleContractDetailsChange("damageDeposit", e.target.value)}
                      className="w-20 h-6 px-1 py-0 inline-block"
                    />
                    .
                  </li>
                  <li>
                    Vendors: Outside caterers subject to $
                    <Input
                      value={contractDetails.cakeFee}
                      onChange={(e) => handleContractDetailsChange("cakeFee", e.target.value)}
                      className="w-20 h-6 px-1 py-0 inline-block"
                    />{" "}
                    cake-cutting fee.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  Signatures
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="font-medium">{contractDetails.coupleNames}</p>
                    <div className="h-12 border-b border-dashed mt-6"></div>
                    <p className="text-sm text-muted-foreground">Date: _____________</p>
                  </div>
                  <div>
                    <p className="font-medium">ClubEventPro Representative</p>
                    <div className="h-12 border-b mt-6"></div>
                    <p className="text-sm text-muted-foreground">Date: _____________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "golf":
        return (
          <div className="space-y-6">
            <div className="text-center" style={{ color: contractDetails.clubPrimaryColor }}>
              <div className="flex justify-center mb-2">
                <img src={contractDetails.clubLogo || "/placeholder.svg"} alt="Club Logo" className="h-16" />
              </div>
              <h1 className="text-2xl font-bold">GOLF TOURNAMENT CONTRACT</h1>
              <p className="text-lg font-medium">CLUBEVENTPRO & {contractDetails.organizationName}</p>
              <p>
                Date: {new Date(contractDetails.tournamentDate).toLocaleDateString()} | Tee Times:{" "}
                {formatTimeDisplay(contractDetails.startTime)} - {formatTimeDisplay(contractDetails.endTime)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  1. Tournament Details
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="playerCount">Player Count</Label>
                    <Input
                      id="playerCount"
                      value={contractDetails.playerCount}
                      onChange={(e) => handleContractDetailsChange("playerCount", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tournamentFormat">Format</Label>
                    <Select
                      value={contractDetails.tournamentFormat}
                      onValueChange={(value) => handleContractDetailsChange("tournamentFormat", value)}
                    >
                      <SelectTrigger id="tournamentFormat" className="mt-1">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scramble">Scramble</SelectItem>
                        <SelectItem value="Best Ball">Best Ball</SelectItem>
                        <SelectItem value="Stroke Play">Stroke Play</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cartFee">Cart Fee ($)</Label>
                    <Input
                      id="cartFee"
                      value={contractDetails.cartFee}
                      onChange={(e) => handleContractDetailsChange("cartFee", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">per player</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  2. Financial Terms
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="greenFees">Green Fees ($)</Label>
                    <Input
                      id="greenFees"
                      value={contractDetails.greenFees}
                      onChange={(e) => handleContractDetailsChange("greenFees", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsorLevels">Sponsorship Packages</Label>
                    <Input
                      id="sponsorLevels"
                      value={contractDetails.sponsorLevels}
                      onChange={(e) => handleContractDetailsChange("sponsorLevels", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastCallTime">Alcohol Policy: Last call at</Label>
                    <Input
                      id="lastCallTime"
                      value={contractDetails.lastCallTime}
                      onChange={(e) => handleContractDetailsChange("lastCallTime", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  3. Key Clauses
                </h2>
                <div className="space-y-2 mt-2">
                  <div>
                    <Label htmlFor="rainDate">Weather: Rain date</Label>
                    <Input
                      id="rainDate"
                      type="date"
                      value={contractDetails.rainDate}
                      onChange={(e) => handleContractDetailsChange("rainDate", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">or full credit for future event.</p>
                  </div>
                  <p>Conduct: Club reserves right to remove disruptive players without refund.</p>
                  <div>
                    <Label htmlFor="logoDeadline">Sponsorships: Logos due by</Label>
                    <Input
                      id="logoDeadline"
                      type="date"
                      value={contractDetails.logoDeadline}
                      onChange={(e) => handleContractDetailsChange("logoDeadline", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  Signatures
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="font-medium">{contractDetails.organizationName}</p>
                    <div className="h-12 border-b border-dashed mt-6"></div>
                    <p className="text-sm text-muted-foreground">Date: _____________</p>
                  </div>
                  <div>
                    <p className="font-medium">ClubEventPro Golf Director</p>
                    <div className="h-12 border-b mt-6"></div>
                    <p className="text-sm text-muted-foreground">Date: _____________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "corporate":
        return (
          <div className="space-y-6">
            <div className="text-center" style={{ color: contractDetails.clubPrimaryColor }}>
              <div className="flex justify-center mb-2">
                <img src={contractDetails.clubLogo || "/placeholder.svg"} alt="Club Logo" className="h-16" />
              </div>
              <h1 className="text-2xl font-bold">CORPORATE OUTING CONTRACT</h1>
              <p className="text-lg font-medium">
                CLUBEVENTPRO & {contractDetails.companyName} (Tax ID: {contractDetails.taxId})
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  1. Event Specifications
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="eventPurpose">Purpose</Label>
                    <Input
                      id="eventPurpose"
                      value={contractDetails.eventPurpose}
                      onChange={(e) => handleContractDetailsChange("eventPurpose", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avEquipment">AV Needs</Label>
                    <Input
                      id="avEquipment"
                      value={contractDetails.avEquipment}
                      onChange={(e) => handleContractDetailsChange("avEquipment", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="roomAssignments">Breakout Rooms</Label>
                    <Input
                      id="roomAssignments"
                      value={contractDetails.roomAssignments}
                      onChange={(e) => handleContractDetailsChange("roomAssignments", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  2. Financial Terms
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="roomFee">Room Rental ($)</Label>
                    <Input
                      id="roomFee"
                      value={contractDetails.roomFee}
                      onChange={(e) => handleContractDetailsChange("roomFee", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">/hour (4-hour minimum)</p>
                  </div>
                  <div>
                    <Label htmlFor="overtimeRate">Overtime Fee ($)</Label>
                    <Input
                      id="overtimeRate"
                      value={contractDetails.overtimeRate}
                      onChange={(e) => handleContractDetailsChange("overtimeRate", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      /hour after {formatTimeDisplay(contractDetails.endTime)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="taxExempt"
                        checked={contractDetails.taxExempt as boolean}
                        onChange={(e) => handleContractDetailsChange("taxExempt", e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="taxExempt">Tax-Exempt Status</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  3. Key Clauses
                </h2>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Confidentiality: All discussions under NDA.</li>
                  <li>Equipment: Client liable for damages to AV equipment.</li>
                  <li>Catering: 18% service fee added.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  Signatures
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="font-medium">{contractDetails.companyName}</p>
                    <div className="h-12 border-b border-dashed mt-6"></div>
                    <p className="text-sm text-muted-foreground">Title: _____________ Date: _____________</p>
                  </div>
                  <div>
                    <p className="font-medium">ClubEventPro Events Director</p>
                    <div className="h-12 border-b mt-6"></div>
                    <p className="text-sm text-muted-foreground">Date: _____________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "social":
        return (
          <div className="space-y-6">
            <div className="text-center" style={{ color: contractDetails.clubPrimaryColor }}>
              <div className="flex justify-center mb-2">
                <img src={contractDetails.clubLogo || "/placeholder.svg"} alt="Club Logo" className="h-16" />
              </div>
              <h1 className="text-2xl font-bold">SOCIAL EVENT CONTRACT</h1>
              <p className="text-lg font-medium">CLUBEVENTPRO & {contractDetails.hostName}</p>
              <p>Event Type: {contractDetails.eventType} (Birthday/Anniversary/etc.)</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  1. Event Details
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Input
                      id="theme"
                      value={contractDetails.theme}
                      onChange={(e) => handleContractDetailsChange("theme", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="approvedDecorations">Decorations</Label>
                    <Input
                      id="approvedDecorations"
                      value={contractDetails.approvedDecorations}
                      onChange={(e) => handleContractDetailsChange("approvedDecorations", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="vendorList">Outside Vendors</Label>
                    <Input
                      id="vendorList"
                      value={contractDetails.vendorList}
                      onChange={(e) => handleContractDetailsChange("vendorList", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  2. Policies
                </h2>
                <div className="space-y-2 mt-2">
                  <p>Noise: Music ends at 11:00PM per local ordinance.</p>
                  <div>
                    <Label htmlFor="cleaningFee">Damages: $</Label>
                    <Input
                      id="cleaningFee"
                      value={contractDetails.cleaningFee}
                      onChange={(e) => handleContractDetailsChange("cleaningFee", e.target.value)}
                      className="w-20 h-6 px-1 py-0 inline-block"
                    />{" "}
                    for excessive cleanup.
                  </div>
                  <div>
                    <Label htmlFor="corkageFee">Alcohol: BYOB permitted with $</Label>
                    <Input
                      id="corkageFee"
                      value={contractDetails.corkageFee}
                      onChange={(e) => handleContractDetailsChange("corkageFee", e.target.value)}
                      className="w-20 h-6 px-1 py-0 inline-block"
                    />
                    /bottle fee.
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  Signatures
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="font-medium">{contractDetails.hostName}</p>
                    <div className="h-12 border-b border-dashed mt-6"></div>
                    <p className="text-sm text-muted-foreground">Date: _____________</p>
                  </div>
                  <div>
                    <p className="font-medium">ClubEventPro Manager</p>
                    <div className="h-12 border-b mt-6"></div>
                    <p className="text-sm text-muted-foreground">Date: _____________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "custom":
      default:
        return (
          <div className="space-y-6">
            <div className="text-center" style={{ color: contractDetails.clubPrimaryColor }}>
              <div className="flex justify-center mb-2">
                <img src={contractDetails.clubLogo || "/placeholder.svg"} alt="Club Logo" className="h-16" />
              </div>
              <h1 className="text-2xl font-bold">CUSTOM EVENT CONTRACT</h1>
              <p className="text-lg font-medium">CLUBEVENTPRO & {contractDetails.clientName}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  Customizable Sections
                </h2>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={contractDetails.specialRequests}
                      onChange={(e) => handleContractDetailsChange("specialRequests", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customClauses">Unique Terms</Label>
                    <Textarea
                      id="customClauses"
                      value={contractDetails.customClauses}
                      onChange={(e) => handleContractDetailsChange("customClauses", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="insuranceDetails">Insurance Requirements</Label>
                    <Textarea
                      id="insuranceDetails"
                      value={contractDetails.insuranceDetails}
                      onChange={(e) => handleContractDetailsChange("insuranceDetails", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-1" style={{ color: contractDetails.clubPrimaryColor }}>
                  Signatures
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="font-medium">{contractDetails.clientName}</p>
                    <div className="h-12 border-b border-dashed mt-6"></div>
                    <p className="text-sm text-muted-foreground">Date: _____________</p>
                  </div>
                  <div>
                    <p className="font-medium">ClubEventPro Custom Events Team</p>
                    <div className="h-12 border-b mt-6"></div>
                    <p className="text-sm text-muted-foreground">Date: _____________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={prevPeriod}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextPeriod}>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <h3 className="text-xl font-medium">
              {`${weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            </h3>
            <Button variant="outline" onClick={() => setDate(new Date())}>
              Today
            </Button>
            <Button className="flex items-center gap-1 ml-4" onClick={() => setShowNewEventDialog(true)}>
              <Plus className="h-4 w-4" />
              Schedule New Event
            </Button>
          </div>
        </div>

        {/* Week view calendar */}
        <Card className="border shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-8 border-b">
              <div className="p-2 border-r"></div>
              {weekDays.map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString()
                const isSelected = date && day.toDateString() === date.toDateString()

                return (
                  <div
                    key={index}
                    className={cn(
                      "p-2 text-center cursor-pointer hover:bg-muted/50",
                      isToday ? "bg-accent/30" : "",
                      isSelected ? "bg-primary/10" : "",
                    )}
                    onClick={() => setDate(day)}
                  >
                    <div className="text-sm font-medium">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center mx-auto",
                        isToday ? "bg-accent text-accent-foreground font-bold" : "",
                        isSelected ? "bg-primary text-primary-foreground font-bold" : "",
                      )}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="relative" style={{ height: "600px", overflowY: "auto" }}>
              {timeSlots.map((timeSlot, index) => (
                <div key={index} className="grid grid-cols-8 border-b h-12">
                  <div className="p-1 text-xs text-right pr-2 text-muted-foreground border-r">
                    {formatTimeDisplay(timeSlot)}
                  </div>

                  {weekDays.map((day, dayIndex) => {
                    const dayEvents = events.filter(
                      (event) =>
                        event.date.toDateString() === day.toDateString() &&
                        timeToMinutes(event.startTime) <= timeToMinutes(timeSlot) &&
                        timeToMinutes(event.endTime) > timeToMinutes(timeSlot),
                    )

                    return (
                      <div key={dayIndex} className="relative border-r">
                        {dayEvents.map((event) => {
                          // Only render at the start time
                          if (timeToMinutes(event.startTime) === timeToMinutes(timeSlot)) {
                            const durationHours = (timeToMinutes(event.endTime) - timeToMinutes(event.startTime)) / 60
                            const heightInRem = durationHours * 3 // 3rem per hour

                            return (
                              <div
                                key={event.id}
                                className={cn(
                                  "absolute left-0 right-0 mx-1 p-1 rounded-md overflow-hidden cursor-pointer text-xs card-hover",
                                  event.type === "wedding"
                                    ? "bg-event-wedding/70"
                                    : event.type === "corporate"
                                      ? "bg-event-corporate/70 text-white"
                                      : "bg-event-golf/70 text-white",
                                )}
                                style={{
                                  height: `${heightInRem}rem`,
                                  zIndex: 10,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEventClick(event)
                                  setShowEventDetails(true)
                                }}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                <div className="truncate">{event.time}</div>
                                <div className="truncate">{event.location}</div>
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event details below calendar */}
        {selectedEvent && showEventDetails && (
          <div className="mt-4" ref={eventDetailsRef}>
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Event Details</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleEditEvent}>
                      <Edit className="h-4 w-4" />
                      Edit Details
                    </Button>
                    <Button size="sm" className="flex items-center gap-1" onClick={handleGenerateContract}>
                      <FileText className="h-4 w-4" />
                      Generate Contract
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowEventDetails(false)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={cn(
                          "status-pill",
                          eventTypeColors[selectedEvent.type as keyof typeof eventTypeColors],
                        )}
                      >
                        {selectedEvent.type}
                      </Badge>
                      <span className="text-lg font-medium">{selectedEvent.budget}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {selectedEvent.contact.email}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {selectedEvent.contact.phone}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Stage</h3>
                        <p className="font-medium flex items-center gap-2">
                          <Badge
                            className={cn(
                              "status-pill",
                              statusColors[selectedEvent.status as keyof typeof statusColors],
                            )}
                          >
                            {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                          </Badge>
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
                        <p className="font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {selectedEvent.budget}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
                        <p className="font-medium flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          {selectedEvent.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {" • "}
                          {selectedEvent.time}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                        <p className="font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {selectedEvent.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                      <div className="p-3 bg-muted/30 rounded-md mt-1 h-32 overflow-y-auto">
                        <p>{selectedEvent.notes}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Requirements</h3>
                      <div className="p-3 bg-muted/30 rounded-md mt-1 h-32 overflow-y-auto">
                        <p>{selectedEvent.requirements || "No specific requirements listed."}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Proposed Package</h3>
                      <div className="p-3 bg-muted/30 rounded-md mt-1 h-32 overflow-y-auto">
                        <p>{selectedEvent.proposedPackage || "No package proposed yet."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Event Details Dialog */}
      <Dialog
        open={!!selectedEvent && isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false)
            setEditedEvent(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Event</DialogTitle>
            <DialogDescription>Update event details for {editedEvent?.title}</DialogDescription>
          </DialogHeader>

          {editedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={editedEvent.title}
                    onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={editedEvent.startTime}
                    onChange={(e) => setEditedEvent({ ...editedEvent, startTime: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={editedEvent.endTime}
                    onChange={(e) => setEditedEvent({ ...editedEvent, endTime: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editedEvent.location}
                    onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    value={editedEvent.budget}
                    onChange={(e) => setEditedEvent({ ...editedEvent, budget: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={editedEvent.contact.name}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent,
                        contact: { ...editedEvent.contact, name: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    value={editedEvent.contact.email}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent,
                        contact: { ...editedEvent.contact, email: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={editedEvent.contact.phone}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent,
                        contact: { ...editedEvent.contact, phone: e.target.value },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="attendees">Attendees</Label>
                  <Input
                    id="attendees"
                    type="number"
                    value={editedEvent.attendees}
                    onChange={(e) =>
                      setEditedEvent({ ...editedEvent, attendees: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={editedEvent.type}
                    onValueChange={(value) => setEditedEvent({ ...editedEvent, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="golf">Golf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedEvent.status}
                    onValueChange={(value) => setEditedEvent({ ...editedEvent, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tentative">Tentative</SelectItem>
                      <SelectItem value="deposit">Deposit Paid</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="paid">Fully Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editedEvent.notes}
                    onChange={(e) => setEditedEvent({ ...editedEvent, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={editedEvent.requirements}
                    onChange={(e) => setEditedEvent({ ...editedEvent, requirements: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="proposedPackage">Proposed Package</Label>
                  <Textarea
                    id="proposedPackage"
                    value={editedEvent.proposedPackage}
                    onChange={(e) => setEditedEvent({ ...editedEvent, proposedPackage: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedEvent(null)
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex items-center gap-1" onClick={handleSaveEvent}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Event Dialog */}
      <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Add a new event to the calendar</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="new-title">Event Title</Label>
                <Input
                  id="new-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="new-startTime">Start Time</Label>
                <Input
                  id="new-startTime"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="new-endTime">End Time</Label>
                <Input
                  id="new-endTime"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="new-location">Location</Label>
                <Input
                  id="new-location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="new-budget">Budget</Label>
                <Input
                  id="new-budget"
                  value={newEvent.budget}
                  onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })}
                  placeholder="e.g. $5,000"
                />
              </div>

              <div>
                <Label htmlFor="new-contactName">Contact Name</Label>
                <Input
                  id="new-contactName"
                  value={newEvent.contact.name}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      contact: { ...newEvent.contact, name: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="new-contactEmail">Contact Email</Label>
                <Input
                  id="new-contactEmail"
                  value={newEvent.contact.email}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      contact: { ...newEvent.contact, email: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="new-contactPhone">Contact Phone</Label>
                <Input
                  id="new-contactPhone"
                  value={newEvent.contact.phone}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      contact: { ...newEvent.contact, phone: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="new-attendees">Attendees</Label>
                <Input
                  id="new-attendees"
                  type="number"
                  value={newEvent.attendees || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, attendees: Number.parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="new-type">Event Type</Label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="golf">Golf</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-status">Status</Label>
                <Select value={newEvent.status} onValueChange={(value) => setNewEvent({ ...newEvent, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tentative">Tentative</SelectItem>
                    <SelectItem value="deposit">Deposit Paid</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="paid">Fully Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="new-notes">Notes</Label>
                <Textarea
                  id="new-notes"
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="new-requirements">Requirements</Label>
                <Textarea
                  id="new-requirements"
                  value={newEvent.requirements}
                  onChange={(e) => setNewEvent({ ...newEvent, requirements: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="new-proposedPackage">Proposed Package</Label>
                <Textarea
                  id="new-proposedPackage"
                  value={newEvent.proposedPackage}
                  onChange={(e) => setNewEvent({ ...newEvent, proposedPackage: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent}>Create Event</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract Generation Dialog */}
      <Dialog open={showContractDialog} onOpenChange={setShowContractDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Contract</DialogTitle>
            <DialogDescription>Review and edit the contract for {contractDetails.eventTitle}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="contractTemplate">Contract Template</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="clubLogo" className="cursor-pointer flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  Change Logo
                </Label>
                <Input
                  id="clubLogo"
                  value={contractDetails.clubLogo}
                  onChange={(e) => handleContractDetailsChange("clubLogo", e.target.value)}
                  className="hidden"
                />
                <Input
                  type="color"
                  value={contractDetails.clubPrimaryColor}
                  onChange={(e) => handleContractDetailsChange("clubPrimaryColor", e.target.value)}
                  className="w-10 h-8 p-1"
                />
              </div>
            </div>

            <RadioGroup
              value={selectedContractTemplate}
              onValueChange={setSelectedContractTemplate}
              className="flex flex-wrap gap-4 mb-4"
            >
              {contractTemplates.map((template) => (
                <div key={template.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={template.id} id={template.id} />
                  <Label htmlFor={template.id}>{template.name}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="border rounded-md p-6">{renderContractTemplate()}</div>

            <DialogFooter>
              <Button variant="outline">Download PDF</Button>
              <Button className="flex items-center gap-1" onClick={handleSendContract}>
                <Send className="h-4 w-4" />
                Send to Client
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
