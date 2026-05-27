import { useState, useEffect } from 'react';
import type { PoseOption } from '@/types/types';
import { getJwtToken } from '@/service/auth/auth_service';

const FALLBACK_POSES: PoseOption[] = [
  { id: 'male',   label: 'Male',   thumbnailUrl: '', selected: false },
  { id: 'female', label: 'Female', thumbnailUrl: '', selected: false },
];

export function usePoses() {
  const [poses, setPoses] = useState<PoseOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getJwtToken();
    if (!token) {
      setPoses(FALLBACK_POSES);
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

    fetch(`${apiUrl}/poses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch poses');
        return res.json();
      })
      .then((data: Omit<PoseOption, 'selected'>[]) => {
        setPoses(
          data.map((pose) => ({
            ...pose,
            selected: false,
            thumbnailUrl: pose.thumbnailUrl.startsWith('/')
              ? `${apiUrl}${pose.thumbnailUrl}`
              : pose.thumbnailUrl,
          }))
        );
      })
      .catch(() => {
        setPoses(FALLBACK_POSES);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectGender = (id: string) => {
    setPoses((current) =>
      current.map((pose) => ({ ...pose, selected: pose.id === id }))
    );
  };

  const selectedGender = poses.find((p) => p.selected)?.id ?? null;

  return { poses, loading, selectGender, selectedGender };
}
