interface Product {
  price?: number;
  quantity?: number;
  checked?: boolean;
}

interface Status {
  checked: number;
  checkedPrice: number;
  unchecked: number;
  uncheckedPrice: number;
  total: number;
}

export function calculateStatus(products?: Product[]): Status {
  if (!products) {
    return {
      checked: 0,
      checkedPrice: 0,
      unchecked: 0,
      uncheckedPrice: 0,
      total: 0,
    };
  }

  return products.reduce(
    (acc, cur) => {
      const price = (cur?.price || 0) * (cur.quantity || 1);
      return {
        checked: acc.checked + (cur.checked ? 1 : 0),
        checkedPrice: acc.checkedPrice + (cur.checked ? price : 0),
        unchecked: acc.unchecked + (cur.checked ? 0 : 1),
        uncheckedPrice: acc.uncheckedPrice + (cur.checked ? 0 : price),
        total: acc.total + 1,
      };
    },
    {
      checked: 0,
      checkedPrice: 0,
      unchecked: 0,
      uncheckedPrice: 0,
      total: 0,
    }
  );
}
