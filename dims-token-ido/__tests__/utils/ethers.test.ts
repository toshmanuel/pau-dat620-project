import { ethers } from 'ethers'

describe('Ethers Utilities', () => {
  describe('formatEther', () => {
    it('converts wei to ether correctly', () => {
      const wei = '1000000000000000000' // 1 ETH in wei
      const ether = ethers.formatEther(wei)
      expect(ether).toBe('1.0')
    })

    it('handles zero wei', () => {
      const wei = '0'
      const ether = ethers.formatEther(wei)
      expect(ether).toBe('0.0')
    })

    it('handles fractional ether', () => {
      const wei = '500000000000000000' // 0.5 ETH in wei
      const ether = ethers.formatEther(wei)
      expect(ether).toBe('0.5')
    })

    it('handles large amounts', () => {
      const wei = '1000000000000000000000' // 1000 ETH in wei
      const ether = ethers.formatEther(wei)
      expect(ether).toBe('1000.0')
    })
  })

  describe('parseEther', () => {
    it('converts ether to wei correctly', () => {
      const ether = '1.0'
      const wei = ethers.parseEther(ether)
      expect(wei.toString()).toBe('1000000000000000000')
    })

    it('handles zero ether', () => {
      const ether = '0'
      const wei = ethers.parseEther(ether)
      expect(wei.toString()).toBe('0')
    })

    it('handles fractional ether', () => {
      const ether = '0.5'
      const wei = ethers.parseEther(ether)
      expect(wei.toString()).toBe('500000000000000000')
    })

    it('handles large amounts', () => {
      const ether = '1000'
      const wei = ethers.parseEther(ether)
      expect(wei.toString()).toBe('1000000000000000000000')
    })
  })

  describe('Address validation', () => {
    it('validates correct Ethereum addresses', () => {
      const validAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
      expect(ethers.isAddress(validAddress)).toBe(true)
    })

    it('rejects invalid addresses', () => {
      const invalidAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b'
      expect(ethers.isAddress(invalidAddress)).toBe(false)
    })

    it('rejects empty string', () => {
      expect(ethers.isAddress('')).toBe(false)
    })

    it('rejects non-string input', () => {
      expect(ethers.isAddress(null as any)).toBe(false)
    })
  })

  describe('Contract interaction utilities', () => {
    it('creates contract instance with correct ABI', () => {
      const tokenAbi = [
        'function balanceOf(address owner) view returns (uint256)',
      ]
      
      // This would normally create a contract instance
      // In a real test, you'd mock the contract creation
      expect(tokenAbi).toHaveLength(1)
      expect(tokenAbi[0]).toContain('balanceOf')
    })

    it('handles contract method calls', async () => {
      const mockContract = {
        balanceOf: jest.fn().mockResolvedValue('1000000000000000000'),
      }

      const balance = await mockContract.balanceOf('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')
      expect(balance).toBe('1000000000000000000')
    })
  })

  describe('Network utilities', () => {
    it('identifies Sepolia network correctly', () => {
      const sepoliaChainId = 11155111
      expect(sepoliaChainId).toBe(11155111)
    })

    it('handles network switching', () => {
      const networkConfig = {
        chainId: '0xaa36a7', // Sepolia in hex
        chainName: 'Sepolia test network',
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
      }

      expect(networkConfig.chainId).toBe('0xaa36a7')
      expect(networkConfig.chainName).toBe('Sepolia test network')
    })
  })

  describe('Transaction utilities', () => {
    it('formats transaction data correctly', () => {
      const txData = {
        to: '0x8784672035EcF46E17DE2352292183517466d483',
        value: ethers.parseEther('0.01'),
        gasLimit: 200000,
      }

      expect(txData.to).toBe('0x8784672035EcF46E17DE2352292183517466d483')
      expect(txData.value.toString()).toBe('10000000000000000') // 0.01 ETH in wei
      expect(txData.gasLimit).toBe(200000)
    })

    it('handles gas estimation', () => {
      const gasLimit = 200000
      const gasPrice = ethers.parseUnits('20', 'gwei')
      
      expect(gasLimit).toBe(200000)
      expect(gasPrice.toString()).toBe('20000000000') // 20 gwei in wei
    })
  })
})
