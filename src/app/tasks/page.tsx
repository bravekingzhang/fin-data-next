"use client"

import { useState } from "react"
import {
  PlayCircle,
  StopCircle,
  RefreshCw,
  CheckCircle2,
  History,
  Trash2,
  Plus,
  Search,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface AlertContact {
  name: string
  email: string
  type: "email" | "sms" | "webhook"
}

interface Task {
  id: string
  name: string
  type: "industry" | "etf" | "stock"
  status: "running" | "stopped" | "error" | "completed"
  lastRun: string
  nextRun: string
  progress?: {
    current: number
    total: number
    currentSymbol?: string
  }
  config: {
    interval: number
    symbols?: string[]
    alertContacts: AlertContact[]
  }
}

interface DataItem {
  symbol: string
  name: string
  value: number
  change: number
  isAbnormal: boolean
  correctedValue?: number
}

const STOCKS = [
  { value: "AAPL", label: "Apple Inc." },
  { value: "MSFT", label: "Microsoft Corporation" },
  { value: "GOOGL", label: "Alphabet Inc." },
  { value: "AMZN", label: "Amazon.com, Inc." },
  { value: "META", label: "Meta Platforms, Inc." },
  { value: "TSLA", label: "Tesla, Inc." },
]

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "industry-task",
      name: "行业指数数据",
      type: "industry",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        alertContacts: [
          {
            name: "默认用户",
            email: "default@example.com",
            type: "email"
          }
        ]
      }
    },
    {
      id: "etf-task",
      name: "ETF数据",
      type: "etf",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        alertContacts: [
          {
            name: "默认用户",
            email: "default@example.com",
            type: "email"
          }
        ]
      }
    },
    {
      id: "stock-task",
      name: "股票数据",
      type: "stock",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        symbols: ["AAPL", "GOOGL", "MSFT"],
        alertContacts: [
          {
            name: "默认用户",
            email: "default@example.com",
            type: "email"
          }
        ]
      }
    }
  ])
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [updateInterval, setUpdateInterval] = useState<number>(5)
  const [selectedStocks, setSelectedStocks] = useState<string[]>([])
  const [alertContacts, setAlertContacts] = useState<AlertContact[]>([
    { name: "默认用户", email: "default@example.com", type: "email" }
  ])
  const [newContactName, setNewContactName] = useState("")
  const [newContactEmail, setNewContactEmail] = useState("")

  const filteredTasks = tasks.filter(task => {
    if (typeFilter !== "all" && task.type !== typeFilter) return false
    if (statusFilter !== "all" && task.status !== statusFilter) return false
    if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge variant="success"><PlayCircle className="w-4 h-4 mr-1" /> 运行中</Badge>
      case "stopped":
        return <Badge variant="secondary"><StopCircle className="w-4 h-4 mr-1" /> 已停止</Badge>
      case "error":
        return <Badge variant="destructive"><RefreshCw className="w-4 h-4 mr-1" /> 错误</Badge>
      case "completed":
        return <Badge variant="success"><CheckCircle2 className="w-4 h-4 mr-1" /> 已完成</Badge>
      default:
        return null
    }
  }

  const handleAddContact = () => {
    if (!newContactName || !newContactEmail) return

    setAlertContacts(prev => [
      ...prev,
      {
        name: newContactName,
        email: newContactEmail,
        type: "email"
      }
    ])

    setNewContactName("")
    setNewContactEmail("")
  }

  const handleRemoveContact = (index: number) => {
    setAlertContacts(prev => prev.filter((_, i) => i !== index))
  }

  const handleCreateTask = () => {
    if (!newTaskName || !selectedType) return

    const newTask: Task = {
      id: `${selectedType}-${Date.now()}`,
      name: newTaskName,
      type: selectedType as Task["type"],
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: updateInterval,
        alertContacts,
        ...(selectedType === "stock" ? { symbols: selectedStocks } : {})
      }
    }

    setTasks(prev => [...prev, newTask])
    setNewTaskName("")
    setSelectedType("")
    setUpdateInterval(5)
    setSelectedStocks([])
    setAlertContacts([{ name: "默认用户", email: "default@example.com", type: "email" }])
    setIsCreating(false)
  }

  const generateMockData = (type: string, symbol?: string): DataItem => {
    const baseValue = Math.random() * 1000
    const change = (Math.random() - 0.5) * 10
    const isAbnormal = Math.random() < 0.2

    return {
      symbol: symbol || `${type.toUpperCase()}-${Math.floor(Math.random() * 100)}`,
      name: `${type} ${symbol || Math.floor(Math.random() * 100)}`,
      value: baseValue,
      change,
      isAbnormal
    }
  }

  const handleStartTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    let total = 0
    if (task.type === "industry") total = 10
    else if (task.type === "etf") total = 20
    else if (task.type === "stock" && task.config.symbols) total = task.config.symbols.length

    const resultData: DataItem[] = []
    let currentIndex = 0

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: "running",
          lastRun: new Date().toLocaleString(),
          nextRun: new Date(Date.now() + t.config.interval * 60000).toLocaleString(),
          progress: {
            current: 0,
            total,
            currentSymbol: task.type === "stock" ? task.config.symbols?.[0] : undefined
          }
        }
      }
      return t
    }))

    const interval = setInterval(() => {
      if (currentIndex >= total) {
        clearInterval(interval)
        setTasks(prev => prev.map(task => {
          if (task.id === taskId) {
            // 创建审批任务
            const reviewId = `review-${Date.now()}`
            const reviewTask = {
              id: reviewId,
              taskId: task.id,
              taskName: task.name,
              type: task.type,
              status: "pending",
              createdAt: new Date().toISOString(),
              data: resultData
            }

            // 将审批任务数据保存到本地存储
            const reviews = JSON.parse(localStorage.getItem("reviews") || "[]")
            localStorage.setItem("reviews", JSON.stringify([...reviews, reviewTask]))

            return {
              ...task,
              status: "completed" as const,
              progress: undefined
            }
          }
          return task
        }))
        return
      }

      const symbol = task.type === "stock" ? task.config.symbols?.[currentIndex] : undefined
      const newData = generateMockData(task.type, symbol)
      resultData.push(newData)

      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            progress: {
              current: currentIndex + 1,
              total,
              currentSymbol: task.type === "stock" ? task.config.symbols?.[currentIndex + 1] : undefined
            }
          }
        }
        return t
      }))

      currentIndex++
    }, 2000)
  }

  const handleStopTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: "stopped",
          progress: undefined
        }
      }
      return task
    }))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">任务管理</h1>
          <p className="text-sm text-muted-foreground">
            管理数据拉取任务，配置更新频率和通知设置
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新建任务
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="running">运行中</SelectItem>
            <SelectItem value="stopped">已停止</SelectItem>
            <SelectItem value="error">错误</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="类型筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="industry">行业指数</SelectItem>
            <SelectItem value="etf">ETF数据</SelectItem>
            <SelectItem value="stock">股票数据</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted">
              <th className="p-4 text-left">任务名称</th>
              <th className="p-4 text-left">类型</th>
              <th className="p-4 text-left">状态</th>
              <th className="p-4 text-left">上次运行</th>
              <th className="p-4 text-left">下次运行</th>
              <th className="p-4 text-left">更新频率</th>
              <th className="p-4 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="p-4">{task.name}</td>
                <td className="p-4">{task.type}</td>
                <td className="p-4">
                  {getStatusBadge(task.status)}
                  {task.progress && (
                    <div className="mt-2">
                      <Progress value={(task.progress.current / task.progress.total) * 100} />
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.progress.currentSymbol ? `处理: ${task.progress.currentSymbol}` : null}
                        {task.progress.current}/{task.progress.total}
                      </p>
                    </div>
                  )}
                </td>
                <td className="p-4">{task.lastRun}</td>
                <td className="p-4">{task.nextRun}</td>
                <td className="p-4">{task.config.interval}分钟</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {task.status === "running" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStopTask(task.id)}
                      >
                        <StopCircle className="w-4 h-4 mr-2" />
                        停止
                      </Button>
                    ) : task.status === "completed" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/reviews")}
                      >
                        <History className="w-4 h-4 mr-2" />
                        查看审批
                      </Button>
                    ) : task.status === "stopped" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartTask(task.id)}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        启动
                      </Button>
                    ) : null}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>任务名称</Label>
              <Input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="请输入任务名称"
              />
            </div>

            <div className="space-y-2">
              <Label>任务类型</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择任务类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="industry">行业指数</SelectItem>
                  <SelectItem value="etf">ETF数据</SelectItem>
                  <SelectItem value="stock">股票数据</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>更新频率（分钟）</Label>
              <Input
                type="number"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Number(e.target.value))}
                min={1}
              />
            </div>

            {selectedType === "stock" && (
              <div className="space-y-2">
                <Label>选择股票</Label>
                <Command>
                  <CommandInput placeholder="搜索股票..." />
                  <CommandEmpty>未找到股票</CommandEmpty>
                  <CommandGroup>
                    {STOCKS.map(stock => (
                      <CommandItem
                        key={stock.value}
                        onSelect={() => {
                          setSelectedStocks(prev => {
                            if (prev.includes(stock.value)) {
                              return prev.filter(s => s !== stock.value)
                            }
                            return [...prev, stock.value]
                          })
                        }}
                      >
                        <div className={cn(
                          "mr-2",
                          selectedStocks.includes(stock.value) ? "text-primary" : ""
                        )}>
                          {selectedStocks.includes(stock.value) ? "✓" : ""}
                        </div>
                        {stock.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>通知联系人</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddContact}
                  disabled={!newContactName || !newContactEmail}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  添加联系人
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="姓名"
                />
                <Input
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  placeholder="邮箱"
                />
              </div>
              <div className="space-y-2">
                {alertContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleCreateTask}
                disabled={!newTaskName || !selectedType}
              >
                创建
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}