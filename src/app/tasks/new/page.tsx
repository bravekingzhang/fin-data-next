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
      <h1 className="text-3xl font-bold mb-8">新建任务</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">任务名称</Label>
          <Input id="name" placeholder="请输入任务名称" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">数据类型</Label>
          <Select>
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
          <Label htmlFor="interval">更新间隔（分钟）</Label>
          <Input 
            id="interval" 
            type="number" 
            min="1" 
            placeholder="请输入更新间隔" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="days">历史数据天数</Label>
          <Input 
            id="days" 
            type="number" 
            min="1" 
            placeholder="请输入需要获取的历史数据天数" 
            required 
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "创建中..." : "创建任务"}
          </Button>
        </div>
      </form>
    </div>
  )
} 