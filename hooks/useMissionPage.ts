import { getScannedSlug } from '@/utils/storage';
import { useEffect, useState } from 'react';

export default function useMissionPage(slugParam?: string) {
  const [page, setPage] = useState<any>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // slug resolve
  useEffect(() => {
    let active = true;

    (async () => {
      if (slugParam) {
        if (active) setSlug(slugParam);
        return;
      }

      const saved = await getScannedSlug();
      if (active) setSlug(saved);
    })();

    return () => {
      active = false;
    };
  }, [slugParam]);

  // api call
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=${slug}`
        );
        const data = await res.json();
        setPage(data?.[0] || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return { page, loading };
}