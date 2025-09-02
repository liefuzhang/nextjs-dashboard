"use client"

import { useState } from 'react'
import { CustomerField } from "@/app/lib/definitions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import CustomerForm from "./customer-form"
import { deleteCustomer } from '@/app/lib/actions'

// Add Customer Modal
interface AddCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCustomerModal({ open, onOpenChange }: AddCustomerModalProps) {
  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Create a new customer profile with their details.
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}

// Edit Customer Modal
interface EditCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: CustomerField | null
}

export function EditCustomerModal({ open, onOpenChange, customer }: EditCustomerModalProps) {
  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update {customer?.name}'s information.
          </DialogDescription>
        </DialogHeader>
        {customer && (
          <CustomerForm
            customer={customer}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

// Delete Customer Modal
interface DeleteCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: CustomerField | null
}

export function DeleteCustomerModal({ open, onOpenChange, customer }: DeleteCustomerModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!customer?.id) return
    
    setIsLoading(true)
    try {
      await deleteCustomer(customer.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete customer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{customer?.name}</strong>? 
            This action cannot be undone and will permanently remove their information.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deleting..." : "Delete Customer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}