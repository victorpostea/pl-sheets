/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { InlineField } from '@/components/InlineField'

describe('InlineField', () => {
  it('renders with initial value', () => {
    render(<InlineField initialValue="140" placeholder="—" onSave={jest.fn()} />)
    expect(screen.getByDisplayValue('140')).toBeInTheDocument()
  })

  it('shows placeholder when value is empty', () => {
    render(<InlineField initialValue="" placeholder="—" onSave={jest.fn()} />)
    expect(screen.getByPlaceholderText('—')).toBeInTheDocument()
  })

  it('calls onSave with new value on blur', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined)
    render(<InlineField initialValue="" placeholder="—" onSave={onSave} />)
    const input = screen.getByPlaceholderText('—')
    fireEvent.change(input, { target: { value: '140' } })
    fireEvent.blur(input)
    await waitFor(() => expect(onSave).toHaveBeenCalledWith('140'))
  })

  it('does not call onSave when value is unchanged', async () => {
    const onSave = jest.fn()
    render(<InlineField initialValue="140" placeholder="—" onSave={onSave} />)
    const input = screen.getByDisplayValue('140')
    fireEvent.blur(input)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onSave when Enter is pressed', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined)
    render(<InlineField initialValue="" placeholder="—" onSave={onSave} />)
    const input = screen.getByPlaceholderText('—')
    fireEvent.change(input, { target: { value: '7.5' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(onSave).toHaveBeenCalledWith('7.5'))
  })
})
