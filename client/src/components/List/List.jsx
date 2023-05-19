import React from 'react'

import './List.scss'
// import Card from '../Card/Card'
import MyCard from '../MyCard/MyCard'
import Card from '../Card/Card'

const List = ( {pros, deleteProduct} ) => {

  return (
    <div className='list'>{pros?.map(pro=>(
        deleteProduct===undefined ? 
        <Card pro={pro} key={pro.id}></Card>
        :
        <MyCard pro={pro} key={pro.id} deleteProduct={deleteProduct}></MyCard>
    ))}
    </div>
  )
}

export default List