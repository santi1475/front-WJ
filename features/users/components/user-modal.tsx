"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserForm } from "@/features/users/components/user-form"
import { userService } from "@/features/users/services/user.service"
import type { IUserManaged, IUserFormData } from "@/features/shared/types/user"

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: IUserManaged
  onSuccess: () => void
}

export function UserModal({ open, onOpenChange, user, onSuccess }: UserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: IUserFormData) {
    setIsLoading(true)
    setError(null)
    try {
      if (user) {
        await userService.update(user.id, data)
      } else {
        await userService.create(data)
      }
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <UserForm user={user} onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
