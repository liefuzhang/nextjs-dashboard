import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function CustomerCardSkeleton() {
  return (
    <Card className="relative">
      <CardContent className="p-6">
        {/* Dropdown menu skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton className="h-8 w-8" />
        </div>
        
        <div className="flex items-start gap-4">
          {/* Avatar skeleton */}
          <Skeleton className="w-16 h-16 rounded-full" />
          
          <div className="flex-1 space-y-2 pr-8">
            {/* Name and badge */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            
            {/* Email */}
            <Skeleton className="h-4 w-48" />
            
            {/* Phone */}
            <Skeleton className="h-4 w-36" />
            
            {/* Company and location */}
            <div className="pt-2 space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CustomerCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <CustomerCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CustomerTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      <Table>
        <TableCaption>
          <Skeleton className="h-4 w-32 mx-auto" />
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="w-8 h-8 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-36" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function CustomerHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {/* View toggle skeleton */}
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-4 w-12" />
        
        {/* Filter dropdown skeleton */}
        <Skeleton className="h-9 w-24" />
        
        {/* Sort dropdown skeleton */}
        <Skeleton className="h-9 w-28" />
      </div>
      
      {/* Add button skeleton */}
      <Skeleton className="h-10 w-32" />
    </div>
  )
}