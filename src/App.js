import React, { useEffect, useRef, useState } from 'react'
import { notification, Select, Spin, Table } from 'antd'
import Axios from 'axios'
import moment from 'moment'
import 'antd/dist/antd.css'
import './App.scss'

const { Option } = Select

const columns = [
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: 'Order Expires In',
    key: 'orderExpiresIn',
    dataIndex: 'orderExpiresIn',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Max',
    dataIndex: 'max',
    key: 'max',
  },
  {
    title: 'Min',
    dataIndex: 'min',
    key: 'min',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: 'Min Conf',
    dataIndex: 'minConf',
    key: 'minConf',
  },
]

const App = () => {
  const [data, setData] = useState([])
  const [refreshTime, setRefreshTime] = useState(null)
  const [fetching, setFetching] = useState(false)
  const timeout = useRef(null)

  const getData = () => {
    setFetching(true)
    Axios.get('https://liquality.io/swap/agent/api/swap/marketinfo')
      .then((res) => {
        setFetching(false)
        if (res.data) {
          setData(
            res.data.map((el, index) => ({
              ...el,
              createdAt: moment(el.createdAt).format('YYYY-MM-DD hh:mm:ss'),
              updatedAt: moment(el.updatedAt).format('YYYY-MM-DD hh:mm:ss'),
              key: index,
            })),
          )
        }
      })
      .catch((err) => {
        setFetching(false)
        notification.open({
          message: 'Error Occured',
          description: err,
          onClick: () => {},
        })
      })
  }

  useEffect(() => {
    getData()
    return () => {}
  }, [])

  useEffect(() => {
    if (refreshTime) {
      timeout.current = setInterval(() => {
        getData()
      }, +refreshTime * 1000)
    }
    return () => {
      clearInterval(timeout.current)
    }
  }, [refreshTime])
  return (
    <div className="App">
      <Select
        placeholder="Select refresh time (seconds)"
        style={{ width: 300, marginBottom: 40 }}
        onChange={(value) => setRefreshTime(value)}
      >
        <Option value="5">5</Option>
        <Option value="10">10</Option>
        <Option value="15">15</Option>
      </Select>
      <Spin tip="Updating Data..." spinning={fetching}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ showSizeChanger: true }}
        />
      </Spin>
    </div>
  )
}

export default App
