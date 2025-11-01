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
import { Switch } from "@/components/ui/switch"
import { useTeamMembers, useProjects, useLoading } from "@/context/AppContext"
import { TeamMember } from "@/types"
import { UserPlus, AlertTriangle, CheckCircle, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TeamMemberFormProps {
  member?: TeamMember
  isEditing?: boolean
}

export function TeamMemberForm({ member, isEditing = false }: TeamMemberFormProps) {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [formData, setFormData] = useState({
    userId: member?.userId || "",
    role: member?.role || "",
    name: member?.name || "",
    email: member?.email || "",
    position: member?.position || "",
    birthdate: member?.birthdate || new Date(),
    phone: member?.phone || "",
    projectId: member?.projectId || "",
    isActive: member?.isActive ?? true,
  })

  const { addTeamMember, updateTeamMember } = useTeamMembers()
  const { projects } = useProjects()
  const { loading, setLoading } = useLoading()

  const validateForm = () => {
    const newErrors: string[] = []
    
    if (!formData.name.trim()) {
      newErrors.push("El nombre es obligatorio")
    }
    
    if (!formData.email.trim()) {
      newErrors.push("El email es obligatorio")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push("El email no es válido")
    }
    
    if (!formData.role.trim()) {
      newErrors.push("El rol es obligatorio")
    }
    
    if (!formData.position.trim()) {
      newErrors.push("La posición es obligatoria")
    }
    
    if (!formData.phone.trim()) {
      newErrors.push("El teléfono es obligatorio")
    }

    if (!isEditing && !formData.userId.trim()) {
      newErrors.push("El ID de usuario es obligatorio")
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
        if (isEditing && member) {
          updateTeamMember({
            ...formData,
            createdAt: member.createdAt,
            updatedAt: new Date(),
          })
        } else {
          addTeamMember(formData)
        }
        
        setSuccess(true)
        if (!isEditing) {
          setFormData({
            userId: "",
            role: "",
            name: "",
            email: "",
            position: "",
            birthdate: new Date(),
            phone: "",
            projectId: "",
            isActive: true,
          })
        }
        setErrors([])
        
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
        }, 1500)
      } catch (error) {
        setErrors([`Error al ${isEditing ? 'actualizar' : 'crear'} el miembro. Inténtalo de nuevo.`])
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button size="sm" variant="outline">
            Editar
          </Button>
        ) : (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Miembro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Miembro del Equipo" : "Agregar Nuevo Miembro"}
            </DialogTitle>
            <DialogDescription>
              Completa la información del miembro del equipo.
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
                  ¡Miembro {isEditing ? 'actualizado' : 'creado'} exitosamente!
                </AlertDescription>
              </Alert>
            )}

            {/* Campos del formulario */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userId">
                  ID de Usuario <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userId"
                  placeholder="user123"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  disabled={loading || isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Nombre Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">
                  Teléfono <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="+34 600 123 456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">
                  Rol <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="role"
                  placeholder="Frontend Developer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">
                  Posición <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  placeholder="Senior Developer"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>
                Fecha de Nacimiento <span className="text-red-500">*</span>
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
                  {formData.birthdate ? format(formData.birthdate, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                </Button>
                {showCalendar && (
                  <div className="absolute top-full left-0 z-50 mt-1 bg-background border rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={formData.birthdate}
                      onSelect={(date) => {
                        if (date) {
                          setFormData({ ...formData, birthdate: date })
                          setShowCalendar(false)
                        }
                      }}
                      locale={es}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="projectId">Proyecto Asignado</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proyecto (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin proyecto asignado</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                disabled={loading}
              />
              <Label htmlFor="isActive">Miembro Activo</Label>
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
                isEditing ? 'Actualizar Miembro' : 'Crear Miembro'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}