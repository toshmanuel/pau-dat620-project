import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock providers and context
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock ethers utilities
export const mockEthers = {
  formatEther: (value: string | bigint) => {
    const num = typeof value === 'string' ? BigInt(value) : value
    return (Number(num) / 1e18).toString()
  },
  parseEther: (value: string) => {
    return (Number(value) * 1e18).toString()
  },
  isAddress: (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  },
}

// Mock contract responses
export const mockContractResponses = {
  balanceOf: '1000000000000000000', // 1 ETH worth of tokens
  rate: '66225165', // Rate from contract
  totalSupply: '1000000000000000000000000000', // 1 billion tokens
}

// Mock network responses
export const mockNetworkResponses = {
  sepolia: {
    name: 'sepolia',
    chainId: 11155111n,
  },
  mainnet: {
    name: 'homestead',
    chainId: 1n,
  },
}

// Mock transaction responses
export const mockTransactionResponses = {
  success: {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    wait: jest.fn().mockResolvedValue({
      status: 1,
      gasUsed: 200000n,
    }),
  },
  failure: {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    wait: jest.fn().mockRejectedValue(new Error('Transaction failed')),
  },
}

// Test data
export const testData = {
  addresses: {
    token: '0x12988493e2b178B0E3279cE89d4b88CcB2878f61',
    ido: '0x8784672035EcF46E17DE2352292183517466d483',
    user: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  },
  amounts: {
    eth: '0.01',
    tokens: '662251.65',
    wei: '10000000000000000',
  },
  rates: {
    default: 66225165,
    high: 1000000,
    low: 1000,
  },
}

// Helper functions
export const createMockProvider = (network = 'sepolia') => ({
  getNetwork: jest.fn().mockResolvedValue(mockNetworkResponses[network as keyof typeof mockNetworkResponses]),
  getSigner: jest.fn().mockResolvedValue({
    getAddress: jest.fn().mockResolvedValue(testData.addresses.user),
    sendTransaction: jest.fn().mockResolvedValue(mockTransactionResponses.success),
  }),
  getBalance: jest.fn().mockResolvedValue('1000000000000000000'), // 1 ETH
})

export const createMockContract = (responses = mockContractResponses) => ({
  balanceOf: jest.fn().mockResolvedValue(responses.balanceOf),
  rate: jest.fn().mockResolvedValue(responses.rate),
  totalSupply: jest.fn().mockResolvedValue(responses.totalSupply),
  buyTokens: jest.fn().mockResolvedValue(mockTransactionResponses.success),
  transfer: jest.fn().mockResolvedValue(mockTransactionResponses.success),
  approve: jest.fn().mockResolvedValue(mockTransactionResponses.success),
})

// Mock window.ethereum
export const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isMetaMask: true,
  selectedAddress: testData.addresses.user,
  chainId: '0xaa36a7', // Sepolia
}

// Setup function for tests
export const setupTestEnvironment = () => {
  // Mock window.ethereum
  Object.defineProperty(window, 'ethereum', {
    value: mockEthereum,
    writable: true,
  })

  // Mock environment variables
  process.env.NEXT_PUBLIC_TOKEN_ADDRESS = testData.addresses.token
  process.env.NEXT_PUBLIC_IDO_ADDRESS = testData.addresses.ido
}

// Cleanup function for tests
export const cleanupTestEnvironment = () => {
  jest.clearAllMocks()
  delete (window as any).ethereum
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
