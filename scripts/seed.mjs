import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "moviles-a2959.firebaseapp.com",
  projectId: "moviles-a2959",
  storageBucket: "moviles-a2959.firebasestorage.app",
  messagingSenderId: "1065207468721",
  appId: "1:1065207468721:web:e7e26086118ff449e2c890",
  measurementId: "G-TQ6F1184S5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const candidatosEjemplo = [
  {
    nombres: "Ana Pérez",
    correo: "ana.perez@testmail.com",
    telefono: "0991234567",
    fechaNacimiento: "1998-04-15",
    cargo: "Desarrollador móvil",
    nivelAcademico: "Tercer nivel",
    experienciaAnios: 3,
    modalidad: "Híbrida",
    habilidades: ["Ionic", "Angular", "Git"],
    fechaDisponibilidad: "2026-12-01",
    aspiracionSalarial: 1200,
    resumen: "Desarrolladora de aplicaciones móviles con experiencia en Angular e Ionic para entornos híbridos.",
    consentimiento: true
  },
  {
    nombres: "Carlos Morales",
    correo: "carlos.morales@testmail.com",
    telefono: "0987654321",
    fechaNacimiento: "1995-09-20",
    cargo: "Analista de datos",
    nivelAcademico: "Posgrado",
    experienciaAnios: 5,
    modalidad: "Remota",
    habilidades: ["Python", "SQL", "Git"],
    fechaDisponibilidad: "2026-11-20",
    aspiracionSalarial: 1800,
    resumen: "Especialista en extracción y modelado de datos con Python y SQL para análisis predictivo.",
    consentimiento: true
  },
  {
    nombres: "Valeria Torres",
    correo: "valeria.torres@testmail.com",
    telefono: "0998877665",
    fechaNacimiento: "2001-02-10",
    cargo: "Diseñador UX/UI",
    nivelAcademico: "Tercer nivel",
    experienciaAnios: 2,
    modalidad: "Presencial",
    habilidades: ["JavaScript", "Git"],
    fechaDisponibilidad: "2026-12-15",
    aspiracionSalarial: 1000,
    resumen: "Diseñadora centrada en la experiencia de usuario, prototipado interactivo e interfaces intuitivas.",
    consentimiento: true
  },
  {
    nombres: "David Salazar",
    correo: "david.salazar@testmail.com",
    telefono: "0971122334",
    fechaNacimiento: "1997-11-05",
    cargo: "Soporte TI",
    nivelAcademico: "Tecnología",
    experienciaAnios: 4,
    modalidad: "Presencial",
    habilidades: ["SQL", "Git", "Firebase"],
    fechaDisponibilidad: "2026-11-25",
    aspiracionSalarial: 900,
    resumen: "Técnico en soporte con experiencia en infraestructura de redes, bases de datos y soporte a usuarios.",
    consentimiento: true
  },
  {
    nombres: "Elena Castillo",
    correo: "elena.castillo@testmail.com",
    telefono: "0965544332",
    fechaNacimiento: "1999-07-30",
    cargo: "Desarrollador móvil",
    nivelAcademico: "Tercer nivel",
    experienciaAnios: 1,
    modalidad: "Remota",
    habilidades: ["Ionic", "Angular", "JavaScript", "Firebase"],
    fechaDisponibilidad: "2026-12-05",
    aspiracionSalarial: 1100,
    resumen: "Ingeniera de software con foco en frontend web y móvil utilizando Angular, Ionic y servicios en la nube.",
    consentimiento: true
  }
];

async function seed() {
  console.log('Iniciando carga de candidatos de prueba...');
  for (const c of candidatosEjemplo) {
    const docRef = await addDoc(collection(db, 'candidatos'), {
      ...c,
      creadoEn: serverTimestamp()
    });
    console.log(`Candidato registrado: ${c.nombres} con ID: ${docRef.id}`);
  }
  const snapshot = await getDocs(collection(db, 'candidatos'));
  console.log(`Total de candidatos en Firestore: ${snapshot.size}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Error al insertar candidatos:', err);
  process.exit(1);
});
