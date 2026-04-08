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

  it('delete corrects the PIN before submission', () => {
    const onSubmit = jest.fn()
    render(<PinPad onSubmit={onSubmit} />)
    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('7'))
    fireEvent.click(screen.getByLabelText('Delete'))  // removes '7', pin is '1'
    fireEvent.click(screen.getByText('7'))  // re-enter correct digit
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('8'))
    // PIN should be '1738', not '1738' with a stray '7' or wrong digit
    expect(onSubmit).toHaveBeenCalledWith('1738')
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
