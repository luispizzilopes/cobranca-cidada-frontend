import { useEffect, useState } from 'react';
import { authService } from '../services/auth/authService';
import type { Profile } from '../services/types';

/**
 * Perfil da conta logada (inclui se ela tem senha e se está vinculada ao Google).
 * `profile` é nulo enquanto carrega; se a leitura falhar, o chamador assume a conta comum, com senha.
 */
export function useProfile(enabled: boolean): { profile: Profile | null; loaded: boolean } {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    authService
      .getProfile()
      .then((data) => active && setProfile(data))
      .catch(() => undefined)
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [enabled]);

  return { profile, loaded };
}
