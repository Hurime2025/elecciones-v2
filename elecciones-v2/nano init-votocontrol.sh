#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# 🗳️ VOTOCONTROL PRO - Script de Inicialización de Proyecto
# ═══════════════════════════════════════════════════════════════

echo "🗳️  Iniciando creación de VotoControl Pro..."
echo ""

# Nombre del proyecto
PROJECT_NAME="votocontrol-pro"

# Crear directorio principal
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# ═══════════════════════════════════════════════════════════════
# 📁 CREAR ESTRUCTURA DE CARPETAS
# ═══════════════════════════════════════════════════════════════

echo "📁 Creando estructura de carpetas..."

mkdir -p public
mkdir -p src/apps/mobile/screens
mkdir -p src/apps/web/views
mkdir -p src/components/common
mkdir -p src/components/mobile
mkdir -p src/components/web
mkdir -p src/layouts
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/data
mkdir -p src/assets/images
mkdir -p src/assets/icons
mkdir -p src/assets/styles
mkdir -p src/config

echo "✅ Estructura de carpetas creada"
echo ""

# ═══════════════════════════════════════════════════════════════
# 📄 ARCHIVOS DE CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════

echo "📄 Creando archivos de configuración..."

# package.json
cat > package.json << 'EOF'
{
  "name": "votocontrol-pro",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5"
  }
}
EOF

# vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@apps': path.resolve(__dirname, './src/apps'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@context': path.resolve(__dirname, './src/context'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#0ea5e9',
      },
      fontFamily: {
        sans: ['Sora', 'DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
EOF

# postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# .env.example
cat > .env.example << 'EOF'
# API
VITE_API_BASE_URL=https://api.votocontrol.com
VITE_API_VERSION=v1

# Auth
VITE_JWT_SECRET=tu_secreto_aqui
VITE_TOKEN_EXPIRY=24h

# Mensajería
VITE_WHATSAPP_API_KEY=tu_api_key
VITE_SMS_PROVIDER=twilio

# App
VITE_APP_NAME=VotoControl Pro
VITE_REGION=Sucre
VITE_ELECTION_YEAR=2027
EOF

# .env
cat > .env << 'EOF'
VITE_API_BASE_URL=http://localhost:3001
VITE_API_VERSION=v1
VITE_APP_NAME=VotoControl Pro
VITE_REGION=Sucre
VITE_ELECTION_YEAR=2027
EOF

# .gitignore
cat > .gitignore << 'EOF'
node_modules
dist
.env
.env.local
.DS_Store
*.log
.vscode
.idea
EOF

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#060c1a" />
    <meta name="description" content="Plataforma Electoral VotoControl Pro - Sucre 2027" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <title>VotoControl Pro</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# public/manifest.json (PWA)
cat > public/manifest.json << 'EOF'
{
  "name": "VotoControl Pro",
  "short_name": "VotoControl",
  "description": "Plataforma de Gestión Electoral",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#060c1a",
  "theme_color": "#060c1a",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

echo "✅ Archivos de configuración creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🎨 ESTILOS GLOBALES
# ═══════════════════════════════════════════════════════════════

echo "🎨 Creando estilos globales..."

# src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #0ea5e9;
  --color-dark-bg: #060c1a;
  --color-dark-surface: #0d1b3e;
  --color-dark-border: #1e3a6e;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Sora', 'DM Sans', sans-serif;
  background-color: var(--color-dark-bg);
  color: #e2e8f0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #0d1b3e;
}

::-webkit-scrollbar-thumb {
  background: #1e3a6e;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3b82f6;
}

/* Utilidades */
.glass {
  background: rgba(13, 27, 62, 0.8);
  backdrop-filter: blur(10px);
}

.gradient-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.gradient-success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.gradient-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}
EOF

echo "✅ Estilos globales creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🔧 UTILIDADES Y CONSTANTES
# ═══════════════════════════════════════════════════════════════

echo "🔧 Creando utilidades y constantes..."

# src/utils/constants.js
cat > src/utils/constants.js << 'EOF'
// ═══════════════════════════════════════════════════════════════
// CONSTANTES GLOBALES - VotoControl Pro
// ═══════════════════════════════════════════════════════════════

export const ESTADO_META = {
  confirmado:    { label: "Confirmado",    color: "#10b981", bg: "#10b98120", icon: "✅" },
  pendiente:     { label: "Pendiente",     color: "#f59e0b", bg: "#f59e0b20", icon: "⏳" },
  no_contactado: { label: "Sin contacto",  color: "#6b7280", bg: "#6b728020", icon: "📵" },
};

export const NOVEDAD_TIPOS = [
  { k: "cambio_opinion", icon: "⚠️",  label: "Cambió de opinión",  color: "#ef4444" },
  { k: "traslado",       icon: "🚚",  label: "Se trasladó",        color: "#f59e0b" },
  { k: "fallecido",      icon: "🕊️",  label: "Falleció",           color: "#6b7280" },
  { k: "nuevo_apoyo",    icon: "🎉",  label: "Nuevo apoyo",        color: "#10b981" },
  { k: "sin_transporte", icon: "🚗",  label: "Sin transporte",     color: "#a78bfa" },
  { k: "otro",           icon: "📝",  label: "Otro",               color: "#64748b" },
];

export const ROLES = {
  COORDINADOR: 'coordinador',
  LIDER: 'lider',
  ADMIN: 'admin'
};

export const CANALES_MENSAJERIA = {
  WHATSAPP: { key: 'whatsapp', label: 'WhatsApp', color: '#25d366', icon: '💬' },
  SMS:      { key: 'sms',      label: 'SMS',      color: '#0ea5e9', icon: '📱' },
};

export const TIPOS_LIDER = {
  URBANO: { key: 'urbano', label: 'Urbano', icon: '🏙️', color: '#0ea5e9' },
  RURAL:  { key: 'rural',  label: 'Rural',  icon: '🌿', color: '#10b981' },
};

export const CARGOS = {
  GOBERNADOR:  { key: 'gobernador',  label: 'Gobernador',  color: '#f59e0b', icon: '🏛️' },
  ALCALDE:     { key: 'alcalde',     label: 'Alcalde',     color: '#3b82f6', icon: '🏙️' },
  CONCEJAL:    { key: 'concejal',    label: 'Concejal',    color: '#10b981', icon: '🗂️' },
  ASAMBLEISTA: { key: 'asambleista', label: 'Asambleísta', color: '#a78bfa', icon: '📜' },
};

export const APP_INFO = {
  name: import.meta.env.VITE_APP_NAME || 'VotoControl Pro',
  region: import.meta.env.VITE_REGION || 'Sucre',
  electionYear: import.meta.env.VITE_ELECTION_YEAR || '2027',
};

export const FORMATO_FECHA = {
  fecha: 'DD/MM/YYYY',
  hora: 'HH:mm',
  datetime: 'DD/MM/YYYY HH:mm',
};
EOF

# src/utils/helpers.js
cat > src/utils/helpers.js << 'EOF'
// ═══════════════════════════════════════════════════════════════
// FUNCIONES UTILITARIAS
// ═══════════════════════════════════════════════════════════════

export const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

export const fmt = (n) => n?.toLocaleString('es-CO') ?? '0';

export const fmtPhone = (phone) => {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) return `+57 ${clean.slice(0,3)} ${clean.slice(3,6)} ${clean.slice(6)}`;
  return phone;
};

