import React from 'react'
import AddOrder from './AddOrder'

describe('<AddOrder />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AddOrder />)
  })
})