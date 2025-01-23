import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">数据概览</h1>
      
      <Tabs defaultValue="industry" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="industry">行业指数</TabsTrigger>
          <TabsTrigger value="etf">ETF数据</TabsTrigger>
          <TabsTrigger value="stock">股票数据</TabsTrigger>
        </TabsList>
        
        <TabsContent value="industry">
          <DataTable type="industry" />
        </TabsContent>
        
        <TabsContent value="etf">
          <DataTable type="etf" />
        </TabsContent>
        
        <TabsContent value="stock">
          <DataTable type="stock" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