export const fmtCedula = (cedula) => {
  if (!cedula) return '';
  return cedula.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const generarId = (prefix = 'ID') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const validarCedula = (cedula) => {
  const clean = cedula.replace(/\D/g, '');
  return clean.length >= 7 && clean.length <= 10;
};

export const validarTelefono = (phone) => {
  const clean = phone.replace(/\D/g, '');
  return clean.length >= 10 && clean.length <= 11;
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const descargarCSV = (data, filename = 'export.csv') => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const copiarAlPortapapeles = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (err) {
    return false;
  }
};

export const abrirWhatsApp = (phone, mensaje = '') => {
  const cleanPhone = phone.replace(/\D/g, '');
  const url = `https://wa.me/57${cleanPhone}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
};

export const abrirLlamada = (phone) => {
  window.location.href = `tel:${phone}`;
};
EOF

# src/utils/formatters.js
cat > src/utils/formatters.js << 'EOF'
// ═══════════════════════════════════════════════════════════════
// FORMATEADORES
// ═══════════════════════════════════════════════════════════════

export const formatNumero = (num, decimals = 0) => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPorcentaje = (valor, total, decimals = 0) => {
  const pct = total > 0 ? (valor / total) * 100 : 0;
  return `${pct.toFixed(decimals)}%`;
};

export const formatFecha = (fecha, formato = 'DD/MM/YYYY') => {
  const d = new Date(fecha);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  switch (formato) {
    case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
    case 'HH:mm': return `${hours}:${minutes}`;
    case 'DD/MM/YYYY HH:mm': return `${day}/${month}/${year} ${hours}:${minutes}`;
    default: return `${day}/${month}/${year}`;
  }
};

export const formatMoneda = (valor, moneda = 'COP') => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 0,
  }).format(valor);
};

export const truncarTexto = (texto, longitud = 50) => {
  if (!texto) return '';
  if (texto.length <= longitud) return texto;
  return texto.slice(0, longitud) + '...';
};

export const capitalizar = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

export const obtenerIniciales = (nombre) => {
  if (!nombre) return '??';
  const parts = nombre.trim().split(/\s+/);
  return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
};
EOF

echo "✅ Utilidades creadas"
echo ""

# ═══════════════════════════════════════════════════════════════
# 📊 DATOS MOCK (Migrados de los archivos originales)
# ═══════════════════════════════════════════════════════════════

echo "📊 Creando datos mock..."

# src/data/mockLideres.js
cat > src/data/mockLideres.js << 'EOF'
export const LIDERES = [
  { id: "L-01", nombre: "Franklyn Torres",    tipo: "urbano", zona: "Com. 1 – Centro",         candidatoId: "C-01", phone: "3001234567" },
  { id: "L-02", nombre: "Esperanza Jiménez",  tipo: "urbano", zona: "Com. 2 – Las Américas",   candidatoId: "C-01", phone: "3107654321" },
  { id: "L-03", nombre: "Reinaldo Pacheco",   tipo: "rural",  zona: "Vereda El Palmar",         candidatoId: "C-01", phone: "3204567890" },
  { id: "L-04", nombre: "Carmen Suárez",      tipo: "rural",  zona: "Vereda La Unión",          candidatoId: "C-02", phone: "3156789012" },
  { id: "L-05", nombre: "Julio César Reyes",  tipo: "urbano", zona: "Com. 3 – Venecia",         candidatoId: "C-04", phone: "3008901234" },
  { id: "L-06", nombre: "Patricia Angarita",  tipo: "rural",  zona: "Vereda San Pedro",         candidatoId: "C-07", phone: "3123456789" },
  { id: "L-07", nombre: "Deimer Herrera",     tipo: "urbano", zona: "Com. 4 – Villa Olímpica",  candidatoId: "C-01", phone: "3209871234" },
  { id: "L-08", nombre: "Nubia Cassiani",     tipo: "rural",  zona: "Vereda Palo Alto",         candidatoId: "C-03", phone: "3145678901" },
];

export const LIDER_ACTUAL = {
  id: "L-01",
  nombre: "Franklyn Torres",
  tipo: "urbano",
  zona: "Com. 1 – Centro / Com. 2 – Las Américas",
  phone: "3001234567",
  candidato: "Carlos Martínez Ruiz",
  cargo: "Alcalde",
  municipio: "Sincelejo",
  campañaId: "C-01",
  campañaColor: "#3b82f6",
};
EOF

# src/data/mockCandidatos.js
cat > src/data/mockCandidatos.js << 'EOF'
export const GOBERNADOR = {
  id: "GOB-1",
  nombre: "Eduardo Padilla Díaz",
  cargo: "Gobernador",
  depto: "Sucre",
  color: "#f59e0b",
  meta: 55000,
};

export const CANDIDATOS = [
  { id: "C-01", nombre: "Carlos Martínez Ruiz",    cargo: "Alcalde",     municipio: "Sincelejo",  color: "#3b82f6", meta: 16000 },
  { id: "C-02", nombre: "Yenis Álvarez Torres",    cargo: "Alcalde",     municipio: "Corozal",    color: "#06b6d4", meta: 10000 },
  { id: "C-03", nombre: "Hernando Soto Luna",      cargo: "Alcalde",     municipio: "San Marcos", color: "#0ea5e9", meta: 7500  },
  { id: "C-04", nombre: "Rosa Mendoza Pérez",      cargo: "Concejal",    municipio: "Sincelejo",  color: "#10b981", meta: 4000  },
  { id: "C-05", nombre: "Álvaro Díaz Herrera",     cargo: "Concejal",    municipio: "Sincelejo",  color: "#34d399", meta: 3500  },
  { id: "C-06", nombre: "Marta Salas Quintero",    cargo: "Concejal",    municipio: "Corozal",    color: "#6ee7b7", meta: 2200  },
  { id: "C-07", nombre: "Jorge Ríos Castellanos",  cargo: "Asambleísta", municipio: "Sucre",      color: "#a78bfa", meta: 6500  },
  { id: "C-08", nombre: "Lina Cure Montoya",       cargo: "Asambleísta", municipio: "Sucre",      color: "#c4b5fd", meta: 5000  },
];
EOF

# src/data/mockVotantes.js
cat > src/data/mockVotantes.js << 'EOF'
export const VOTANTES_BASE = [
  { id: "V-001", nombre: "María González",     cedula: "10234567", phone: "3001112233", barrio: "Centro",         puesto: "IE Simón Bolívar", mesa: "12", liderIds: ["L-01"], campañas: ["C-01", "C-04", "GOB"], estado: { "C-01": "confirmado", "C-04": "pendiente", "GOB": "confirmado" } },
  { id: "V-002", nombre: "Juan Rodríguez",     cedula: "10345678", phone: "3112223344", barrio: "Las Américas",   puesto: "IE Simón Bolívar", mesa: "07", liderIds: ["L-02"], campañas: ["C-01", "GOB"],       estado: { "C-01": "pendiente", "GOB": "pendiente" } },
  { id: "V-003", nombre: "Carmen Jiménez",     cedula: "10456789", phone: "3223334455", barrio: "Centro",         puesto: "IE La Esperanza",  mesa: "03", liderIds: ["L-01"], campañas: ["C-01", "C-04", "C-07", "GOB"], estado: { "C-01": "confirmado", "C-04": "confirmado", "C-07": "pendiente", "GOB": "confirmado" } },
  { id: "V-004", nombre: "Pedro Álvarez",      cedula: "10567890", phone: "3334445566", barrio: "Las Américas",   puesto: "IE Politécnico",   mesa: "21", liderIds: ["L-02"], campañas: ["C-01", "GOB"],       estado: { "C-01": "no_contactado", "GOB": "pendiente" } },
  { id: "V-005", nombre: "Rosa Martínez",      cedula: "10678901", phone: "3001234567", barrio: "Venecia",        puesto: "IE Simón Bolívar", mesa: "15", liderIds: ["L-05", "L-01"], campañas: ["C-01", "C-04", "GOB"], estado: { "C-01": "confirmado", "C-04": "confirmado", "GOB": "confirmado" } },
  { id: "V-006", nombre: "Luis Hernández",     cedula: "10789012", phone: "3123456789", barrio: "El Palmar",      puesto: "IE Rural",         mesa: "02", liderIds: ["L-03"], campañas: ["C-01", "GOB"],       estado: { "C-01": "confirmado", "GOB": "confirmado" } },
  { id: "V-007", nombre: "Ana Pérez Díaz",     cedula: "10890123", phone: "3145678901", barrio: "La Unión",       puesto: "IE Corozal",       mesa: "08", liderIds: ["L-04"], campañas: ["C-02", "C-06", "GOB"], estado: { "C-02": "confirmado", "C-06": "pendiente", "GOB": "confirmado" } },
  { id: "V-008", nombre: "Jorge Herrera",      cedula: "10901234", phone: "3156789012", barrio: "San Pedro",      puesto: "IE Rural 2",       mesa: "01", liderIds: ["L-06"], campañas: ["C-07", "GOB"],       estado: { "C-07": "confirmado", "GOB": "confirmado" } },
  { id: "V-009", nombre: "Luz Marina Castro",  cedula: "11012345", phone: "3167890123", barrio: "Palo Alto",      puesto: "IE Rural 3",       mesa: "05", liderIds: ["L-08"], campañas: ["C-03", "GOB"],       estado: { "C-03": "pendiente", "GOB": "pendiente" } },
  { id: "V-010", nombre: "Iván Díaz Polo",     cedula: "11123456", phone: "3178901234", barrio: "Villa Olímpica", puesto: "IE Politécnico",   mesa: "18", liderIds: ["L-07"], campañas: ["C-01", "C-04", "GOB"], estado: { "C-01": "confirmado", "C-04": "confirmado", "GOB": "confirmado" } },
  { id: "V-011", nombre: "Sandra López",       cedula: "11234567", phone: "3189012345", barrio: "Centro",         puesto: "IE Simón Bolívar", mesa: "11", liderIds: ["L-01", "L-05"], campañas: ["C-01", "C-04", "GOB"], estado: { "C-01": "confirmado", "C-04": "no_contactado", "GOB": "confirmado" } },
  { id: "V-012", nombre: "Carlos Ruiz Ortiz",  cedula: "11345678", phone: "3190123456", barrio: "Las Américas",   puesto: "IE La Esperanza",  mesa: "04", liderIds: ["L-02"], campañas: ["C-01", "GOB"],       estado: { "C-01": "no_contactado", "GOB": "no_contactado" } },
];

// Votantes específicos para el líder (migrado de LiderMovil.jsx)
export const VOTANTES_LIDER = [
  { id: "V-001", nombre: "María González",    cedula: "10234567", phone: "3001112233", barrio: "Centro",       puesto: "IE Simón Bolívar", mesa: "12", estado: "confirmado",    contactado: true,  notas: "Confirmó por WhatsApp el 04 Mar" },
  { id: "V-002", nombre: "Juan Rodríguez",    cedula: "10345678", phone: "3112223344", barrio: "Las Américas", puesto: "IE Simón Bolívar", mesa: "07", estado: "pendiente",     contactado: true,  notas: "No ha respondido aún" },
  { id: "V-003", nombre: "Carmen Jiménez",    cedula: "10456789", phone: "3223334455", barrio: "Centro",       puesto: "IE La Esperanza",  mesa: "03", estado: "confirmado",    contactado: true,  notas: "Muy comprometida, tiene 4 más" },
  { id: "V-004", nombre: "Pedro Álvarez",     cedula: "10567890", phone: "3334445566", barrio: "Las Américas", puesto: "IE Politécnico",   mesa: "21", estado: "no_contactado", contactado: false, notas: "" },
  { id: "V-005", nombre: "Rosa Martínez",     cedula: "10678901", phone: "3001234567", barrio: "Centro",       puesto: "IE Simón Bolívar", mesa: "15", estado: "confirmado",    contactado: true,  notas: "Trae 2 familiares el día E" },
  { id: "V-006", nombre: "Luis Hernández",    cedula: "10789012", phone: "3123456789", barrio: "El Palmar",    puesto: "IE Simón Bolívar", mesa: "11", estado: "pendiente",     contactado: true,  notas: "Duda entre candidatos" },
  { id: "V-007", nombre: "Ana Pérez Díaz",    cedula: "10890123", phone: "3145678901", barrio: "Centro",       puesto: "IE La Esperanza",  mesa: "04", estado: "no_contactado", contactado: false, notas: "" },
  { id: "V-008", nombre: "Iván Díaz Polo",    cedula: "11123456", phone: "3178901234", barrio: "Las Américas", puesto: "IE Politécnico",   mesa: "18", estado: "confirmado",    contactado: true,  notas: "Líder natural de su cuadra" },
  { id: "V-009", nombre: "Sandra López",      cedula: "11234567", phone: "3189012345", barrio: "Centro",       puesto: "IE Simón Bolívar", mesa: "11", estado: "confirmado",    contactado: true,  notas: "" },
  { id: "V-010", nombre: "Carlos Ruiz Ortiz", cedula: "11345678", phone: "3190123456", barrio: "Las Américas", puesto: "IE La Esperanza",  mesa: "04", estado: "no_contactado", contactado: false, notas: "Número sin WhatsApp, llamar" },
  { id: "V-011", nombre: "Luz Dary Caro",     cedula: "11456789", phone: "3201234567", barrio: "Centro",       puesto: "IE Simón Bolívar", mesa: "12", estado: "pendiente",     contactado: true,  notas: "Hablar con su esposo primero" },
  { id: "V-012", nombre: "Hernando Puerta",   cedula: "11567890", phone: "3212345678", barrio: "Las Américas", puesto: "IE Politécnico",   mesa: "21", estado: "confirmado",    contactado: true,  notas: "Confirmado, ya tiene transporte" },
];
EOF

# src/data/mockNovedades.js
cat > src/data/mockNovedades.js << 'EOF'
export const NOVEDADES = [
  { id: 1, liderId: "L-01", tipo: "cambio_opinion", votanteId: "V-004", msg: "Pedro Álvarez dudando de apoyar la candidatura",        fecha: "05 Mar 11:32", atendida: false },
  { id: 2, liderId: "L-02", tipo: "traslado",        votanteId: null,    msg: "3 votantes de Las Américas se mudaron a Corozal",       fecha: "04 Mar 09:15", atendida: false },
  { id: 3, liderId: "L-03", tipo: "fallecido",       votanteId: "V-006", msg: "Confirmado fallecimiento de Luis Hernández el 03 Mar",  fecha: "03 Mar 16:48", atendida: true  },
  { id: 4, liderId: "L-07", tipo: "nuevo_apoyo",     votanteId: null,    msg: "12 nuevos votantes en Villa Olímpica listos",           fecha: "05 Mar 08:05", atendida: false },
  { id: 5, liderId: "L-04", tipo: "sin_transporte",  votanteId: null,    msg: "Vereda La Unión necesita transporte el día de elecciones", fecha: "04 Mar 14:22", atendida: false },
];
EOF

echo "✅ Datos mock creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🧩 COMPONENTES COMUNES
# ═══════════════════════════════════════════════════════════════

echo "🧩 Creando componentes comunes..."

# src/components/common/Avatar.jsx
cat > src/components/common/Avatar.jsx << 'EOF'
import { obtenerIniciales } from '@utils/formatters';

export default function Avatar({ nombre, size = 38, color = "#3b82f6" }) {
  const initials = obtenerIniciales(nombre);
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color}88, ${color}44)`,
    border: `2px solid ${color}55`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    fontWeight: 800,
    color: '#fff',
    flexShrink: 0,
  };

  return <div style={style}>{initials}</div>;
}
EOF

