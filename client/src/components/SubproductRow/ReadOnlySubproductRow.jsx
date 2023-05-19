import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import './ReadOnlySubproductRow.scss';

const ReadOnlySubproductRow = ({ item, handleEditSubproductClick, handleDeleteSubproductClick }) => {
    // const propertyNames = Object.keys(item).filter((propertyName) => propertyName !== 'id');

  return (
    <tr className='read-only-subproduct-row'>
      {/* {propertyNames.map((propertyName) => (
        <td key={propertyName}>{item[propertyName]}</td>
      ))} */}
      <td>
        {item.variation}
      </td>
      <td>
        {item.price}
      </td>
      <td>
        {item.stock}
      </td>
      <td>
        <div className="btn">
          <EditTwoToneIcon 
            onClick={ (e) => handleEditSubproductClick(e,item) }
            color="action"
          />
          <DeleteIcon 
            onClick={ (e) => handleDeleteSubproductClick(item.variation) } 
            color="action"
          />
        </div>
      </td>
    </tr>
  )
}

export default ReadOnlySubproductRow;