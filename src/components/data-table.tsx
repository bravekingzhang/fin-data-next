"use client"

import { useEffect, useState, useCallback } from 'react'
import { DataPoint } from '@/types/financial'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'

interface DataTableProps {
  type: 'industry' | 'etf' | 'stock'
}

export function DataTable({ type }: DataTableProps) {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/data?type=${type}&days=30`)
      const json = await response.json()
      setData(json.data)
      setError(null)
    } catch (err) {
      console.log(err);
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [type])

  const handleFixData = async (id: string) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: 'fixed' }),
      })
      await fetchData()
    } catch  {
      setError('Failed to fix data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [type,fetchData])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
        <Button onClick={fetchData} variant="outline" className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'anomaly':
        return <Badge variant="destructive"><AlertTriangle className="w-4 h-4 mr-1" /> Anomaly</Badge>
      case 'fixed':
        return <Badge variant="success"><CheckCircle className="w-4 h-4 mr-1" /> Fixed</Badge>
      default:
        return <Badge variant="secondary">Normal</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {type.charAt(0).toUpperCase() + type.slice(1)} Data
        </h2>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted">
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Symbol</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-4">{item.timestamp}</td>
                <td className="p-4">{(item.data).symbol}</td>
                <td className="p-4">{getStatusBadge(item.status)}</td>
                <td className="p-4">
                  {item.status === 'anomaly' && (
                    <Button
                      onClick={() => handleFixData(item.id)}
                      variant="outline"
                      size="sm"
                    >
                      Fix Data
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