# src/components/common/StatusPill.jsx
cat > src/components/common/StatusPill.jsx << 'EOF'
import { ESTADO_META } from '@utils/constants';

export default function StatusPill({ estado }) {
  const m = ESTADO_META[estado] || ESTADO_META.no_contactado;
  
  const style = {
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    background: m.bg,
    color: m.color,
    border: `1px solid ${m.color}40`,
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  };

  return <span style={style}>{m.icon} {m.label}</span>;
}
EOF

# src/components/common/Ring.jsx
cat > src/components/common/Ring.jsx << 'EOF'
export default function Ring({ val, max, color, size = 60 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * Math.min(val / Math.max(max, 1), 1);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#1e3a6e"
        strokeWidth={6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}
EOF

# src/components/common/Bar.jsx
cat > src/components/common/Bar.jsx << 'EOF'
import { pct } from '@utils/helpers';

export default function Bar({ val, max, color, height = 5 }) {
  const style = {
    height,
    background: '#1e3a6e',
    borderRadius: height,
    overflow: 'hidden',
  };

  const fillStyle = {
    height: '100%',
    width: `${pct(val, max)}%`,
    background: color,
    borderRadius: height,
    transition: 'width .5s',
  };

  return (
    <div style={style}>
      <div style={fillStyle} />
    </div>
  );
}
EOF

# src/components/common/Tag.jsx
cat > src/components/common/Tag.jsx << 'EOF'
export default function Tag({ label, color }) {
  const style = {
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    background: `${color}20`,
    color,
    border: `1px solid ${color}40`,
    display: 'inline-block',
  };

  return <span style={style}>{label}</span>;
}
EOF

# src/components/common/Button.jsx
cat > src/components/common/Button.jsx << 'EOF'
export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    success: 'bg-success hover:bg-success/90 text-white',
    warning: 'bg-warning hover:bg-warning/90 text-black',
    danger: 'bg-danger hover:bg-danger/90 text-white',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-500/10',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
EOF

# src/components/common/Card.jsx
cat > src/components/common/Card.jsx << 'EOF'
export default function Card({ children, className = '', onClick, ...props }) {
  const baseStyles = 'bg-dark-surface border border-dark-border rounded-xl p-4';
  const clickStyles = onClick ? 'cursor-pointer hover:border-primary-500/50 transition-colors' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${clickStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
EOF

# src/components/common/Modal.jsx
cat > src/components/common/Modal.jsx << 'EOF'
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-dark-surface border border-dark-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
EOF

# src/components/common/Input.jsx
cat > src/components/common/Input.jsx << 'EOF'
export default function Input({
  label,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-[10px] text-gray-500 font-bold mb-2 uppercase">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        className={`w-full bg-dark-surface border rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors
          ${error ? 'border-danger' : 'border-dark-border focus:border-primary-500'}`}
        {...props}
      />
      {error && <p className="text-[10px] text-danger mt-1">⚠️ {error}</p>}
    </div>
  );
}
EOF

echo "✅ Componentes comunes creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 📱 COMPONENTES MÓVILES
# ═══════════════════════════════════════════════════════════════

echo "📱 Creando componentes móviles..."

# src/components/mobile/BottomNav.jsx
cat > src/components/mobile/BottomNav.jsx << 'EOF'
export default function BottomNav({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-dark-950 border-t border-dark-border flex px-0 pb-4 pt-2 sticky bottom-0">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center gap-1 bg-none border-none cursor-pointer py-1"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
                ${active ? 'bg-primary-500/20' : 'bg-transparent'}`}
            >
              <span className="text-lg">{tab.icon}</span>
            </div>
            <span
              className={`text-[9px] font-bold ${
                active ? 'text-primary-500 font-extrabold' : 'text-gray-600'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
EOF

# src/components/mobile/PhoneFrame.jsx
cat > src/components/mobile/PhoneFrame.jsx << 'EOF'
export default function PhoneFrame({ children, className = '' }) {
  return (
    <div
      className={`
        w-[390px] max-w-full min-h-[780px]
        bg-dark-900 rounded-[40px] overflow-hidden
        shadow-[0_40px_120px_#0000001a,0_0_0_1px_#1e3a6e44]
        relative flex flex-col
        font-sans text-gray-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
EOF

echo "✅ Componentes móviles creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🖥️ COMPONENTES WEB
# ═══════════════════════════════════════════════════════════════

echo "🖥️ Creando componentes web..."

# src/components/web/Sidebar.jsx
cat > src/components/web/Sidebar.jsx << 'EOF'
export default function Sidebar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="w-[185px] bg-dark-950 border-r border-dark-border min-h-[calc(100vh-58px)] py-3.5 flex-shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center justify-between w-full px-5 py-2.5
            bg-none border-none border-l-[3px]
            text-sm cursor-pointer text-left transition-all
            ${
              activeTab === tab.id
                ? 'bg-warning-500/10 border-warning-500 text-white font-bold'
                : 'border-transparent text-gray-600 font-normal'
            }
          `}
        >
          <span>
            {tab.icon} {tab.label}
          </span>
          {tab.badge > 0 && (
            <span className="bg-danger-500/30 text-danger-500 rounded-full w-[18px] h-[18px] text-[10px] font-extrabold flex items-center justify-center">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
EOF

# src/components/web/TopBar.jsx
cat > src/components/web/TopBar.jsx << 'EOF'
import { APP_INFO } from '@utils/constants';

export default function TopBar({ stats, onGlobalMessage }) {
  return (
    <div className="bg-dark-950 border-b border-dark-border h-[58px] flex items-center px-6 justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-[38px] h-[38px] rounded-xl bg-gradient-135 from-warning-500 to-warning-700 flex items-center justify-center text-xl">
          🗳️
        </div>
        <div>
          <div className="font-extrabold text-[15px] text-white tracking-tighter">
            VotoControl <span className="text-warning-500">Pro</span>
          </div>
          <div className="text-[9px] text-gray-700">
            PLATAFORMA ELECTORAL · {APP_INFO.region} {APP_INFO.electionYear}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-1.5">
          {stats.map((s) => (
            <div
              key={s.l}
              className="bg-dark-surface border border-dark-border rounded-lg px-3 py-1.5 text-center"
            >
              <div className={`text-[14px] font-extrabold ${s.c || 'text-white'}`}>
                {s.v}
              </div>
              <div className="text-[8px] text-gray-700 font-bold">{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onGlobalMessage}
          className="bg-warning-500/22 border border-warning-500/44 rounded-lg px-4 py-1.5 text-warning-500 text-xs font-extrabold cursor-pointer"
        >
          📡 Difusión global
        </button>
      </div>
    </div>
  );
}
EOF

# src/components/web/DataTable.jsx
cat > src/components/web/DataTable.jsx << 'EOF'
export default function DataTable({ columns, data, onRowClick, selectable = false, selected = [], onToggleSelect, onSelectAll }) {
  const allSelected = data.length > 0 && data.every((row) => selected.includes(row.id));

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-dark-950">
            {selectable && (
              <th className="px-3.5 py-2.5 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="accent-warning-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3.5 py-2.5 text-left text-[10px] text-gray-500 font-bold tracking-wide"
              >
                {col.label.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`
                border-t border-dark-border cursor-pointer
                ${i % 2 === 0 ? 'bg-transparent' : 'bg-dark-950'}
              `}
            >
              {selectable && (
                <td className="px-3.5 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => onToggleSelect?.(row.id)}
                    className="accent-warning-500"
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className="px-3.5 py-2.5">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
EOF

echo "✅ Componentes web creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 📐 LAYOUTS
# ═══════════════════════════════════════════════════════════════

echo "📐 Creando layouts..."

# src/layouts/MobileLayout.jsx
cat > src/layouts/MobileLayout.jsx << 'EOF'
import PhoneFrame from '@components/mobile/PhoneFrame';
import BottomNav from '@components/mobile/BottomNav';

export default function MobileLayout({ children, activeTab, onTabChange, tabs, header }) {
  return (
    <div className="min-h-screen bg-dark-950 flex justify-center items-start py-5">
      <PhoneFrame>
        {/* Status bar */}
        <div className="bg-dark-950 px-5 py-3 flex justify-between items-center">
          <span className="text-[11px] font-bold text-gray-200">9:41</span>
          <div className="w-20 h-[18px] bg-dark-border rounded-xl" />
          <div className="flex gap-1.5 items-center">
            <span className="text-[10px] text-gray-500">📶 🔋</span>
          </div>
        </div>

        {/* Header */}
        {header}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Bottom nav */}
        <BottomNav tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      </PhoneFrame>
    </div>
  );
}
EOF

# src/layouts/DashboardLayout.jsx
cat > src/layouts/DashboardLayout.jsx << 'EOF'
import Sidebar from '@components/web/Sidebar';
import TopBar from '@components/web/TopBar';

export default function DashboardLayout({
  children,
  activeView,
  onViewChange,
  tabs,
  stats,
  onGlobalMessage,
  title,
}) {
  return (
    <div className="font-sans bg-dark-900 min-h-screen text-gray-200">
      <TopBar stats={stats} onGlobalMessage={onGlobalMessage} />

      <div className="flex">
        <Sidebar tabs={tabs} activeTab={activeView} onTabChange={onViewChange} />

        <div className="flex-1 p-6 overflow-y-auto min-h-[calc(100vh-58px)]">
          {title && (
            <div className="mb-5">
              <h1 className="text-xl font-extrabold text-white m-0 tracking-tighter">
                {title}
              </h1>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Layouts creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🔄 CONTEXT
# ═══════════════════════════════════════════════════════════════

echo "🔄 Creando context..."

# src/context/AuthContext.jsx
cat > src/context/AuthContext.jsx << 'EOF'
import { createContext, useContext, useState } from 'react';
import { ROLES } from '@utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    // TODO: Implementar llamada real a API
    // Simulación para desarrollo
    const mockUser = {
      id: 'U-001',
      nombre: 'Usuario Demo',
      email,
      role: ROLES.COORDINADOR,
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole: (role) => user?.role === role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
EOF

# src/context/DataContext.jsx
cat > src/context/DataContext.jsx << 'EOF'
import { createContext, useContext, useState } from 'react';
import { VOTANTES_BASE } from '@data/mockVotantes';
import { LIDERES } from '@data/mockLideres';
import { CANDIDATOS, GOBERNADOR } from '@data/mockCandidatos';
import { NOVEDADES } from '@data/mockNovedades';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [votantes, setVotantes] = useState(VOTANTES_BASE);
  const [lideres, setLideres] = useState(LIDERES);
  const [candidatos, setCandidatos] = useState(CANDIDATOS);
  const [gobernador] = useState(GOBERNADOR);
  const [novedades, setNovedades] = useState(NOVEdades);

  // Votantes
  const updateVotante = (id, patch) => {
    setVotantes((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const addVotante = (votante) => {
    setVotantes((prev) => [...prev, votante]);
  };

  // Novedades
  const addNovedad = (novedad) => {
    setNovedades((prev) => [
      { ...novedad, id: Date.now(), fecha: new Date().toLocaleString(), atendida: false },
      ...prev,
    ]);
  };

  const marcarNovedadAtendida = (id) => {
    setNovedades((prev) => prev.map((n) => (n.id === id ? { ...n, atendida: true } : n)));
  };

  const value = {
    votantes,
    lideres,
    candidatos,
    gobernador,
    novedades,
    updateVotante,
    addVotante,
    addNovedad,
    marcarNovedadAtendida,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
}
EOF

echo "✅ Context creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🎣 HOOKS
# ═══════════════════════════════════════════════════════════════

echo "🎣 Creando hooks..."

# src/hooks/useVotantes.js
cat > src/hooks/useVotantes.js << 'EOF'
import { useData } from '@context/DataContext';
import { useMemo } from 'react';

export function useVotantes() {
  const { votantes, updateVotante, addVotante } = useData();

  const getVotantesByLider = (liderId) => {
    return votantes.filter((v) => v.liderIds?.includes(liderId));
  };

  const getVotantesByCampana = (campanaId) => {
    return votantes.filter((v) => v.campañas?.includes(campanaId));
  };

  const getStats = (campanaId) => {
    const vots = campanaId ? getVotantesByCampana(campanaId) : votantes;
    return {
      total: vots.length,
      confirmados: vots.filter((v) => v.estado?.[campanaId || 'GOB'] === 'confirmado').length,
      pendientes: vots.filter((v) => v.estado?.[campanaId || 'GOB'] === 'pendiente').length,
      noContactados: vots.filter((v) => v.estado?.[campanaId || 'GOB'] === 'no_contactado').length,
    };
  };

  return {
    votantes,
    updateVotante,
    addVotante,
    getVotantesByLider,
    getVotantesByCampana,
    getStats,
  };
}
EOF

# src/hooks/useLideres.js
cat > src/hooks/useLideres.js << 'EOF'
import { useData } from '@context/DataContext';
import { useMemo } from 'react';

export function useLideres() {
  const { lideres, votantes } = useData();

  const getLideresByCandidato = (candidatoId) => {
    return lideres.filter((l) => l.candidatoId === candidatoId);
  };

  const getLiderStats = (liderId, campanaId) => {
    const misVots = votantes.filter(
      (v) => v.liderIds?.includes(liderId) && v.campañas?.includes(campanaId)
    );
    const conf = misVots.filter((v) => v.estado?.[campanaId] === 'confirmado').length;
    return {
      total: misVots.length,
      confirmados: conf,
      pendientes: misVots.filter((v) => v.estado?.[campanaId] === 'pendiente').length,
      noContactados: misVots.filter((v) => v.estado?.[campanaId] === 'no_contactado').length,
      efectividad: misVots.length > 0 ? Math.round((conf / misVots.length) * 100) : 0,
    };
  };

  return {
    lideres,
    getLideresByCandidato,
    getLiderStats,
  };
}
EOF

# src/hooks/useNovedades.js
cat > src/hooks/useNovedades.js << 'EOF'
import { useData } from '@context/DataContext';

export function useNovedades() {
  const { novedades, addNovedad, marcarNovedadAtendida } = useData();

  const pendientes = novedades.filter((n) => !n.atendida);
  const atendidas = novedades.filter((n) => n.atendida);

  return {
    novedades,
    pendientes,
    atendidas,
    addNovedad,
    marcarNovedadAtendida,
  };
}
EOF

echo "✅ Hooks creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🔌 SERVICES
# ═══════════════════════════════════════════════════════════════

echo "🔌 Creando services..."

# src/services/api.js
cat > src/services/api.js << 'EOF'
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
EOF

# src/services/auth.service.js
cat > src/services/auth.service.js << 'EOF'
import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
EOF

# src/services/votantes.service.js
cat > src/services/votantes.service.js << 'EOF'
import api from './api';

export const votantesService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/votantes', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/votantes/${id}`);
    return response.data;
  },

  create: async (votante) => {
    const response = await api.post('/votantes', votante);
    return response.data;
  },

  update: async (id, patch) => {
    const response = await api.patch(`/votantes/${id}`, patch);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/votantes/${id}`);
    return response.data;
  },

  export: async (filters = {}) => {
    const response = await api.get('/votantes/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },
};
EOF

echo "✅ Services creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# ⚙️ CONFIG
# ═══════════════════════════════════════════════════════════════

echo "⚙️ Creando configuración..."

# src/config/routes.js
cat > src/config/routes.js << 'EOF'
export const ROUTES = {
  // Público
  LOGIN: '/login',
  REGISTER: '/register',

  // Mobile (Líder)
  MOBILE_HOME: '/mobile/home',
  MOBILE_VOTANTES: '/mobile/votantes',
  MOBILE_DETALLE: '/mobile/votantes/:id',
  MOBILE_AGREGAR: '/mobile/agregar',
  MOBILE_NOVEDAD: '/mobile/novedad',
  MOBILE_MENSAJE: '/mobile/mensaje',

  // Web (Coordinador)
  WEB_DASHBOARD: '/dashboard',
  WEB_ESTRUCTURA: '/dashboard/estructura',
  WEB_VOTANTES: '/dashboard/votantes',
  WEB_LIDERES: '/dashboard/lideres',
  WEB_NOVEDADES: '/dashboard/novedades',
  WEB_MENSAJERIA: '/dashboard/mensajeria',

  // Auth
  LOGOUT: '/logout',
};

export const PROTECTED_ROUTES = [
  ROUTES.MOBILE_HOME,
  ROUTES.MOBILE_VOTANTES,
  ROUTES.WEB_DASHBOARD,
  ROUTES.WEB_ESTRUCTURA,
  ROUTES.WEB_VOTANTES,
  ROUTES.WEB_LIDERES,
  ROUTES.WEB_NOVEDADES,
  ROUTES.WEB_MENSAJERIA,
];
EOF

# src/config/permissions.js
cat > src/config/permissions.js << 'EOF'
import { ROLES } from '@utils/constants';

export const PERMISSIONS = {
  // Líder
  [ROLES.LIDER]: {
    verPropiosVotantes: true,
    editarPropiosVotantes: true,
    agregarVotantes: true,
    reportarNovedades: true,
    enviarMensajes: true,
    verDashboard: false,
    verTodosVotantes: false,
    verTodosLideres: false,
    enviarMensajesMasivos: false,
    exportarDatos: false,
  },

  // Coordinador
  [ROLES.COORDINADOR]: {
    verPropiosVotantes: true,
    editarPropiosVotantes: true,
    agregarVotantes: true,
    reportarNovedades: true,
    enviarMensajes: true,
    verDashboard: true,
    verTodosVotantes: true,
    verTodosLideres: true,
    enviarMensajesMasivos: true,
    exportarDatos: true,
  },

  // Admin
  [ROLES.ADMIN]: {
    verPropiosVotantes: true,
    editarPropiosVotantes: true,
    agregarVotantes: true,
    reportarNovedades: true,
    enviarMensajes: true,
    verDashboard: true,
    verTodosVotantes: true,
    verTodosLideres: true,
    enviarMensajesMasivos: true,
    exportarDatos: true,
    gestionarUsuarios: true,
    gestionarPermisos: true,
  },
};

export const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.[permission] || false;
};
EOF

echo "✅ Configuración creada"
echo ""

# ═══════════════════════════════════════════════════════════════
# 📱 APP MÓVIL (LiderMovil migrado)
# ═══════════════════════════════════════════════════════════════

echo "📱 Migrando App Móvil..."

# src/apps/mobile/MobileApp.jsx
cat > src/apps/mobile/MobileApp.jsx << 'EOF'
import { useState } from 'react';
import MobileLayout from '@layouts/MobileLayout';
import ScreenHome from './screens/HomeScreen';
import ScreenVotantes from './screens/VotantesScreen';
import ScreenDetalle from './screens/DetalleVotanteScreen';
import ScreenAgregar from './screens/AgregarVotanteScreen';
import ScreenNovedad from './screens/NovedadScreen';
import ScreenMensaje from './screens/MensajeScreen';
import { LIDER_ACTUAL } from '@data/mockLideres';
import { VOTANTES_LIDER } from '@data/mockVotantes';
import Avatar from '@components/common/Avatar';

const TABS = [
  { id: 'home', icon: '🏠', label: 'Inicio' },
  { id: 'votantes', icon: '👥', label: 'Votantes' },
  { id: 'agregar', icon: '➕', label: 'Agregar' },
  { id: 'novedad', icon: '🔔', label: 'Reportar' },
  { id: 'mensaje', icon: '💬', label: 'Mensaje' },
];

export default function MobileApp() {
  const [screen, setScreen] = useState('home');
  const [votantes, setVotantes] = useState(VOTANTES_LIDER);
  const [selected, setSelected] = useState(null);
  const [novedadVot, setNovVot] = useState(null);

  const updateVotante = (id, patch) => {
    setVotantes((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const addVotante = (v) => {
    setVotantes((prev) => [...prev, v]);
  };

  const nav = (s, extra) => {
    if (s === 'novedad' && extra) setNovVot(extra);
    else setNovVot(null);
    if (s === 'detalle' && extra) setSelected(extra);
    setScreen(s);
  };

  const header = (
    <div className="bg-dark-950 border-b border-dark-border px-5 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Avatar nombre={LIDER_ACTUAL.nombre} size={34} color="#f59e0b" />
        <div>
          <div className="text-xs font-extrabold text-white">{LIDER_ACTUAL.nombre}</div>
          <div className="text-[9px] text-gray-500">
            {LIDER_ACTUAL.tipo === 'urbano' ? '🏙️' : '🌿'} {LIDER_ACTUAL.zona.slice(0, 26)}
            {LIDER_ACTUAL.zona.length > 26 ? '…' : ''}
          </div>
        </div>
      </div>
      <div className="bg-warning-500/18 border border-warning-500/40 rounded-lg px-2.5 py-1">
        <span className="text-[10px] font-extrabold text-warning-500">{votantes.length} votantes</span>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <ScreenHome votantes={votantes} onNav={nav} />;
      case 'votantes':
        return <ScreenVotantes votantes={votantes} onSelect={(v) => nav('detalle', v)} />;
      case 'detalle':
        return selected ? (
          <ScreenDetalle
            votante={selected}
            onBack={() => setScreen('votantes')}
            onUpdate={updateVotante}
            onNovedad={(v) => nav('novedad', v)}
          />
        ) : null;
      case 'agregar':
        return <ScreenAgregar onSave={addVotante} onBack={() => setScreen('home')} />;
      case 'novedad':
        return (
          <ScreenNovedad
            votante={novedadVot}
            onBack={() => setScreen(novedadVot ? 'detalle' : 'home')}
            onSend={() => {}}
          />
        );
      case 'mensaje':
        return <ScreenMensaje votantes={votantes} onBack={() => setScreen('home')} />;
      default:
        return <ScreenHome votantes={votantes} onNav={nav} />;
    }
  };

  return (
    <MobileLayout
      header={header}
      activeTab={screen}
      onTabChange={nav}
      tabs={TABS}
    >
      {renderScreen()}
    </MobileLayout>
  );
}
EOF

# src/apps/mobile/screens/HomeScreen.jsx
cat > src/apps/mobile/screens/HomeScreen.jsx << 'EOF'
import { pct } from '@utils/helpers';
import Avatar from '@components/common/Avatar';
import StatusPill from '@components/common/StatusPill';
import { ESTADO_META } from '@utils/constants';
import { LIDER_ACTUAL } from '@data/mockLideres';

export default function ScreenHome({ votantes, onNav }) {
  const conf = votantes.filter((v) => v.estado === 'confirmado').length;
  const pend = votantes.filter((v) => v.estado === 'pendiente').length;
  const noContact = votantes.filter((v) => v.estado === 'no_contactado').length;
  const total = votantes.length;
  const pctConf = pct(conf, total);

  const r = 54;
  const circ = 2 * Math.PI * r;
  const fill = circ * (conf / total);

  const stats = [
    { v: total, l: 'Total asignados', c: '#e2e8f0' },
    { v: conf, l: 'Confirmados', c: '#10b981' },
    { v: pend, l: 'Pendientes', c: '#f59e0b' },
    { v: noContact, l: 'Sin contactar', c: '#6b7280' },
  ];

  const quickActions = [
    { icon: '👥', label: 'Mis votantes', color: '#3b82f6', screen: 'votantes' },
    { icon: '➕', label: 'Agregar votante', color: '#10b981', screen: 'agregar' },
    { icon: '🔔', label: 'Reportar novedad', color: '#f59e0b', screen: 'novedad' },
    { icon: '💬', label: 'Enviar mensaje', color: '#25d366', screen: 'mensaje' },
  ];

  return (
    <div className="pb-20">
      {/* Hero card */}
      <div className="bg-gradient-160 from-[#0f1f45] via-[#1a3068] to-[#0d1b3e] px-5 pt-7 pb-6 border-b border-[#1e3a6e20]">
        <div className="text-[11px] text-warning-500 font-extrabold tracking-widest mb-1">
          MI CAMPAÑA
        </div>
        <div className="text-lg font-extrabold text-white leading-tight mb-0.5">
          {LIDER_ACTUAL.candidato}
        </div>
        <div className="text-[11px] text-gray-500">
          {LIDER_ACTUAL.cargo} · {LIDER_ACTUAL.municipio}
        </div>

        {/* Progress ring + stats */}
        <div className="flex items-center gap-5 mt-5">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg width={128} height={128} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={64} cy={64} r={r} fill="none" stroke="#1e3a6e" strokeWidth={10} />
              <circle
                cx={64}
                cy={64}
                r={r}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={10}
                strokeDasharray={`${fill} ${circ}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-extrabold text-white">{pctConf}%</div>
              <div className="text-[9px] text-gray-500 font-bold">AVANCE</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2.5">
            {stats.map((s) => (
              <div key={s.l} className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{s.l}</span>
                <span className={`text-lg font-extrabold ${s.c}`}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-[#1e3a6e] rounded-lg">
          <div
            className="h-full bg-gradient-90 from-primary-500 to-primary-400 rounded-lg transition-width duration-500"
            style={{ width: `${pctConf}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-gray-600">0</span>
          <span className="text-[9px] text-primary-500 font-bold">{conf} confirmados</span>
          <span className="text-[9px] text-gray-600">Meta: {total}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 pt-4.5">
        <div className="text-[11px] text-gray-600 font-bold tracking-wide mb-3">ACCIONES RÁPIDAS</div>
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((a) => (
            <button
              key={a.screen}
              onClick={() => onNav(a.screen)}
              className={`bg-[${a.color}12] border border-[${a.color}35] rounded-xl px-3.5 py-4 flex items-center gap-2.5 cursor-pointer transition-all`}
              style={{
                background: `${a.color}12`,
                border: `1px solid ${a.color}35`,
              }}
            >
              <span className="text-xl">{a.icon}</span>
              <span className="text-xs font-bold text-gray-200">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sin contactar urgente */}
      {noContact > 0 && (
        <div
          onClick={() => onNav('votantes')}
          className="mx-4 mt-4.5 bg-danger-500/12 border border-danger-500/30 rounded-xl px-4 py-3.5 cursor-pointer flex items-center gap-3"
        >
          <span className="text-xl">📵</span>
          <div>
            <div className="text-sm font-bold text-red-300">{noContact} votantes sin contactar</div>
            <div className="text-[11px] text-danger-500">Toca para ver y contactar ahora →</div>
          </div>
        </div>
      )}

      {/* Últimos votantes */}
      <div className="px-4 pt-4.5">
        <div className="flex justify-between mb-3">
          <span className="text-[11px] text-gray-600 font-bold tracking-wide">ÚLTIMOS REGISTROS</span>
          <span
            onClick={() => onNav('votantes')}
            className="text-[11px] text-primary-500 font-bold cursor-pointer"
          >
            Ver todos →
          </span>
        </div>
        {votantes.slice(0, 4).map((v) => (
          <div
            key={v.id}
            className="flex items-center justify-between py-2.75 border-b border-[#1e3a6e20]"
          >
            <div className="flex items-center gap-2.5">
              <Avatar nombre={v.nombre} size={36} color={ESTADO_META[v.estado].color} />
              <div>
                <div className="text-sm font-semibold text-gray-200">{v.nombre}</div>
                <div className="text-[10px] text-gray-500">{v.barrio} · Mesa {v.mesa}</div>
              </div>
            </div>
            <StatusPill estado={v.estado} />
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

echo "✅ App móvil creada (pantalla Home)"
echo ""

# ═══════════════════════════════════════════════════════════════
# 🖥️ APP WEB (VotoControl migrado)
# ═══════════════════════════════════════════════════════════════

echo "🖥️ Migrando App Web..."

# src/apps/web/WebApp.jsx
cat > src/apps/web/WebApp.jsx << 'EOF'
import { useState } from 'react';
import DashboardLayout from '@layouts/DashboardLayout';
import ViewEstructura from './views/EstructuraView';
import ViewVotantes from './views/VotantesView';
import ViewLideres from './views/LideresView';
import ViewNovedades from './views/NovedadesView';
import ViewMensajeria from './views/MensajeriaView';
import ModalMensaje from '@components/common/Modal';
import { VOTANTES_BASE } from '@data/mockVotantes';
import { LIDERES } from '@data/mockLideres';

const TABS = [
  { id: 'estructura', icon: '🏛️', label: 'Estructura' },
  { id: 'votantes', icon: '👥', label: 'Votantes' },
  { id: 'lideres', icon: '🤝', label: 'Líderes' },
  { id: 'novedades', icon: '🔔', label: 'Novedades', badge: 4 },
  { id: 'mensajeria', icon: '💬', label: 'Mensajería' },
];

export default function WebApp() {
  const [view, setView] = useState('estructura');
  const [msgTarget, setMsg] = useState(null);

  const totalVots = VOTANTES_BASE.length;
  const confGob = VOTANTES_BASE.filter(
    (v) => v.campañas.includes('GOB') && v.estado['GOB'] === 'confirmado'
  ).length;

  const stats = [
    { v: totalVots, l: 'votantes', c: '#e2e8f0' },
    { v: confGob, l: 'confirmados', c: '#10b981' },
    { v: LIDERES.length, l: 'líderes', c: '#f59e0b' },
  ];

  const title = TABS.find((t) => t.id === view)?.label;

  const renderView = () => {
    switch (view) {
      case 'estructura':
        return <ViewEstructura onOpenMsg={setMsg} />;
      case 'votantes':
        return <ViewVotantes onOpenMsg={setMsg} />;
      case 'lideres':
        return <ViewLideres onOpenMsg={setMsg} />;
      case 'novedades':
        return <ViewNovedades />;
      case 'mensajeria':
        return <ViewMensajeria onOpenMsg={setMsg} />;
      default:
        return <ViewEstructura onOpenMsg={setMsg} />;
    }
  };

  return (
    <>
      <DashboardLayout
        activeView={view}
        onViewChange={setView}
        tabs={TABS}
        stats={stats}
        onGlobalMessage={() => setMsg({ nombre: 'TODA LA RED', scope: 'gob' })}
        title={`${TABS.find((t) => t.id === view)?.icon} ${title}`}
      >
        {renderView()}
      </DashboardLayout>

      {msgTarget && (
        <ModalMensaje target={msgTarget} onClose={() => setMsg(null)} />
      )}
    </>
  );
}
EOF

echo "✅ App web creada (estructura base)"
echo ""

# ═══════════════════════════════════════════════════════════════
# 📄 ARCHIVOS DE ENTRADA
# ═══════════════════════════════════════════════════════════════

echo "📄 Creando archivos de entrada..."

# src/main.jsx
cat > src/main.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# src/App.jsx
cat > src/App.jsx << 'EOF'
import { useState } from 'react';
import MobileApp from '@apps/mobile/MobileApp';
import WebApp from '@apps/web/WebApp';

// Selector de modo para desarrollo
// En producción, esto se determinará por autenticación/rutas
function App() {
  const [mode, setMode] = useState('web'); // 'web' | 'mobile'

  return (
    <>
      {/* Selector de modo - solo para desarrollo */}
      <div className="fixed top-4 right-4 z-[9999] flex gap-2">
        <button
          onClick={() => setMode('web')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === 'web'
              ? 'bg-primary-500 text-white'
              : 'bg-dark-surface text-gray-400 border border-dark-border'
          }`}
        >
          🖥️ Web
        </button>
        <button
          onClick={() => setMode('mobile')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === 'mobile'
              ? 'bg-primary-500 text-white'
              : 'bg-dark-surface text-gray-400 border border-dark-border'
          }`}
        >
          📱 Mobile
        </button>
      </div>

      {mode === 'web' ? <WebApp /> : <MobileApp />}
    </>
  );
}

export default App;
EOF

echo "✅ Archivos de entrada creados"
echo ""

# ═══════════════════════════════════════════════════════════════
# 📝 README
# ═══════════════════════════════════════════════════════════════

echo "📝 Creando README..."

cat > README.md << 'EOF'
# 🗳️ VotoControl Pro

Plataforma de Gestión Electoral para campañas políticas.

## 🚀 Características

- **App Móvil para Líderes**: Gestión de votantes en terreno
- **Dashboard Web para Coordinadores**: Supervisión y análisis centralizado
- **Base de Datos Compartida**: Un votante puede estar en múltiples campañas
- **Sistema de Novedades**: Reportes en tiempo real desde el campo
- **Mensajería Masiva**: WhatsApp y SMS integrados

## 📁 Estructura del Proyecto
