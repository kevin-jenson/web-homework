import React from 'react'
import PropTypes from 'prop-types'
import { css } from '@emotion/core'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import TxCrud from './TxCrud'
import { Trash, Pencil } from '../icons'

const makeDataTestId = (transactionId, fieldName) => `transaction-${transactionId}-${fieldName}`

export function TxTable({ data }) {
  let { transactions } = data
  let [state, dispatch] = React.useReducer(
    (_state, action) => {
      switch (action.type) {
        case 'CLOSE':
          return { open: false, event: null, transaction: {} }
        case 'DELETE':
          return { open: true, event: 'DELETE', transaction: action.transaction }
        case 'EDIT':
          return { open: true, event: 'EDIT', transaction: action.transaction }
        case 'CREATE':
          return { open: true, event: 'CREATE', transaction: {} }
        default:
          throw new Error(`Action type: ${action.type} not allowed`)
      }
    },
    { open: false, event: null, transaction: {} }
  )

  function handleClose() {
    dispatch({ type: 'CLOSE' })
  }

  function handleOpen(type, transaction) {
    dispatch({ type, transaction })
  }

  return (
    <div css={tableContainer}>
      <h1>Transactions</h1>

      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow css={css`
              &>th {
                font-weight: bold;
              }
            `}>
              <TableCell>ID</TableCell>
              <TableCell align='left'>User ID</TableCell>
              <TableCell align='left'>Description</TableCell>
              <TableCell align='left'>Merchant ID</TableCell>
              <TableCell align='left'>Debit</TableCell>
              <TableCell align='left'>Credit</TableCell>
              <TableCell align='left'>Amount</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.map(tx => {
              const { id, user_id: userId, description, merchant_id: merchantId, debit, credit, amount } = tx
              return (
                <TableRow data-testid={`transaction-${id}`} key={`transaction-${id}`}>
                  <TableCell component='th' data-testid={makeDataTestId(id, 'id')} scope='row'>
                    {id}
                  </TableCell>

                  <TableCell align='left' data-testid={makeDataTestId(id, 'userId')}>
                    {userId}
                  </TableCell>

                  <TableCell align='left' data-testid={makeDataTestId(id, 'description')}>
                    {description}
                  </TableCell>

                  <TableCell align='left' data-testid={makeDataTestId(id, 'merchant')}>
                    {merchantId}
                  </TableCell>

                  <TableCell align='left' data-testid={makeDataTestId(id, 'debit')}>
                    {String(debit)}
                  </TableCell>

                  <TableCell align='left' data-testid={makeDataTestId(id, 'credit')}>
                    {String(credit)}
                  </TableCell>

                  <TableCell align='left' data-testid={makeDataTestId(id, 'amount')}>
                    {new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(amount)}
                  </TableCell>

                  <TableCell align='right' data-testid={makeDataTestId(id, 'actions')}>
                    <IconButton onClick={() => handleOpen('EDIT', tx)}>
                      <Pencil />
                    </IconButton>
                    <IconButton onClick={() => handleOpen('DELETE', tx)}>
                      <Trash />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button color='primary' css={createNewBtn} onClick={() => dispatch({ type: 'CREATE' })}variant='contained'>Create New</Button>

      <TxCrud data={data} event={state.event} handleClose={handleClose} open={state.open} transaction={state.transaction} />
    </div>
  )
}

TxTable.propTypes = {
  data: PropTypes.object
}

const tableContainer = css`
  width: 90vw;
  margin: auto;
`

const createNewBtn = css`
  float: right;
  margin: 16px;
`
