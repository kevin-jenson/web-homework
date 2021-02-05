import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import { css } from '@emotion/core'

export function Header() {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Button component={Link} css={button} to='/'>
          Home
        </Button>
        <Button component={Link} css={button} to='/roman-numerals'>
          Roman Numerals
        </Button>
      </Toolbar>
    </AppBar>
  )
}

const button = css`
  color: whitesmoke;
`

export function Footer() {
  return (
    <div
      css={css`
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;

        & > a {
          padding: 8px;
        }
      `}
    >
      <p>Some links for Kevin Jenson</p>
      <a href='https://www.linkedin.com/in/kevin-jenson/' rel='noopener noreferrer' target='_blank'>
        LinkedIn
      </a>
      <a href='https://github.com/kevin-jenson' rel='noopener noreferrer' target='_blank'>
        GitHub
      </a>
      <a href='https://kevinjenson.dev/' rel='noopener noreferrer' target='_blank'>
        Personal Site
      </a>
    </div>
  )
}
