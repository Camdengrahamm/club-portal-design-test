import { EventCostCalculator } from "@/components/event-cost-calculator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CalculatorPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Event Cost Calculator</h1>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Budget Planning Tool</CardTitle>
          <CardDescription>Calculate and manage all your event-related expenses in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <EventCostCalculator />
        </CardContent>
      </Card>
    </div>
  )
}
