import { environment } from '../../../environments/environment';

export const firebaseIsConfigured = Object.values(environment.firebase)
  .every((value) => value !== 'REEMPLAZAR' && value.trim().length > 0);
