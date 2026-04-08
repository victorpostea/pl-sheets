/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PinPad } from '@/components/PinPad'

describe('PinPad', () => {
  it('calls onSubmit with 4-digit PIN after 4th digit pressed', () => {
    const onSubmit = jest.fn()
    render(<PinPad onSubmit={onSubmit} />)
    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('7'))
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('8'))
    expect(onSubmit).toHaveBeenCalledWith('1738')
  })

  it('shows error message when error prop is provided', () => {
    render(<PinPad onSubmit={jest.fn()} error="Wrong PIN" />)
    expect(screen.getByText('Wrong PIN')).toBeInTheDocument()
  })

  it('delete button removes last digit so submit is not called after 4 taps', () => {
    const onSubmit = jest.fn()
    render(<PinPad onSubmit={onSubmit} />)
    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('7'))
    fireEvent.click(screen.getByText('⌫'))  // removes '7', pin is now '1'
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('8'))
    // PIN is '138' — only 3 digits entered after delete, no submit yet
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('resets to empty after submission', () => {
    const onSubmit = jest.fn()
    render(<PinPad onSubmit={onSubmit} />)
    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('7'))
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('8'))
    // After submit, all dots should be unfilled
    const dots = document.querySelectorAll('[data-testid="dot"]')
    expect(dots).toHaveLength(4)
    dots.forEach(dot => expect(dot).not.toHaveClass('bg-white'))
  })
})
