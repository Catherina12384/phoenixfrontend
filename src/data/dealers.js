import acerLogo from '../assets/acer.png'
import amdLogo from '../assets/amd.png'
import appleLogo from '../assets/apple.png'
import asusLogo from '../assets/asus.png'
import brotherLogo from '../assets/brother.png'
import canonLogo from '../assets/canon.png'
import dellLogo from '../assets/dell.png'
import epsonLogo from '../assets/epson.png'
import hpLogo from '../assets/hp.png'
import intelLogo from '../assets/intel.png'
import lenovoLogo from '../assets/lenovo.png'
import logitechLogo from '../assets/logitech.png'
import nvidiaLogo from '../assets/nvidia.png'

// `id` is the slug used in the URL (?dealer=hp) and later matched against products.
// `logo` is optional; when present, it renders the brand image in the dealer tile.
export const DEALERS = [
  { id: 'hp', name: 'HP', logo: hpLogo },
  { id: 'dell', name: 'Dell', logo: dellLogo },
  { id: 'lenovo', name: 'Lenovo', logo: lenovoLogo },
  { id: 'asus', name: 'Asus', logo: asusLogo },
  { id: 'acer', name: 'Acer', logo: acerLogo },
  { id: 'amd', name: 'AMD', logo: amdLogo },
  { id: 'apple', name: 'Apple', logo: appleLogo },
  { id: 'brother', name: 'Brother', logo: brotherLogo },
  { id: 'hikvision', name: 'Hikvision' },
  { id: 'cp-plus', name: 'CP Plus' },
  { id: 'dahua', name: 'Dahua' },
  { id: 'intel', name: 'Intel', logo: intelLogo },
  { id: 'logitech', name: 'Logitech', logo: logitechLogo },
  { id: 'nvidia', name: 'NVIDIA', logo: nvidiaLogo },
  { id: 'tp-link', name: 'TP-Link' },
  { id: 'canon', name: 'Canon', logo: canonLogo },
  { id: 'epson', name: 'Epson', logo: epsonLogo },
]

// Pages call this, never DEALERS directly. When Spring Boot is ready, change the body to:
//   const res = await fetch('/api/dealers'); if (!res.ok) throw new Error('dealers'); return res.json()
// (the Vite proxy in vite.config.js already forwards /api). Expected shape: [{ id, name, logo? }]
export async function getDealers() {
  return DEALERS
}