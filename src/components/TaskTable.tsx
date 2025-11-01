"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { TaskForm } from "@/components/TaskForm"
import { useTasks, useTeamMembers, useProjects } from "@/context/AppContext"
import { Task } from "@/types"
import { Edit, Trash2, User, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

export function TasksTable() {
  const { tasks, deleteTask } = useTasks()
  const { teamMembers } = useTeamMembers()
  const { projects } = useProjects()
  
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  // Calcular paginación
  const totalPages = Math.ceil(tasks.length / tasksPerPage)
  const startIndex = (currentPage - 1) * tasksPerPage
  const endIndex = startIndex + tasksPerPage
  const currentTasks = tasks.slice(startIndex, endIndex)

  const handleTaskSelect = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId])
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(currentTasks.map(task => task.id))
    } else {
      setSelectedTasks([])
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTask(taskId)
      setSelectedTasks(selectedTasks.filter(id => id !== taskId))
    }
  }

  const getAssigneeName = (userId: string) => {
    const member = teamMembers.find(m => m.userId === userId)
    return member?.name || 'No asignado'
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name || 'Proyecto no encontrado'
  }

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: es })
  }

  const isOverdue = (date: Date) => {
    return new Date() > date
  }

  return (
    <div className="space-y-4">
      {/* Cabecera con botón para nueva tarea */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Tareas del Proyecto</h3>
          <p className="text-sm text-muted-foreground">
            Mostrando {currentTasks.length} de {tasks.length} tareas
          </p>
        </div>
        <TaskForm />
      </div>

      {/* Tabla de tareas */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedTasks.length === currentTasks.length && currentTasks.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Tarea</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Asignado a
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Fecha límite
                </div>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Calendar className="h-8 w-8 opacity-50" />
                    <p>No hay tareas disponibles</p>
                    <p className="text-sm">Crea la primera tarea para comenzar</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentTasks.map((task) => (
                <TableRow 
                  key={task.id}
                  className={selectedTasks.includes(task.id) ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={(checked) => handleTaskSelect(task.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px]">
                    <div className="truncate" title={task.description}>
                      {task.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getProjectName(task.projectId)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getAssigneeName(task.userId)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm ${isOverdue(task.dateline) && task.status !== 'Completado' ? 'text-destructive font-medium' : ''}`}>
                      {formatDate(task.dateline)}
                      {isOverdue(task.dateline) && task.status !== 'Completado' && (
                        <div className="text-xs text-destructive">Vencida</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <TaskForm task={task} isEditing={true} />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Información de tareas seleccionadas */}
      {selectedTasks.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedTasks.length} tarea{selectedTasks.length > 1 ? 's' : ''} seleccionada{selectedTasks.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline">
              Marcar como completadas
            </Button>
            <Button size="sm" variant="outline">
              Cambiar asignación
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => {
                if (confirm(`¿Eliminar ${selectedTasks.length} tareas seleccionadas?`)) {
                  selectedTasks.forEach(taskId => deleteTask(taskId))
                  setSelectedTasks([])
                }
              }}
            >
              Eliminar seleccionadas
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
