"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  Download,
  Eye,
  MoreHorizontal,
  Send,
  Printer,
  PlusCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DatePicker } from "@/components/ui/date-picker"

// Sample payment data
const payments = [
  {
    id: 1,
    client: "Johnson Wedding",
    amount: 25000,
    paid: 12500,
    dueDate: "Apr 10, 2025",
    status: "partial",
    method: "Credit Card",
    invoiceNumber: "INV-2025-001",
    paymentHistory: [
      { date: "Jan 15, 2025", amount: 5000, method: "Credit Card", note: "Initial deposit" },
      { date: "Feb 20, 2025", amount: 7500, method: "Bank Transfer", note: "Second installment" },
    ],
    contact: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "(555) 123-4567",
    },
  },
  {
    id: 2,
    client: "Acme Inc. Retreat",
    amount: 15000,
    paid: 15000,
    dueDate: "Apr 15, 2025",
    status: "paid",
    method: "Bank Transfer",
    invoiceNumber: "INV-2025-002",
    paymentHistory: [{ date: "Jan 10, 2025", amount: 15000, method: "Bank Transfer", note: "Full payment" }],
    contact: {
      name: "John Smith",
      email: "john@acme.com",
      phone: "(555) 987-6543",
    },
  },
  {
    id: 3,
    client: "Thompson Birthday",
    amount: 5000,
    paid: 0,
    dueDate: "Apr 20, 2025",
    status: "pending",
    method: "Pending",
    invoiceNumber: "INV-2025-003",
    paymentHistory: [],
    contact: {
      name: "Mike Thompson",
      email: "mike@example.com",
      phone: "(555) 456-7890",
    },
  },
  {
    id: 4,
    client: "Annual Golf Tournament",
    amount: 30000,
    paid: 15000,
    dueDate: "Apr 18, 2025",
    status: "partial",
    method: "Credit Card",
    invoiceNumber: "INV-2025-004",
    paymentHistory: [
      { date: "Feb 1, 2025", amount: 10000, method: "Credit Card", note: "Initial deposit" },
      { date: "Mar 5, 2025", amount: 5000, method: "Credit Card", note: "Second installment" },
    ],
    contact: {
      name: "David Wilson",
      email: "david@example.com",
      phone: "(555) 234-5678",
    },
  },
  {
    id: 5,
    client: "Smith Anniversary",
    amount: 10000,
    paid: 10000,
    dueDate: "Apr 22, 2025",
    status: "paid",
    method: "PayPal",
    invoiceNumber: "INV-2025-005",
    paymentHistory: [{ date: "Mar 1, 2025", amount: 10000, method: "PayPal", note: "Full payment" }],
    contact: {
      name: "Robert Smith",
      email: "robert@example.com",
      phone: "(555) 345-6789",
    },
  },
]

const statusColors = {
  paid: "bg-green-100 text-green-800 border-green-200",
  partial: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
}

// Payment methods for the dropdown
const paymentMethods = ["Credit Card", "Bank Transfer", "PayPal", "Cash", "Check"]

