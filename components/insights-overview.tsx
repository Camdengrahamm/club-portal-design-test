"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Search, Calendar, ArrowUpDown, ChevronDown, ChevronUp, BarChart3, Users } from "lucide-react"

// Sample data for revenue by month
const revenueData = [
  { month: "Jan", revenue: 35000 },
  { month: "Feb", revenue: 42000 },
  { month: "Mar", revenue: 38000 },
  { month: "Apr", revenue: 48750 },
  { month: "May", revenue: 52000 },
  { month: "Jun", revenue: 61000 },
]

// Sample data for event types
const eventTypeData = [
  { name: "Weddings", value: 45, color: "#FEE2E2" },
  { name: "Corporate", value: 30, color: "#002366" },
  { name: "Golf", value: 15, color: "#10B981" },
  { name: "Social", value: 10, color: "#A78BFA" },
]

// Sample data for top clients
const topClients = [
  {
    name: "Acme Corporation",
    events: 12,
    revenue: 145000,
    lastEvent: "Mar 15, 2025",
    nextEvent: "Apr 20, 2025",
    status: "active",
  },
  {
    name: "Johnson Family",
    events: 5,
    revenue: 75000,
    lastEvent: "Feb 22, 2025",
    nextEvent: "May 10, 2025",
    status: "active",
  },
  {
    name: "Smith Enterprises",
    events: 8,
    revenue: 120000,
    lastEvent: "Mar 05, 2025",
    nextEvent: "Jun 15, 2025",
    status: "active",
  },
  {
    name: "Wilson Group",
    events: 6,
    revenue: 90000,
    lastEvent: "Jan 30, 2025",
    nextEvent: "Apr 12, 2025",
    status: "active",
  },
  {
    name: "Thompson LLC",
    events: 4,
    revenue: 60000,
    lastEvent: "Feb 10, 2025",
    nextEvent: "May 05, 2025",
    status: "active",
  },
]

// Sample data for detailed events
const detailedEvents = [
  {
    id: 1,
    name: "Johnson Wedding",
    date: "Apr 10, 2025",
    type: "Wedding",
    revenue: 25000,
    status: "Confirmed",
    location: "Grand Ballroom",
  },
  {
    id: 2,
    name: "Acme Corporate Retreat",
    date: "Apr 15, 2025",
    type: "Corporate",
    revenue: 35000,
    status: "Confirmed",
    location: "Conference Center",
  },
  {
    id: 3,
    name: "Annual Golf Tournament",
    date: "Apr 18, 2025",
    type: "Golf",
    revenue: 40000,
    status: "Confirmed",
    location: "Golf Course",
  },
  {
    id: 4,
    name: "Smith Anniversary",
    date: "Apr 22, 2025",
    type: "Wedding",
    revenue: 15000,
    status: "Tentative",
    location: "Terrace Room",
  },
  {
    id: 5,
    name: "Executive Board Meeting",
    date: "Apr 25, 2025",
    type: "Corporate",
    revenue: 8000,
    status: "Confirmed",
    location: "Boardroom",
  },
  {
    id: 6,
    name: "Thompson Birthday",
    date: "May 5, 2025",
    type: "Social",
    revenue: 12000,
    status: "Confirmed",
    location: "Private Dining Room",
  },
  {
    id: 7,
    name: "Wilson Charity Gala",
    date: "May 12, 2025",
    type: "Social",
    revenue: 30000,
    status: "Tentative",
    location: "Grand Ballroom",
  },
  {
    id: 8,
    name: "Tech Conference",
    date: "May 18, 2025",
    type: "Corporate",
    revenue: 45000,
    status: "Confirmed",
    location: "Conference Center",
  },
]

// Sample data for monthly revenue breakdown
const monthlyRevenueBreakdown = [
  { category: "Venue Rental", value: 20000 },
  { category: "Food & Beverage", value: 15000 },
  { category: "Equipment Rental", value: 5000 },
  { category: "Staffing", value: 5000 },
  { category: "Decorations", value: 3750 },
]

// Sample data for revenue forecast
const revenueForecast = [
  { month: "Jan", actual: 35000, forecast: 32000 },
  { month: "Feb", actual: 42000, forecast: 40000 },
  { month: "Mar", actual: 38000, forecast: 38000 },
  { month: "Apr", actual: 48750, forecast: 45000 },
  { month: "May", actual: 0, forecast: 52000 },
  { month: "Jun", actual: 0, forecast: 58000 },
  { month: "Jul", actual: 0, forecast: 65000 },
  { month: "Aug", actual: 0, forecast: 70000 },
]

