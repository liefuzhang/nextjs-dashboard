"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CustomerField } from "@/app/lib/definitions"
import { MoreVertical, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CustomerCardProps {
  customer: CustomerField
  onView: (customer: CustomerField) => void
  onEdit: (customer: CustomerField) => void
  onDelete: (customer: CustomerField) => void
}

export default function CustomerCard({ 
  customer, 
  onView, 
  onEdit, 
  onDelete 
}: CustomerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 relative">
      <CardContent className="p-6">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(customer)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(customer)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit customer
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => window.open(`mailto:${customer.email}`, '_blank')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send email
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => window.open(`tel:${customer.phone}`, '_self')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call customer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(customer)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={customer.image_url} alt={customer.name} />
            <AvatarFallback>
              {customer.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 pr-8">
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
  )
}