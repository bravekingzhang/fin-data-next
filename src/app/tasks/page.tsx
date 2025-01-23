"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlayCircle, StopCircle, RefreshCw, Trash2, Plus, Search } from "lucide-react"
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  name: string
  type: string
  status: "running" | "stopped" | "error"
  lastRun: string
  nextRun: string
  config: {
    interval: number
    symbols?: string[]
  }
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
  const [tasks] = useState<Task[]>([
    {
      id: "industry-task",
      name: "行业指数数据",
      type: "industry",
      status: "running",
      lastRun: "2024-01-23 14:30:00",
      nextRun: "2024-01-23 15:00:00",
      config: {
        interval: 30
      }
    },
    {
      id: "etf-task",
      name: "ETF数据",
      type: "etf",
      status: "running",
      lastRun: "2024-01-23 14:45:00",
      nextRun: "2024-01-23 15:00:00",
      config: {
        interval: 15
      }
    },
    {
      id: "stock-task",
      name: "股票数据 - AAPL",
      type: "stock",
      status: "running",
      lastRun: "2024-01-23 14:55:00",
      nextRun: "2024-01-23 15:00:00",
      config: {
        interval: 5,
        symbols: ["AAPL"]
      }
    }
  ])

  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStocks, setSelectedStocks] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")

  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false
    if (typeFilter !== "all" && task.type !== typeFilter) return false
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
      default:
        return null
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">任务管理</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新建任务
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建数据拉取任务</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>任务名称</Label>
                <Input placeholder="请输入任务名称" />
              </div>
              <div className="space-y-2">
                <Label>数据类型</Label>
                <Select onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择数据类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="industry">行业指数</SelectItem>
                    <SelectItem value="etf">ETF数据</SelectItem>
                    <SelectItem value="stock">股票数据</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>更新间隔（分钟）</Label>
                <Input type="number" min="1" placeholder="请输入更新间隔" />
              </div>
              {selectedType === "stock" && (
                <div className="space-y-2">
                  <Label>选择股票</Label>
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="搜索股票..." />
                    <CommandEmpty>未找到股票</CommandEmpty>
                    <CommandGroup>
                      {STOCKS.map((stock) => (
                        <CommandItem
                          key={stock.value}
                          onSelect={() => {
                            setSelectedStocks(prev => 
                              prev.includes(stock.value)
                                ? prev.filter(s => s !== stock.value)
                                : [...prev, stock.value]
                            )
                          }}
                        >
                          <div className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedStocks.includes(stock.value)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}>
                            <Plus className={cn(
                              "h-3 w-3",
                              selectedStocks.includes(stock.value) ? "opacity-100" : "opacity-0"
                            )} />
                          </div>
                          <span>{stock.value}</span>
                          <span className="ml-2 text-muted-foreground">{stock.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsCreating(false)}>创建任务</Button>
            </div>
          </DialogContent>
        </Dialog>
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
              <th className="p-4 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="p-4">{task.name}</td>
                <td className="p-4">{task.type}</td>
                <td className="p-4">{getStatusBadge(task.status)}</td>
                <td className="p-4">{task.lastRun}</td>
                <td className="p-4">{task.nextRun}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {task.status === "running" ? (
                      <Button variant="outline" size="sm">
                        <StopCircle className="w-4 h-4 mr-2" />
                        停止
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        启动
                      </Button>
                    )}
                    <Button variant="destructive" size="sm">
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
    </div>
  )
} 