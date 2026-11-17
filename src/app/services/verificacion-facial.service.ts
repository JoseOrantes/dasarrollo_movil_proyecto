import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FaceLiveness } from './face-liveness';

@Injectable({ providedIn: 'root' })
export class VerificacionFacialService {
  private readonly URL_BACKEND = 'https://202407391.aplicacionesweb2026.com';
  private readonly URL_GET_SESSION = 'https://z7x5f3gxwk5fo54d57h5dj3vu40dmnmz.lambda-url.us-east-2.on.aws/';
  private readonly URL_GET_RESULTS = 'https://g5fknbtkojh5ev32sitjvslbwa0qxgmy.lambda-url.us-east-2.on.aws/';
  private readonly URL_COMPARE = 'https://fldpbsvh25yo2eftlcfuwi7mgy0csxdv.lambda-url.us-east-2.on.aws/';
  private readonly ID_USUARIO_REFERENCIA = 1;

  constructor(private http: HttpClient) {}

  async verificar(): Promise<{ acceso: boolean; mensaje: string }> {
    // 1. Session ID (Lambda 1)
    const sesion = await firstValueFrom(
      this.http.get<any>(this.URL_GET_SESSION)
    );
    const sessionId =
      typeof sesion === 'string' ? sesion : sesion?.sessionId ?? null;
    console.log('[VF] 1 sesion', JSON.stringify(sesion), 'sessionId=', sessionId);
    if (!sessionId) {
      return { acceso: false, mensaje: 'No se obtuvo sessionId' };
    }

    // 2. Captura con el ovalo de Amplify (sin edicion)
    try {
      const r = await FaceLiveness.startLiveness({ sessionId, region: 'us-east-1' });
      console.log('[VF] 2 liveness OK', JSON.stringify(r));
    } catch (err: any) {
      console.log('[VF] 2 liveness ERROR', err?.code, err?.message, JSON.stringify(err?.data ?? null));
      return { acceso: false, mensaje: err?.message ?? 'Verificacion cancelada' };
    }

    // 3. Foto en vivo (Lambda 2)
    const resultados = await firstValueFrom(
      this.http.post<any>(this.URL_GET_RESULTS, { sessionId })
    );
    console.log('[VF] 3 resultados', JSON.stringify({ ...resultados, referenceImageBase64: resultados?.referenceImageBase64?.length ?? null }));
    const fotoEnVivo: string | null = resultados?.referenceImageBase64 ?? null;
    if (!fotoEnVivo) {
      return { acceso: false, mensaje: 'No se obtuvo foto en vivo' };
    }

    // 4. Foto de perfil desde la base de datos (id_user = 1)
    const perfil = await firstValueFrom(
      this.http.get<any>(
        `${this.URL_BACKEND}/api/users/${this.ID_USUARIO_REFERENCIA}/profile`
      )
    );
    const fotoPerfil: string | null = perfil?.body?.fotoBase64?.replace(/\s/g, '') ?? null;
    console.log('[VF] 4 perfil', fotoPerfil?.length ?? null);
    if (!fotoPerfil) {
      return { acceso: false, mensaje: 'El usuario no tiene foto de perfil' };
    }

    // 5. Comparacion (Lambda 3)
    const comparacion = await firstValueFrom(
      this.http.post<any>(this.URL_COMPARE, {
        sourceImageBase64: fotoEnVivo,
        targetImageBase64: fotoPerfil,
      })
    );
    console.log('[VF] 5 comparacion', JSON.stringify(comparacion));

    return comparacion?.isMatch
      ? { acceso: true, mensaje: `Coincidencia: ${Number(comparacion.similarity).toFixed(1)}%` }
      : { acceso: false, mensaje: 'El rostro no coincide con la foto registrada' };
  }
}
