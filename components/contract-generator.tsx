"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Send, Calendar, DollarSign, Clock, User } from "lucide-react"

export function ContractGenerator() {
  const [contractDetails, setContractDetails] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventType: "Wedding",
    eventDate: "",
    eventTime: "",
    venue: "Grand Ballroom",
    attendees: "",
    totalAmount: "",
    depositAmount: "",
    depositDueDate: "",
    finalPaymentDate: "",
    specialRequirements: "",
    additionalServices: [],
  })

  const [activeTab, setActiveTab] = useState("details")
  const [previewMode, setPreviewMode] = useState(false)

  // Calculate deposit amount (25% of total)
  const calculateDeposit = (total: string) => {
    const totalNum = Number.parseFloat(total.replace(/[^0-9.]/g, ""))
    if (isNaN(totalNum)) return ""
    return (totalNum * 0.25).toFixed(2)
  }

  // Calculate final payment date (14 days before event)
  const calculateFinalPaymentDate = (eventDate: string) => {
    if (!eventDate) return ""
    const date = new Date(eventDate)
    date.setDate(date.getDate() - 14)
    return date.toISOString().split("T")[0]
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setContractDetails((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-calculate deposit if total amount changes
      if (field === "totalAmount") {
        updated.depositAmount = calculateDeposit(value)
      }

      // Auto-calculate final payment date if event date changes
      if (field === "eventDate") {
        updated.finalPaymentDate = calculateFinalPaymentDate(value)

        // Set deposit due date to current date
        const today = new Date()
        updated.depositDueDate = today.toISOString().split("T")[0]
      }

      return updated
    })
  }

  // Handle additional services
  const handleServiceToggle = (service: string) => {
    setContractDetails((prev) => {
      const services = [...prev.additionalServices]
      const index = services.indexOf(service)

      if (index === -1) {
        services.push(service)
      } else {
        services.splice(index, 1)
      }

      return { ...prev, additionalServices: services }
    })
  }

  // Generate contract
  const generateContract = () => {
    setPreviewMode(true)
    setActiveTab("preview")
  }

  // Send contract
  const sendContract = () => {
    alert("Contract sent to client for signature!")
    // In a real app, this would send the contract to the client via email
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contract Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Client & Event Details</TabsTrigger>
            <TabsTrigger value="payment">Payment Terms</TabsTrigger>
            <TabsTrigger value="preview">Preview Contract</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        value={contractDetails.clientName}
                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email Address</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={contractDetails.clientEmail}
                        onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Phone Number</Label>
                      <Input
                        id="clientPhone"
                        value={contractDetails.clientPhone}
                        onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Event Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select
                        value={contractDetails.eventType}
                        onValueChange={(value) => handleInputChange("eventType", value)}
                      >
                        <SelectTrigger id="eventType">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wedding">Wedding</SelectItem>
                          <SelectItem value="Corporate">Corporate Event</SelectItem>
                          <SelectItem value="Golf">Golf Tournament</SelectItem>
                          <SelectItem value="Social">Social Gathering</SelectItem>
                          <SelectItem value="Birthday">Birthday Party</SelectItem>
                          <SelectItem value="Anniversary">Anniversary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={contractDetails.eventDate}
                        onChange={(e) => handleInputChange("eventDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventTime">Event Time</Label>
                      <Input
                        id="eventTime"
                        placeholder="e.g. 4:00 PM - 10:00 PM"
                        value={contractDetails.eventTime}
                        onChange={(e) => handleInputChange("eventTime", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">Venue & Attendance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="venue">Venue</Label>
                      <Select
                        value={contractDetails.venue}
                        onValueChange={(value) => handleInputChange("venue", value)}
                      >
                        <SelectTrigger id="venue">
                          <SelectValue placeholder="Select venue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Grand Ballroom">Grand Ballroom</SelectItem>
                          <SelectItem value="Terrace Room">Terrace Room</SelectItem>
                          <SelectItem value="Garden Pavilion">Garden Pavilion</SelectItem>
                          <SelectItem value="Conference Center">Conference Center</SelectItem>
                          <SelectItem value="Golf Course">Golf Course</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="attendees">Number of Attendees</Label>
                      <Input
                        id="attendees"
                        type="number"
                        value={contractDetails.attendees}
                        onChange={(e) => handleInputChange("attendees", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Enter any special requirements or requests..."
                    value={contractDetails.specialRequirements}
                    onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Additional Services</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Open Bar",
                      "DJ Services",
                      "Floral Arrangements",
                      "Photography",
                      "Valet Parking",
                      "Custom Menu",
                    ].map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={service.replace(/\s+/g, "-").toLowerCase()}
                          checked={contractDetails.additionalServices.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          className="h-4 w-4"
                        />
                        <label htmlFor={service.replace(/\s+/g, "-").toLowerCase()} className="text-sm">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("payment")}>Continue to Payment Terms</Button>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="totalAmount">Total Amount ($)</Label>
                      <Input
                        id="totalAmount"
                        value={contractDetails.totalAmount}
                        onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="depositAmount">Deposit Amount ($)</Label>
                      <Input
                        id="depositAmount"
                        value={contractDetails.depositAmount}
                        onChange={(e) => handleInputChange("depositAmount", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Typically 25% of the total amount</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Payment Schedule
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="depositDueDate">Deposit Due Date</Label>
                      <Input
                        id="depositDueDate"
                        type="date"
                        value={contractDetails.depositDueDate}
                        onChange={(e) => handleInputChange("depositDueDate", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Due upon contract signing</p>
                    </div>
                    <div>
                      <Label htmlFor="finalPaymentDate">Final Payment Due Date</Label>
                      <Input
                        id="finalPaymentDate"
                        type="date"
                        value={contractDetails.finalPaymentDate}
                        onChange={(e) => handleInputChange("finalPaymentDate", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Due 14 days prior to event date</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back to Details
              </Button>
              <Button onClick={generateContract}>Generate Contract</Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {previewMode && (
              <div className="border rounded-md p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">EVENT CONTRACT</h2>
                  <p className="text-muted-foreground">ClubEventPro</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Client Information:</h3>
                      <p>{contractDetails.clientName}</p>
                      <p>{contractDetails.clientEmail}</p>
                      <p>{contractDetails.clientPhone}</p>
                    </div>

                    <div>
                      <h3 className="font-medium">Event Details:</h3>
                      <p>
                        <strong>Type:</strong> {contractDetails.eventType}
                      </p>
                      <p>
                        <strong>Date:</strong> {contractDetails.eventDate}
                      </p>
                      <p>
                        <strong>Time:</strong> {contractDetails.eventTime}
                      </p>
                      <p>
                        <strong>Venue:</strong> {contractDetails.venue}
                      </p>
                      <p>
                        <strong>Attendees:</strong> {contractDetails.attendees}
                      </p>
                    </div>
                  </div>

                  {contractDetails.additionalServices.length > 0 && (
                    <div>
                      <h3 className="font-medium">Additional Services:</h3>
                      <ul className="list-disc pl-5">
                        {contractDetails.additionalServices.map((service) => (
                          <li key={service}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {contractDetails.specialRequirements && (
                    <div>
                      <h3 className="font-medium">Special Requirements:</h3>
                      <p>{contractDetails.specialRequirements}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium">Payment Terms:</h3>
                    <p>
                      <strong>Total Amount:</strong> ${Number.parseFloat(contractDetails.totalAmount).toLocaleString()}
                    </p>
                    <p>
                      <strong>Deposit Amount:</strong> $
                      {Number.parseFloat(contractDetails.depositAmount).toLocaleString()} (due by{" "}
                      {new Date(contractDetails.depositDueDate).toLocaleDateString()})
                    </p>
                    <p>
                      <strong>Final Payment:</strong> $
                      {(
                        Number.parseFloat(contractDetails.totalAmount) -
                        Number.parseFloat(contractDetails.depositAmount)
                      ).toLocaleString()}{" "}
                      (due by {new Date(contractDetails.finalPaymentDate).toLocaleDateString()})
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Terms and Conditions:</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                      <li>Deposit is non-refundable and required to secure the date.</li>
                      <li>Final payment is due 14 days prior to the event date.</li>
                      <li>Cancellations must be made in writing at least 30 days prior to the event.</li>
                      <li>Client is responsible for any damages to the venue during the event.</li>
                      <li>ClubEventPro reserves the right to substitute equivalent services if necessary.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="font-medium">Client Signature:</p>
                      <div className="h-12 border-b border-dashed mt-6"></div>
                      <p className="text-sm text-muted-foreground">Date: _____________</p>
                    </div>

                    <div>
                      <p className="font-medium">ClubEventPro Representative:</p>
                      <div className="h-12 border-b mt-6"></div>
                      <p className="text-sm text-muted-foreground">Date: _____________</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("payment")}>
                Back to Payment Terms
              </Button>
              <div className="space-x-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="flex items-center gap-1" onClick={sendContract}>
                  <Send className="h-4 w-4" />
                  Send to Client
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
