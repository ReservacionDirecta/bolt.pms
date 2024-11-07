export const ES = {
  common: {
    actions: {
      add: 'Añadir',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      search: 'Buscar',
      filter: 'Filtrar'
    },
    status: {
      active: 'Activo',
      inactive: 'Inactivo',
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado'
    }
  },
  navigation: {
    dashboard: 'Inicio',
    calendar: 'Calendario',
    reservations: 'Reservas',
    rooms: 'Habitaciones',
    guests: 'Huéspedes',
    rates: 'Tarifas',
    housekeeping: 'Limpieza',
    statistics: 'Estadísticas',
    settings: 'Configuración',
    more: 'Más'
  },
  reservations: {
    title: 'Reservas',
    subtitle: 'Gestiona las reservas del hotel',
    new: 'Nueva Reserva',
    table: {
      guest: 'Huésped',
      room: 'Habitación',
      checkIn: 'Entrada',
      checkOut: 'Salida',
      status: 'Estado',
      payment: 'Pago',
      total: 'Total',
      actions: 'Acciones'
    },
    status: {
      confirmed: 'Confirmada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
      checkedIn: 'Registrado',
      checkedOut: 'Finalizada'
    }
  },
  rates: {
    title: 'Gestión de Tarifas',
    subtitle: 'Configura las tarifas por habitación y temporada',
    newRoom: 'Añadir Tipo de Habitación',
    stats: {
      averageRate: 'Tarifa Promedio',
      activeSeasons: 'Temporadas Activas',
      weekendPremium: 'Premium Fin de Semana'
    },
    table: {
      roomType: 'Tipo de Habitación',
      baseRate: 'Tarifa Base',
      weekendRate: 'Tarifa Fin de Semana',
      specialSeasons: 'Temporadas Especiales'
    },
    form: {
      roomName: 'Nombre del Tipo de Habitación',
      baseRate: 'Tarifa Base',
      weekendRate: 'Tarifa Fin de Semana',
      seasonName: 'Nombre de la Temporada',
      dateRange: 'Rango de Fechas',
      rate: 'Tarifa'
    }
  },
  validation: {
    required: 'Este campo es obligatorio',
    invalid: 'El valor ingresado no es válido',
    minLength: 'Debe tener al menos {min} caracteres',
    maxLength: 'Debe tener máximo {max} caracteres',
    email: 'Debe ser un correo electrónico válido',
    phone: 'Debe ser un número de teléfono válido',
    number: 'Debe ser un número válido',
    positive: 'Debe ser un número positivo',
    date: 'Debe ser una fecha válida',
    dateRange: 'La fecha final debe ser posterior a la fecha inicial'
  }
}

export const EN = {
  // ... (similar structure for English)
} 