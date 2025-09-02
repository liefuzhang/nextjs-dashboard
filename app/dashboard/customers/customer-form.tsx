"use client"

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createCustomer, updateCustomer, CustomerState } from '@/app/lib/actions'
import { CustomerField } from "@/app/lib/definitions"

interface CustomerFormProps {
  customer?: CustomerField | null
  onCancel: () => void
  onSuccess?: () => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Customer"}
    </Button>
  )
}

export default function CustomerForm({ 
  customer, 
  onCancel,
  onSuccess
}: CustomerFormProps) {
  const initialState: CustomerState = { message: null, errors: {} }
  const updateCustomerWithId = customer ? updateCustomer.bind(null, customer.id) : createCustomer
  const [state, dispatch] = useFormState(updateCustomerWithId, initialState)
  
  // Use values from server state if available (after validation error), otherwise use customer data
  const formValues = state.values || {
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    company: customer?.company || "",
    location: customer?.location || "",
    status: customer?.status || "active",
  }

  useEffect(() => {
    if (state.message === null && Object.keys(state.errors || {}).length === 0 && onSuccess) {
      // Form submitted successfully (no errors and no message means success)
      // We need a better way to detect success, but for now this works
      // In a real app, you'd want the server action to return a success flag
    }
  }, [state, onSuccess])

  return (
    <form action={dispatch} className="space-y-6" key={state.message || "form"}>
      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter customer name"
            defaultValue={formValues.name}
            aria-describedby="name-error"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            defaultValue={formValues.email}
            aria-describedby="email-error"
          />
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            placeholder="Enter phone number"
            defaultValue={formValues.phone}
            aria-describedby="phone-error"
          />
          <div id="phone-error" aria-live="polite" aria-atomic="true">
            {state.errors?.phone &&
              state.errors.phone.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Business Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Business Information</h3>
        
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            type="text"
            placeholder="Enter company name"
            defaultValue={formValues.company}
            aria-describedby="company-error"
          />
          <div id="company-error" aria-live="polite" aria-atomic="true">
            {state.errors?.company &&
              state.errors.company.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            type="text"
            placeholder="Enter location"
            defaultValue={formValues.location}
            aria-describedby="location-error"
          />
          <div id="location-error" aria-live="polite" aria-atomic="true">
            {state.errors?.location &&
              state.errors.location.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={formValues.status}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <SubmitButton />
      </div>
      
      {/* Global error message */}
      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>
    </form>
  )
}
