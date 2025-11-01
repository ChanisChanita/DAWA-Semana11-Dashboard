"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSettings, useLoading } from "@/context/AppContext"
import { AlertTriangle, CheckCircle, Settings, Save, User, Bell, Globe, Database } from "lucide-react"

export function SettingsForm() {
  const { settings, updateSettings } = useSettings()
  const { loading, setLoading } = useLoading()
  
  const [formData, setFormData] = useState(settings)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: string[] = []
    
    if (formData.projectsPerPage < 1 || formData.projectsPerPage > 50) {
      newErrors.push("Los proyectos por página deben estar entre 1 y 50")
    }
    
    if (formData.tasksPerPage < 1 || formData.tasksPerPage > 100) {
      newErrors.push("Las tareas por página deben estar entre 1 y 100")
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
        updateSettings(formData)
        setSuccess(true)
        setErrors([])
        
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } catch (error) {
        setErrors(["Error al guardar la configuración. Inténtalo de nuevo."])
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  const handleReset = () => {
    setFormData(settings)
    setErrors([])
    setSuccess(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <div>
          <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
          <p className="text-muted-foreground">
            Personaliza las preferencias de tu dashboard
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              ¡Configuración guardada exitosamente!
            </AlertDescription>
          </Alert>
        )}

        {/* Configuración de Apariencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Preferencias de Usuario
            </CardTitle>
            <CardDescription>
              Configura la apariencia y el idioma de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="theme">Tema</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => setFormData({ ...formData, theme: value as any })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="language">
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Idioma
                  </div>
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value as any })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Controla cuándo y cómo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificaciones en la App</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones en tiempo real dentro de la aplicación
                </p>
              </div>
              <Switch
                id="notifications"
                checked={formData.notifications}
                onCheckedChange={(checked) => setFormData({ ...formData, notifications: checked })}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailUpdates">Actualizaciones por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir resúmenes diarios y actualizaciones importantes por correo
                </p>
              </div>
              <Switch
                id="emailUpdates"
                checked={formData.emailUpdates}
                onCheckedChange={(checked) => setFormData({ ...formData, emailUpdates: checked })}
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configuración de Datos
            </CardTitle>
            <CardDescription>
              Personaliza la visualización de datos en las tablas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectsPerPage">
                  Proyectos por Página
                </Label>
                <Input
                  id="projectsPerPage"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.projectsPerPage}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    projectsPerPage: parseInt(e.target.value) || 1 
                  })}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Número de proyectos a mostrar por página (1-50)
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tasksPerPage">
                  Tareas por Página
                </Label>
                <Input
                  id="tasksPerPage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.tasksPerPage}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tasksPerPage: parseInt(e.target.value) || 1 
                  })}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Número de tareas a mostrar por página (1-100)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración
              </>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            disabled={loading}
          >
            Restablecer
          </Button>
        </div>
      </form>
    </div>
  )
}