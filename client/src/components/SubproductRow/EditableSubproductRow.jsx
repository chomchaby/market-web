import React from 'react'
import "./EditableSubproductRow.scss"
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';

const EditableSubproductRow = ({ item, editSubproductData, handleEditSubproductChange, handleCancelEditSubproductClick, handleEditSubproductSubmit }) => {

  return (
    <tr className='editable-subproduct-row'>
      <td key='variation'>{item.variation}</td>

      <td key='price'>
          <input 
            type="number" 
            min={1}
            name='price'
            // required  
            value={editSubproductData['price']}
            onChange={handleEditSubproductChange}
            autoComplete='off'
          />
      </td>
      <td key='stock'>
          <input 
            type="number" 
            min={0}
            name='stock'
            // required  
            value={editSubproductData['stock']}
            onChange={handleEditSubproductChange}
            autoComplete='off'
          />
      </td>

      <td>
        <div className="btn">
          <CheckIcon onClick={handleEditSubproductSubmit}/>
          <CancelIcon onClick={handleCancelEditSubproductClick} />
        </div>
      </td>
    </tr>
  )
}

export default EditableSubproductRow;