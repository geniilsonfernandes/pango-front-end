import { render, screen, userEvent } from '@test-utils';
import { vi } from 'vitest';
import { ProductButton, type ProductButtonProps } from './ProductButton';

const setup = (overrides: Partial<ProductButtonProps> = {}) => {
  const defaultProps: ProductButtonProps = {
    onIncrement: vi.fn(),
    onDecrement: vi.fn(),
    onRemove: vi.fn(),
    name: 'Banana',
    product: { name: 'banana', category: 'fruits', quantity: 2 },
    ...overrides,
  };

  render(<ProductButton {...defaultProps} />);
  return {
    ...defaultProps,
    incrementButton: screen.getByLabelText('increment-button'),
    decrementButton: screen.queryByLabelText('decrement-button'),
    removeButton: screen.queryByLabelText('remove-button'),
    name: screen.getByText(defaultProps.name),
    quantity: (defaultProps.product?.quantity ?? 0) > 1 ? screen.getByLabelText('quantity') : null,
    button: screen.getByLabelText(defaultProps.name),
  };
};

describe('ProductButton component', () => {
  it('renders with correct props and selected state', () => {
    const { name, quantity, button } = setup();

    expect(name).toBeInTheDocument();
    expect(quantity).toHaveTextContent('2');
    expect(button).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onIncrement when increment button is clicked', async () => {
    const user = userEvent.setup();
    const { incrementButton, onIncrement } = setup();

    await user.click(incrementButton);

    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  it('calls onDecrement when decrement button is clicked', async () => {
    const user = userEvent.setup();
    const { decrementButton, onDecrement } = setup();

    if (decrementButton) {
      await user.click(decrementButton);
      expect(onDecrement).toHaveBeenCalledTimes(1);
    } else {
      throw new Error('Decrement button should be rendered');
    }
  });

  it('shows trash icon when product quantity is 1 and calls onRemove', async () => {
    const user = userEvent.setup();
    const { removeButton, onRemove } = setup({
      product: { category: 'fruits', name: 'banana', quantity: 1 },
    });

    if (removeButton) {
      await user.click(removeButton);
      expect(onRemove).toHaveBeenCalledTimes(1);
    } else {
      throw new Error('Remove button should be rendered');
    }
  });

  it('matches the snapshot when product is selected', () => {
    const { button } = setup();
    expect(button).toMatchSnapshot();
  });
});