export function PaymentTracker() {
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [showRequestPayment, setShowRequestPayment] = useState(false)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [showRevenueBreakdown, setShowRevenueBreakdown] = useState(false)
  const [showPendingPayments, setShowPendingPayments] = useState(false)
  const [showPaymentRateDetails, setShowPaymentRateDetails] = useState(false)

  // New payment request form state
  const [paymentRequest, setPaymentRequest] = useState({
    client: "",
    clientId: 0,
    amount: "",
    dueDate: new Date(),
    notes: "",
    sendEmail: true,
  })

  // Invoice preview ref for "printing"
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Function to handle sorting
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

  // Filter payments based on search query
  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      payment.client.toLowerCase().includes(searchLower) ||
      payment.invoiceNumber.toLowerCase().includes(searchLower) ||
      payment.contact.name.toLowerCase().includes(searchLower) ||
      payment.contact.email.toLowerCase().includes(searchLower)
    )
  })

  // Sort payments
  const sortedPayments = React.useMemo(() => {
    const sortablePayments = [...filteredPayments]
    if (sortConfig !== null) {
      sortablePayments.sort((a, b) => {
        if (sortConfig.key === "client") {
          return sortConfig.direction === "ascending"
            ? a.client.localeCompare(b.client)
            : b.client.localeCompare(a.client)
        }

        if (sortConfig.key === "amount" || sortConfig.key === "paid") {
          return sortConfig.direction === "ascending"
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key]
        }

        if (sortConfig.key === "dueDate") {
          const dateA = new Date(a.dueDate)
          const dateB = new Date(b.dueDate)
          return sortConfig.direction === "ascending"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime()
        }

        return 0
      })
    }
    return sortablePayments
  }, [filteredPayments, sortConfig])

  // Calculate total revenue
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.paid, 0)

  // Calculate pending payments
  const pendingPayments = payments.reduce((sum, payment) => sum + (payment.amount - payment.paid), 0)

  // Calculate payment rate
  const paymentRate = Math.round(
    (payments.reduce((sum, payment) => sum + payment.paid, 0) /
      payments.reduce((sum, payment) => sum + payment.amount, 0)) *
      100,
  )

  // Data for revenue breakdown chart
  const revenueByMonthData = [
    { month: "Jan", revenue: 15000 },
    { month: "Feb", revenue: 22500 },
    { month: "Mar", revenue: 15000 },
    { month: "Apr", revenue: 0 }, // Future month
    { month: "May", revenue: 0 }, // Future month
    { month: "Jun", revenue: 0 }, // Future month
  ]

  // Data for payment methods pie chart
  const paymentMethodsData = [
    { name: "Credit Card", value: 27500 },
    { name: "Bank Transfer", value: 22500 },
    { name: "PayPal", value: 10000 },
    { name: "Cash", value: 0 },
    { name: "Check", value: 0 },
  ]

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  // Handle payment request submission
  const handleSubmitPaymentRequest = () => {
    // In a real app, this would send the payment request to the client
    alert(`Payment request for $${paymentRequest.amount} sent to ${paymentRequest.client}!`)
    setShowRequestPayment(false)

    // Reset form
    setPaymentRequest({
      client: "",
      clientId: 0,
      amount: "",
      dueDate: new Date(),
      notes: "",
      sendEmail: true,
    })
  }

  // Handle "print" invoice
  const handlePrintInvoice = () => {
    // In a real app, this would generate a PDF
    alert("Generating PDF invoice...")
  }

  // Handle record payment
  const handleRecordPayment = (payment: any) => {
    // In a real app, this would open a form to record a payment
    alert(`Recording payment for ${payment.client}...`)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover cursor-pointer" onClick={() => setShowRevenueBreakdown(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From {payments.length} clients</p>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => setShowPendingPayments(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {payments.filter((p) => p.status !== "paid").length} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => setShowPaymentRateDetails(true)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Of total invoiced amount</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Payment Time</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 Days</div>
            <p className="text-xs text-muted-foreground mt-1">From invoice to payment</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowRequestPayment(true)}>
          <PlusCircle className="h-4 w-4" />
          Request Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Tracker</CardTitle>
          <CardDescription>Track and manage client payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 p-4 text-sm font-medium border-b">
                  <div
                    className="col-span-2 flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestSort("client")}
                  >
                    Client {getSortDirectionIcon("client")}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestSort("amount")}
                  >
                    Amount {getSortDirectionIcon("amount")}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestSort("status")}
                  >
                    Status {getSortDirectionIcon("status")}
                  </div>
                  <div
                    className="flex items-center cursor-pointer hover:text-primary"
                    onClick={() => requestSort("dueDate")}
                  >
                    Due Date {getSortDirectionIcon("dueDate")}
                  </div>
                  <div>Payment</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="divide-y">
                  {sortedPayments.map((payment) => (
                    <div key={payment.id} className="grid grid-cols-7 p-4 text-sm items-center">
                      <div className="col-span-2 font-medium">{payment.client}</div>
                      <div>
                        <div>${payment.amount.toLocaleString()}</div>
                        <Progress value={(payment.paid / payment.amount) * 100} className="h-1 w-24 mt-1" />
                      </div>
                      <div>
                        <Badge variant="outline" className={statusColors[payment.status as keyof typeof statusColors]}>
                          {payment.status === "paid"
                            ? "Paid"
                            : payment.status === "partial"
                              ? "Partial"
                              : payment.status === "pending"
                                ? "Pending"
                                : "Overdue"}
                        </Badge>
                      </div>
                      <div>{payment.dueDate}</div>
                      <div>{payment.method}</div>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedPayment(payment)
                            setShowPaymentDetails(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Send className="h-4 w-4" />
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2"
                              onClick={() => {
                                setSelectedPayment(payment)
                                setShowInvoicePreview(true)
                              }}
                            >
                              <Download className="h-4 w-4" />
                              Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="flex items-center gap-2"
                              onClick={() => handleRecordPayment(payment)}
                            >
                              <CreditCard className="h-4 w-4" />
                              Record Payment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 p-4 text-sm font-medium border-b">
                  <div className="col-span-2">Client</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Due Date</div>
                  <div>Payment</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="divide-y">
                  {sortedPayments
                    .filter((payment) => payment.status !== "paid")
                    .map((payment) => (
                      <div key={payment.id} className="grid grid-cols-7 p-4 text-sm items-center">
                        <div className="col-span-2 font-medium">{payment.client}</div>
                        <div>
                          <div>${payment.amount.toLocaleString()}</div>
                          <Progress value={(payment.paid / payment.amount) * 100} className="h-1 w-24 mt-1" />
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            className={statusColors[payment.status as keyof typeof statusColors]}
                          >
                            {payment.status === "partial"
                              ? "Partial"
                              : payment.status === "pending"
                                ? "Pending"
                                : "Overdue"}
                          </Badge>
                        </div>
                        <div>{payment.dueDate}</div>
                        <div>{payment.method}</div>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPayment(payment)
                              setShowPaymentDetails(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Send className="h-4 w-4" />
                                Send Reminder
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() => {
                                  setSelectedPayment(payment)
                                  setShowInvoicePreview(true)
                                }}
                              >
                                <Download className="h-4 w-4" />
                                Download Invoice
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() => handleRecordPayment(payment)}
                              >
                                <CreditCard className="h-4 w-4" />
                                Record Payment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="paid" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 p-4 text-sm font-medium border-b">
                  <div className="col-span-2">Client</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Due Date</div>
                  <div>Payment</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="divide-y">
                  {sortedPayments
                    .filter((payment) => payment.status === "paid")
                    .map((payment) => (
                      <div key={payment.id} className="grid grid-cols-7 p-4 text-sm items-center">
                        <div className="col-span-2 font-medium">{payment.client}</div>
                        <div>
                          <div>${payment.amount.toLocaleString()}</div>
                          <Progress value={100} className="h-1 w-24 mt-1" />
                        </div>
                        <div>
                          <Badge variant="outline" className={statusColors.paid}>
                            Paid
                          </Badge>
                        </div>
                        <div>{payment.dueDate}</div>
                        <div>{payment.method}</div>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPayment(payment)
                              setShowPaymentDetails(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() => {
                                  setSelectedPayment(payment)
                                  setShowInvoicePreview(true)
                                }}
                              >
                                <Download className="h-4 w-4" />
                                Download Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Invoice #{selectedPayment?.invoiceNumber}</DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{selectedPayment.client}</h3>
                    <p className="text-sm text-muted-foreground">Due: {selectedPayment.dueDate}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusColors[selectedPayment.status as keyof typeof statusColors]}
                  >
                    {selectedPayment.status === "paid"
                      ? "Paid"
                      : selectedPayment.status === "partial"
                        ? "Partial"
                        : selectedPayment.status === "pending"
                          ? "Pending"
                          : "Overdue"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Amount:</span>
                    <span className="font-medium">${selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Paid Amount:</span>
                    <span className="font-medium">${selectedPayment.paid.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Remaining:</span>
                    <span className="font-medium">
                      ${(selectedPayment.amount - selectedPayment.paid).toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Payment Progress:</span>
                      <span>{Math.round((selectedPayment.paid / selectedPayment.amount) * 100)}%</span>
                    </div>
                    <Progress value={(selectedPayment.paid / selectedPayment.amount) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Contact Information</h3>
                <div className="space-y-1">
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium">Name:</span> {selectedPayment.contact.name}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium">Email:</span> {selectedPayment.contact.email}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium">Phone:</span> {selectedPayment.contact.phone}
                  </p>
                </div>
              </div>

              {/* Payment History Section */}
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Payment History</h3>
                {selectedPayment.paymentHistory.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPayment.paymentHistory.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between text-sm border-b pb-2">
                        <div>
                          <p className="font-medium">{payment.date}</p>
                          <p className="text-muted-foreground">{payment.note}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${payment.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{payment.method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No payment history available.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => {
                    setShowPaymentDetails(false)
                    setShowInvoicePreview(true)
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download Invoice
                </Button>
                {selectedPayment.status !== "paid" && (
                  <Button className="flex items-center gap-1">
                    <Send className="h-4 w-4" />
                    Send Reminder
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Revenue Breakdown Dialog */}
      <Dialog open={showRevenueBreakdown} onOpenChange={setShowRevenueBreakdown}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Revenue Breakdown</DialogTitle>
            <DialogDescription>Detailed view of all payment histories</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Revenue by Month</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByMonthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="#002366" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-md border">
              <div className="grid grid-cols-4 p-4 text-sm font-medium border-b">
                <div>Client</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Method</div>
              </div>
              <div className="divide-y max-h-[300px] overflow-y-auto">
                {payments.flatMap((payment) =>
                  payment.paymentHistory.map((history, index) => (
                    <div key={`${payment.id}-${index}`} className="grid grid-cols-4 p-4 text-sm">
                      <div>{payment.client}</div>
                      <div>{history.date}</div>
                      <div>${history.amount.toLocaleString()}</div>
                      <div>{history.method}</div>
                    </div>
                  )),
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pending Payments Dialog */}
      <Dialog open={showPendingPayments} onOpenChange={setShowPendingPayments}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Pending Payments</DialogTitle>
            <DialogDescription>Outstanding balances and who owes them</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 text-sm font-medium border-b">
                <div>Client</div>
                <div>Contact</div>
                <div>Due Date</div>
                <div>Outstanding</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="divide-y max-h-[400px] overflow-y-auto">
                {payments
                  .filter((payment) => payment.status !== "paid")
                  .map((payment) => (
                    <div key={payment.id} className="grid grid-cols-5 p-4 text-sm items-center">
                      <div className="font-medium">{payment.client}</div>
                      <div>
                        <p>{payment.contact.name}</p>
                        <p className="text-xs text-muted-foreground">{payment.contact.email}</p>
                      </div>
                      <div>{payment.dueDate}</div>
                      <div className="font-medium">${(payment.amount - payment.paid).toLocaleString()}</div>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Send className="h-3 w-3" />
                          Remind
                        </Button>
                        <Button size="sm" className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          Record
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">Total Outstanding: ${pendingPayments.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  Across {payments.filter((p) => p.status !== "paid").length} clients
                </p>
              </div>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export List
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Rate Details Dialog */}
      <Dialog open={showPaymentRateDetails} onOpenChange={setShowPaymentRateDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment Rate Details</DialogTitle>
            <DialogDescription>Analysis of payment rates and trends</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Overall Payment Rate</div>
                  <div className="text-3xl font-bold">{paymentRate}%</div>
                  <Progress value={paymentRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Average Days to Pay</div>
                  <div className="text-3xl font-bold">14</div>
                  <p className="text-xs text-muted-foreground mt-1">From invoice to payment</p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2">Payment Rate by Client Type</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Wedding Events</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Corporate Events</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Golf Events</span>
                    <span>50%</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2">Payment Method Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Credit Card</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Bank Transfer</span>
                    <span>38%</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>PayPal</span>
                    <span>17%</span>
                  </div>
                  <Progress value={17} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Payment Dialog */}
      <Dialog open={showRequestPayment} onOpenChange={setShowRequestPayment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Payment</DialogTitle>
            <DialogDescription>Send a payment request to a client</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Select
                value={paymentRequest.client}
                onValueChange={(value) => {
                  const client = payments.find((p) => p.client === value)
                  setPaymentRequest({
                    ...paymentRequest,
                    client: value,
                    clientId: client?.id || 0,
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {payments.map((payment) => (
                    <SelectItem key={payment.id} value={payment.client}>
                      {payment.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                value={paymentRequest.amount}
                onChange={(e) => setPaymentRequest({ ...paymentRequest, amount: e.target.value })}
                placeholder="Enter amount"
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <DatePicker
                date={paymentRequest.dueDate}
                onSelect={(date) => setPaymentRequest({ ...paymentRequest, dueDate: date || new Date() })}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={paymentRequest.notes}
                onChange={(e) => setPaymentRequest({ ...paymentRequest, notes: e.target.value })}
                placeholder="Add any notes or instructions..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendEmail"
                checked={paymentRequest.sendEmail}
                onChange={(e) => setPaymentRequest({ ...paymentRequest, sendEmail: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="sendEmail">Send email notification to client</Label>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestPayment(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitPaymentRequest}>Send Request</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Preview Dialog */}
      <Dialog open={showInvoicePreview} onOpenChange={setShowInvoicePreview}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>Invoice #{selectedPayment?.invoiceNumber}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="border rounded-md p-6" ref={invoiceRef}>
              <div className="flex justify-between items-start">
                <div>
                  <img src="/placeholder.svg?height=60&width=200&text=ClubEventPro" alt="Logo" className="h-12" />
                  <p className="text-sm mt-2">123 Country Club Lane</p>
                  <p className="text-sm">Anytown, ST 12345</p>
                  <p className="text-sm">Phone: (555) 123-4567</p>
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold text-primary">INVOICE</h1>
                  <p className="text-sm mt-2">Invoice #: {selectedPayment?.invoiceNumber}</p>
                  <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-sm">Due Date: {selectedPayment?.dueDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                  <h2 className="text-sm font-bold text-muted-foreground">BILL TO:</h2>
                  <p className="font-medium">{selectedPayment?.contact.name}</p>
                  <p className="text-sm">{selectedPayment?.contact.email}</p>
                  <p className="text-sm">{selectedPayment?.contact.phone}</p>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-muted-foreground">EVENT DETAILS:</h2>
                  <p className="font-medium">{selectedPayment?.client}</p>
                  <p className="text-sm">Date: {selectedPayment?.dueDate}</p>
                  <p className="text-sm">Location: Grand Ballroom</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="grid grid-cols-12 bg-muted/50 p-2 text-sm font-medium">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Quantity</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                <div className="border-b">
                  <div className="grid grid-cols-12 p-2 text-sm">
                    <div className="col-span-6">Venue Rental</div>
                    <div className="col-span-2 text-right">1</div>
                    <div className="col-span-2 text-right">$10,000.00</div>
                    <div className="col-span-2 text-right">$10,000.00</div>
                  </div>
                  <div className="grid grid-cols-12 p-2 text-sm">
                    <div className="col-span-6">Catering Services (150 guests)</div>
                    <div className="col-span-2 text-right">150</div>
                    <div className="col-span-2 text-right">$85.00</div>
                    <div className="col-span-2 text-right">$12,750.00</div>
                  </div>
                  <div className="grid grid-cols-12 p-2 text-sm">
                    <div className="col-span-6">Premium Bar Package</div>
                    <div className="col-span-2 text-right">1</div>
                    <div className="col-span-2 text-right">$2,250.00</div>
                    <div className="col-span-2 text-right">$2,250.00</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <div className="w-1/3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${selectedPayment?.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Tax (0%):</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span>${selectedPayment?.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Amount Paid:</span>
                      <span>${selectedPayment?.paid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-primary mt-2 pt-2 border-t">
                      <span>Balance Due:</span>
                      <span>
                        ${(selectedPayment ? selectedPayment.amount - selectedPayment.paid : 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-sm">
                  <h3 className="font-bold">Payment Terms:</h3>
                  <p>
                    Payment is due by the date specified above. Please make checks payable to ClubEventPro or pay online
                    at clubeventpro.com/pay
                  </p>
                  <p className="mt-2">Thank you for your business!</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-1" onClick={handlePrintInvoice}>
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
