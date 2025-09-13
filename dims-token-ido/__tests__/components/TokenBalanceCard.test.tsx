import { render, screen } from '@testing-library/react'
import { TokenBalanceCard } from '@/components/token-balance-card'

describe('TokenBalanceCard', () => {
  it('renders user balance card correctly', () => {
    render(
      <TokenBalanceCard
        userBalance="1000.1234"
        idoBalance="50000.5678"
        isConnected={true}
      />
    )

    expect(screen.getByText('Your DIMS Balance')).toBeInTheDocument()
    expect(screen.getByText('1000.1234')).toBeInTheDocument()
    expect(screen.getByText('DIMS')).toBeInTheDocument()
    expect(screen.getByText('DimsToken')).toBeInTheDocument()
  })

  it('renders IDO pool balance card correctly', () => {
    render(
      <TokenBalanceCard
        userBalance="1000.1234"
        idoBalance="50000.5678"
        isConnected={true}
      />
    )

    expect(screen.getByText('IDO Pool Balance')).toBeInTheDocument()
    expect(screen.getByText('50000.5678')).toBeInTheDocument()
    expect(screen.getByText('Available for Purchase')).toBeInTheDocument()
  })

  it('shows zero balance when not connected', () => {
    render(
      <TokenBalanceCard
        userBalance="1000.1234"
        idoBalance="50000.5678"
        isConnected={false}
      />
    )

    const balanceElements = screen.getAllByText('0.0000')
    expect(balanceElements).toHaveLength(2)
  })

  it('formats balance correctly with 4 decimal places', () => {
    render(
      <TokenBalanceCard
        userBalance="1234.567890123"
        idoBalance="98765.432109876"
        isConnected={true}
      />
    )

    expect(screen.getByText('1234.5679')).toBeInTheDocument()
    expect(screen.getByText('98765.4321')).toBeInTheDocument()
  })

  it('handles zero balance correctly', () => {
    render(
      <TokenBalanceCard
        userBalance="0"
        idoBalance="0"
        isConnected={true}
      />
    )

    expect(screen.getByText('0.0000')).toBeInTheDocument()
  })

  it('handles very large numbers correctly', () => {
    render(
      <TokenBalanceCard
        userBalance="999999999.9999"
        idoBalance="1000000000.0000"
        isConnected={true}
      />
    )

    expect(screen.getByText('999999999.9999')).toBeInTheDocument()
    expect(screen.getByText('1000000000.0000')).toBeInTheDocument()
  })

  it('renders both cards in grid layout', () => {
    const { container } = render(
      <TokenBalanceCard
        userBalance="1000"
        idoBalance="50000"
        isConnected={true}
      />
    )

    const cards = container.querySelectorAll('[class*="grid"]')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('displays correct icons for each card', () => {
    render(
      <TokenBalanceCard
        userBalance="1000"
        idoBalance="50000"
        isConnected={true}
      />
    )

    // Check for icon containers (they have specific classes)
    const iconContainers = document.querySelectorAll('[class*="p-2"][class*="rounded-lg"]')
    expect(iconContainers).toHaveLength(2)
  })
})
