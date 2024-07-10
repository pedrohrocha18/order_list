import React from 'react'
import OrderItem from './OrderItem'

describe('<OrderItem />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<OrderItem />)
  })
})