import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContractGenerator } from "@/components/contract-generator"

export default function ContractGeneratorPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contract Generator</h1>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Create Custom Contracts</CardTitle>
          <CardDescription>Generate contracts with automated payment schedules and client information.</CardDescription>
        </CardHeader>
        <CardContent>
          <ContractGenerator />
        </CardContent>
      </Card>
    </div>
  )
}
