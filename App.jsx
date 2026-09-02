import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Search, Download, Check, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'inventario-data';

// kind: 'location' -> desglosado en Aula / AIP
// kind: 'kit'      -> desglosado en sus propios accesorios internos
// kind: 'simple'   -> una sola entrada de conteo
const CATEGORIES = [
  { id: 'computadoras', name: 'Computadoras', kind: 'location' },
  { id: 'proyector', name: 'Proyector', kind: 'location' },
  {
    id: 'proyector_portatil',
    name: 'Proyector Portátil',
    kind: 'kit',
    subItems: [
      { id: 'unidad', label: 'Proyector' },
      { id: 'cable_hdmi', label: 'Cable HDMI' },
      { id: 'cable_vga', label: 'Cable VGA' },
      { id: 'parlante', label: 'Parlante' },
      { id: 'cable_poder', label: 'Cable de poder' },
    ],
  },
  { id: 'laptop_xo', name: 'Laptop XO', kind: 'simple' },
  { id: 'laptop', name: 'Laptop', kind: 'simple' },
  { id: 'impresora', name: 'Impresora', kind: 'simple' },
  { id: 'linea_internet', name: 'Línea de Internet', kind: 'simple' },
  { id: 'teclado', name: 'Teclado', kind: 'simple' },
  { id: 'mouse', name: 'Mouse', kind: 'simple' },
  { id: 'cpu', name: 'CPU', kind: 'simple' },
  { id: 'cable_vga', name: 'Cable VGA', kind: 'simple' },
  { id: 'cable_hdmi', name: 'Cable HDMI', kind: 'simple' },
  { id: 'cable_poder', name: 'Cable de Poder', kind: 'simple' },
  { id: 'cable_extension', name: 'Cable de Extensión', kind: 'simple' },
  { id: 'parlante', name: 'Parlante', kind: 'simple' },
  { id: 'ventilador', name: 'Ventilador', kind: 'simple' },
  { id: 'sillas', name: 'Sillas', kind: 'simple' },
  { id: 'armario', name: 'Armario', kind: 'simple' },
  { id: 'puerta', name: 'Puerta', kind: 'simple' },
  { id: 'mesas', name: 'Mesas', kind: 'simple' },
  { id: 'tacho', name: 'Tacho', kind: 'simple' },
  { id: 'podio', name: 'Podio', kind: 'simple' },
];

const LOCATIONS = [
  { id: 'aula', label: 'Aula' },
  { id: 'aip', label: 'AIP' },
];

const ESTADO_FIELDS = [
  { key: 'bueno', label: 'B', title: 'Bueno', color: '#2F7D4C' },
  { key: 'regular', label: 'R', title: 'Regular', color: '#B8862B' },
  { key: 'malo', label: 'M', title: 'Malo', color: '#B23A2E' },
];

const COLORS = {
  bg: '#F7F2E6',
  card: '#FFFFFF',
  ink: '#2B1116',
  inkSoft: '#7A5C55',
  accent: '#6E1E2B',
  accentSoft: '#F1DCC9',
  gold: '#C99A3B',
  stamp: '#6E1E2B',
  border: '#E3D3B8',
};

const DEFAULT_SCHOOL_NAME = 'I.E. N° 0162 San José Obrero';

function emptyEntry() {
  return { bueno: 0, regular: 0, malo: 0, marca: '', color: '', codigoPatrimonial: '', numeroSerie: '' };
}

function entrySum(e) {
  return e.bueno + e.regular + e.malo;
}

function defaultItemData(cat) {
  if (cat.kind === 'location') {
    return { aula: emptyEntry(), aip: emptyEntry() };
  }
  if (cat.kind === 'kit') {
    const obj = {};
    cat.subItems.forEach((s) => { obj[s.id] = emptyEntry(); });
    return obj;
  }
  return emptyEntry();
}

