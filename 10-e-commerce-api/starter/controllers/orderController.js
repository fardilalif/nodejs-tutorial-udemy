const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = 'client secret';
  return { clientSecret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id: ${item.product}`
      );
    }

    const { _id, name, price, image } = dbProduct;
    const singleOrderItem = {
      name,
      price,
      image,
      amount: item.amount,
      product: _id,
    };
    // order items array for cartItems property in an order document
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal for subtotal property in an order document
    subtotal += item.amount * price;
  }

  const total = subtotal + tax + shippingFee;
  // fake stripe api
  const paymentIntent = await fakeStripeAPI({ amount: total, currency: 'usd' });

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userID,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const {
    params: { id: orderID },
    user,
  } = req;

  const order = await Order.findOne({ _id: orderID });

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${orderID}`);
  }

  checkPermissions(user, order.user);

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const {
    user: { userID },
  } = req;

  const orders = await Order.find({ user: userID });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const {
    params: { id: orderID },
    body: { paymentIntentID },
    user,
  } = req;

  const order = await Order.findOne({ _id: orderID });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${orderID}`);
  }

  checkPermissions(user, order.user);

  order.paymentIntentID = paymentIntentID;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
