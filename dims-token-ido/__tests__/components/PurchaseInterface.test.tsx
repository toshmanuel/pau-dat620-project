import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PurchaseInterface } from '@/components/purchase-interface'

describe('PurchaseInterface', () => {
  const mockOnBuyTokens = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders purchase interface correctly', () => {
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={1000}
      />
    )

    expect(screen.getByText('Purchase DimsTokens')).toBeInTheDocument()
    expect(screen.getByLabelText('ETH Amount')).toBeInTheDocument()
    expect(screen.getByDisplayValue('0.01')).toBeInTheDocument()
  })

  it('calculates estimated tokens correctly', () => {
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={1000}
      />
    )

    // With default 0.01 ETH and rate of 1000, should show 10 tokens
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Rate: 1 ETH = 1,000 DIMS')).toBeInTheDocument()
  })

  it('updates estimated tokens when ETH amount changes', async () => {
    const user = userEvent.setup()
    
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={1000}
      />
    )

    const ethInput = screen.getByLabelText('ETH Amount')
    await act(async () => {
      await user.clear(ethInput)
      await user.type(ethInput, '0.05')
    })

    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument()
    })
  })

  it('shows correct button text when connected', () => {
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={1000}
      />
    )

    expect(screen.getByText('Buy 10 DIMS')).toBeInTheDocument()
  })

  it('shows correct button text when not connected', () => {
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={false}
        isLoading={false}
        rate={1000}
      />
    )

    expect(screen.getByText('Connect Wallet First')).toBeInTheDocument()
  })

  it('calls onBuyTokens when purchase button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={1000}
      />
    )

    const purchaseButton = screen.getByText('Buy 10 DIMS')
    await act(async () => {
      await user.click(purchaseButton)
    })

    expect(mockOnBuyTokens).toHaveBeenCalledTimes(1)
  })

  it('disables button when not connected', () => {
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={false}
        isLoading={false}
        rate={1000}
      />
    )

    const purchaseButton = screen.getByRole('button', { name: /Connect Wallet First/i })
    expect(purchaseButton).toBeDisabled()
  })

  it('disables button when loading', () => {
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={true}
        rate={1000}
      />
    )

    const purchaseButton = screen.getByRole('button')
    expect(purchaseButton).toBeDisabled()
  })

  it('shows processing state when isProcessing is true', async () => {
    // Mock the onBuyTokens to be async
    const asyncMockOnBuyTokens = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )
    
    const user = userEvent.setup()
    
    render(
      <PurchaseInterface
        onBuyTokens={asyncMockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={1000}
      />
    )

    const purchaseButton = screen.getByText('Buy 10 DIMS')
    
    // Click the button and wait for processing state
    await act(async () => {
      await user.click(purchaseButton)
    })

    // The component should show processing state
    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('handles different rates correctly', () => {
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={5000}
      />
    )

    // With 0.01 ETH and rate of 5000, should show 50 tokens
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('Rate: 1 ETH = 5,000 DIMS')).toBeInTheDocument()
  })

  it('handles zero ETH amount', async () => {
    const user = userEvent.setup()
    
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={1000}
      />
    )

    const ethInput = screen.getByLabelText('ETH Amount')
    await act(async () => {
      await user.clear(ethInput)
      await user.type(ethInput, '0')
    })

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  it('shows Sepolia testnet badge', () => {
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={1000}
      />
    )

    expect(screen.getByText('Sepolia Testnet')).toBeInTheDocument()
  })

  it('formats large numbers correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <PurchaseInterface
        onBuyTokens={mockOnBuyTokens}
        isConnected={true}
        isLoading={false}
        rate={1000000}
      />
    )

    const ethInput = screen.getByLabelText('ETH Amount')
    await act(async () => {
      await user.clear(ethInput)
      await user.type(ethInput, '1.5')
    })

    await waitFor(() => {
      expect(screen.getByText('1,500,000')).toBeInTheDocument()
    })
  })
})
