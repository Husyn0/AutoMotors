// src/pages/TruckTypes.jsx
import React from 'react';
import CrudPage from '../components/common/CrudPage';
import truckTypesApi from '../api/truckTypesApi';

const initialFormData = { name: '', models: '', icon: '', description: '' };

/* ── Curated emoji set for the truck types this company services ──
 *  Poids lourds : Mercedes, Sinotruk, DAF, Renault
 *  Camionette   : Kia, Hyundai, Canter
 *  Plus a few generic truck / parts / trailer icons.
 */
const TRUCK_ICON_OPTIONS = [
  // ── Heavy trucks (poids lourds) ────────────────────────────
  { value: '🚛', label: 'Heavy Truck',        emoji: '🚛' },
  { value: '🚚', label: 'Delivery Truck',     emoji: '🚚' },
  { value: '🚜', label: 'Tractor / Heavy',    emoji: '🚜' },
  { value: '🛻', label: 'Pickup Truck',       emoji: '🛻' },
  { value: '🚐', label: 'Van / Camionette',   emoji: '🚐' },

  // ── Trailers & hauling ─────────────────────────────────────
  { value: '🚋', label: 'Trailer',            emoji: '🚋' },
  { value: '🚃', label: 'Wagon',              emoji: '🚃' },
  { value: '⛟',  label: 'Semi Truck',         emoji: '⛟' },
  { value: '🏗️', label: 'Construction',       emoji: '🏗️' },

  // ── Truck parts & service ──────────────────────────────────
  { value: '⚙️', label: 'Engine / Parts',     emoji: '⚙️' },
  { value: '🔧', label: 'Wrench / Service',   emoji: '🔧' },
  { value: '🔩', label: 'Bolts / Fittings',   emoji: '🔩' },
  { value: '🛞', label: 'Wheel / Tire',       emoji: '🛞' },
  { value: '🛢️', label: 'Oil / Lubricant',    emoji: '🛢️' },
  { value: '🔋', label: 'Battery',            emoji: '🔋' },
  { value: '💡', label: 'Lights / Electrical',emoji: '💡' },

  // ── Brand‑associated (visual stand‑ins) ────────────────────
  { value: '⭐', label: 'Mercedes (star)',    emoji: '⭐' },
  { value: '🔷', label: 'Renault (diamond)',  emoji: '🔷' },
  { value: '🟦', label: 'DAF (blue)',         emoji: '🟦' },
  { value: '🟩', label: 'Sinotruk (green)',   emoji: '🟩' },
  { value: '🟨', label: 'Kia (yellow)',       emoji: '🟨' },
  { value: '🟥', label: 'Hyundai (red)',      emoji: '🟥' },

  // ── Misc ───────────────────────────────────────────────────
  { value: '📦', label: 'Cargo / Box',        emoji: '📦' },
  { value: '🚧', label: 'Under Maintenance',  emoji: '🚧' },
];

const fields = [
  { name: 'name', type: 'text', placeholder: 'Truck Type Name', required: true },
  { name: 'models', type: 'text', placeholder: 'Models (comma separated)', required: true },
  {
    name: 'icon',
    type: 'select',
    placeholder: 'Icon',
    selectPlaceholder: 'Choose an icon…',
    emoji: true,
    options: TRUCK_ICON_OPTIONS,
  },
  {
    name: 'description',
    type: 'textarea',
    placeholder: 'Description',
    required: true,
    fullWidth: true,
  },
];

const columns = [
  {
    key: 'icon',
    label: 'Icon',
    className: 'icon-cell',
    render: (t) => t.icon || '🚛',
  },
  { key: 'name', label: 'Name' },
  { key: 'models', label: 'Models' },
  { key: 'description', label: 'Description', className: 'description-cell' },
];

const TruckTypes = () => (
  <CrudPage
    title="Truck Types Management"
    entityName="Truck Type"
    entityNamePlural="truck type"
    api={truckTypesApi}
    initialFormData={initialFormData}
    fields={fields}
    columns={columns}
  />
);

export default TruckTypes;