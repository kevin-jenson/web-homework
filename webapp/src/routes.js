import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { css } from '@emotion/core'
import { Home } from './home'
import { Header, Footer } from './components/Navigation'
import Grogu from './components/icons/Grogu'

export const RomanNumeralContext = React.createContext(null)

function AppRouter() {
  let [romanNumeralsChecked, setRomanNumeralsChecked] = React.useState(false)

  return (
    <Router>
      <div css={layoutStyle}>
        <Header
          checked={romanNumeralsChecked}
          handleChange={e => setRomanNumeralsChecked(e.target.checked)}
        />
        <div className='main-content' css={contentStyle}>
          <RomanNumeralContext.Provider value={romanNumeralsChecked}>
            <Route component={Home} exact path='/' />
            <Route component={() => <Grogu size={1800} />} exact path='/grogu' />
          </RomanNumeralContext.Provider>
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
