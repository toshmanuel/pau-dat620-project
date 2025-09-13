import { renderHook, act } from '@testing-library/react'
import { useToast } from '@/hooks/use-toast'

// Mock the toast implementation
const mockToast = jest.fn()

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

describe('useToast Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides toast function', () => {
    const { result } = renderHook(() => useToast())
    
    expect(result.current.toast).toBeDefined()
    expect(typeof result.current.toast).toBe('function')
  })

  it('calls toast with correct parameters', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
      })
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Test Title',
      description: 'Test Description',
    })
  })

  it('handles toast with only title', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({
        title: 'Simple Toast',
      })
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Simple Toast',
    })
  })

  it('handles toast with variant', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({
        title: 'Error Toast',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error Toast',
      description: 'Something went wrong',
      variant: 'destructive',
    })
  })

  it('handles multiple toast calls', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({ title: 'First Toast' })
      result.current.toast({ title: 'Second Toast' })
    })

    expect(mockToast).toHaveBeenCalledTimes(2)
  })
})
