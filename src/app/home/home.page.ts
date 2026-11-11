import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonDatetime,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonRadio,
  IonCheckbox,
  IonTextarea,
  IonButton,
  IonSpinner,
  IonList,
  IonText,
  IonToast,
  IonChip,
  IonButtons,
  IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';
import { CandidatosService } from '../services/candidatos.service';
import { Candidato } from '../models/candidato.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonDatetime,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonRadioGroup,
    IonRadio,
    IonCheckbox,
    IonTextarea,
    IonButton,
    IonSpinner,
    IonList,
    IonText,
    IonToast,
    IonChip,
    IonButtons,
    IonIcon
  ]
})
export class HomePage implements OnInit {
  private candidatosService = inject(CandidatosService);
  private cdr = inject(ChangeDetectorRef);

  seccionActiva: string = 'registro';

  nombres: string = '';
  correo: string = '';
  telefono: string = '';
  fechaHoy: string = new Date().toISOString().split('T')[0];
  fechaNacimiento: string = '2000-01-01';
  fechaDisponibilidad: string = new Date().toISOString().split('T')[0];

  cargo: string = '';
  nivelAcademico: string = '';
  experienciaAnios: number | null = null;
  modalidad: string = 'Híbrida';
  habilidadesSeleccionadas: string[] = [];
  aspiracionSalarial: number | null = null;
  resumen: string = '';
  consentimiento: boolean = false;

  listaHabilidades: string[] = [
    'Angular',
    'Ionic',
    'JavaScript',
    'Python',
    'SQL',
    'Git',
    'Firebase'
  ];

  guardando: boolean = false;
  errorFormulario: string = '';
  mensajeToast: string = '';
  mostrarToast: boolean = false;

  candidatos: Candidato[] = [];
  cargando: boolean = false;
  candidatoSeleccionado: Candidato | null = null;
  mostrarModalDetalle: boolean = false;

  constructor() {
    addIcons({ 'calendar-outline': calendarOutline, calendarOutline });
  }

  async ngOnInit() {
    await this.cargarCandidatos();
  }

  cambiarSeccion(event: any) {
    this.seccionActiva = event.detail.value;
    if (this.seccionActiva === 'listado') {
      this.cargarCandidatos();
    }
    this.cdr.detectChanges();
  }

  toggleHabilidad(habilidad: string, event: any) {
    const checked = event.detail.checked;
    if (checked && !this.habilidadesSeleccionadas.includes(habilidad)) {
      this.habilidadesSeleccionadas.push(habilidad);
    } else if (!checked) {
      this.habilidadesSeleccionadas = this.habilidadesSeleccionadas.filter(h => h !== habilidad);
    }
  }

  // valida campos obligatorios segun requerimientos del taller
  validarFormulario(): boolean {
    if (!this.nombres || this.nombres.trim().length < 3) {
      this.errorFormulario = 'El nombre debe tener al menos 3 caracteres.';
      return false;
    }

    if (/\d/.test(this.nombres)) {
      this.errorFormulario = 'El nombre no debe contener números.';
      return false;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.correo || !regexCorreo.test(this.correo.trim())) {
      this.errorFormulario = 'Ingrese un correo electrónico válido.';
      return false;
    }

    if (!this.telefono || !/^\d+$/.test(this.telefono.trim())) {
      this.errorFormulario = 'El teléfono no debe contener letras ni caracteres especiales.';
      return false;
    }

    if (this.telefono.trim().length !== 10) {
      this.errorFormulario = 'El teléfono debe tener exactamente 10 dígitos.';
      return false;
    }

    if (!this.fechaNacimiento) {
      this.errorFormulario = 'Seleccione su fecha de nacimiento.';
      return false;
    }

    if (!this.cargo) {
      this.errorFormulario = 'Seleccione el cargo al que postula.';
      return false;
    }

    if (!this.nivelAcademico) {
      this.errorFormulario = 'Seleccione su nivel académico.';
      return false;
    }

    if (this.experienciaAnios === null || this.experienciaAnios < 0 || this.experienciaAnios > 50) {
      this.errorFormulario = 'Los años de experiencia deben estar entre 0 y 50.';
      return false;
    }

    if (!this.modalidad) {
      this.errorFormulario = 'Seleccione la modalidad de trabajo.';
      return false;
    }

    if (this.habilidadesSeleccionadas.length === 0) {
      this.errorFormulario = 'Seleccione al menos una habilidad técnica.';
      return false;
    }

    if (!this.fechaDisponibilidad) {
      this.errorFormulario = 'Seleccione la fecha disponible para iniciar.';
      return false;
    }

    if (!this.aspiracionSalarial || this.aspiracionSalarial <= 0) {
      this.errorFormulario = 'La aspiración salarial debe ser mayor a 0.';
      return false;
    }

    if (!this.resumen || this.resumen.trim().length < 30) {
      this.errorFormulario = 'El resumen profesional debe tener al menos 30 caracteres.';
      return false;
    }

    if (!this.consentimiento) {
      this.errorFormulario = 'Debe aceptar los términos de tratamiento de datos de prueba.';
      return false;
    }

    this.errorFormulario = '';
    return true;
  }

  async guardarCandidato() {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;
    try {
      await this.candidatosService.guardarCandidato({
        nombres: this.nombres.trim(),
        correo: this.correo.trim(),
        telefono: this.telefono.trim(),
        fechaNacimiento: this.fechaNacimiento.split('T')[0],
        cargo: this.cargo,
        nivelAcademico: this.nivelAcademico,
        experienciaAnios: Number(this.experienciaAnios),
        modalidad: this.modalidad,
        habilidades: [...this.habilidadesSeleccionadas],
        fechaDisponibilidad: this.fechaDisponibilidad.split('T')[0],
        aspiracionSalarial: Number(this.aspiracionSalarial),
        resumen: this.resumen.trim(),
        consentimiento: this.consentimiento
      });

      this.limpiarFormulario();
      this.mensajeToast = 'Postulación guardada correctamente.';
      this.mostrarToast = true;
      await this.cargarCandidatos();
    } catch (error) {
      console.error(error);
      this.errorFormulario = 'Error al guardar en Firestore. Verifique la conexión.';
    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }

  async cargarCandidatos() {
    this.cargando = true;
    this.cdr.detectChanges();
    try {
      this.candidatos = await this.candidatosService.obtenerCandidatos();
    } catch (error) {
      console.error(error);
      this.mensajeToast = 'Error al cargar candidatos de Firestore.';
      this.mostrarToast = true;
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  verDetalle(item: Candidato) {
    this.candidatoSeleccionado = item;
    this.mostrarModalDetalle = true;
  }

  cerrarDetalle() {
    this.mostrarModalDetalle = false;
    this.candidatoSeleccionado = null;
  }

  limpiarFormulario() {
    this.nombres = '';
    this.correo = '';
    this.telefono = '';
    this.fechaNacimiento = '2000-01-01';
    this.cargo = '';
    this.nivelAcademico = '';
    this.experienciaAnios = null;
    this.modalidad = 'Híbrida';
    this.habilidadesSeleccionadas = [];
    this.fechaDisponibilidad = this.fechaHoy;
    this.aspiracionSalarial = null;
    this.resumen = '';
    this.consentimiento = false;
    this.errorFormulario = '';
  }
}
