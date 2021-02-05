import React from 'react'
import { render, cleanup } from '@testing-library/react'
import TxTable from './TxTable'

jest.mock('@apollo/client')
jest.mock('./TxCrud.js', () => () => null)

describe('Transactions Table', () => {
  afterEach(() => {
    cleanup()
  })

  let mockData = {
    transactions: [
      {
        id: 'transaction6',
        user_id: 'employee4',
        description: 'a description',
        merchant_id: 'merchant1',
        debit: false,
        credit: true,
        amount: 150
      }
    ]
  }

  test('should show user "employee4" with amount "150"', () => {
    let { getByText } = render(<TxTable data={mockData} />)

    expect(getByText('employee4')).toBeInTheDocument()
    expect(getByText('$150.00')).toBeInTheDocument()
  })
})
