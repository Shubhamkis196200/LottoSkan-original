import React, { useState, } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useLocation } from 'react-router-dom'
// import { useSelector } from 'react-redux'
const WinnerNumberList = React.lazy(() => import('./WinnerNumberList'))
const WinnerAmount = React.lazy(() => import('./WinningAmount'))
const SuperWinnerNumberList = React.lazy(() => import('./SuperWinnerNumberList'))
const SuperWinningAmount = React.lazy(() => import('./SuperWinningAmount'))

const View = () => {

  const search = useLocation().search
  const super_btn = new URLSearchParams(search).get('super_btn')

  const [activeTab, setActiveTab] = useState('1')
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }
  console.log(super_btn)


  return (
    <div>
      <ToastContainer
        position='top-right'
        autoClose={3000}
      // style={containerStyle}
      />
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              toggle('1')
            }}>
            Winner Number List
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              toggle('2')
            }}>
            Winning Amount
          </NavLink>
        </NavItem>

        {parseInt(super_btn) !== 2 ? (

          <Nav>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => {
                  toggle('3')
                }}>
                Super Winner Number List
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '4' })}
                onClick={() => {
                  toggle('4')
                }}>
                Super Winning Amount
              </NavLink>
            </NavItem>
          </Nav>
        ) : null}


      </Nav>

      <TabContent activeTab={activeTab}>

        <TabPane tabId='1'>
          <WinnerNumberList />
        </TabPane>

        <TabPane tabId='2'>
          <WinnerAmount />
        </TabPane>{' '}

        <TabPane tabId='3'>
          <SuperWinnerNumberList />
        </TabPane>

        <TabPane tabId='4'>
          <SuperWinningAmount />
        </TabPane>{' '}

      </TabContent>
    </div>
  )
}

export default View
