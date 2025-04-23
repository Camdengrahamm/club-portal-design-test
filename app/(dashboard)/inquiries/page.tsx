import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InquiryBot } from "@/components/inquiry-bot"

export default function InquiriesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inquiry Bot</h1>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Automated Discovery Bot</CardTitle>
          <CardDescription>
            This bot will automatically collect information from potential clients and create leads in your pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InquiryBot />
        </CardContent>
      </Card>
    </div>
  )
}
