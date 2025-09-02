"use client"

import { useState } from 'react'
import { CustomerField } from "@/app/lib/definitions"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronUp, ChevronDown, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SortColumn = 'name' | 'email' | 'company' | 'status'
type SortDirection = 'asc' | 'desc'

// Helper component for sort indicators
const SortIcon = ({ column, currentSort, direction }: {
  column: SortColumn
  currentSort: SortColumn
  direction: SortDirection
}) => {
  if (currentSort !== column) return null
  
  return direction === 'asc' ? 
    <ChevronUp className="w-4 h-4 ml-2" /> : 
    <ChevronDown className="w-4 h-4 ml-2" />
}

interface CustomersTableProps {
  customers: CustomerField[]
  onView: (customer: CustomerField) => void
  onEdit: (customer: CustomerField) => void
  onDelete: (customer: CustomerField) => void
}

export default function CustomersTable({ 
  customers, 
  onView, 
  onEdit, 
  onDelete 
}: CustomersTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Same column - toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New column - start with asc
      setSortColumn(column)
      setSortDirection('asc')
    }
  }


  // Sort customers based on current sort column and direction
  const sortedCustomers = [...customers].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortColumn) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'email':
        aValue = a.email.toLowerCase()
        bValue = b.email.toLowerCase()
        break
      case 'company':
        aValue = a.company.toLowerCase()
        bValue = b.company.toLowerCase()
        break
      case 'status':
        // Sort active first, then inactive
        aValue = a.status === 'active' ? 0 : 1
        bValue = b.status === 'active' ? 0 : 1
        break
      default:
        return 0
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1
    }
    return 0
  })

  return (
    <div>
    <Table>
      <TableCaption>A list of customers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Avatar</TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort('name')}
          >
            <div className="flex items-center">
              Name
              <SortIcon column="name" currentSort={sortColumn} direction={sortDirection} />
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort('email')}
          >
            <div className="flex items-center">
              Email
              <SortIcon column="email" currentSort={sortColumn} direction={sortDirection} />
            </div>
          </TableHead>
          <TableHead>Phone</TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort('company')}
          >
            <div className="flex items-center">
              Company
              <SortIcon column="company" currentSort={sortColumn} direction={sortDirection} />
            </div>
          </TableHead>
          <TableHead>Location</TableHead>
          <TableHead 
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleSort('status')}
          >
            <div className="flex items-center">
              Status
              <SortIcon column="status" currentSort={sortColumn} direction={sortDirection} />
            </div>
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedCustomers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <Avatar className="w-8 h-8">
                <AvatarImage src={customer.image_url} alt={customer.name} />
                <AvatarFallback>
                  {customer.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>{customer.company}</TableCell>
            <TableCell>{customer.location}</TableCell>
            <TableCell>
              <Badge
                variant={
                  customer.status === "active" ? "default" : "secondary"
                }
              >
                {customer.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  )
}