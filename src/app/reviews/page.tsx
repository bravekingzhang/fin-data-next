"use client"

import { useState, useEffect } from "react"
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface DataItem {
  symbol: string
  name: string
  value: number
  change: number
  isAbnormal: boolean
  correctedValue?: number
}

interface ReviewTask {
  id: string
  taskId: string
  taskName: string
  type: "industry" | "etf" | "stock"
  status: "pending" | "approved" | "rejected"
  createdAt: string
  data: DataItem[]
  reviewComment?: string
  reviewedBy?: string
  reviewedAt?: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewTask[]>([])
  const [selectedTask, setSelectedTask] = useState<ReviewTask | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewComment, setReviewComment] = useState("")
  const [editingData, setEditingData] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem("reviews") || "[]")
    setReviews(savedReviews)
  }, [])

  const handleUpdateValue = (symbol: string, value: number) => {
    setEditingData(prev => ({
      ...prev,
      [symbol]: value
    }))
  }

  const handleReviewTask = (task: ReviewTask) => {
    setSelectedTask(task)
    setIsReviewing(true)
    setEditingData({})
    setReviewComment("")
  }

  const handleApproveTask = () => {
    if (!selectedTask) return

    const updatedData = selectedTask.data.map(item => ({
      ...item,
      value: editingData[item.symbol] || item.value,
      correctedValue: editingData[item.symbol]
    }))

    const updatedTask: ReviewTask = {
      ...selectedTask,
      status: "approved",
      data: updatedData,
      reviewComment,
      reviewedBy: "当前用户",
      reviewedAt: new Date().toISOString()
    }

    setReviews(prev => prev.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ))

    localStorage.setItem("reviews", JSON.stringify(reviews.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    )))

    setIsReviewing(false)
    setSelectedTask(null)
  }

  const handleRejectTask = () => {
    if (!selectedTask) return

    const updatedTask: ReviewTask = {
      ...selectedTask,
      status: "rejected",
      reviewComment,
      reviewedBy: "当前用户",
      reviewedAt: new Date().toISOString()
    }

    setReviews(prev => prev.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ))

    localStorage.setItem("reviews", JSON.stringify(reviews.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    )))

    setIsReviewing(false)
    setSelectedTask(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning"><AlertCircle className="w-4 h-4 mr-1" /> 待审批</Badge>
      case "approved":
        return <Badge variant="success"><CheckCircle2 className="w-4 h-4 mr-1" /> 已通过</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-4 h-4 mr-1" /> 已拒绝</Badge>
      default:
        return null
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">数据审批</h1>
          <p className="text-sm text-muted-foreground">
            审批数据拉取任务的结果，确保数据的准确性
          </p>
        </div>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted">
              <th className="p-4 text-left">任务名称</th>
              <th className="p-4 text-left">类型</th>
              <th className="p-4 text-left">创建时间</th>
              <th className="p-4 text-left">状态</th>
              <th className="p-4 text-left">审批人</th>
              <th className="p-4 text-left">审批时间</th>
              <th className="p-4 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="p-4">{task.taskName}</td>
                <td className="p-4">{task.type}</td>
                <td className="p-4">{new Date(task.createdAt).toLocaleString()}</td>
                <td className="p-4">{getStatusBadge(task.status)}</td>
                <td className="p-4">{task.reviewedBy || "-"}</td>
                <td className="p-4">{task.reviewedAt ? new Date(task.reviewedAt).toLocaleString() : "-"}</td>
                <td className="p-4">
                  {task.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReviewTask(task)}
                    >
                      <History className="w-4 h-4 mr-2" />
                      审批
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isReviewing} onOpenChange={setIsReviewing}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>数据审批</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{selectedTask?.taskName}</h3>
                <p className="text-sm text-muted-foreground">
                  创建时间: {selectedTask?.createdAt}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={handleRejectTask}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  拒绝
                </Button>
                <Button
                  onClick={handleApproveTask}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  通过
                </Button>
              </div>
            </div>

            <div className="border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="p-4 text-left">代码</th>
                    <th className="p-4 text-left">名称</th>
                    <th className="p-4 text-right">数值</th>
                    <th className="p-4 text-right">涨跌幅</th>
                    <th className="p-4 text-left">状态</th>
                    <th className="p-4 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTask?.data.map((item) => (
                    <tr key={item.symbol} className="border-b">
                      <td className="p-4">{item.symbol}</td>
                      <td className="p-4">{item.name}</td>
                      <td className="p-4 text-right">
                        {editingData[item.symbol] !== undefined ? (
                          <Input
                            type="number"
                            value={editingData[item.symbol]}
                            onChange={(e) => handleUpdateValue(item.symbol, Number(e.target.value))}
                            className="w-32 text-right"
                          />
                        ) : (
                          item.value.toFixed(2)
                        )}
                      </td>
                      <td className={cn(
                        "p-4 text-right",
                        item.change > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {item.change > 0 ? "+" : ""}{item.change.toFixed(2)}%
                      </td>
                      <td className="p-4">
                        {item.isAbnormal ? (
                          <Badge variant="destructive">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            异常
                          </Badge>
                        ) : (
                          <Badge variant="success">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            正常
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        {item.isAbnormal && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateValue(item.symbol, item.value)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            修正
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <Label>审批意见</Label>
              <Input
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="请输入审批意见"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 