'use client'

import { useState, useEffect } from 'react'
import { Input, Button, Select, SelectItem, Card, CardBody, Image } from '@nextui-org/react'
import { FaUpload, FaTrash } from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

interface RoomFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function RoomForm({ initialData, onSubmit, onCancel }: RoomFormProps) {
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    room_number: initialData?.room_number || '',
    name: initialData?.name || '',
    type: initialData?.type || 'single',
    status: initialData?.status || 'available',
    floor: initialData?.floor || '',
    rate_type: initialData?.rate_type || 'fixed',
    base_price: initialData?.base_price?.toString() || '0',
    max_occupancy: initialData?.max_occupancy?.toString() || '2',
    occupancy_rates: initialData?.occupancy_rates || [],
    description: initialData?.description || '',
    images: initialData?.images || []
  })

  useEffect(() => {
    if (formData.rate_type === 'occupancy') {
      const maxOcc = parseInt(formData.max_occupancy)
      if (!isNaN(maxOcc)) {
        const newRates = Array.from({ length: maxOcc }, (_, index) => {
          const guests = index + 1
          const existingRate = formData.occupancy_rates.find(r => r.guests === guests)
          return {
            guests,
            price: existingRate?.price || '0'
          }
        })
        setFormData(prev => ({
          ...prev,
          occupancy_rates: newRates
        }))
      }
    }
  }, [formData.max_occupancy, formData.rate_type])

  const roomTypes = [
    { value: 'single', label: 'Individual' },
    { value: 'double', label: 'Doble' },
    { value: 'twin', label: 'Twin' },
    { value: 'suite', label: 'Suite' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'family', label: 'Familiar' }
  ]

  const statusTypes = [
    { value: 'available', label: 'Disponible' },
    { value: 'occupied', label: 'Ocupada' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'cleaning', label: 'Limpieza' }
  ]

  const rateTypes = [
    { value: 'fixed', label: 'Tarifa por Habitación' },
    { value: 'occupancy', label: 'Tarifa por Ocupación' }
  ]

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'rate_type' && {
        occupancy_rates: value === 'occupancy' 
          ? Array.from({ length: parseInt(prev.max_occupancy) }, (_, i) => ({
              guests: i + 1,
              price: '0'
            }))
          : []
      })
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return
      }

      setUploading(true)
      const files = Array.from(e.target.files)
      const newImages = []

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} no es una imagen válida`)
          continue
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} es demasiado grande (máx. 5MB)`)
          continue
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `rooms/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('room-images')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Error uploading:', uploadError)
          toast.error(`Error al subir ${file.name}`)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('room-images')
          .getPublicUrl(filePath)

        newImages.push({
          url: publicUrl,
          path: filePath,
          main: formData.images.length === 0 && newImages.length === 0
        })
      }

      if (newImages.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }))
        toast.success('Imágenes subidas correctamente')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al procesar las imágenes')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageToDelete: { path: string; url: string }) => {
    try {
      const { error } = await supabase.storage
        .from('room-images')
        .remove([imageToDelete.path])

      if (error) {
        throw error
      }

      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.path !== imageToDelete.path)
      }))

      toast.success('Imagen eliminada correctamente')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar la imagen')
    }
  }

  const setMainImage = (selectedImage: { path: string }) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        main: img.path === selectedImage.path
      }))
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const processedData = {
        ...formData,
        rate_type: formData.rate_type,
        max_occupancy: parseInt(formData.max_occupancy),
        // Si es tarifa fija
        ...(formData.rate_type === 'fixed' && {
          base_price: parseFloat(formData.base_price) || 0,
          occupancy_rates: []
        }),
        // Si es tarifa por ocupación
        ...(formData.rate_type === 'occupancy' && {
          base_price: null,
          occupancy_rates: Array.from(
            { length: parseInt(formData.max_occupancy) },
            (_, i) => ({
              guests: i + 1,
              price: parseFloat(formData.occupancy_rates[i]?.price || '0')
            })
          )
        })
      }

      onSubmit(processedData)
    } catch (error) {
      console.error('Error processing form data:', error)
      toast.error('Error al procesar los datos del formulario')
    }
  }

  const handleOccupancyRateChange = (guests: number, price: string) => {
    setFormData(prev => ({
      ...prev,
      occupancy_rates: prev.occupancy_rates.map(rate => 
        rate.guests === guests ? { ...rate, price } : rate
      )
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Número de Habitación"
          value={formData.room_number}
          onChange={(e) => handleChange('room_number', e.target.value)}
          required
        />

        <Input
          label="Nombre de la Habitación"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Tipo de Habitación"
          selectedKeys={[formData.type]}
          onChange={(e) => handleChange('type', e.target.value)}
          required
        >
          {roomTypes.map((type) => (
            <SelectItem key={type.value} value={type.value} textValue={type.label}>
              {type.label}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Estado"
          selectedKeys={[formData.status]}
          onChange={(e) => handleChange('status', e.target.value)}
          required
        >
          {statusTypes.map((status) => (
            <SelectItem key={status.value} value={status.value} textValue={status.label}>
              {status.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Piso"
          value={formData.floor}
          onChange={(e) => handleChange('floor', e.target.value)}
          required
        />

        <Input
          type="number"
          label="Ocupación Máxima"
          value={formData.max_occupancy}
          onChange={(e) => handleChange('max_occupancy', e.target.value)}
          min="1"
          max="8"
          required
        />
      </div>

      <Card>
        <CardBody>
          <div className="space-y-4">
            <Select
              label="Tipo de Tarifa"
              selectedKeys={[formData.rate_type]}
              onChange={(e) => handleChange('rate_type', e.target.value)}
              required
            >
              {[
                { value: 'fixed', label: 'Tarifa por Habitación' },
                { value: 'occupancy', label: 'Tarifa por Ocupación' }
              ].map((rate) => (
                <SelectItem key={rate.value} value={rate.value} textValue={rate.label}>
                  {rate.label}
                </SelectItem>
              ))}
            </Select>

            {formData.rate_type === 'fixed' ? (
              <Input
                type="number"
                label="Precio por Noche"
                value={formData.base_price}
                onChange={(e) => handleChange('base_price', e.target.value)}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
                min="0"
                step="0.01"
                required
              />
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-default-500">Tarifas por Ocupación</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.occupancy_rates.map((rate) => (
                    <Input
                      key={rate.guests}
                      type="number"
                      label={`${rate.guests} ${rate.guests === 1 ? 'Huésped' : 'Huéspedes'}`}
                      value={rate.price}
                      onChange={(e) => handleOccupancyRateChange(rate.guests, e.target.value)}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  ))}
                </div>
                <p className="text-xs text-default-400 mt-2">
                  * Ingrese la tarifa por noche para cada cantidad de huéspedes
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <Input
        label="Descripción"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />

      <Card>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Imágenes de la Habitación</h3>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  as="span"
                  color="primary"
                  startContent={<FaUpload />}
                  isLoading={uploading}
                >
                  Subir Imágenes
                </Button>
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={image.url}
                    alt={`Room image ${index + 1}`}
                    className={`w-full h-40 object-cover rounded-lg ${
                      image.main ? 'ring-2 ring-primary' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    {!image.main && (
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => setMainImage(image)}
                      >
                        Principal
                      </Button>
                    )}
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => handleDeleteImage(image)}
                      isIconOnly
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {formData.images.length === 0 && (
              <p className="text-center text-default-400">
                No hay imágenes cargadas
              </p>
            )}
            <p className="text-xs text-default-400">
              * Formatos permitidos: JPG, PNG. Tamaño máximo: 5MB
            </p>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end gap-2">
        <Button color="danger" variant="light" onPress={onCancel}>
          Cancelar
        </Button>
        <Button color="primary" type="submit">
          {initialData ? 'Actualizar' : 'Crear'} Habitación
        </Button>
      </div>
    </form>
  )
}