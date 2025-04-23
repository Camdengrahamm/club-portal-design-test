"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Plus, Trash2, Save, Download, DollarSign, Percent } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the expense category type
interface ExpenseCategory {
  id: string
  name: string
  amount: number
  notes: string
  isCustom?: boolean
}

// Default expense categories
const defaultExpenseCategories: ExpenseCategory[] = [
  { id: "venue", name: "Venue Rental", amount: 0, notes: "" },
  { id: "catering", name: "Catering & Bar Service", amount: 0, notes: "" },
  { id: "cake", name: "Cake Cutting / Dessert", amount: 0, notes: "" },
  { id: "decor", name: "Decor & Floral", amount: 0, notes: "" },
  { id: "entertainment", name: "Entertainment (DJ/Band)", amount: 0, notes: "" },
  { id: "photography", name: "Photography & Videography", amount: 0, notes: "" },
  { id: "rentals", name: "Rentals (tables, chairs, linens)", amount: 0, notes: "" },
  { id: "staffing", name: "Staffing (servers, bartenders)", amount: 0, notes: "" },
  { id: "transportation", name: "Transportation & Valet", amount: 0, notes: "" },
  { id: "permits", name: "Permits or Security", amount: 0, notes: "" },
  { id: "tips", name: "Tips & Gratuities", amount: 0, notes: "" },
]

// Chart colors
const COLORS = [
  "#002366", // Primary navy
  "#FFD700", // Gold
  "#10B981", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#6B7280", // Gray
  "#1E40AF", // Dark blue
  "#047857", // Dark green
  "#7C3AED", // Violet
  "#DB2777", // Dark pink
]

export function EventCostCalculator() {
  const [expenses, setExpenses] = useState<ExpenseCategory[]>(defaultExpenseCategories)
  const [newCustomExpense, setNewCustomExpense] = useState("")
  const [totalBudget, setTotalBudget] = useState<number>(0)
  const [eventName, setEventName] = useState("My Event")
  const [activeTab, setActiveTab] = useState("expenses")
  const [editingNotes, setEditingNotes] = useState<string | null>(null)

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate remaining budget
  const remainingBudget = totalBudget - totalExpenses

  // Calculate percentage of budget used
  const percentageUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0

  // Update total expenses when expenses change
  useEffect(() => {
    // This effect is intentionally left empty as we calculate totalExpenses on the fly
  }, [expenses])

  // Handle expense amount change
  const handleAmountChange = (id: string, value: string) => {
    const numericValue = value === "" ? 0 : Number.parseFloat(value)

    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, amount: isNaN(numericValue) ? 0 : numericValue } : expense,
      ),
    )
  }

  // Handle expense notes change
  const handleNotesChange = (id: string, notes: string) => {
    setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, notes } : expense)))
  }

  // Add custom expense
  const addCustomExpense = () => {
    if (newCustomExpense.trim() === "") return

    const newId = `custom-${Date.now()}`
    setExpenses([...expenses, { id: newId, name: newCustomExpense, amount: 0, notes: "", isCustom: true }])
    setNewCustomExpense("")
  }

  // Remove expense
  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  // Prepare data for pie chart
  const chartData = expenses
    .filter((expense) => expense.amount > 0)
    .map((expense) => ({
      name: expense.name,
      value: expense.amount,
    }))

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  // Save calculator data
  const saveCalculator = () => {
    // In a real app, this would save to a database
    alert("Calculator data saved!")
  }

  // Export as PDF
  const exportAsPDF = () => {
    // In a real app, this would generate a PDF
    alert("Exporting as PDF...")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="event-name">Event Name</Label>
              <Input
                id="event-name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="total-budget">Total Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="total-budget"
                  type="number"
                  value={totalBudget || ""}
                  onChange={(e) => setTotalBudget(Number.parseFloat(e.target.value) || 0)}
                  placeholder="Enter total budget"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card
              className={cn(
                "col-span-1",
                remainingBudget < 0 ? "bg-red-50" : remainingBudget === 0 ? "bg-amber-50" : "bg-green-50",
              )}
            >
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Remaining Budget</div>
                <div
                  className={cn(
                    "text-2xl font-bold",
                    remainingBudget < 0 ? "text-red-600" : remainingBudget === 0 ? "text-amber-600" : "text-green-600",
                  )}
                >
                  {formatCurrency(remainingBudget)}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Expenses</div>
                <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Budget Used</div>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{percentageUsed.toFixed(1)}%</div>
                  <Percent className="h-4 w-4 ml-1 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="text-center mb-2">
                <h3 className="font-medium">Budget Breakdown</h3>
                <p className="text-sm text-muted-foreground">Expense Distribution</p>
              </div>
              {chartData.length > 0 ? (
                <ChartContainer
                  config={{
                    expenses: {
                      label: "Expenses",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend layout="vertical" align="center" verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                  Add expenses to see chart
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses" className="space-y-4 mt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-4 text-sm font-medium border-b bg-muted/50">
              <div className="col-span-5 md:col-span-4">Expense Category</div>
              <div className="col-span-3 md:col-span-2">Amount</div>
              <div className="col-span-3 md:col-span-5">Notes</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="divide-y">
              {expenses.map((expense) => (
                <div key={expense.id} className="grid grid-cols-12 p-4 text-sm items-center">
                  <div className="col-span-5 md:col-span-4 font-medium">{expense.name}</div>
                  <div className="col-span-3 md:col-span-2">
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={expense.amount || ""}
                        onChange={(e) => handleAmountChange(expense.id, e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-5">
                    {editingNotes === expense.id ? (
                      <Input
                        value={expense.notes}
                        onChange={(e) => handleNotesChange(expense.id, e.target.value)}
                        onBlur={() => setEditingNotes(null)}
                        autoFocus
                      />
                    ) : (
                      <div
                        className="truncate cursor-pointer hover:text-primary"
                        onClick={() => setEditingNotes(expense.id)}
                      >
                        {expense.notes || <span className="text-muted-foreground italic">Add notes...</span>}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 text-right">
                    {expense.isCustom && (
                      <Button variant="ghost" size="icon" onClick={() => removeExpense(expense.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="New expense category"
              value={newCustomExpense}
              onChange={(e) => setNewCustomExpense(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCustomExpense()
                }
              }}
            />
            <Button onClick={addCustomExpense} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Custom Expense
            </Button>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" className="flex items-center gap-1" onClick={saveCalculator}>
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" className="flex items-center gap-1" onClick={exportAsPDF}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">{eventName} - Budget Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Total Budget:</span>
                  <span className="font-bold">{formatCurrency(totalBudget)}</span>
                </div>

                <div className="space-y-2">
                  {expenses
                    .filter((expense) => expense.amount > 0)
                    .map((expense) => (
                      <div key={expense.id} className="flex justify-between">
                        <span>{expense.name}</span>
                        <span>{formatCurrency(expense.amount)}</span>
                      </div>
                    ))}
                </div>

                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total Expenses:</span>
                  <span>{formatCurrency(totalExpenses)}</span>
                </div>

                <div
                  className={cn(
                    "flex justify-between pt-2 font-bold",
                    remainingBudget < 0 ? "text-red-600" : remainingBudget === 0 ? "text-amber-600" : "text-green-600",
                  )}
                >
                  <span>Remaining Budget:</span>
                  <span>{formatCurrency(remainingBudget)}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span>Percentage of Budget Used:</span>
                  <span>{percentageUsed.toFixed(1)}%</span>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full" onClick={exportAsPDF}>
                  Export Summary as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
