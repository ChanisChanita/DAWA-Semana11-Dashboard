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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { useTasks, useProjects, useTeamMembers, useLoading } from "@/context/AppContext"
import { Task } from "@/types"
import { Plus, Edit, AlertTriangle, CheckCircle, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TaskFormProps {
  task?: Task
  isEditing?: boolean
}

export function TaskForm({ task, isEditing = false }: TaskFormProps) {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [formData, setFormData] = useState({
    description: task?.description || "",
    projectId: task?.projectId || "",
    status: task?.status || "Pendiente",
    priority: task?.priority || "Media",
    userId: task?.userId || "",
    dateline: task?.dateline || new Date(),
  })

  const { addTask, updateTask } = useTasks()
  const { projects } = useProjects()
  const { teamMembers } = useTeamMembers()
  const { loading, setLoading } = useLoading()

  const validateForm = () => {
    const newErrors: string[] = []
    
    if (!formData.description.trim()) {
      newErrors.push("La descripción de la tarea es obligatoria")
    }
    
    if (!formData.projectId) {
      newErrors.push("Debe seleccionar un proyecto")
    }
    
    if (!formData.userId) {
      newErrors.push("Debe asignar la tarea a un miembro del equipo")
    }
    
    if (!formData.dateline || formData.dateline < new Date()) {
      newErrors.push("La fecha límite debe ser futura")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    // Simular petición al backend
    setTimeout(() => {
      try {
        if (isEditing && task) {
          updateTask({
            ...task,
            ...formData,
            updatedAt: new Date(),
          })
        } else {
          addTask(formData)
        }
        
        setSuccess(true)
        if (!isEditing) {
          setFormData({
            description: "",
            projectId: "",
            status: "Pendiente",
            priority: "Media",
            userId: "",
            dateline: new Date(),
          })
        }
        setErrors([])
        
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
        }, 1500)
      } catch (error) {
        setErrors([`Error al ${isEditing ? 'actualizar' : 'crear'} la tarea. Inténtalo de nuevo.`])
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  const activeMembers = teamMembers.filter(member => member.isActive)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Tarea" : "Crear Nueva Tarea"}
            </DialogTitle>
            <DialogDescription>
              Completa la información de la tarea.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Alertas */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ¡Tarea {isEditing ? 'actualizada' : 'creada'} exitosamente!
                </AlertDescription>
              </Alert>
            )}

            {/* Campos del formulario */}
            <div className="grid gap-2">
              <Label htmlFor="description">
                Descripción de la Tarea <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                placeholder="Implementar funcionalidad de login..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectId">
                  Proyecto <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="userId">
                  Asignado a <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeMembers.map(member => (
                      <SelectItem key={member.userId} value={member.userId}>
                        <div className="flex items-center gap-2">
                          <span>{member.name}</span>
                          <span className="text-sm text-muted-foreground">({member.role})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En progreso">En progreso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>
                Fecha Límite <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setShowCalendar(!showCalendar)}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateline ? format(formData.dateline, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                </Button>
                {showCalendar && (
                  <div className="absolute top-full left-0 z-50 mt-1 bg-background border rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={formData.dateline}
                      onSelect={(date) => {
                        if (date) {
                          setFormData({ ...formData, dateline: date })
                          setShowCalendar(false)
                        }
                      }}
                      locale={es}
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditing ? 'Actualizar Tarea' : 'Crear Tarea'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}