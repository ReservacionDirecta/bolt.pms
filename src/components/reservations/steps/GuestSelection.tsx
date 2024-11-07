import { useState } from 'react';

export function GuestSelection({ onUpdate }) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleUpdate = () => {
    const totalGuests = adults + children;
    onUpdate(totalGuests); // Actualiza el número total de huéspedes
  };

  return (
    <div>
      <h3>Seleccionar Huéspedes</h3>
      <div>
        <label>Adultos:</label>
        <input
          type="number"
          value={adults}
          onChange={(e) => {
            setAdults(Number(e.target.value));
            handleUpdate();
          }}
        />
      </div>
      <div>
        <label>Niños:</label>
        <input
          type="number"
          value={children}
          onChange={(e) => {
            setChildren(Number(e.target.value));
            handleUpdate();
          }}
        />
      </div>
    </div>
  );
} 