interface Product {
  price?: number;
  quantity?: number;
  name?: string;
  unit?: string;
  category?: string;
  checked?: boolean;
}

interface Status {
  checked: number;
  checkedPrice: number;
  unchecked: number;
  uncheckedPrice: number;
  total: number;
  uncheckedItems: Product[];
  checkedItems: Product[];
}

export function calculateStatus(products?: Product[]): Status {
  if (!products) {
    return {
      checked: 0,
      checkedPrice: 0,
      unchecked: 0,
      uncheckedPrice: 0,
      total: 0,
      uncheckedItems: [],
      checkedItems: [],
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
        uncheckedItems: acc.uncheckedItems.concat(cur.checked ? [] : [cur]),
        checkedItems: acc.checkedItems.concat(cur.checked ? [cur] : []),
      };
    },
    {
      checked: 0,
      checkedPrice: 0,
      unchecked: 0,
      uncheckedPrice: 0,
      total: 0,
      uncheckedItems: [],
      checkedItems: [],
    } as Status
  );
}
