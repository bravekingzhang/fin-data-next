"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewTaskPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // In a real app, we would submit the form data to an API
    await new Promise(resolve => setTimeout(resolve, 1000))

    setLoading(false)
    router.push('/tasks')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Task</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Task Name</Label>
          <Input id="name" placeholder="Please enter the task name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Data Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Data Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industry">Industry Index</SelectItem>
              <SelectItem value="etf">ETF Data</SelectItem>
              <SelectItem value="stock">Stock Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interval">Update Interval (minutes)</Label>
          <Input
            id="interval"
            type="number"
            min="1"
            placeholder="Please enter the update interval"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="days">History Data Days</Label>
          <Input
            id="days"
            type="number"
            min="1"
            placeholder="Please enter the number of days to retrieve historical data"
            required
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </div>
  )
}