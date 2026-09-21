// Normalizes any /services response into { services: [], advantages: [] }
export const splitServicesPayload = (payload) => {
  // unwrap laravel collection
  const inner = payload?.data ?? payload;

  // already grouped
  if (inner && !Array.isArray(inner) && (inner.services || inner.advantages)) {
    return {
      services: Array.isArray(inner.services) ? inner.services : [],
      advantages: Array.isArray(inner.advantages) ? inner.advantages : [],
    };
  }

  // flat array — split by type
  const list = Array.isArray(inner) ? inner : [];
  return {
    services: list.filter((s) => (s.type ?? 'srv') === 'srv'),
    advantages: list.filter((s) => s.type === 'adv'),
  };
};

// Normalizes /products, /truck-types, /projects, /categories — same shape family
export const unwrapList = (payload) => {
  const inner = payload?.data ?? payload;
  return Array.isArray(inner) ? inner : [];
};