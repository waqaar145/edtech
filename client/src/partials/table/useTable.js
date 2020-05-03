import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {Button, Spinner} from 'react-bootstrap';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropUp';

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #425460;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField id="search" type="text" placeholder="Filter" value={filterText} onChange={onFilter} />
    <ClearButton type="button" onClick={onClear}>X</ClearButton>
  </>
);

export default function useTable () {

  let initial_state = {
    pageSize: 10,
    pageNo: 1,
    sort: 'desc',
    pattern: '',
    columnName: ''
  }
  const [currentState, setCurrentState] = useState(initial_state);

  const handlePerRowsChange = (rowPerPage) => {
    setCurrentState({
      ...currentState,
      pageSize: rowPerPage
    });
  }

  const handlePageChange = (page) => {
    setCurrentState({
      ...currentState,
      pageNo: page
    });
  }

  const handleSorting = (data) => {
    setCurrentState({
      ...currentState,
      sort: currentState.sort === 'desc' ? 'asc' : 'desc'
    });
  }

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (currentState.pattern) {
        setCurrentState({
          ...currentState,
          pageNo: 1,
          pattern: ''
        })
      }
    };

    return (
      <FilterComponent 
          onFilter={e => setCurrentState({
            ...currentState,
            pattern: e.target.value
          })} 
          onClear={handleClear}
          filterText={currentState.pattern} 
        />
    );
  }, [currentState]);

  const SpinnerComp = () => {
    return <Spinner animation="border" variant="primary" />
  }

  const SortIconComp = () => {
    return <span style={{color: '#fff'}}><ArrowDropDownIcon /></span>
  }

  return {
    currentState,
    handlePerRowsChange,
    handlePageChange,
    handleSorting,
    subHeaderComponentMemo,
    SpinnerComp,
    SortIconComp
  }
}