import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Bell, Calendar, CreditCard, FileText } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "inquiry",
    title: "New inquiry: Johnson Wedding",
    description: "Today 9:42AM",
    icon: Bell,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
  },
  {
    id: 2,
    type: "contract",
    title: "Contract signed: Corporate Retreat",
    description: "Yesterday",
    icon: FileText,
    iconColor: "text-green-500",
    iconBg: "bg-green-100",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment received: $5,000",
    description: "2 hrs ago",
    icon: CreditCard,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100",
  },
  {
    id: 4,
    type: "event",
    title: "Event scheduled: Smith Anniversary",
    description: "Yesterday",
    icon: Calendar,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100",
  },
  {
    id: 5,
    type: "inquiry",
    title: "New inquiry: Thompson Birthday",
    description: "3 hrs ago",
    icon: Bell,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
  },
]

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <div className={cn("rounded-full p-2", activity.iconBg)}>
            <activity.icon className={cn("h-4 w-4", activity.iconColor)} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${activity.id}`} alt="User" />
            <AvatarFallback>U{activity.id}</AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  )
}
