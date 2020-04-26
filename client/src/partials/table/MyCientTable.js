import React, {useState, useEffect} from 'react';
import {Row, Col, Spinner, Input, Table} from 'reactstrap';
// eslint-disable-next-line no-restricted-imports
import PropTypes from 'prop-types';
import PaginationComp from './Pagination';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'

const row_per_page_dropdown = [
  10,
  15,
  25
]

const MyClientTable = (props) => {
  // const [search, setSearch] = useState('');
  const [rows, setRows] = useState([]);
  const [temps, setTemp] = useState([]);
  const [temps1, setTemp1] = useState([]);
  const [order, setOrder] = useState('desc');
  const [totalCount, setTotalCount] = useState(null);
  const [rowPerPage, setRowPerPage] = useState(row_per_page_dropdown[0]);
  const [currentActive, setCurrentActive] = useState(1);
  const { options, columns, sortings, filtering, data, loading } = props;
  useEffect(() => {
    if (data.length > 0) {
      setRows(data);
      setTemp(data.slice(0, rowPerPage));
      setTemp1(data);
      setTotalCount(data.length)
      setCurrentActive(1)
    }
  }, [data, rowPerPage]);

  useEffect(() => {
    setTemp(temps1.slice(0, rowPerPage))
  }, [rowPerPage, temps1]);

  let reserved_keys = ["options", "columns", "data", "sortings", "filtering", "total", "loading"];
  let update_keys = [];

  for (let k of Object.keys(props)) {
    if (reserved_keys.indexOf(k) < 0) {
      update_keys.push(k);
    }
  }

  const renderRows = (data, column, index, i) => {

    if (column === "id") {
      return (
        <td key={'column-' + index}>
          {order === 'asc' ? (totalCount + 1) - ((rowPerPage * (currentActive - 1)) + (i + 1)) : ((rowPerPage * (currentActive - 1)) + (i + 1)) } 
        </td>
      )
    }

    if (update_keys.indexOf(column) > -1) {
      return (
        <td key={'column-' + index}>
          {React.cloneElement(props[column], {data})}
        </td>
      )
    } else {
      return (
        <td key={'column-' + index}>
          {data[column]}
        </td>
      )
    }
  }

  const handleSorting = (column) => {
    let sortedArr = temps1.sort((a, b) => {
      if (order === 'asc') {
        if(a[column].toLowerCase() > b[column].toLowerCase()) { return -1; }
      } else {
        if(a[column].toLowerCase() < b[column].toLowerCase()) { return -1; }
      }
      return 0;
    });
    setOrder(order === 'asc' ? 'dsc' : 'asc');
    setRows(sortedArr);
    setCurrentActive(1);
    setTotalCount(sortedArr.length);
    setTemp(sortedArr.slice(0, rowPerPage));
  }

  const handleChange = debounce((value) => {
    let temp_data = rows.filter(r => {
      for (let f of filtering) {
        if (r[f].toString().toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
    setCurrentActive(1);
    setTotalCount(temp_data.length);
    setTemp(temp_data.slice(0, rowPerPage));
    setTemp1(temp_data);
  }, 500);

  const handlePagination = (number) => {
    let last = number * rowPerPage;
    let first = last - rowPerPage;
    setCurrentActive(number)
    setTemp(temps1.slice(first, last));
  }

  const handleDropDownChange = (e) => {
    const {value} = e.target;
    setRowPerPage(value);
  }

  return  (

    <div style={{paddingTop: '10px', paddingLeft: '10px'}}>
      <Row>
        <Col sm={12}>
          <div align="left">
            <input 
              style={{width: '200px', border: '1px solid #c8ced3', borderRadius: '2px', padding: '2px'}}
              name="search"
              margin="normal"
              placeholder={`Search by ${filtering.map(f => options[f]).join(', ')}`}
              onChange={(e) => handleChange(e.target.value)}
              />
          </div>
          <div align="right" style={{marginTop: '-25px', paddingRight: '10px'}}>
            <select name="per_page" onChange={handleDropDownChange}>
              {
                row_per_page_dropdown.map((d, index) => {
                  return (
                    <option key={index} value={d}>{d}</option>
                  )
                })
              }
            </select>
          </div>
        </Col>
      </Row>
      <br/>
      <Table>
        {
        columns.length > 0
          &&
        <thead>
          <tr>
            {
              columns.map((column, index) => {
                return (
                  <th key={'heading-' + index}>
                    {options[column]}
                    {sortings.indexOf(column) > -1 && <span onClick={() => handleSorting(column)}><span style={{marginLeft: '10px', cursor: 'pointer'}}><FontAwesomeIcon icon={faSort} /></span></span>}
                  </th>
                )
              })
            }
          </tr>
        </thead>
        }
        {
          (temps.length > 0 && !loading)
            ?
          <tbody>
            {
              temps.map((d, i) => {
                return (
                  <tr key={d.id}>
                    {
                      columns.map((column, index) => {
                        return renderRows(d, column, index, i)
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
            :
          <tbody>
            <tr>
            </tr>
          </tbody>
        }
      </Table>
      {
        loading && <h5 style={{textAlign: 'center'}}><br /> <Spinner animation="border" variant="primary" /></h5>
      }
      {
        (temps.length === 0 && !loading) && (<h5 style={{textAlign: 'center'}}>No data found</h5>)
      }
      <br />
      {
        !loading
          &&
        <div className="pagination-box">
          <div>
            <PaginationComp 
              total_rows={totalCount} 
              row_per_page={rowPerPage} 
              current_active={currentActive} 
              handlePagination={handlePagination}
            />
          </div>
        </div>
      }
      {
        temps.length > 0
        &&
        <div className="pagination-box">
          <br />
          <div className="total-records">
            Showing {((currentActive - 1) * rowPerPage) + 1} to {(currentActive - 1) * rowPerPage + temps.length} of {totalCount} records
          </div>
        </div>
      }
    </div>
  )
}

MyClientTable.propTypes = {
  options: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  sortings: PropTypes.array.isRequired,
  filtering: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
}

export default MyClientTable;