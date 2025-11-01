"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { useTeamMembers, useLoading } from "@/context/AppContext"
import { TeamMember } from "@/types"
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react"

interface DeleteTeamMemberProps {
  member: TeamMember
}

export function DeleteTeamMember({ member }: DeleteTeamMemberProps) {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { deleteTeamMember } = useTeamMembers()
  const { loading, setLoading } = useLoading()

  const handleDelete = async () => {
    setError("")
    setLoading(true)
    
    // Simular petición al backend
    setTimeout(() => {
      try {
        deleteTeamMember(member.userId)
        setSuccess(true)
        
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
        }, 1500)
      } catch (err) {
        setError("Error al eliminar el miembro. Inténtalo de nuevo.")
      } finally {
        setLoading(false)
      }
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Miembro
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El miembro será eliminado permanentemente del equipo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Alerta de error */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Alerta de éxito */}
          {success && (
            <Alert className="border-green-200 bg-green-50 mb-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Miembro eliminado exitosamente!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">
              ¿Estás seguro de que quieres eliminar a:
            </p>
            <div className="bg-muted p-3 rounded space-y-1">
              <p className="text-sm font-bold">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
              <p className="text-xs text-muted-foreground">{member.role} - {member.position}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Esto también puede afectar los proyectos en los que participa.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Miembro
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}