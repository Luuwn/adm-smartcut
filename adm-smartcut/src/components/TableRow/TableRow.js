// src/components/TableRow.js
import React from 'react';
import PropTypes from 'prop-types';
import './TableRow.css';

const TableRow = ({ data, columns, actions }) => {
  return (
    <tr className={data.status === 'aberto' ? 'row-aberto' : 'row-fechado'}>
      {columns.map((column) => (
        <td key={column.accessor}>
          {data[column.accessor]}
        </td>
      ))}
      {actions && (
        <td>
          {actions.map((action) => (
            <button key={action.label} onClick={() => action.onClick(data.id)}>
              {action.label}
            </button>
          ))}
        </td>
      )}
    </tr>
  );
};

TableRow.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      accessor: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
};

export default TableRow;
