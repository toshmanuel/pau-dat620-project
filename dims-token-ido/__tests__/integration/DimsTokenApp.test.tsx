import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DimsTokenIDO from '@/app/page'

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    formatEther: jest.fn((value) => (Number(value) / 1e18).toString()),
    parseEther: jest.fn((value) => (Number(value) * 1e18).toString()),
    BrowserProvider: jest.fn(),
    Contract: jest.fn(),
  },
}))

// Mock window.ethereum
const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
}

Object.defineProperty(window, 'ethereum', {
  value: mockEthereum,
  writable: true,
})

describe('DimsTokenIDO Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockEthereum.request.mockResolvedValue(['0x1234567890123456789012345678901234567890'])
  })

  it('renders the main application', () => {
    render(<DimsTokenIDO />)

    expect(screen.getByText('DimsToken IDO')).toBeInTheDocument()
    expect(screen.getByText('Join the DimsToken Revolution')).toBeInTheDocument()
  })

  it('shows connect wallet button initially', () => {
    render(<DimsTokenIDO />)

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  it('displays contract addresses', () => {
    render(<DimsTokenIDO />)

    expect(screen.getByText('Token Contract')).toBeInTheDocument()
    expect(screen.getByText('IDO Contract')).toBeInTheDocument()
  })

  it('shows network information', () => {
    render(<DimsTokenIDO />)

    // Use getAllByText since there are multiple "Sepolia Testnet" elements
    expect(screen.getAllByText('Sepolia Testnet')).toHaveLength(2)
    expect(screen.getByText('Powered by Ethereum')).toBeInTheDocument()
  })

  it('displays security badges', () => {
    render(<DimsTokenIDO />)

    expect(screen.getByText('Secure')).toBeInTheDocument()
    expect(screen.getByText('Fast')).toBeInTheDocument()
  })

  it('shows footer information', () => {
    render(<DimsTokenIDO />)

    // Check for footer text that actually exists in the component
    expect(screen.getByText('Built with security and transparency in mind. Always verify contract addresses before transacting.')).toBeInTheDocument()
  })
})

describe('DimsTokenIDO Error Handling', () => {
  it('handles missing MetaMask gracefully', () => {
    // Remove ethereum from window
    delete (window as any).ethereum

    render(<DimsTokenIDO />)

    // Component should still render without crashing
    expect(screen.getByText('DimsToken IDO')).toBeInTheDocument()
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  it('handles network errors gracefully', () => {
    const mockProvider = {
      getNetwork: jest.fn().mockResolvedValue({
        name: 'homestead',
        chainId: 1n,
      }),
      getSigner: jest.fn(),
    }

    const mockContract = {
      balanceOf: jest.fn(),
      rate: jest.fn(),
    }

    const { ethers } = require('ethers')
    ethers.BrowserProvider.mockImplementation(() => mockProvider)
    ethers.Contract.mockImplementation(() => mockContract)

    render(<DimsTokenIDO />)

    // Component should render without crashing
    expect(screen.getByText('DimsToken IDO')).toBeInTheDocument()
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })
})

describe('DimsTokenIDO Component Integration', () => {
  it('renders all main components', () => {
    render(<DimsTokenIDO />)

    // Check for main component sections
    expect(screen.getByText('Wallet Connection')).toBeInTheDocument()
    expect(screen.getByText('Your DIMS Balance')).toBeInTheDocument()
    expect(screen.getByText('IDO Pool Balance')).toBeInTheDocument()
    expect(screen.getByText('Purchase DimsTokens')).toBeInTheDocument()
  })

  it('maintains consistent styling and layout', () => {
    const { container } = render(<DimsTokenIDO />)

    // Check for main layout classes
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
    expect(container.querySelector('.container')).toBeInTheDocument()
  })
})
