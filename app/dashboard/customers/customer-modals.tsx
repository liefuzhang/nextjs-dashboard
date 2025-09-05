"use client"

import { useState } from 'react'
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { CustomerField } from "@/app/lib/definitions"
import { useDeleteCustomer } from "@/app/lib/queries"
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
            Update {customer?.name}&apos;s information.
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
  const deleteMutation = useDeleteCustomer()

  const handleDelete = async () => {
    if (!customer?.id) return
    
    deleteMutation.mutate(customer.id, {
      onSuccess: (result) => {
        if (result?.message && !result.message.includes('Error')) {
          toast.success(`${customer.name} has been deleted successfully.`)
          onOpenChange(false)
        } else {
          toast.error(result?.message || "Failed to delete customer. Please try again.")
        }
      },
      onError: (error) => {
        console.error('Failed to delete customer:', error)
        toast.error("Failed to delete customer. Please try again.")
      }
    })
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
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Customer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}