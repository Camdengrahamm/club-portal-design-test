"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

// Define message types
type MessageType = "bot" | "user" | "form"
type FormType = "event-type" | "date" | "guests" | "budget" | "time" | "requirements" | "contact"

interface Message {
  id: number
  type: MessageType
  content: string
  formType?: FormType
  formValue?: string
}

// Initial bot messages
const initialMessages: Message[] = [
  {
    id: 1,
    type: "bot",
    content: "👋 Hello! I'm your ClubEventPro assistant. I'd be happy to help you plan your event at our country club.",
  },
  {
    id: 2,
    type: "bot",
    content: "To get started, could you tell me what type of event you're planning?",
  },
  {
    id: 3,
    type: "form",
    content: "Please select your event type:",
    formType: "event-type",
  },
]

export function InquiryBot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [eventDetails, setEventDetails] = useState({
    type: "",
    date: "",
    guests: "",
    budget: "",
    time: "",
    requirements: "",
    name: "",
    email: "",
    phone: "",
  })
  const [isComplete, setIsComplete] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Function to handle form submissions
  const handleFormSubmit = (formType: FormType, value: string) => {
    // Add user's selection as a message
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: value,
    }

    setMessages([...messages, userMessage])

    // Update event details
    switch (formType) {
      case "event-type":
        setEventDetails({ ...eventDetails, type: value })
        setTimeout(() => {
          const nextMessages: Message[] = [
            {
              id: messages.length + 2,
              type: "bot",
              content: `Great! A ${value.toLowerCase()} event is a wonderful choice. When are you thinking of holding this event?`,
            },
            {
              id: messages.length + 3,
              type: "form",
              content: "Please select a preferred date:",
              formType: "date",
            },
          ]
          setMessages((prev) => [...prev, ...nextMessages])
        }, 500)
        setCurrentStep(1)
        break

      case "date":
        setEventDetails({ ...eventDetails, date: value })
        setTimeout(() => {
          const nextMessages: Message[] = [
            {
              id: messages.length + 2,
              type: "bot",
              content: `${value} works for us! How many guests are you expecting?`,
            },
            {
              id: messages.length + 3,
              type: "form",
              content: "Please enter the approximate number of guests:",
              formType: "guests",
            },
          ]
          setMessages((prev) => [...prev, ...nextMessages])
        }, 500)
        setCurrentStep(2)
        break

      case "guests":
        setEventDetails({ ...eventDetails, guests: value })
        setTimeout(() => {
          const nextMessages: Message[] = [
            {
              id: messages.length + 2,
              type: "bot",
              content: `${value} guests, perfect! What's your approximate budget for this event?`,
            },
            {
              id: messages.length + 3,
              type: "form",
              content: "Please enter your budget range:",
              formType: "budget",
            },
          ]
          setMessages((prev) => [...prev, ...nextMessages])
        }, 500)
        setCurrentStep(3)
        break

      case "budget":
        setEventDetails({ ...eventDetails, budget: value })
        setTimeout(() => {
          const nextMessages: Message[] = [
            {
              id: messages.length + 2,
              type: "bot",
              content: `Thank you. What time would you like your event to start?`,
            },
            {
              id: messages.length + 3,
              type: "form",
              content: "Please select a preferred time:",
              formType: "time",
            },
          ]
          setMessages((prev) => [...prev, ...nextMessages])
        }, 500)
        setCurrentStep(4)
        break

      case "time":
        setEventDetails({ ...eventDetails, time: value })
        setTimeout(() => {
          const nextMessages: Message[] = [
            {
              id: messages.length + 2,
              type: "bot",
              content: `Do you have any specific requirements or special requests for your event?`,
            },
            {
              id: messages.length + 3,
              type: "form",
              content: "Please describe any special requirements:",
              formType: "requirements",
            },
          ]
          setMessages((prev) => [...prev, ...nextMessages])
        }, 500)
        setCurrentStep(5)
        break

      case "requirements":
        setEventDetails({ ...eventDetails, requirements: value })
        setTimeout(() => {
          const nextMessages: Message[] = [
            {
              id: messages.length + 2,
              type: "bot",
              content: `Thank you for all this information! To finalize your inquiry, I'll need your contact details.`,
            },
            {
              id: messages.length + 3,
              type: "form",
              content: "Please provide your contact information:",
              formType: "contact",
            },
          ]
          setMessages((prev) => [...prev, ...nextMessages])
        }, 500)
        setCurrentStep(6)
        break

      case "contact":
        // Parse contact info from form
        const contactInfo = JSON.parse(value)
        setEventDetails({
          ...eventDetails,
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone,
        })

        setTimeout(() => {
          const nextMessages: Message[] = [
            {
              id: messages.length + 2,
              type: "bot",
              content: `Thank you, ${contactInfo.name}! Your inquiry has been submitted successfully. One of our event coordinators will contact you within 24 hours at ${contactInfo.email} or ${contactInfo.phone} to discuss your ${eventDetails.type.toLowerCase()} event in more detail.`,
            },
            {
              id: messages.length + 3,
              type: "bot",
              content: `Here's a summary of your inquiry:
              
• Event Type: ${eventDetails.type}
• Date: ${eventDetails.date}
• Guests: ${eventDetails.guests}
• Budget: ${eventDetails.budget}
• Time: ${eventDetails.time}
• Requirements: ${eventDetails.requirements || "None specified"}`,
            },
          ]
          setMessages((prev) => [...prev, ...nextMessages])
          setIsComplete(true)
        }, 500)
        setCurrentStep(7)
        break
    }
  }

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: input,
    }

    setMessages([...messages, userMessage])
    setInput("")

    // Bot response to free-form input
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content:
          "Thank you for your message. To help you better, I'd like to gather some specific information about your event. Please follow the prompts to continue.",
      }
      setMessages((prev) => [...prev, botResponse])
    }, 500)
  }

  // Function to render form based on type
  const renderForm = (formType: FormType) => {
    switch (formType) {
      case "event-type":
        return (
          <div className="flex flex-wrap gap-2">
            {["Wedding", "Corporate", "Golf", "Social", "Birthday", "Anniversary"].map((type) => (
              <Badge
                key={type}
                className="cursor-pointer py-2 px-3 hover:bg-primary hover:text-white"
                variant="outline"
                onClick={() => handleFormSubmit("event-type", type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        )

      case "date":
        return (
          <div className="flex flex-col gap-2">
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleFormSubmit("date", e.target.value)}
            />
          </div>
        )

      case "guests":
        return (
          <div className="flex gap-2">
            <Select onValueChange={(value) => handleFormSubmit("guests", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-25">1-25 guests</SelectItem>
                <SelectItem value="26-50">26-50 guests</SelectItem>
                <SelectItem value="51-100">51-100 guests</SelectItem>
                <SelectItem value="101-200">101-200 guests</SelectItem>
                <SelectItem value="201+">201+ guests</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case "budget":
        return (
          <div className="flex gap-2">
            <Select onValueChange={(value) => handleFormSubmit("budget", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                <SelectItem value="$10,000 - $25,000">$10,000 - $25,000</SelectItem>
                <SelectItem value="$25,000 - $50,000">$25,000 - $50,000</SelectItem>
                <SelectItem value="$50,000+">$50,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case "time":
        return (
          <div className="flex gap-2">
            <Select onValueChange={(value) => handleFormSubmit("time", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</SelectItem>
                <SelectItem value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</SelectItem>
                <SelectItem value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</SelectItem>
                <SelectItem value="Night (8:00 PM - 12:00 AM)">Night (8:00 PM - 12:00 AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case "requirements":
        return (
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Enter any special requirements or requests..."
              onChange={(e) => {
                if (e.target.value.trim()) {
                  handleFormSubmit("requirements", e.target.value)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  const target = e.target as HTMLTextAreaElement
                  if (target.value.trim()) {
                    handleFormSubmit("requirements", target.value)
                  }
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFormSubmit("requirements", "No special requirements")}
            >
              No special requirements
            </Button>
          </div>
        )

      case "contact":
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="Full Name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Email" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Phone" className="mt-1" />
            </div>
            <Button
              className="w-full mt-2"
              onClick={() => {
                const nameInput = document.getElementById("name") as HTMLInputElement
                const emailInput = document.getElementById("email") as HTMLInputElement
                const phoneInput = document.getElementById("phone") as HTMLInputElement

                if (nameInput.value && emailInput.value && phoneInput.value) {
                  const contactInfo = {
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value,
                  }
                  handleFormSubmit("contact", JSON.stringify(contactInfo))
                }
              }}
            >
              Submit Inquiry
            </Button>
          </div>
        )
    }
  }

  // Function to start a new inquiry
  const handleNewInquiry = () => {
    setMessages(initialMessages)
    setCurrentStep(0)
    setEventDetails({
      type: "",
      date: "",
      guests: "",
      budget: "",
      time: "",
      requirements: "",
      name: "",
      email: "",
      phone: "",
    })
    setIsComplete(false)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-primary text-white">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          ClubEventPro Inquiry Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("mb-4 flex", message.type === "user" ? "justify-end" : "justify-start")}
            >
              {message.type === "bot" && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=Bot" alt="Bot" />
                  <AvatarFallback>Bot</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.type === "bot"
                      ? "bg-muted"
                      : "bg-card w-full",
                )}
              >
                {message.type === "form" ? (
                  <div className="space-y-2">
                    <p className="mb-2">{message.content}</p>
                    {message.formType && renderForm(message.formType)}
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{message.content}</p>
                )}
              </div>

              {message.type === "user" && (
                <Avatar className="h-8 w-8 ml-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=You" alt="You" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        {isComplete ? (
          <Button className="w-full" onClick={handleNewInquiry}>
            Start New Inquiry
          </Button>
        ) : (
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={currentStep < 7 && currentStep > 0}
            />
            <Button type="submit" size="icon" onClick={handleSendMessage} disabled={currentStep < 7 && currentStep > 0}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

// Label component
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
    </label>
  )
}
