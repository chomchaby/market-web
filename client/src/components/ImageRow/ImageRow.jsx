import React from 'react'
import './ImageRow.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const ImageRow = ({ item, handleDeleteImageClick, setPreviewImage, defaultImage, setDefaultImage }) => {
    const propertyNames = Object.keys(item).filter((propertyName) => propertyName === 'title' || propertyName==='url');
  return (
    <tr className='image-row'>
      <td>
          {item === defaultImage ?
            // <div>
            //   <input type="radio" id={item.title} value={item.title} name="default-image" checked onClick={(e)=>setDefaultImage(item)}/>
            //   <label htmlFor={item.title}></label>
            // </div>:
            // <div>
            //   <input type="radio" id={item.title} value={item.title} name="default-image" onClick={(e)=>setDefaultImage(item)}/>
            //   <label htmlFor={item.title}></label>
            // </div>
            <CheckBoxIcon onClick={(e)=>setDefaultImage(item)}></CheckBoxIcon>
            :
            <CheckBoxOutlineBlankIcon onClick={(e)=>setDefaultImage(item)}></CheckBoxOutlineBlankIcon>
          }
          
      </td>
      {propertyNames.map((propertyName) => (
        <td key={propertyName} onClick={ () => {setPreviewImage(item)}}>
          {item[propertyName].substring(0,80)}
          {item[propertyName].length>80 ? '...':null}
        </td>
      ))}
      <td>
        <div className="btn">
            <DeleteIcon 
              onClick={ (e) =>handleDeleteImageClick(item.title) } 
              color="action"
            />
        </div>
      </td>
    </tr>
  )
}

export default ImageRow;