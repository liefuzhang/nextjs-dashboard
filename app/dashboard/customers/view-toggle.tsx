"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CustomerField } from "@/app/lib/definitions"
import CustomersTable from "./customers-table"

type ViewType = 'cards' | 'table'

export default function ViewToggle({ customers }: { customers: CustomerField[] }) {
  const [viewType, setViewType] = useState<ViewType>('cards')

  // Load saved preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customers-view')
    if (saved === 'cards' || saved === 'table') {
      setViewType(saved)
    }
  }, [])

  // Save preference to localStorage
  const handleViewChange = (checked: boolean) => {
    const newView: ViewType = checked ? 'table' : 'cards'
    setViewType(newView)
    localStorage.setItem('customers-view', newView)
  }

  return (
    <div>
      {/* Toggle UI */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className={`text-sm font-medium ${viewType === 'cards' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Cards
          </span>
          <Switch
            checked={viewType === 'table'}
            onCheckedChange={handleViewChange}
          />
          <span className={`text-sm font-medium ${viewType === 'table' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Table
          </span>
        </div>
      </div>

      {/* Conditional rendering */}
      {viewType === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={customer.image_url} alt={customer.name} />
                    <AvatarFallback>
                      {customer.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{customer.name}</h3>
                      <Badge
                        variant={
                          customer.status === "active" ? "default" : "secondary"
                        }
                      >
                        {customer.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                    <div className="pt-2">
                      <p className="text-sm font-medium">{customer.company}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.location}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <CustomersTable customers={customers} />
      )}
    </div>
  )
}