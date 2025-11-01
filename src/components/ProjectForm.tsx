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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { useProjects, useTeamMembers, useLoading } from "@/context/AppContext"
import { AlertTriangle, CheckCircle, X } from "lucide-react"

export function ProjectForm() {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "",
  })

  const { addProject } = useProjects()
  const { teamMembers } = useTeamMembers()
  const { loading, setLoading } = useLoading()

  const validateForm = () => {
    const newErrors: string[] = []
    
    if (!formData.name.trim()) {
      newErrors.push("El nombre del proyecto es obligatorio")
    }
    
    if (!formData.category) {
      newErrors.push("Debe seleccionar una categoría")
    }
    
    if (!formData.priority) {
      newErrors.push("Debe seleccionar una prioridad")
    }
    
    if (selectedMembers.length === 0) {
      newErrors.push("Debe asignar al menos un miembro del equipo")
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
        addProject({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent',
          status: 'Planificado',
          progress: 0,
          teamMembers: selectedMembers,
        })
        
        setSuccess(true)
        setFormData({ name: "", description: "", category: "", priority: "" })
        setSelectedMembers([])
        setErrors([])
        
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
        }, 1500)
      } catch (error) {
        setErrors(["Error al crear el proyecto. Inténtalo de nuevo."])
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const removeMember = (memberId: string) => {
    setSelectedMembers(prev => prev.filter(id => id !== memberId))
  }

  const availableMembers = teamMembers.filter(member => member.isActive)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Alertas de error */}
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

            {/* Alerta de éxito */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ¡Proyecto creado exitosamente!
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Desarrollo Web</SelectItem>
                  <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                  <SelectItem value="design">Diseño</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">
                Prioridad <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>
                Miembros del Equipo <span className="text-red-500">*</span>
              </Label>
              
              {/* Miembros seleccionados */}
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/30">
                  {selectedMembers.map(memberId => {
                    const member = teamMembers.find(m => m.userId === memberId)
                    return member ? (
                      <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                        {member.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeMember(memberId)}
                        />
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
              
              {/* Selector de miembros */}
              <Select onValueChange={handleMemberToggle} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar miembros del equipo" />
                </SelectTrigger>
                <SelectContent>
                  {availableMembers.map(member => (
                    <SelectItem 
                      key={member.userId} 
                      value={member.userId}
                      disabled={selectedMembers.includes(member.userId)}
                    >
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
                  Creando...
                </>
              ) : (
                "Crear Proyecto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
