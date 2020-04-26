import React, {useState, useEffect} from 'react';
import {Row, Col, Spinner } from 'react-bootstrap';
import {Table, TableBody, TableCell, TableHead, TableRow, TextField} from '@material-ui/core';
// eslint-disable-next-line no-restricted-imports
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SortIcon from '@material-ui/icons/Sort';
import PaginationComp from './Pagination';
import {debounce} from 'lodash'
const row_per_page_dropdown = [
  10,
  15,
  25
]
const state = {
  pageSize: row_per_page_dropdown[0],
  pageNo: 1,
  sort: 'desc',
  pattern: '',
  columnName: ''
}
const tableHeadStyle = {
  backgroundColor : '#425460'
}
const tableHeadTextColorStyle = {
  color: 'white'
}
const useStyles = makeStyles(theme => ({
  textField: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
  },
}));
const MyServerTable = (props) => {
  const classes = useStyles();
  // const [search, setSearch] = useState('');
  const [paginationState, setPaginationState] = useState(state);
  const { options, columns, sortings, filtering, data, total, loading, handleAction } = props;
  useEffect(() => {
    handleAction(paginationState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationState]);
  let reserved_keys = ["options", "columns", "data", "sortings", "filtering", "total", "loading"];
  let update_keys = []
  for (let k of Object.keys(props)) {
    if (reserved_keys.indexOf(k) < 0) {
      update_keys.push(k);
    }
  }
  const renderRows = (data, column, index, i) => {
    if (column === "id") {
      return (
        <TableCell key={'column-' + index}>
          {paginationState.sort === 'asc' ? (total + 1) - ((paginationState.pageSize * (paginationState.pageNo - 1)) + (i + 1)) : ((paginationState.pageSize * (paginationState.pageNo - 1)) + (i + 1)) } 
        </TableCell>
      )
    }
    if (update_keys.indexOf(column) > -1) {
      return (
        <TableCell key={'column-' + index}>
          {React.cloneElement(props[column], {data})}
        </TableCell>
      )
    } else {
      return (
        <TableCell key={'column-' + index}>
          {data[column]}
        </TableCell>
      )
    }
  }
  const handleSorting = (column) => {
    setPaginationState({...paginationState, sort: paginationState.sort === 'desc' ? 'asc' : 'desc', columnName: column});
  }
  const handleChange = debounce((value) => {
    setPaginationState({...paginationState, pattern: value})
  }, 500);
  const handlePagination = (number) => {
    setPaginationState({...paginationState, pageNo: number});
  }
  const handleDropDownChange = (e) => {
    const {value} = e.target;
    setPaginationState({...paginationState, pageSize: value});
  }
  return  (
    <div>
      <Row>
        <Col sm={12}>
          <div align="left">
            <TextField
              name="search" 
              onChange={(e) => handleChange(e.target.value)} 
              className={classes.textField}
              margin="normal"
              placeholder={`Search by ${filtering.map(f => options[f]).join(', ')}`}
              />
          </div>
          <div align="right" style={{marginTop: '-35px'}}>
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
        <TableHead style={tableHeadStyle}>
          <TableRow>
            {
              columns.map((column, index) => {
                return (
                  <TableCell style={tableHeadTextColorStyle} align="left" key={'heading-' + index}>
                    {options[column]}
                    {sortings.indexOf(column) > -1 && <span onClick={() => handleSorting(column)}><span style={{float: 'right', cursor: 'pointer'}}><SortIcon /></span></span>}
                  </TableCell>
                )
              })
            }
          </TableRow>
        </TableHead>
        }
        {
          (data.length > 0 && !loading)
            ?
          <TableBody>
            {
              data.map((d, i) => {
                return (
                  <TableRow key={d.id}>
                    {
                      columns.map((column, index) => {
                        return renderRows(d, column, index, i)
                      })
                    }
                  </TableRow>
                )
              })
            }
          </TableBody>
            :
          <TableBody>
            <TableRow>
            </TableRow>
          </TableBody>
        }
      </Table>
      {
        loading && <h5 style={{textAlign: 'center'}}><br /> <Spinner animation="border" variant="primary" /></h5>
      }
      {
        (data.length === 0 && !loading) && (<h5 style={{textAlign: 'center'}}><br />No data found</h5>)
      }
      <br />
      {
        !loading
         &&
        <div className="pagination-box">
          <div>
            <PaginationComp 
              total_rows={total}
              row_per_page={paginationState.pageSize} 
              current_active={paginationState.pageNo} 
              handlePagination={handlePagination}
              />
            </div>
        </div>
      }
      {
        data.length > 0
        &&
        <div className="pagination-box">
          <br />
          <div className="total-records">
            Showing {((paginationState.pageNo - 1) * paginationState.pageSize) + 1} to {(paginationState.pageNo - 1) * paginationState.pageSize + data.length} of {total} records
          </div>
        </div>
      }
    </div>
  )
}
MyServerTable.propTypes = {
  options: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  sortings: PropTypes.array.isRequired,
  filtering: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  handleAction: PropTypes.func.isRequired
}
export default MyServerTable;