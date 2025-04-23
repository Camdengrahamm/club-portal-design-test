import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const events = [
  {
    id: 1,
    title: "Johnson Wedding",
    date: "Apr 10, 2025",
    time: "4:00 PM - 10:00 PM",
    type: "wedding",
    status: "deposit",
  },
  {
    id: 2,
    title: "Corporate Retreat: Acme Inc",
    date: "Apr 15, 2025",
    time: "9:00 AM - 5:00 PM",
    type: "corporate",
    status: "paid",
  },
  {
    id: 3,
    title: "Annual Golf Tournament",
    date: "Apr 18, 2025",
    time: "8:00 AM - 4:00 PM",
    type: "golf",
    status: "paid",
  },
  {
    id: 4,
    title: "Smith Anniversary",
    date: "Apr 22, 2025",
    time: "6:00 PM - 11:00 PM",
    type: "wedding",
    status: "tentative",
  },
  {
    id: 5,
    title: "Executive Board Meeting",
    date: "Apr 25, 2025",
    time: "10:00 AM - 2:00 PM",
    type: "corporate",
    status: "deposit",
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
}

export function UpcomingEvents() {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex flex-col space-y-2 rounded-md border p-3 card-hover">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{event.title}</h3>
            <Badge className={cn("status-pill", statusColors[event.status as keyof typeof statusColors])}>
              {event.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("status-pill", eventTypeColors[event.type as keyof typeof eventTypeColors])}
              >
                {event.type}
              </Badge>
              <span className="text-muted-foreground">{event.date}</span>
            </div>
            <span className="text-muted-foreground">{event.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
