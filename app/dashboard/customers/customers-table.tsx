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
import { ChevronUp, ChevronDown } from 'lucide-react'
import { EditCustomerModal, DeleteCustomerModal } from './customer-modals'

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

export default function CustomersTable({ customers }: { customers: CustomerField[] }) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerField | null>(null)
  
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

  // Action handlers
  const handleView = (customer: CustomerField) => {
    console.log('View customer:', customer.name)
  }

  const handleEdit = (customer: CustomerField) => {
    setSelectedCustomer(customer)
    setEditModalOpen(true)
  }

  const handleDelete = (customer: CustomerField) => {
    setSelectedCustomer(customer)
    setDeleteModalOpen(true)
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
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleView(customer)}
                >
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={() => handleEdit(customer)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(customer)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    
    {/* Modal components */}
    <EditCustomerModal
      open={editModalOpen}
      onOpenChange={setEditModalOpen}
      customer={selectedCustomer}
    />
    
    <DeleteCustomerModal
      open={deleteModalOpen}
      onOpenChange={setDeleteModalOpen}
      customer={selectedCustomer}
    />
  </div>
  )
}