function buildDefaultItems() {
  const obj = {};
  CATEGORIES.forEach((c) => { obj[c.id] = defaultItemData(c); });
  return obj;
}

function categoryEntries(cat, data) {
  if (cat.kind === 'location') return LOCATIONS.map((l) => data[l.id]);
  if (cat.kind === 'kit') return cat.subItems.map((s) => data[s.id]);
  return [data];
}

function categoryBreakdown(cat, data) {
  return categoryEntries(cat, data).reduce(
    (acc, e) => ({ bueno: acc.bueno + e.bueno, regular: acc.regular + e.regular, malo: acc.malo + e.malo, total: acc.total + entrySum(e) }),
    { bueno: 0, regular: 0, malo: 0, total: 0 }
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-lg p-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
      <p className="font-display" style={{ fontSize: '1.65rem', fontWeight: 700, color }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: COLORS.inkSoft, fontWeight: 700 }}>{label}</p>
    </div>
  );
}

function EntryFields({ data, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ESTADO_FIELDS.map((f) => (
        <label key={f.key} className="flex items-center gap-1" title={f.title}>
          <span className="font-mono" style={{ color: f.color, fontSize: '12px', fontWeight: 700 }}>{f.label}</span>
          <input
            type="number"
            min="0"
            value={data[f.key]}
            onChange={(e) => onChange(f.key, Math.max(0, Number(e.target.value)))}
            className="font-mono w-11 text-center rounded px-1 py-1"
            style={{ border: `1px solid ${f.color}`, fontWeight: 700 }}
            aria-label={f.title}
          />
        </label>
      ))}
    </div>
  );
}

function MarcaColorFields({ data, onChange }) {
  return (
    <div className="flex items-center gap-2 mt-1 flex-wrap">
      <input
        type="text"
        placeholder="Marca"
        value={data.marca}
        onChange={(e) => onChange('marca', e.target.value)}
        className="text-xs rounded px-2 py-1 flex-1 min-w-0"
        style={{ border: `1px solid ${COLORS.border}`, fontWeight: 700 }}
        aria-label="Marca"
      />
      <input
        type="text"
        placeholder="Color"
        value={data.color}
        onChange={(e) => onChange('color', e.target.value)}
        className="text-xs rounded px-2 py-1 flex-1 min-w-0"
        style={{ border: `1px solid ${COLORS.border}`, fontWeight: 700 }}
        aria-label="Color"
      />
    </div>
  );
}

function CodeFields({ data, onChange }) {
  return (
    <div className="flex items-center gap-2 mt-1 flex-wrap">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <input
          type="text"
          placeholder="Código patrimonial"
          value={data.codigoPatrimonial}
          onChange={(e) => onChange('codigoPatrimonial', e.target.value)}
          className="text-xs rounded px-2 py-1 flex-1 min-w-0"
          style={{ border: `1px solid ${COLORS.border}`, fontWeight: 700 }}
          aria-label="Código patrimonial"
        />
        <button
          type="button"
          onClick={() => onChange('codigoPatrimonial', 'S/N')}
          className="text-xs rounded px-2 py-1 shrink-0"
          style={{ border: `1px solid ${COLORS.gold}`, color: COLORS.accent, fontWeight: 700 }}
          title="Marcar como Sin Número"
        >
          S/N
        </button>
      </div>
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <input
          type="text"
          placeholder="N° de serie"
          value={data.numeroSerie}
          onChange={(e) => onChange('numeroSerie', e.target.value)}
          className="text-xs rounded px-2 py-1 flex-1 min-w-0"
          style={{ border: `1px solid ${COLORS.border}`, fontWeight: 700 }}
          aria-label="Número de serie"
        />
        <button
          type="button"
          onClick={() => onChange('numeroSerie', 'S/N')}
          className="text-xs rounded px-2 py-1 shrink-0"
          style={{ border: `1px solid ${COLORS.gold}`, color: COLORS.accent, fontWeight: 700 }}
          title="Marcar como Sin Número"
        >
          S/N
        </button>
      </div>
    </div>
  );
}

