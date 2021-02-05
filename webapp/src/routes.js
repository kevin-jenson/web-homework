import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { css } from '@emotion/core'
import { Home } from './home'
import { Header, Footer } from './components/Navigation'

function AppRouter () {
  return (
    <Router>
      <div css={layoutStyle}>
        <Header />
        <div className='main-content' css={contentStyle}>
          <Route component={Home} exact path='/' />
          <Route component={() => (<div>Content for /another route</div>)} exact path='/another' />
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default AppRouter

const layoutStyle = css`
    display: grid;
    grid-row-gap: 24px;
`

const contentStyle = css`
  grid-row: 2;
`
