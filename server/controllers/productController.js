const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFEATURES = require("../utils/apiFeatures");

//create new product => /api/v1/product/new

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//get all products =>/api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 8;
  const productsCount = await Prouct.countDocuments();
  const apiFeatures = new APIFEATURES(Product.find(), req.query)
    .search()
    .filter();
  let products = await apiFeatures.query;
  let filteredProductCount = products.length;
  apiFeatures.pagination(resPerPage);
  products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    productsCount,
    resPerPage,
    filteredProductCount,
    products,
  });
});

//get specific product by id=> /api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//update product => /api/v1/admin/product/:id

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//update delete => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Product is deleted",
    product,
  });
});

//create new review   => /api/v1/review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

//get product review    =>/api/v1/reviews

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({ success: true, reviews: product.reviews });
});

//delete product review    =>/api/v1/reviews

exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;
  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(req.query.productId),
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    };
  res.status(200).json({ success: true });
});
