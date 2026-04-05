const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
});

export const parsePrice = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const raw = String(value ?? '').trim();
  if (!raw) return 0;

  const cleaned = raw.replace(/[^\d.,-]/g, '');
  if (!cleaned) return 0;

  const hasDot = cleaned.includes('.');
  const hasComma = cleaned.includes(',');

  let normalized = cleaned;
  if (hasDot && hasComma) {
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    normalized = lastComma > lastDot
      ? cleaned.replace(/\./g, '').replace(',', '.')
      : cleaned.replace(/,/g, '');
  } else if (hasComma) {
    normalized = cleaned.replace(',', '.');
  }

  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getDiscountPercentage = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, Math.round(parsed)));
};

export const getDiscountedPrice = (price: unknown, discountPercentage: unknown): number => {
  const originalPrice = parsePrice(price);
  const normalizedDiscount = getDiscountPercentage(discountPercentage);

  return Number((originalPrice * (1 - normalizedDiscount / 100)).toFixed(2));
};

export const getPriceDisplayData = (price: unknown, discountPercentage: unknown) => {
  const originalPrice = parsePrice(price);
  const normalizedDiscount = getDiscountPercentage(discountPercentage);
  const hasDiscount = normalizedDiscount > 0;
  const discountedPrice = hasDiscount
    ? getDiscountedPrice(originalPrice, normalizedDiscount)
    : originalPrice;

  return {
    originalPrice,
    discountedPrice,
    discountPercentage: normalizedDiscount,
    hasDiscount,
  };
};

export const formatCurrency = (value: unknown): string => currencyFormatter.format(parsePrice(value));
