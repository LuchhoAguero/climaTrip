import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from, map, of, switchMap, throwError } from 'rxjs';
import { SavedCity, SavedCityUpdate } from '../models/saved-city.model';

@Injectable({ providedIn: 'root' })
export class SavedCityService {
  private readonly firestore = inject(Firestore, { optional: true });

  getSavedCities(uid: string): Observable<SavedCity[]> {
    if (!this.firestore) return this.configurationError();

    const savedCities = query(
      collection(this.firestore, `users/${uid}/savedCities`),
      orderBy('createdAt', 'desc'),
    );
    return collectionData(savedCities, { idField: 'id' }).pipe(
      map((cities) => cities as SavedCity[]),
    );
  }

  getSavedCityByExternalId(uid: string, cityExternalId: number): Observable<SavedCity | null> {
    if (!this.firestore) return of(null);

    const savedCity = doc(this.firestore, `users/${uid}/savedCities/${cityExternalId}`);
    return from(getDoc(savedCity)).pipe(
      map((snapshot) => snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as SavedCity) : null),
    );
  }

  isCitySaved(uid: string, cityExternalId: number): Observable<boolean> {
    return this.getSavedCityByExternalId(uid, cityExternalId).pipe(map(Boolean));
  }

  createSavedCity(uid: string, city: Omit<SavedCity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Observable<string> {
    if (!this.firestore) return this.configurationError();

    const savedCity = doc(this.firestore, `users/${uid}/savedCities/${city.cityExternalId}`);
    return from(getDoc(savedCity)).pipe(
      switchMap((snapshot) => {
        if (snapshot.exists()) {
          return throwError(() => new Error('Esta ciudad ya está guardada en tu lista.'));
        }

        return from(setDoc(savedCity, {
          ...city,
          userId: uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })).pipe(map(() => savedCity.id));
      }),
    );
  }

  updateSavedCity(uid: string, documentId: string, changes: SavedCityUpdate): Observable<void> {
    if (!this.firestore) return this.configurationError();

    const savedCity = doc(this.firestore, `users/${uid}/savedCities/${documentId}`);
    return from(updateDoc(savedCity, {
      ...changes,
      updatedAt: serverTimestamp(),
    }));
  }

  deleteSavedCity(uid: string, documentId: string): Observable<void> {
    if (!this.firestore) return this.configurationError();
    return from(deleteDoc(doc(this.firestore, `users/${uid}/savedCities/${documentId}`)));
  }

  private configurationError(): Observable<never> {
    return throwError(() => new Error('Firebase todavía no está configurado. Completá el environment antes de usar ciudades guardadas.'));
  }
}
