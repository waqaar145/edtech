import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComp = ({total_rows, row_per_page, current_active, handlePagination}) => {

  const paginationCount = Math.ceil(total_rows / row_per_page);
  const currentSelected = (number) => {
    handlePagination(number);
  }

  let active = current_active;
  let items = [];

  for (let number = 1; number <= paginationCount; number++) {
    items.push(
      <Pagination.Item onClick={() => currentSelected(number)} key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }
  
  return (
    <Pagination size="sm">{items}</Pagination>
  )
}
export default PaginationComp;