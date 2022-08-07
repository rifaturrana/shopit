/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Fragment, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect } from "react";
import MetaData from "./layout/MetaData";
import { getProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "./product/Product";
import Loader from "./layout/Loader";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";

const { createSliderWithToolTip } = Slider;
const Range = createSliderWithToolTip(Slider.Range);

const Home = ({ match }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, products, error, productsCount, resPerPage } = useSelector(
    (state) => state.products
  );

  const keyword = match.params.keyword;
  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage));
  }, [dispatch, alert, error, keyword, currentPage]);
  function setCurrentpageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
          {resPerPage <= productsCount && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentpageNo}
                nextPageText={"Next"}
                prevPageText={"Previ"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
