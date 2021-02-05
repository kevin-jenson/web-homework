import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import MuiTextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import MuiSelect from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Grid from '@material-ui/core/Grid'
import { css } from '@emotion/core'
import { gql, useMutation } from '@apollo/client'

import Modal from '../Modal'
import DeleteTransaction from '../../gql/delete_transaction.gql'
import UpdateTransaction from '../../gql/update_transaction.gql'
import CreateTransaction from '../../gql/create_transaction.gql'
import toRomanNumeral from '../../toRomanNumeral'
import { RomanNumeralContext } from '../../routes'

function TxCrud({ handleClose, open, event, transaction, data }) {
  let [deleteTransaction] = useMutation(DeleteTransaction)
  let [updateTransaction] = useMutation(UpdateTransaction)
  let [createTransaction] = useMutation(CreateTransaction)
  let romanNumeralsChecked = React.useContext(RomanNumeralContext)

  let [form, setForm] = React.useState({ ...transaction })
  React.useEffect(() => {
    setForm(transaction)
  }, [transaction])

  function handleChange(name, value) {
    if (name === 'credit') {
      setForm(form => ({ ...form, credit: true, debit: false }))
    } else if (name === 'debit') {
      setForm(form => ({ ...form, credit: false, debit: true }))
    } else {
      setForm(form => ({ ...form, [name]: value }))
    }
  }

  function handleCreate() {
    createTransaction({
      variables: {
        amount: Number(form.amount),
        companyId: form.company_id,
        credit: form.credit,
        debit: form.debit,
        description: form.description,
        userId: form.user_id,
        merchantId: form.merchant_id
      },
      update: (cache, { data: { createTransaction } }) => {
        cache.modify({
          fields: {
            transactions(existingTransactions = []) {
              const newTx = cache.writeFragment({
                data: createTransaction,
                fragment: gql`
                  fragment CreatedTransaction on Transactions {
                    id
                    type
                  }
                `
              })

              return [...existingTransactions, newTx]
            }
          }
        })
        handleClose()
      }
    })
  }

  function handleUpdate() {
    updateTransaction({
      variables: {
        amount: Number(form.amount),
        companyId: form.company_id,
        credit: form.credit,
        debit: form.debit,
        description: form.description,
        id: form.id,
        userId: form.user_id,
        merchantId: form.merchant_id
      },
      update: () => {
        handleClose()
      }
    })
  }

  function handleDelete() {
    deleteTransaction({
      variables: { id: transaction.id },
      update: (cache, { data: { deleteTransaction } }) => {
        cache.modify({
          fields: {
            transactions(existingTransactions = []) {
              const oldTx = cache.writeFragment({
                data: deleteTransaction,
                fragment: gql`
                  fragment DeletedTransaction on Transactions {
                    id
                    type
                  }
                `
              })

              return existingTransactions.filter(({ __ref }) => __ref !== oldTx.__ref)
            }
          }
        })
        handleClose()
      }
    })
  }

  let companiesAvailableCredit = (data.companies.find(({ id }) => id === form.company_id) || {}).availableCredit

  return (
    <Modal onClose={handleClose} open={open}>
      <div css={modalStyles}>
        {event === 'DELETE' ? (
          <React.Fragment>
            <p>Are you sure you want to delete?</p>
            <div css={buttonContainer}>
              <Button onClick={handleClose} variant='contained'>
                Cancel
              </Button>
              <Button color='secondary' onClick={handleDelete} variant='contained'>
                Delete
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {event === 'EDIT' ? (
                <span>
                  Transaction: <strong>{transaction.id}</strong>
                </span>
              ) : (
                'New Transaction'
              )}
            </Grid>

            {/* this would ideally have validation to ensure this is a proper currency float; */}
            <TextField
              helperText='Please enter a float'
              label='Amount'
              onChange={e => handleChange('amount', e.target.value)}
              value={form.amount}
              xs={6}
            />

            <Grid item xs={6}>
              <FormControl component='fieldset'>
                <RadioGroup
                  onChange={e => handleChange(e.target.value)}
                  value={(form.credit && 'credit') || (form.debit && 'debit')}
                >
                  <FormControlLabel control={<Radio />} label='Debit' value='debit' />
                  <FormControlLabel control={<Radio />} label='Credit' value='credit' />
                </RadioGroup>
              </FormControl>
            </Grid>

            <TextField
              label='Description'
              multiline
              onChange={e => handleChange('description', e.target.value)}
              value={form.description}
              xs={12}
            />

            <Select
              content={({ firstName, lastName }) => `${firstName} ${lastName}`}
              data={data.users}
              label='Users'
              onChange={e => handleChange('user_id', e.target.value)}
              value={form.user_id}
              xs={6}
            />

            <Select
              content={({ name }) => name}
              data={data.merchants}
              label='Merchants'
              onChange={e => handleChange('merchant_id', e.target.value)}
              value={form.merchant_id}
              xs={6}
            />

            <Select
              content={({ name }) => name}
              data={data.companies}
              label='Companies'
              onChange={e => handleChange('company_id', e.target.value)}
              value={form.company_id}
              xs={6}
            />

            <Grid item xs={6}>
              Company&apos;s available credit:{' '}
              {romanNumeralsChecked ? toRomanNumeral(companiesAvailableCredit) : new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(companiesAvailableCredit)}
            </Grid>

            <Grid item xs={12}>
              <div css={buttonContainer}>
                <Button onClick={handleClose} variant='contained'>
                  Cancel
                </Button>
                <Button color='primary' onClick={event === 'EDIT' ? handleUpdate : handleCreate} variant='contained'>
                  Save
                </Button>
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </Modal>
  )
}

export default TxCrud

TxCrud.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  event: PropTypes.string,
  transaction: PropTypes.object,
  data: PropTypes.object
}

const modalStyles = css`
  position: absolute;
  width: 500px;
  background-color: whitesmoke;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 32px;
  text-align: center;
  border: none;
  border-radius: 8px;
`

const buttonContainer = css`
  & > button {
    margin: 8px;
  }
`

function TextField({ label, xs, value, onChange, ...props }) {
  return (
    <Grid item xs={xs}>
      <MuiTextField fullWidth label={label} onChange={onChange} required value={value} variant='outlined' {...props} />
    </Grid>
  )
}

TextField.propTypes = {
  label: PropTypes.string,
  xs: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func
}

function Select({ xs, label, data, content, value, onChange }) {
  return (
    <Grid item xs={xs}>
      <FormControl fullWidth variant='outlined'>
        <InputLabel>{label}</InputLabel>
        <MuiSelect
          label={label}
          onChange={onChange}
          value={value}
        >
          {data.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {content(item)}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </Grid>
  )
}

Select.propTypes = {
  xs: PropTypes.number,
  label: PropTypes.string,
  data: PropTypes.array,
  content: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func
}
