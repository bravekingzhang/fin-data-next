import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Financial Data Platform</h1>
      
      <Tabs defaultValue="industry" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="industry">Industry Indices</TabsTrigger>
          <TabsTrigger value="etf">ETF Data</TabsTrigger>
          <TabsTrigger value="stock">Stock Data</TabsTrigger>
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
    </main>
  )
}
