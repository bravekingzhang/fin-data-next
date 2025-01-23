"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Moon, Sun, BellRing, Mail, MessageSquare } from "lucide-react"

type AlertType = "email" | "sms" | "webhook"

interface AlertContact {
  id: string
  name: string
  type: AlertType
  value: string
  enabled: boolean
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [alertContacts, setAlertContacts] = useState<AlertContact[]>([
    {
      id: "1",
      name: "系统管理员",
      type: "email",
      value: "admin@example.com",
      enabled: true
    },
    {
      id: "2",
      name: "运维团队",
      type: "webhook",
      value: "https://api.example.com/alerts",
      enabled: true
    }
  ])

  const handleAddContact = () => {
    const newContact: AlertContact = {
      id: Date.now().toString(),
      name: "",
      type: "email",
      value: "",
      enabled: true
    }
    setAlertContacts([...alertContacts, newContact])
  }

  const handleRemoveContact = (id: string) => {
    setAlertContacts(alertContacts.filter(contact => contact.id !== id))
  }

  const handleUpdateContact = (id: string, updates: Partial<AlertContact>) => {
    setAlertContacts(alertContacts.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ))
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">系统设置</h1>

      <div className="space-y-8">
        {/* 主题设置 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">主题设置</h2>
          <div className="flex items-center gap-8">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="w-24"
            >
              <Sun className="w-4 h-4 mr-2" />
              浅色
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="w-24"
            >
              <Moon className="w-4 h-4 mr-2" />
              深色
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="w-24"
            >
              系统
            </Button>
          </div>
        </div>

        <Separator />

        {/* 告警设置 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">告警设置</h2>
            <Button onClick={handleAddContact}>
              添加联系人
            </Button>
          </div>

          <div className="space-y-4">
            {alertContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>联系人名称</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => handleUpdateContact(contact.id, { name: e.target.value })}
                        placeholder="请输入联系人名称"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>通知方式</Label>
                      <Select
                        value={contact.type}
                        onValueChange={(value: AlertType) => handleUpdateContact(contact.id, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              邮件通知
                            </div>
                          </SelectItem>
                          <SelectItem value="sms">
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              短信通知
                            </div>
                          </SelectItem>
                          <SelectItem value="webhook">
                            <div className="flex items-center">
                              <BellRing className="w-4 h-4 mr-2" />
                              Webhook
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      {contact.type === "email" ? "邮箱地址" : 
                       contact.type === "sms" ? "手机号码" : 
                       "Webhook URL"}
                    </Label>
                    <Input
                      value={contact.value}
                      onChange={(e) => handleUpdateContact(contact.id, { value: e.target.value })}
                      placeholder={
                        contact.type === "email" ? "请输入邮箱地址" :
                        contact.type === "sms" ? "请输入手机号码" :
                        "请输入Webhook URL"
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={contact.enabled}
                      onCheckedChange={(checked: boolean) => handleUpdateContact(contact.id, { enabled: checked })}
                    />
                    <Label>启用</Label>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 