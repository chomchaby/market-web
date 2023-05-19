import React, {useState, useEffect, useRef, Fragment} from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import "@blueprintjs/core/lib/css/blueprint.css";
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import ReadOnlySubproductRow from '../../components/SubproductRow/ReadOnlySubproductRow';
import EditableSubproductRow from '../../components/SubproductRow/EditableSubproductRow';
import ImageRow from '../../components/ImageRow/ImageRow';

import {PRODUCT_CATEGORIES} from "../../context/Constant"
import "./MyProductEditor.scss"

const ADD_MY_PRODUCT_URL = '/my-store/add-product'
const EDIT_MY_PRODUCT_URL = '/my-store/edit-product'
const MY_PRODUCT_URL = '/my-store/product/'

const PRICE_REGEX = /^[1-9]\d*$/; //positive integers with no leading zeros
const STOCK_REGEX = /^(?:[1-9]\d*|0)$/; //non-negative integers with no leading zeros

const MyProductEditor = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const { productId } = useParams();

    // product information
    const [name,setName] = useState('');
    const [category, setCategory] = useState();
    const [desc,setDesc] = useState('');
    const [subproducts, setSubproducts] = useState([])
    const [images, setImages] = useState([])
    const [defaultImage, setDefaultImage] = useState(null);
    // name ref
    const nameRef = useRef();

    // form data //
    // state for subproduct form
    const [addSubproduct, setAddSubproduct] = useState();
    const [addSubproductErrMsg, setAddSubproductErrMsg] = useState('');
    const addSubproductVariationRef = useRef();
    const addSubproductPriceRef = useRef();
    const addSubproductStockRef = useRef();

    // table state for subproduct table
    const [editSubproductVariation, setEditSubproductVariation] = useState(null);
    const [editSubproductData, setEditSubproductData] = useState();
    const [editSubproductErrMsg, setEditSubproductErrMsg] = useState('');

    // state for image form
    const [addImage, setAddImage] = useState();
    const [addImageErrMsg, setAddImageErrMsg] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const addImageTitleRef = useRef();
    const addImageUrlRef = useRef();

    // state for submit or save 
    const [submitErrMsg, setSubmitErrMsg] = useState(''); 

    // response
    const resRef = useRef();
    const [resMsg, setResMsg] = useState('');

    useEffect(() => {
      setResMsg('');
    }, [name,category,desc,defaultImage,addSubproduct, addImage, previewImage])

    useEffect(() => {
      setSubmitErrMsg('');
    }, [category, defaultImage, addSubproduct, addImage])

    useEffect(() => {
      setAddSubproductErrMsg('');
    }, [addSubproduct])

    useEffect(() => {
      setEditSubproductErrMsg('');
    }, [editSubproductData])

    useEffect(() => {
      setAddImageErrMsg('');
    }, [addImage])

    useEffect(() => {
      nameRef.current.focus();
    }, [])

    useEffect(() => {
      
      const getMyProductInfo = async () => {
          if (productId===undefined) {
            return;
          }
          try {
              const response = await axiosPrivate.get(MY_PRODUCT_URL+productId, {
                  // signal: controller.signal
              });
              console.log(response.data);
              if (response.data.id) {
                  setName(response.data.product_name);
                  setCategory(response.data.category_name)
                  setDesc(response.data.description)
                  setSubproducts(response.data.subproducts)
                  setImages(response.data.images);
                  for (let i = 0; i < response.data.images.length; i++) {
                      if (response.data.images[i].isDefault === true) {
                        setDefaultImage(response.data.images[i]);
                        break;
                      }
                  }
              }
          }
          catch (err) {
              console.error(err);
              navigate('/login', { replace: true });
          }
      }
      // if (effectRan.current === true ){
        getMyProductInfo();
      // }
      // return () => {
      //   isMounted = false;
      //   controller.abort();
      //   effectRan.current = true;
      // }
  },[])

    const handleCategoryChange = (e) => {
      setCategory(e.target.value);
    }

    // functions for subproduct editor
    
    const handleAddSubproductSubmit = (e) => {
      e.preventDefault();
      if (addSubproduct.variation==='' || addSubproduct.variation===undefined  
        || addSubproduct.price===undefined || addSubproduct.stock===undefined) {
        setAddSubproductErrMsg('Please complete all fields.');
        return;
      }
      if ( !PRICE_REGEX.test(addSubproduct.price) || !STOCK_REGEX.test(addSubproduct.stock)
        || addSubproduct.price<1 || addSubproduct.stock<0) {
        setAddSubproductErrMsg('Invalid input');
        return;
      }
      for (let i = 0; i < subproducts.length; i++) {
        if (subproducts[i].variation === addSubproduct.variation) {
          setAddSubproductErrMsg('Duplicate Variation');
          return;
        }
      }
      // add id to identify which item to edit, not save on database
      // setAddSubproduct(prev => ({ ...prev, id: nanoid() }))
      const newSubproducts = [...subproducts, addSubproduct];
      setSubproducts(newSubproducts);
      
    };


    const handleEditSubproductClick = (e, subproduct) => {
      e.preventDefault();
      setEditSubproductVariation(subproduct.variation);

      const formValues = {
        price: subproduct.price, 
        stock: subproduct.stock
      }
      setEditSubproductData(formValues)

    }

    const handleDeleteSubproductClick = (subproductVariation) => {
      const newSubproducts = [...subproducts];
      const index = subproducts.findIndex((subproduct) => subproduct.variation===subproductVariation);

      newSubproducts.splice(index,1);
      setSubproducts(newSubproducts);
    } 

    const handleEditSubproductChange = (e) => {
      e.preventDefault();

      const fieldName = e.target.getAttribute('name');
      const fieldValue = e.target.value;

      const newSubproductData = {...editSubproductData}
      newSubproductData[fieldName] = fieldValue;
      setEditSubproductData(newSubproductData);
    }

    const handleCancelEditSubproductClick = () =>{
      setEditSubproductVariation(null);
    }

    const handleEditSubproductSubmit = (e) => {
      e.preventDefault();
      
      if ( !PRICE_REGEX.test(editSubproductData.price) || !STOCK_REGEX.test(editSubproductData.stock)
        || editSubproductData.price<1 || editSubproductData.stock<0) {
        setEditSubproductErrMsg('Invalid input');
        return;
      }

      const index = subproducts.findIndex((subproduct)=>subproduct.variation===editSubproductVariation);

      const editedSubproduct = {
          variation : editSubproductVariation, 
          price : editSubproductData.price,
          stock : editSubproductData.stock
      }
      const newSubproducts = [...subproducts];
      newSubproducts[index] = editedSubproduct;
      setSubproducts(newSubproducts);
      setEditSubproductVariation(null);

    }

    // funcitons for image editor
    const validateImageUrl = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => reject(false);
        img.src=url;
      });
    }
    const handleAddImageSubmit = (e) => {
      e.preventDefault();

      if (addImage.title==='' || addImage.title===undefined || addImage.url==='' || addImage.url===undefined) {
        setAddImageErrMsg('Please complete all fields.');
        return;
      }

      if (images.length>8) {
        setAddImageErrMsg('You can only include up to 9 images');
        return;
      }
      for (let i = 0; i < images.length; i++) {
        if (images[i].url === addImage.url) {
          setAddImageErrMsg('Image has already been uploaded');
          return;
        }
        if (images[i].title === addImage.title) {
          setAddImageErrMsg('Duplicate image title');
          return;
        }
      }
      validateImageUrl(addImage.url)
      .then(result => {
        const newImage = {
          title : addImage.title,
          url : addImage.url
        };
        const newImages = [...images, newImage];
        setImages(newImages);
        setPreviewImage(newImage)
      })
      .catch(error => {
        setAddImageErrMsg('Invalid URL');
      });

    };

    const handleDeleteImageClick = (imageTitle) => {

      const newImages = [...images];
      const index = images.findIndex((image) => image.title===imageTitle);

      newImages.splice(index,1);
      setImages(newImages);   

      if (previewImage?.title===imageTitle) {
        setPreviewImage(null);
      }
      if (defaultImage?.title===imageTitle) {
        setDefaultImage(null);
      }

    } 

    const isValidInput = () => {
      if (category === undefined) {
        setSubmitErrMsg('Please select a category for your product')
        return false;
      }
      if (subproducts.length<1) {
        setSubmitErrMsg('Must have at least one variation.');
        return false;
      }
      if (images.length<1) {
        setSubmitErrMsg('Must have at least one image.');
        return false;
      }
      if (defaultImage === null || defaultImage === undefined) {
        setSubmitErrMsg('Please select a default image for your product')
        return false;
      }
      return true;
    }
    const handleSubmitProductAddition = async (e) => {
        e.preventDefault();
        if (!isValidInput()) return;

        try {
          const response = await axiosPrivate.post(ADD_MY_PRODUCT_URL,
              JSON.stringify({ "name":name, "category":category, "desc":desc, "subproducts":subproducts, "images":images, "defaultImageTitle":defaultImage.title}),
              {
                  headers: { 'Content-Type': 'application/json' },
                  withCredentials: true
              }
          );
          console.log(JSON.stringify(response?.data));
          
          setName('');
          setCategory('')
          setDesc('');
          setSubproducts([]);
          setImages([]);
          setDefaultImage(null);
          setPreviewImage(null);
          setAddSubproduct({});
          setAddImage({});
          addSubproductVariationRef.current.value = ''
          addSubproductPriceRef.current.value = ''
          addSubproductStockRef.current.value = ''
          addImageTitleRef.current.value = ''
          addImageUrlRef.current.value = ''

          setResMsg('New product was successfully added to your store');
          resRef.current.focus();

        } 
        catch (err) {
            if (!err?.response) {
                setResMsg('No Server Response');
            } else if (err.response?.status === 401) {
                setResMsg('Unauthorized');
            } else {
                setResMsg('Operation Failed');
            }
            resRef.current.focus();
        }

    } 
    const handleSubmitProductEdition = async (e) => {
      e.preventDefault();
      if (!isValidInput()) return;

      try {
        const response = await axiosPrivate.post(EDIT_MY_PRODUCT_URL,
            JSON.stringify({ "name":name, "category":category, "desc":desc, "subproducts":subproducts, "images":images, "defaultImageTitle":defaultImage.title, "productId":productId}),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        console.log(JSON.stringify(response?.data));
        navigate('/my-store', {replace:true})
          
      } 
      catch (err) {
          if (!err?.response) {
              setResMsg('No Server Response');
          } else if (err.response?.status === 401) {
              setResMsg('Unauthorized');
          } else {
              setResMsg('Operation Failed');
          }
          resRef.current.focus();
      }

  } 



  return (
    <div className='myProductEditor'>
      <div className="container">
          <p ref={resRef} className={resMsg? "resmsg":"offscreen"} aria-live="assertive">{resMsg}</p>
          <h1>{ productId? 'Edit Product':'Add New Product'}</h1>
          
          <form className='edit-form' onSubmit={productId? handleSubmitProductEdition : handleSubmitProductAddition}>

            <div className="general-info-editor">
                <div className="name-input">
                  <label htmlFor="name">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    ref={nameRef}
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="category-input">
                  <label htmlFor="category">
                    Category
                  </label>
                  <select 
                    name="category" 
                    id="category" 
                    onChange={handleCategoryChange}
                    >
                    {category===undefined || category==='' ? 
                      <option disabled selected value> -- select an option -- </option>
                      : null
                    }
                    {PRODUCT_CATEGORIES.map((cat, index) => (
                      category === cat.text ? 
                      <option value={cat.text} selected >{cat.text}</option>
                      :
                      <option value={cat.text}>{cat.text}</option>
                    ))}
                  </select>
                </div>
                <div className="desc-input">
                  <label htmlFor="desc">
                    Description
                  </label>
                  <textarea
                        id="desc"
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                        rows={5}
                        required
                  />
                </div>
            </div>

            <div className="subproduct-editor">
              <h2>Variation</h2>
              <div className="subproduct-form">
                <table className="bp4-html-table">
                  <thead>
                    <tr>
                      <th className='th-variation'>Variation</th>
                      <th className='th-price'>Price (THB)</th>
                      <th className='th-stock'>Stock (Unit)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          ref={addSubproductVariationRef}
                          name="variation"
                          // required
                          autoComplete="off"
                          placeholder="Enter properties..."
                          onChange={(e) => setAddSubproduct(prev => ({ ...prev, variation: e.target.value }))} 
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          ref={addSubproductPriceRef}
                          min={1}
                          name="price"
                          // required
                          autoComplete="off"
                          placeholder="Enter number..."
                          onChange={(e) => setAddSubproduct(prev => ({ ...prev, price: e.target.value }))} 
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          ref={addSubproductStockRef}
                          min={0}
                          name="stock"
                          // required
                          autoComplete="off"
                          placeholder="Enter number..."
                          onChange={(e) => setAddSubproduct(prev => ({ ...prev, stock: e.target.value }))} 
                        />
                      </td>
                      <td>
                        <button type="button" onClick={handleAddSubproductSubmit}>Add</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>{addSubproductErrMsg}</p>
              </div>
              {subproducts !== undefined && subproducts.length>0 ? 
               <div className="subproduct-table">
                  <table className="bp4-html-table 
                    bp4-html-table-striped
                    bp4-html-table-bordered"
                  >
                    <thead>
                      <tr>
                        <th className='th-variation'>Variation</th>
                        <th className='th-price'>Price</th>
                        <th className='th-stock'>Stock</th>
                        <th className='th-action'></th>
                      </tr>
                    </thead>
                    <tbody>
                      {subproducts.map((subproduct) => (
                        <Fragment>
                          {editSubproductVariation === subproduct.variation ? 
                            <EditableSubproductRow 
                              item={subproduct} 
                              editSubproductData={editSubproductData}
                              handleEditSubproductChange={handleEditSubproductChange}
                              handleCancelEditSubproductClick={handleCancelEditSubproductClick}
                              handleEditSubproductSubmit = {handleEditSubproductSubmit}
                              >
                            </EditableSubproductRow> 
                            : <ReadOnlySubproductRow 
                                item={subproduct} 
                                handleEditSubproductClick={handleEditSubproductClick}
                                handleDeleteSubproductClick={handleDeleteSubproductClick}
                                ></ReadOnlySubproductRow>
                          }
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                  <p>{editSubproductErrMsg}</p>
               </div>
              : null
              }
            </div>

            <div className="image-editor">
              <h2>Images</h2>
              <div className="image-form">
                <table className="bp4-html-table">
                    <thead>
                      <tr>
                        <th className='th-title'>Title</th>
                        <th className='th-url'>URL</th>
                        <th className='th-action'></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input 
                            type="text"
                            ref={addImageTitleRef}
                            name="imageTitle"
                            id='imageTitle'
                            // required
                            autoComplete="off"
                            placeholder='Enter image title'
                            onChange={(e) => setAddImage(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            ref={addImageUrlRef}
                            name="imageURL"
                            id='imageUrl'
                            // required
                            autoComplete="off"
                            placeholder="Enter image URL"
                            onChange={(e) => setAddImage(prev => ({ ...prev, url: e.target.value }))}
                          />
                        </td>
                        <td>
                          <button type="button" onClick={handleAddImageSubmit}>Add</button>
                        </td>
                      </tr>
                    </tbody>
                </table>
                <p>{addImageErrMsg}</p>
              </div>
              {images !== undefined && images.length>0 ? 
                <div className="image-table">
                  <table className="bp4-html-table 
                      bp4-html-table-striped
                      bp4-html-table-bordered
                      bp4-interactive">
                      <thead>
                        <tr>
                          <th className='th-default'>Default</th>
                          <th className='th-title'>Title</th>
                          <th className='th-url'>URL</th>
                          <th className='th-action'></th>
                        </tr>
                      </thead>
                      <tbody>
                        {defaultImage!==undefined?
                        images.map((image) => (
                          <ImageRow 
                            item={image} 
                            handleDeleteImageClick = {handleDeleteImageClick}
                            setPreviewImage={setPreviewImage}
                            defaultImage={defaultImage}
                            setDefaultImage={setDefaultImage}
                            >
                          </ImageRow>
                        ))
                        : null
                      }
                      </tbody>
                  </table>
                </div>
                : null
              }

              <div className="preview-image-container">
                {previewImage?.url? 
                  <div className="preview-image">
                    <p>Title: {previewImage.title}</p>
                    <img src={previewImage.url} alt=""/>
                  </div>
                  : null
                }
              </div>


            </div>
            <div className='submit'>

              <div className="btns">
                  <button className='button' type="button" onClick={()=>navigate('/my-store')}>
                     Back
                  </button>
                  <button className='button'>
                     {productId? 'Save' : 'Submit'}
                  </button>
                  {productId?
                    <button className='button' type='button' onClick={() => window.location.reload(false)}>Reset</button>
                      :
                    null
                  }
              </div>

              <p>{submitErrMsg}</p>
            </div>
          </form>
      </div>
    </div>
  )
}

export default MyProductEditor;