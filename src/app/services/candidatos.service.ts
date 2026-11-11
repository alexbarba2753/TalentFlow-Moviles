import { Injectable } from '@angular/core';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { addDoc, collection, getDocs, getFirestore, serverTimestamp } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Candidato } from '../models/candidato.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatosService {
  private app = getApps().length ? getApp() : initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  guardarCandidato(candidato: Omit<Candidato, 'id' | 'creadoEn'>) {
    const data = {
      ...candidato,
      creadoEn: serverTimestamp()
    };
    return addDoc(collection(this.db, 'candidatos'), data);
  }

  async obtenerCandidatos(): Promise<Candidato[]> {
    const snapshot = await getDocs(collection(this.db, 'candidatos'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Candidato, 'id'>)
    }));
  }
}
