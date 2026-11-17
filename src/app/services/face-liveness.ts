import { registerPlugin } from '@capacitor/core';

export interface FaceLivenessPlugin {
  startLiveness(options: { sessionId: string; region?: string }):
    Promise<{ completed: boolean }>;
}

export const FaceLiveness = registerPlugin<FaceLivenessPlugin>('FaceLiveness');
