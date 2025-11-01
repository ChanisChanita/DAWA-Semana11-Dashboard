# Dashboard de Proyectos DAWA - Semana 11

Sistema de gestión de proyectos y tareas desarrollado con Next.js 15 y shadcn/ui, implementando todas las funcionalidades requeridas para la asignación DAWA Semana 11.

## 🚀 Características Implementadas

### ✅ Componentes shadcn/ui Requeridos:
- **Spinner**: Componente de carga utilizado en formularios y operaciones async
- **Alert**: Sistema de alertas para notificaciones y errores
- **Calendar**: Selector de fechas integrado en formularios de equipo y tareas
- **Pagination**: Navegación por páginas en tablas de datos

### ✅ Sistema de Temas:
- **Tema Claro/Oscuro**: Implementación completa con soporte para:
  - Tema claro
  - Tema oscuro  
  - Detección automática del sistema
- **Botón de cambio**: Toggle rápido en el header del dashboard
- **Configuración**: Control completo desde el panel de configuración

### ✅ Gestión de Estado Global:
- **React Context + useReducer**: Estado centralizado para toda la aplicación
- **CRUD Completo**: Operaciones completas para proyectos, equipo y tareas
- **Persistencia**: Estado mantenido durante toda la sesión

### ✅ Dashboard Completo:
1. **Resumen**: Métricas dinámicas y estadísticas en tiempo real
2. **Proyectos**: Gestión completa con formularios y acciones
3. **Tareas**: Tabla paginada con CRUD y filtros
4. **Equipo**: Gestión de miembros con asignación a proyectos
5. **Configuración**: Panel de configuración del sistema y tema

### ✅ Funcionalidades Adicionales:
- **Tema personalizado**: Colores púrpura/violeta usando sistema oklch
- **Formularios avanzados**: Validación, estados de carga y manejo de errores
- **Componentes reutilizables**: Arquitectura modular y escalable
- **TypeScript**: Tipado completo para mayor robustez
- **Responsive**: Diseño adaptativo para diferentes dispositivos

## 🛠️ Tecnologías

- **Next.js 15** - Framework React con App Router
- **shadcn/ui** - Biblioteca de componentes UI
- **Tailwind CSS** - Framework de estilos con tema personalizado
- **TypeScript** - Tipado estático
- **React Context** - Gestión de estado global
- **date-fns** - Manejo de fechas para calendar
- **Lucide React** - Iconografía moderna

## 🚀 Instalación y Uso

### Instalar dependencias:
```bash
npm install
```

### Ejecutar en desarrollo:
```bash
npm run dev
```

### Construir para producción:
```bash
npm run build
```

### Iniciar servidor de producción:
```bash
npm start
```

Abre [http://localhost:3000/dashboard](http://localhost:3000/dashboard) para ver la aplicación.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard principal con 5 pestañas
│   ├── globals.css           # Estilos globales y variables de tema
│   └── layout.tsx            # Layout principal con providers
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   ├── ProjectForm.tsx       # Formulario de proyectos
│   ├── TeamMemberForm.tsx    # Formulario de miembros del equipo
│   ├── TaskTable.tsx         # Tabla de tareas con paginación
│   ├── SettingsForm.tsx      # Configuración del sistema
│   ├── ThemeToggle.tsx       # Botón de cambio de tema
│   └── ThemeProvider.tsx     # Proveedor de tema
├── context/
│   └── AppContext.tsx        # Estado global con React Context
├── hooks/
│   └── useTheme.ts           # Hook personalizado para tema
├── types/
│   └── index.ts              # Definiciones de tipos TypeScript
└── lib/
    └── utils.ts              # Utilidades y helpers
```

## 🎨 Sistema de Temas

El sistema de temas soporta tres modalidades:

1. **Claro**: Tema claro por defecto
2. **Oscuro**: Tema oscuro con alta legibilidad
3. **Sistema**: Detección automática de la preferencia del sistema operativo

### Cambiar Tema:
- **Botón rápido**: Icono en el header del dashboard
- **Configuración**: Panel completo en la pestaña "Configuración"

## 🧩 Componentes shadcn/ui Utilizados

- `Button`, `Card`, `Input`, `Label`, `Select`
- `Tabs`, `Badge`, `Avatar`, `Switch`
- `Dialog`, `Form`, `Alert`, `Calendar`
- `Spinner`, `Pagination`, `Dropdown Menu`

## 📊 Funcionalidades CRUD

### Proyectos:
- ✅ Crear nuevos proyectos con categorías y prioridades
- ✅ Editar información y progreso
- ✅ Eliminar proyectos con confirmación
- ✅ Asignar miembros del equipo

### Equipo:
- ✅ Registrar miembros con información completa
- ✅ Asignar a proyectos específicos
- ✅ Gestionar estado activo/inactivo
- ✅ Formulario con calendar para fecha de nacimiento

### Tareas:
- ✅ Crear tareas asignadas a proyectos y usuarios
- ✅ Estados: Pendiente, En progreso, Completado
- ✅ Prioridades: Baja, Media, Alta, Urgente
- ✅ Tabla paginada con navegación

## 🔧 Configuración

Panel de configuración completo con:
- **Tema**: Claro/Oscuro/Sistema
- **Idioma**: Español/Inglés
- **Notificaciones**: Activar/Desactivar
- **Paginación**: Configurar elementos por página
- **Email**: Configurar actualizaciones por correo

## 🎯 Estado del Proyecto

**✅ COMPLETADO**: Todos los requisitos de la asignación DAWA Semana 11 han sido implementados exitosamente.

- ✅ Componentes shadcn/ui (Spinner, Alert, Calendar, Pagination)
- ✅ Cambio de tema (Claro/Oscuro/Sistema) 
- ✅ Estado global con React Context
- ✅ CRUD completo para Proyectos, Equipo y Tareas
- ✅ Dashboard con 5 pestañas funcionales
- ✅ Formularios con validación
- ✅ Tema personalizado púrpura/violeta
- ✅ Métricas dinámicas en tiempo real
