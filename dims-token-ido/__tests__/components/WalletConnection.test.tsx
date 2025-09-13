import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WalletConnection } from '@/components/wallet-connection'

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe('WalletConnection', () => {
  const mockOnConnect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders connect wallet button when not connected', () => {
    render(
      <WalletConnection
        account=""
        onConnect={mockOnConnect}
        error=""
      />
    )

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
    expect(screen.getByText('Connect your wallet to participate')).toBeInTheDocument()
  })

  it('renders connected state when account is provided', () => {
    const mockAccount = '0x1234567890123456789012345678901234567890'
    
    render(
      <WalletConnection
        account={mockAccount}
        onConnect={mockOnConnect}
        error=""
      />
    )

    expect(screen.getByText('Connected to MetaMask')).toBeInTheDocument()
    expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
    expect(screen.queryByText('Connect Wallet')).not.toBeInTheDocument()
  })

  it('calls onConnect when connect button is clicked', async () => {
    render(
      <WalletConnection
        account=""
        onConnect={mockOnConnect}
        error=""
      />
    )

    const connectButton = screen.getByText('Connect Wallet')
    fireEvent.click(connectButton)

    await waitFor(() => {
      expect(mockOnConnect).toHaveBeenCalledTimes(1)
    })
  })

  it('shows loading state when connecting', async () => {
    let resolveConnect: () => void
    const connectPromise = new Promise<void>((resolve) => {
      resolveConnect = resolve
    })
    
    const mockOnConnectAsync = jest.fn(() => connectPromise)

    render(
      <WalletConnection
        account=""
        onConnect={mockOnConnectAsync}
        error=""
      />
    )

    const connectButton = screen.getByText('Connect Wallet')
    fireEvent.click(connectButton)

    await waitFor(() => {
      expect(screen.getByText('Connecting...')).toBeInTheDocument()
    })

    resolveConnect!()
    await connectPromise
  })

  it('displays error message when error is provided', () => {
    const errorMessage = 'Please switch to Sepolia network'
    
    render(
      <WalletConnection
        account=""
        onConnect={mockOnConnect}
        error={errorMessage}
      />
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('formats address correctly', () => {
    const mockAccount = '0x1234567890123456789012345678901234567890'
    
    render(
      <WalletConnection
        account={mockAccount}
        onConnect={mockOnConnect}
        error=""
      />
    )

    // Should show first 6 and last 4 characters
    expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
  })

  it('handles empty account gracefully', () => {
    render(
      <WalletConnection
        account=""
        onConnect={mockOnConnect}
        error=""
      />
    )

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
    expect(screen.queryByText(/0x/)).not.toBeInTheDocument()
  })
})
