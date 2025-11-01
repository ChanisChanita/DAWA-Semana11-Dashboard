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
import { useProjects, useLoading } from "@/context/AppContext"
import { Project } from "@/types"
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react"

interface DeleteProjectProps {
  project: Project
}

export function DeleteProject({ project }: DeleteProjectProps) {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { deleteProject } = useProjects()
  const { loading, setLoading } = useLoading()

  const handleDelete = async () => {
    setError("")
    setLoading(true)
    
    // Simular petición al backend
    setTimeout(() => {
      try {
        deleteProject(project.id)
        setSuccess(true)
        
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
        }, 1500)
      } catch (err) {
        setError("Error al eliminar el proyecto. Inténtalo de nuevo.")
      } finally {
        setLoading(false)
      }
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4 mr-1" />
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Proyecto
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
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
                ¡Proyecto eliminado exitosamente!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">
              ¿Estás seguro de que quieres eliminar el proyecto:
            </p>
            <p className="text-sm font-bold bg-muted p-2 rounded">
              "{project.name}"
            </p>
            <p className="text-sm text-muted-foreground">
              Esto también afectará todas las tareas asociadas a este proyecto.
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
                Eliminar Proyecto
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}