import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
} from 'reactstrap'
import { connect, useSelector } from 'react-redux'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppSwitch } from '@coreui/react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import { getAllLottery, lotteryStatus } from '../../actions/lotteryAction'

import ContentLoader from 'react-content-loader'
const Index = (props) => {
  const { getAllLottery } = props

  // use Select

  const lottery = useSelector((state) => state.lottery)
  const { lotteryList, loading } = lottery

  const [pageLength, setPageLength] = useState(10)
  const [search, setSearch] = useState('')
  //
  useEffect(() => {
    getAllLottery(1, pageLength, '')
  }, [pageLength])
  const onFieldKeyPress = (e) => {
    if (e.target.name === 'search') {
      if (e.key === 'Enter') {
        getAllLottery(1, pageLength, e.target.value)
      }
    }
  }
  const onPageClick = (page) => {
    getAllLottery(page, pageLength, search)
  }
  const changeStatus = (data) => {
    let newData = {
      flag: data.flag === 1 ? 2 : 1,
    }
    props.lotteryStatus(data._id, newData).then((res) => {
      getAllLottery(lotteryList.page, pageLength, search)
    })
  }
  const paginationSection = (data) => {
    const { page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      data

    let Pages = []
    let skipped = 0
    for (var i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        (page < 4 && i <= 5) ||
        i === page - 1 ||
        i === page + 1 ||
        i === page ||
        i === totalPages ||
        (page >= totalPages - 3 && i >= totalPages - 4)
      ) {
        const test = i
        const item = (
          <React.Fragment key={i}>
            {skipped === 1 ? (
              <PaginationItem>
                <PaginationLink disabled tag='button'>
                  ...
                </PaginationLink>
              </PaginationItem>
            ) : null}
            <PaginationItem
              active={page === i ? true : false}
              onClick={page === i ? () => null : () => onPageClick(test)}
              key={i}>
              <PaginationLink tag='button'>{i}</PaginationLink>
            </PaginationItem>
          </React.Fragment>
        )
        skipped = 0
        Pages.push(item)
      } else {
        skipped = 1
      }
    }

    return (
      <nav>
        <Pagination>
          <PaginationItem
            onClick={hasPrevPage === true ? () => onPageClick(prevPage) : null}>
            <PaginationLink
              previous
              disabled={hasPrevPage === true ? false : true}
              tag='button'>
              Prev
            </PaginationLink>
          </PaginationItem>
          {Pages}

          <PaginationItem
            onClick={hasNextPage === true ? () => onPageClick(nextPage) : null}>
            <PaginationLink
              next
              tag='button'
              disabled={hasNextPage === true ? false : true}>
              Next
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </nav>
    )
  }
  return (
    <div className='animated fadeIn'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        // style={containerStyle}
      />
      <Row>
        <Col xs='12'>
          <Card className='card-style shadow'>
            <CardHeader>
              <i className='fa fa-ticket'></i>
              <strong>Lotteries</strong>
            </CardHeader>

            <CardBody>
              <Col md='12'>
                <Row>
                  <Col md='6' className='pr-0'>
                    <div className='text-left'>
                      <span className=''>Show</span>
                      <select
                        type='text'
                        name='pageLength'
                        value={pageLength}
                        onChange={(e) => setPageLength(e.target.value)}
                        className='form-control show-pagination input  d-inline  mx-2'>
                        <option value={10}>10 </option>
                        <option value={20}>20 </option>
                        <option value={50}>50 </option>
                        <option value={100}>100 </option>
                      </select>
                    </div>
                  </Col>

                  <Col md='6' className='pr-0'>
                    <div className='text-right'>
                      <span className=''>Search : </span>
                      <input
                        type='text'
                        name='search'
                        className='form-control w-50 input  d-inline'
                        onKeyPress={(e) => onFieldKeyPress(e)}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>

              <Table responsive striped className='mt-2 customDataTable'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Lottery Name</th>
                    <th>Number Size</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {!loading && lotteryList.docs.length > 0 ? (
                    lotteryList.docs.map((lottery, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <img
                            src={lottery.lottery_image}
                            alt=''
                            width='45px'
                          />
                        </td>
                        <td>{lottery.lottery_name}</td>
                        <td>{lottery.lottery_number}</td>
                        <td>
                          <AppSwitch
                            className='d-block mt-1'
                            variant='3d'
                            color='primary'
                            name='status'
                            checked={lottery.flag === 1 ? true : false}
                            label
                            dataOn={'\u2715'}
                            dataOff={'\u2713'}
                            onClick={() => changeStatus(lottery)}
                          />
                        </td>
                        <td>
                          <Tooltip
                            title='View Lottery'
                            position='bottom'
                            arrow={true}
                            distance={15}
                            trigger='mouseenter'>
                            <Link
                              to={`lottery/view/${lottery._id}?limit=${lottery.lottery_number}&super_btn=${lottery.super_btn}`}>
                              <Button
                                size='md'
                                className='btn-twitter btn-brand ml-2'
                                type='button'>
                                <i className='fa fa-eye'></i>
                              </Button>
                            </Link>
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  ) : loading ? (
                    <tr>
                      <td colSpan='6' className='middle-align text-center'>
                        <ContentLoader
                          height={40}
                          speed={1.2}
                          backgroundColor='#d0d5d8'
                          foregroundColor='#fafafa'>
                          <rect
                            x='0'
                            y='17'
                            rx='4'
                            ry='4'
                            width='300'
                            height='13'
                          />
                        </ContentLoader>
                      </td>
                    </tr>
                  ) : (
                    lotteryList.docs.length === 0 && (
                      <tr>
                        <td colSpan='6' className='text-center'>
                          No Lottery Found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

                <tfoot>
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Lottery Name</th>
                    <th>Number Size</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </tfoot>
              </Table>
              <div className='row float-right'>
                <div className='col-md-12 '>
                  {paginationSection(lotteryList)}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

Index.propTypes = {}

export default connect(null, { getAllLottery, lotteryStatus })(Index)
