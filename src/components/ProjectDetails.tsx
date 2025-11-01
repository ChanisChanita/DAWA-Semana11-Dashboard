"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTeamMembers } from "@/context/AppContext"
import { Project } from "@/types"
import { Eye, Calendar, Users, Target, BarChart3 } from "lucide-react"

interface ProjectDetailsProps {
  project: Project
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [open, setOpen] = useState(false)
  const { teamMembers } = useTeamMembers()

  const projectMembers = teamMembers.filter(member =>
    project.teamMembers.includes(member.userId)
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "default"
      case "En progreso":
        return "secondary"
      case "En revisión":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4 mr-1" />
          Ver detalles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {project.name}
          </DialogTitle>
          <DialogDescription>
            Información detallada del proyecto
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Descripción</h4>
              <p className="text-sm text-muted-foreground">
                {project.description || "Sin descripción"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Estado</h4>
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Prioridad</h4>
                <Badge variant={getPriorityColor(project.priority)}>
                  {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Progreso: {project.progress}%
              </h4>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Miembros del equipo */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Miembros del Equipo ({projectMembers.length})
            </h4>
            <div className="space-y-2">
              {projectMembers.map(member => (
                <div key={member.userId} className="flex items-center gap-3 p-2 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <Badge variant={member.isActive ? "default" : "secondary"} className="text-xs">
                    {member.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha de Creación
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(project.createdAt)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Última Actualización
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(project.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}