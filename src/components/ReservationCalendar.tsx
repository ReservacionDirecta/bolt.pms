'use client'

import { Card, CardBody, ButtonGroup, Button } from '@nextui-org/react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { useState, useRef } from 'react'

interface Reservation {
  id: string
  title: string
  start: string
  end: string
  roomId: string
  guestName: string
  status: 'confirmed' | 'pending' | 'checked-in' | 'checked-out'
}

const STATUS_COLORS = {
  confirmed: '#3B82F6', // Azul
  pending: '#F59E0B',   // Amarillo
  'checked-in': '#10B981', // Verde
  'checked-out': '#6B7280' // Gris
}

export function ReservationCalendar() {
  const calendarRef = useRef<any>(null)
  const [currentView, setCurrentView] = useState<'timeGridMonth' | 'timeGridWeek'>('timeGridWeek')
  
  const reservations: Reservation[] = [
    {
      id: '1',
      title: 'Juan Pérez',
      start: '2024-02-20T14:00:00',
      end: '2024-02-22T12:00:00',
      roomId: '101',
      guestName: 'Juan Pérez',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'María García',
      start: '2024-02-21T15:00:00',
      end: '2024-02-23T11:00:00',
      roomId: '102',
      guestName: 'María García',
      status: 'checked-in'
    }
  ]

  const handleViewChange = (viewType: 'timeGridMonth' | 'timeGridWeek') => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.changeView(viewType)
      setCurrentView(viewType)
    }
  }

  const handleDateClick = (arg: any) => {
    console.log('Fecha seleccionada:', arg.dateStr)
  }

  const handleEventClick = (arg: any) => {
    console.log('Reserva seleccionada:', arg.event)
  }

  return (
    <Card className="w-full h-[calc(100vh-8rem)]">
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <ButtonGroup variant="flat">
            <Button
              className={`px-4 ${currentView === 'timeGridWeek' ? 'bg-blue-500 text-white' : ''}`}
              onPress={() => handleViewChange('timeGridWeek')}
            >
              Semana
            </Button>
            <Button
              className={`px-4 ${currentView === 'timeGridMonth' ? 'bg-blue-500 text-white' : ''}`}
              onPress={() => handleViewChange('timeGridMonth')}
            >
              Mes
            </Button>
          </ButtonGroup>
        </div>
        
        <div className="h-[calc(100vh-12rem)]">
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView={currentView}
            locale={esLocale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
            events={reservations.map(res => ({
              ...res,
              backgroundColor: STATUS_COLORS[res.status],
              borderColor: STATUS_COLORS[res.status]
            }))}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={false}
            weekends={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={(arg) => (
              <div className="p-1 text-xs">
                <div className="font-semibold">{arg.event.title}</div>
                <div className="opacity-75 text-[10px]">
                  {arg.event.extendedProps.status}
                </div>
              </div>
            )}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            allDaySlot={false}
            height="100%"
            eventTextColor="#FFFFFF"
            slotDuration="01:00:00"
            expandRows={true}
            dayCellClassNames={(arg) => {
              return arg.date.getDay() === 0 || arg.date.getDay() === 6 
                ? 'weekend-day' 
                : ''
            }}
            views={{
              timeGridWeek: {
                type: 'timeGrid',
                duration: { weeks: 1 }
              },
              timeGridMonth: {
                type: 'timeGrid',
                duration: { months: 1 }
              }
            }}
            resourceAreaWidth="150px"
            resources={[
              { id: '101', title: 'Hab 101 - Individual' },
              { id: '102', title: 'Hab 102 - Doble' },
              { id: '103', title: 'Hab 103 - Suite' },
              { id: '104', title: 'Hab 104 - Familiar' },
              { id: '201', title: 'Hab 201 - Individual' },
              { id: '202', title: 'Hab 202 - Doble' },
              { id: '203', title: 'Hab 203 - Suite' },
              { id: '204', title: 'Hab 204 - Familiar' },
            ]}
            resourceAreaHeaderContent="Habitaciones"
            nowIndicator={true}
          />
        </div>
      </CardBody>
    </Card>
  )
} 