// Sample data for client activity
const clientActivity = [
  { month: "Jan", newClients: 5, returningClients: 8 },
  { month: "Feb", newClients: 7, returningClients: 10 },
  { month: "Mar", newClients: 4, returningClients: 12 },
  { month: "Apr", newClients: 6, returningClients: 15 },
]

// Colors for the pie chart
const COLORS = ["#FEE2E2", "#002366", "#10B981", "#A78BFA", "#F59E0B", "#EC4899"]

export function InsightsOverview() {
  const [showRevenueDetails, setShowRevenueDetails] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [showClientDetails, setShowClientDetails] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [revenueTimeframe, setRevenueTimeframe] = useState("6months")
  const [eventSearchQuery, setEventSearchQuery] = useState("")
  const [eventSortConfig, setEventSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(
    null,
  )
  const [clientSearchQuery, setClientSearchQuery] = useState("")
  const [clientSortConfig, setClientSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(null)

  // Function to handle sorting for events
  const requestEventSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (eventSortConfig && eventSortConfig.key === key && eventSortConfig.direction === "ascending") {
      direction = "descending"
    }
    setEventSortConfig({ key, direction })
  }

  // Function to handle sorting for clients
  const requestClientSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (clientSortConfig && clientSortConfig.key === key && clientSortConfig.direction === "ascending") {
      direction = "descending"
    }
    setClientSortConfig({ key, direction })
  }

  // Get sort direction icon
  const getSortDirectionIcon = (
    columnName: string,
    sortConfig: { key: string; direction: "ascending" | "descending" } | null,
  ) => {
    if (!sortConfig || sortConfig.key !== columnName) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  // Filter events based on search query
  const filteredEvents = detailedEvents.filter((event) => {
    const searchLower = eventSearchQuery.toLowerCase()
    return (
      event.name.toLowerCase().includes(searchLower) ||
      event.type.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower)
    )
  })

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!eventSortConfig) return 0

    if (
      eventSortConfig.key === "name" ||
      eventSortConfig.key === "type" ||
      eventSortConfig.key === "location" ||
      eventSortConfig.key === "status"
    ) {
      return eventSortConfig.direction === "ascending"
        ? a[eventSortConfig.key].localeCompare(b[eventSortConfig.key])
        : b[eventSortConfig.key].localeCompare(a[eventSortConfig.key])
    }

    if (eventSortConfig.key === "revenue") {
      return eventSortConfig.direction === "ascending" ? a.revenue - b.revenue : b.revenue - a.revenue
    }

    if (eventSortConfig.key === "date") {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return eventSortConfig.direction === "ascending"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime()
    }

    return 0
  })

  // Filter clients based on search query
  const filteredClients = topClients.filter((client) => {
    const searchLower = clientSearchQuery.toLowerCase()
    return client.name.toLowerCase().includes(searchLower)
  })

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!clientSortConfig) return 0

    if (clientSortConfig.key === "name") {
      return clientSortConfig.direction === "ascending" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    }

    if (clientSortConfig.key === "events" || clientSortConfig.key === "revenue") {
      return clientSortConfig.direction === "ascending"
        ? a[clientSortConfig.key] - b[clientSortConfig.key]
        : b[clientSortConfig.key] - a[clientSortConfig.key]
    }

    if (clientSortConfig.key === "lastEvent" || clientSortConfig.key === "nextEvent") {
      const dateA = new Date(a[clientSortConfig.key])
      const dateB = new Date(b[clientSortConfig.key])
      return clientSortConfig.direction === "ascending"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime()
    }

    return 0
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4 card-hover cursor-pointer" onClick={() => setShowRevenueDetails(true)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Revenue Trend
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>Monthly revenue for the past 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-3 card-hover cursor-pointer" onClick={() => setShowEventDetails(true)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Event Distribution
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Calendar className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>Breakdown of event types</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={eventTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {eventTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-7 card-hover cursor-pointer" onClick={() => setShowClientDetails(true)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Top Clients
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Users className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>Your highest revenue clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-3 p-4 text-sm font-medium border-b">
              <div>Client</div>
              <div>Events</div>
              <div>Revenue</div>
            </div>

            <div className="divide-y">
              {topClients.map((client, index) => (
                <div key={index} className="grid grid-cols-3 p-4 text-sm items-center">
                  <div className="font-medium">{client.name}</div>
                  <div>{client.events}</div>
                  <div>${client.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Details Dialog */}
      <Dialog open={showRevenueDetails} onOpenChange={setShowRevenueDetails}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Analytics
            </DialogTitle>
            <DialogDescription>Detailed revenue insights and forecasts</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select value={revenueTimeframe} onValueChange={setRevenueTimeframe}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">Last 3 months</SelectItem>
                      <SelectItem value="6months">Last 6 months</SelectItem>
                      <SelectItem value="12months">Last 12 months</SelectItem>
                      <SelectItem value="ytd">Year to date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
                    <div className="text-3xl font-bold">$276,750</div>
                    <div className="text-xs text-green-600 mt-1">+12% from previous period</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Average Per Event</div>
                    <div className="text-3xl font-bold">$23,062</div>
                    <div className="text-xs text-green-600 mt-1">+5% from previous period</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Projected Q2</div>
                    <div className="text-3xl font-bold">$161,750</div>
                    <div className="text-xs text-green-600 mt-1">+15% from Q1</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Event Type</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={eventTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {eventTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Categories (April)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyRevenueBreakdown} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
                        <YAxis type="category" dataKey="category" width={120} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                        <Bar dataKey="value" fill="#002366" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Revenue-Generating Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 p-4 text-sm font-medium border-b">
                      <div>Event</div>
                      <div>Date</div>
                      <div>Type</div>
                      <div>Revenue</div>
                    </div>
                    <div className="divide-y">
                      {detailedEvents
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 5)
                        .map((event) => (
                          <div key={event.id} className="grid grid-cols-4 p-4 text-sm items-center">
                            <div className="font-medium">{event.name}</div>
                            <div>{event.date}</div>
                            <div>{event.type}</div>
                            <div>${event.revenue.toLocaleString()}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast (8-Month Outlook)</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartContainer
                    config={{
                      actual: {
                        label: "Actual Revenue",
                        color: "hsl(var(--primary))",
                      },
                      forecast: {
                        label: "Forecasted Revenue",
                        color: "hsl(var(--secondary))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueForecast}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          name="Actual Revenue"
                          stroke="var(--color-actual)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="forecast"
                          name="Forecasted Revenue"
                          stroke="var(--color-forecast)"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Q2 Forecast</div>
                    <div className="text-3xl font-bold">$161,750</div>
                    <div className="text-xs text-green-600 mt-1">+15% from Q1</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Q3 Forecast</div>
                    <div className="text-3xl font-bold">$195,000</div>
                    <div className="text-xs text-green-600 mt-1">+20% from Q2</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Annual Forecast</div>
                    <div className="text-3xl font-bold">$750,000</div>
                    <div className="text-xs text-green-600 mt-1">+25% from previous year</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Forecast Assumptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>15% growth in wedding bookings during summer months</li>
                    <li>20% increase in corporate event average value</li>
                    <li>New golf tournament package expected to generate $50,000 in Q3</li>
                    <li>Seasonal adjustment applied for holiday events in Q4</li>
                    <li>Inflation rate of 3% applied to all pricing</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevenueDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Analytics
            </DialogTitle>
            <DialogDescription>Detailed event insights and trends</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upcoming" className="mt-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={eventSearchQuery}
                      onChange={(e) => setEventSearchQuery(e.target.value)}
                      className="pl-8 w-[250px]"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 text-sm font-medium border-b">
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestEventSort("name")}
                  >
                    Event Name {getSortDirectionIcon("name", eventSortConfig)}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestEventSort("date")}
                  >
                    Date {getSortDirectionIcon("date", eventSortConfig)}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestEventSort("type")}
                  >
                    Type {getSortDirectionIcon("type", eventSortConfig)}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestEventSort("location")}
                  >
                    Location {getSortDirectionIcon("location", eventSortConfig)}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestEventSort("status")}
                  >
                    Status {getSortDirectionIcon("status", eventSortConfig)}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestEventSort("revenue")}
                  >
                    Revenue {getSortDirectionIcon("revenue", eventSortConfig)}
                  </div>
                </div>

                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {sortedEvents.map((event) => (
                    <div key={event.id} className="grid grid-cols-6 p-4 text-sm items-center">
                      <div className="font-medium">{event.name}</div>
                      <div>{event.date}</div>
                      <div>{event.type}</div>
                      <div>{event.location}</div>
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            event.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <div>${event.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Events</div>
                    <div className="text-3xl font-bold">{detailedEvents.length}</div>
                    <div className="text-xs text-green-600 mt-1">+2 from last month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Confirmed Events</div>
                    <div className="text-3xl font-bold">
                      {detailedEvents.filter((e) => e.status === "Confirmed").length}
                    </div>
                    <div className="text-xs text-green-600 mt-1">75% confirmation rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Average Revenue</div>
                    <div className="text-3xl font-bold">
                      $
                      {Math.round(
                        detailedEvents.reduce((sum, e) => sum + e.revenue, 0) / detailedEvents.length,
                      ).toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600 mt-1">+10% from last quarter</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Venue Utilization</div>
                    <div className="text-3xl font-bold">68%</div>
                    <div className="text-xs text-green-600 mt-1">+5% from last quarter</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={eventTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {eventTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Venue Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { venue: "Grand Ballroom", events: 12 },
                          { venue: "Conference Center", events: 8 },
                          { venue: "Golf Course", events: 6 },
                          { venue: "Terrace Room", events: 5 },
                          { venue: "Private Dining", events: 4 },
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="venue" width={120} />
                        <Tooltip formatter={(value) => [`${value} events`, "Usage"]} />
                        <Bar dataKey="events" fill="#002366" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Event Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      wedding: {
                        label: "Wedding",
                        color: "#FEE2E2",
                      },
                      corporate: {
                        label: "Corporate",
                        color: "#002366",
                      },
                      golf: {
                        label: "Golf",
                        color: "#10B981",
                      },
                      social: {
                        label: "Social",
                        color: "#A78BFA",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: "Jan", wedding: 2, corporate: 3, golf: 0, social: 1 },
                          { month: "Feb", wedding: 1, corporate: 4, golf: 0, social: 2 },
                          { month: "Mar", wedding: 2, corporate: 3, golf: 1, social: 1 },
                          { month: "Apr", wedding: 3, corporate: 2, golf: 2, social: 1 },
                          { month: "May", wedding: 4, corporate: 2, golf: 3, social: 2 },
                          { month: "Jun", wedding: 5, corporate: 1, golf: 3, social: 3 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="wedding" name="Wedding" stackId="a" fill="var(--color-wedding)" />
                        <Bar dataKey="corporate" name="Corporate" stackId="a" fill="var(--color-corporate)" />
                        <Bar dataKey="golf" name="Golf" stackId="a" fill="var(--color-golf)" />
                        <Bar dataKey="social" name="Social" stackId="a" fill="var(--color-social)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Event Booking Trends (12 Months)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      events: {
                        label: "Events",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Apr '24", events: 5 },
                          { month: "May '24", events: 7 },
                          { month: "Jun '24", events: 9 },
                          { month: "Jul '24", events: 12 },
                          { month: "Aug '24", events: 10 },
                          { month: "Sep '24", events: 8 },
                          { month: "Oct '24", events: 7 },
                          { month: "Nov '24", events: 9 },
                          { month: "Dec '24", events: 12 },
                          { month: "Jan '25", events: 6 },
                          { month: "Feb '25", events: 7 },
                          { month: "Mar '25", events: 9 },
                          { month: "Apr '25", events: 11 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="events"
                          name="Events"
                          stroke="var(--color-events)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Seasonal Popularity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Spring (Mar-May)</span>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: "28%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Summer (Jun-Aug)</span>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Fall (Sep-Nov)</span>
                          <span className="text-sm font-medium">22%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: "22%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Winter (Dec-Feb)</span>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Event Growth by Type (YoY)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Wedding</span>
                          <span className="text-sm font-medium">+15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#FEE2E2] h-2.5 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Corporate</span>
                          <span className="text-sm font-medium">+22%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#002366] h-2.5 rounded-full" style={{ width: "72%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Golf</span>
                          <span className="text-sm font-medium">+8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#10B981] h-2.5 rounded-full" style={{ width: "58%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Social</span>
                          <span className="text-sm font-medium">+12%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#A78BFA] h-2.5 rounded-full" style={{ width: "62%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Details Dialog */}
      <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Analytics
            </DialogTitle>
            <DialogDescription>Detailed client insights and relationships</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="top" className="mt-4">
            <TabsList>
              <TabsTrigger value="top">Top Clients</TabsTrigger>
              <TabsTrigger value="activity">Client Activity</TabsTrigger>
              <TabsTrigger value="retention">Retention</TabsTrigger>
            </TabsList>
            <TabsContent value="top" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clients..."
                      value={clientSearchQuery}
                      onChange={(e) => setClientSearchQuery(e.target.value)}
                      className="pl-8 w-[250px]"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 text-sm font-medium border-b">
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestClientSort("name")}
                  >
                    Client {getSortDirectionIcon("name", clientSortConfig)}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestClientSort("events")}
                  >
                    Events {getSortDirectionIcon("events", clientSortConfig)}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestClientSort("revenue")}
                  >
                    Revenue {getSortDirectionIcon("revenue", clientSortConfig)}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestClientSort("lastEvent")}
                  >
                    Last Event {getSortDirectionIcon("lastEvent", clientSortConfig)}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestClientSort("nextEvent")}
                  >
                    Next Event {getSortDirectionIcon("nextEvent", clientSortConfig)}
                  </div>
                  <div>Status</div>
                </div>

                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {sortedClients.map((client, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 p-4 text-sm items-center cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="font-medium">{client.name}</div>
                      <div>{client.events}</div>
                      <div>${client.revenue.toLocaleString()}</div>
                      <div>{client.lastEvent}</div>
                      <div>{client.nextEvent}</div>
                      <div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {client.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedClient && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {selectedClient.name}
                      <Button variant="outline" size="sm" onClick={() => setSelectedClient(null)}>
                        Close
                      </Button>
                    </CardTitle>
                    <CardDescription>Client details and history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Client Overview</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Total Events:</span>
                            <span className="text-sm font-medium">{selectedClient.events}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Total Revenue:</span>
                            <span className="text-sm font-medium">${selectedClient.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Average Per Event:</span>
                            <span className="text-sm font-medium">
                              ${Math.round(selectedClient.revenue / selectedClient.events).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Client Since:</span>
                            <span className="text-sm font-medium">Jan 2023</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Last Event:</span>
                            <span className="text-sm font-medium">{selectedClient.lastEvent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Next Event:</span>
                            <span className="text-sm font-medium">{selectedClient.nextEvent}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Event History</h3>
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between border-b pb-2">
                              <div>
                                <div className="text-sm font-medium">
                                  {selectedClient.name} {i === 0 ? "Retreat" : i === 1 ? "Conference" : "Meeting"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(new Date().setMonth(new Date().getMonth() - i - 1)).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric", year: "numeric" },
                                  )}
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                $
                                {Math.round(
                                  (selectedClient.revenue / selectedClient.events) * 0.8 + Math.random() * 5000,
                                ).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Revenue Trend</h3>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { month: "Q2 2023", revenue: Math.round(selectedClient.revenue * 0.15) },
                              { month: "Q3 2023", revenue: Math.round(selectedClient.revenue * 0.2) },
                              { month: "Q4 2023", revenue: Math.round(selectedClient.revenue * 0.25) },
                              { month: "Q1 2024", revenue: Math.round(selectedClient.revenue * 0.4) },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                            <Line
                              type="monotone"
                              dataKey="revenue"
                              stroke="#002366"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Client Acquisition & Retention</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      newClients: {
                        label: "New Clients",
                        color: "#002366",
                      },
                      returningClients: {
                        label: "Returning Clients",
                        color: "#10B981",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clientActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar
                          dataKey="newClients"
                          name="New Clients"
                          fill="var(--color-newClients)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="returningClients"
                          name="Returning Clients"
                          fill="var(--color-returningClients)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">New Clients (YTD)</div>
                    <div className="text-3xl font-bold">22</div>
                    <div className="text-xs text-green-600 mt-1">+15% from last year</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Retention Rate</div>
                    <div className="text-3xl font-bold">78%</div>
                    <div className="text-xs text-green-600 mt-1">+5% from last year</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">Avg. Client Value</div>
                    <div className="text-3xl font-bold">$98,000</div>
                    <div className="text-xs text-green-600 mt-1">+12% from last year</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Client Engagement by Month</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", engagement: 65 },
                        { month: "Feb", engagement: 72 },
                        { month: "Mar", engagement: 68 },
                        { month: "Apr", engagement: 75 },
                        { month: "May", engagement: 82 },
                        { month: "Jun", engagement: 88 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, "Engagement Score"]} />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="#002366"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="retention" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Retention by Type</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: "Wedding", retention: 65 },
                          { type: "Corporate", retention: 85 },
                          { type: "Golf", retention: 72 },
                          { type: "Social", retention: 68 },
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                        <YAxis type="category" dataKey="type" width={100} />
                        <Tooltip formatter={(value) => [`${value}%`, "Retention Rate"]} />
                        <Bar dataKey="retention" fill="#002366" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Lifetime Value</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: "Wedding", value: 75000 },
                          { type: "Corporate", value: 145000 },
                          { type: "Golf", value: 95000 },
                          { type: "Social", value: 65000 },
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
                        <YAxis type="category" dataKey="type" width={100} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Lifetime Value"]} />
                        <Bar dataKey="value" fill="#002366" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Retention Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Loyalty Program</span>
                        <span className="text-sm font-medium">+18% retention</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: "68%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Personalized Follow-ups</span>
                        <span className="text-sm font-medium">+15% retention</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Anniversary Offers</span>
                        <span className="text-sm font-medium">+12% retention</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: "62%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Referral Incentives</span>
                        <span className="text-sm font-medium">+10% retention</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClientDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