function EntryRow({ label, data, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs w-16 shrink-0" style={{ color: COLORS.inkSoft, fontWeight: 700 }}>{label}</span>
        <EntryFields data={data} onChange={onChange} />
      </div>
      <MarcaColorFields data={data} onChange={onChange} />
      <CodeFields data={data} onChange={onChange} />
    </div>
  );
}

export default function App() {
  const [schoolName, setSchoolName] = useState(DEFAULT_SCHOOL_NAME);
  const [items, setItems] = useState(null);
  const [saveState, setSaveState] = useState('idle');
  const [expanded, setExpanded] = useState({});
  const [query, setQuery] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const defaults = buildDefaultItems();
        const merged = { ...defaults };
        CATEGORIES.forEach((c) => {
          const saved = (parsed.items || {})[c.id];
          if (!saved) return;
          const entryKeys = Object.keys(defaults[c.id]);
          const mergedCat = {};
          entryKeys.forEach((k) => {
            const savedEntry = saved[k];
            mergedCat[k] = savedEntry && typeof savedEntry === 'object'
              ? {
                  bueno: Number(savedEntry.bueno) || 0,
                  regular: Number(savedEntry.regular) || 0,
                  malo: Number(savedEntry.malo) || 0,
                  marca: typeof savedEntry.marca === 'string' ? savedEntry.marca : '',
                  color: typeof savedEntry.color === 'string' ? savedEntry.color : '',
                  codigoPatrimonial: typeof savedEntry.codigoPatrimonial === 'string' ? savedEntry.codigoPatrimonial : '',
                  numeroSerie: typeof savedEntry.numeroSerie === 'string' ? savedEntry.numeroSerie : '',
                }
              : emptyEntry();
          });
          merged[c.id] = mergedCat;
        });
        setSchoolName(parsed.schoolName || DEFAULT_SCHOOL_NAME);
        setItems(merged);
      } else {
        setItems(buildDefaultItems());
      }
    } catch (e) {
      setItems(buildDefaultItems());
    }
  }, []);

  const persist = useCallback((nextSchoolName, nextItems) => {
    setSaveState('saving');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schoolName: nextSchoolName, items: nextItems }));
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 1200);
    } catch (e) {
      setSaveState('error');
    }
  }, []);

  const updateSimpleEntry = (catId, field, value) => {
    setItems((prev) => {
      const next = { ...prev, [catId]: { ...prev[catId], [field]: value } };
      persist(schoolName, next);
      return next;
    });
  };

  const updateSubEntry = (catId, subId, field, value) => {
    setItems((prev) => {
      const next = {
        ...prev,
        [catId]: { ...prev[catId], [subId]: { ...prev[catId][subId], [field]: value } },
      };
      persist(schoolName, next);
      return next;
    });
  };

  const toggleExpand = (catId) => {
    setExpanded((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  if (!items) {
    return (
      <div style={{ background: COLORS.bg, minHeight: '100vh' }} className="flex items-center justify-center p-8">
        <span style={{ color: COLORS.inkSoft }}>Cargando inventario…</span>
      </div>
    );
  }

  const totals = CATEGORIES.reduce(
    (acc, c) => {
      const b = categoryBreakdown(c, items[c.id]);
      return { total: acc.total + b.total, malo: acc.malo + b.malo };
    },
    { total: 0, malo: 0 }
  );

  const filtered = CATEGORIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  const downloadCSV = () => {
    const rows = [['Código', 'Categoría', 'Detalle', 'Código Patrimonial', 'N° de Serie', 'Marca', 'Color', 'Bueno', 'Regular', 'Malo', 'Total']];
    CATEGORIES.forEach((c, i) => {
      const code = 'PAT-' + String(i + 1).padStart(3, '0');
      const d = items[c.id];
      if (c.kind === 'location') {
        LOCATIONS.forEach((loc) => {
          const e = d[loc.id];
          rows.push([code, c.name, loc.label, e.codigoPatrimonial, e.numeroSerie, e.marca, e.color, e.bueno, e.regular, e.malo, entrySum(e)]);
        });
      } else if (c.kind === 'kit') {
        c.subItems.forEach((si) => {
          const e = d[si.id];
          rows.push([code, c.name, si.label, e.codigoPatrimonial, e.numeroSerie, e.marca, e.color, e.bueno, e.regular, e.malo, entrySum(e)]);
        });
      } else {
        rows.push([code, c.name, 'General', d.codigoPatrimonial, d.numeroSerie, d.marca, d.color, d.bueno, d.regular, d.malo, entrySum(d)]);
      }
    });
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventario.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', fontFamily: "'Courier Prime', 'Courier New', Courier, monospace", color: COLORS.ink, fontWeight: 700 }} className="pb-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
        .font-display { font-family: 'Courier Prime', 'Courier New', Courier, monospace; }
        .font-mono { font-family: 'Courier Prime', 'Courier New', Courier, monospace; }
      `}</style>

      <header
        className="px-5 pt-8 pb-6 sm:px-8"
        style={{ borderBottom: `3px double ${COLORS.gold}`, background: `linear-gradient(180deg, ${COLORS.accentSoft} 0%, rgba(255,255,255,0) 100%)` }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 64,
                height: 64,
                minWidth: 64,
                borderRadius: '9999px',
                background: '#FFFFFF',
                border: '3px solid #FFFFFF',
                boxShadow: `0 2px 6px rgba(43,17,22,0.35), 0 0 0 3px ${COLORS.gold}`,
                overflow: 'hidden',
              }}
            >
              <img src="/logo.png" alt="Logo I.E. N° 0162 San José Obrero" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <p className="font-mono uppercase tracking-widest" style={{ color: COLORS.accent, fontSize: '11px' }}>Control Patrimonial · Nivel Primaria</p>
              <input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                onBlur={() => persist(schoolName, items)}
                className="font-display bg-transparent border-none outline-none w-full mt-1"
                style={{
                  fontSize: '1.55rem',
                  color: '#5C0F1D',
                  fontWeight: 700,
                  WebkitTextStroke: '2.2px #FFFFFF',
                  paintOrder: 'stroke fill',
                  textShadow: [
                    '0 0 3px #FFFFFF',
                    '1px 1px 0 #FFFFFF',
                    '-1px -1px 0 #FFFFFF',
                    '1px -1px 0 #FFFFFF',
                    '-1px 1px 0 #FFFFFF',
                    '0 2px 3px rgba(43,17,22,0.35)',
                  ].join(', '),
                }}
                aria-label="Nombre de la institución educativa"
              />
              <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>Inventario de aula y Aula de Innovación Pedagógica (AIP)</p>
            </div>
          </div>
          <div className="font-mono h-5 flex items-center gap-1" style={{ color: saveState === 'error' ? COLORS.stamp : '#2F7D4C', fontSize: '12px' }}>
            {saveState === 'saving' && <span>Guardando…</span>}
            {saveState === 'saved' && (<><Check size={14} /> Guardado</>)}
            {saveState === 'error' && (<><AlertCircle size={14} /> No se pudo guardar</>)}
          </div>
        </div>
      </header>

      <div className="px-5 sm:px-8 mt-6">
        <p className="font-mono uppercase tracking-widest mb-2" style={{ color: COLORS.stamp, fontSize: '11px' }}>Resumen por categoría</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {CATEGORIES.map((c) => {
            const total = categoryBreakdown(c, items[c.id]).total;
            return (
              <div key={c.id} className="rounded px-3 py-2 flex items-center justify-between gap-2" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <span className="text-xs" style={{ color: COLORS.inkSoft, fontWeight: 700 }}>{c.name}</span>
                <span className="font-mono" style={{ color: COLORS.accent, fontWeight: 700, fontSize: '1rem' }}>{total}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 sm:px-8 mt-4 grid grid-cols-3 gap-3 max-w-3xl">
        <StatCard label="Bienes registrados" value={totals.total} color={COLORS.accent} />
        <StatCard label="Categorías" value={CATEGORIES.length} color={COLORS.gold} />
        <StatCard label="En mal estado" value={totals.malo} color="#B23A2E" />
      </div>

      <div className="px-5 sm:px-8 mt-6 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 rounded px-3 py-2 flex-1" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <Search size={16} style={{ color: COLORS.inkSoft }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar categoría…"
            className="bg-transparent outline-none border-none text-sm w-full"
          />
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded"
          style={{ background: COLORS.accent, color: '#fff', fontWeight: 700 }}
        >
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <div className="px-5 sm:px-8 mt-4">
        <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: COLORS.inkSoft }}>
          <span>Cada casilla se reparte en:</span>
          {ESTADO_FIELDS.map((f) => (
            <span key={f.key} className="flex items-center gap-1">
              <span className="font-mono" style={{ color: f.color, fontWeight: 700 }}>{f.label}</span> = {f.title}
            </span>
          ))}
          <span>+ Marca, Color, Código Patrimonial y N° de Serie (usa el botón S/N si no tiene)</span>
        </div>
      </div>

      <div className="px-5 sm:px-8 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat) => {
          const code = 'PAT-' + String(CATEGORIES.indexOf(cat) + 1).padStart(3, '0');
          const d = items[cat.id];
          const isOpen = !!expanded[cat.id];
          const b = categoryBreakdown(cat, d);
          const isExpandable = cat.kind !== 'simple';

          return (
            <div key={cat.id} className="relative rounded-lg p-4" style={{ background: COLORS.card, border: `2px dashed ${COLORS.border}` }}>
              <span
                className="absolute -top-3 -right-2 font-mono px-2 py-1 rounded-full"
                style={{ background: COLORS.accentSoft, color: COLORS.accent, fontSize: '11px' }}
              >
                {code}
              </span>

              <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{cat.name}</h3>
              <p className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>
                Total: <strong style={{ color: COLORS.ink }}>{b.total}</strong>
                {' · '}<span style={{ color: '#2F7D4C' }}>{b.bueno}B</span>
                {' · '}<span style={{ color: '#B8862B' }}>{b.regular}R</span>
                {' · '}<span style={{ color: '#B23A2E' }}>{b.malo}M</span>
              </p>

              {isExpandable ? (
                <>
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="mt-2 flex items-center justify-between w-full text-sm py-1"
                    style={{ color: COLORS.inkSoft }}
                  >
                    <span>{isOpen ? 'Ocultar detalle' : 'Ver / editar detalle'}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className="mt-2 space-y-3" style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: '0.75rem' }}>
                      {cat.kind === 'location' && LOCATIONS.map((loc) => (
                        <EntryRow key={loc.id} label={loc.label} data={d[loc.id]} onChange={(field, val) => updateSubEntry(cat.id, loc.id, field, val)} />
                      ))}
                      {cat.kind === 'kit' && cat.subItems.map((si) => (
                        <EntryRow key={si.id} label={si.label} data={d[si.id]} onChange={(field, val) => updateSubEntry(cat.id, si.id, field, val)} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-3">
                  <EntryFields data={d} onChange={(field, val) => updateSimpleEntry(cat.id, field, val)} />
                  <MarcaColorFields data={d} onChange={(field, val) => updateSimpleEntry(cat.id, field, val)} />
                  <CodeFields data={d} onChange={(field, val) => updateSimpleEntry(cat.id, field, val)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="px-5 sm:px-8 mt-8 text-xs" style={{ color: COLORS.inkSoft }}>
        Los datos se guardan automáticamente en este dispositivo.
      </p>
    </div>
  );
}
