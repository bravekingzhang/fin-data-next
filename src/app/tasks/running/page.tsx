"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StopCircle, RefreshCw } from "lucide-react"

interface RunningTask {
  id: string
  name: string
  type: string
  startTime: string
  nextUpdate: string
  progress: number
}

export default function RunningTasksPage() {
  const [tasks] = useState<RunningTask[]>([
    {
      id: "industry-task",
      name: "行业指数数据",
      type: "industry",
      startTime: "2024-01-23 14:30:00",
      nextUpdate: "2024-01-23 15:00:00",
      progress: 75
    },
    {
      id: "etf-task",
      name: "ETF数据",
      type: "etf",
      startTime: "2024-01-23 14:45:00",
      nextUpdate: "2024-01-23 15:00:00",
      progress: 50
    },
    {
      id: "stock-task",
      name: "股票数据",
      type: "stock",
      startTime: "2024-01-23 14:55:00",
      nextUpdate: "2024-01-23 15:00:00",
      progress: 25
    }
  ])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">运行中任务</h1>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-6 border rounded-lg bg-card"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{task.name}</h3>
                <p className="text-sm text-muted-foreground">
                  开始时间: {task.startTime}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <StopCircle className="w-4 h-4 mr-2" />
                停止
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>下次更新: {task.nextUpdate}</span>
                <span>{task.progress}%</span>
              </div>

              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 