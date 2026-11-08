import { useCallback, useEffect, useRef, useState } from 'react';

/** Phone frame vs full desktop layout. Switches `body.desk`, which powers the `desk:` variant. */
export function useView() {
  const [desk, setDesk] = useState(() => window.innerWidth >= 1000);
  const manual = useRef(false);

  useEffect(() => {
    document.body.classList.toggle('desk', desk);
  }, [desk]);

  useEffect(() => {
    const auto = () => {
      const w = window.innerWidth;
      if (w < 900) setDesk(false);
      else if (!manual.current) setDesk(w >= 1000);
    };
    auto();
    window.addEventListener('resize', auto);
    return () => window.removeEventListener('resize', auto);
  }, []);

  const toggleView = useCallback(() => {
    manual.current = true;
    setDesk((d) => !d);
  }, []);

  return { desk, toggleView };
}
