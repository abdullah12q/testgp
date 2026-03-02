import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import mongoose from "mongoose";

async function updateProductRatings(productId) {
  try {
    const stats = await Review.aggregate([
      {
        $match: { productId: new mongoose.Types.ObjectId(productId) },
      },
      {
        $group: {
          _id: "$productId",
          numReviews: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        totalReviews: stats[0].numReviews,
        averageRating: stats[0].avgRating,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        totalReviews: 0,
        averageRating: 0,
      });
    }
  } catch (error) {
    console.error("Error updating product ratings:", error);
  }
}

export async function createReview(req, res) {
  try {
    const { productId, orderId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const user = req.user;

    if (order.clerkId !== user.clerkId) {
      return res
        .status(403)
        .json({ message: "Not authorized to review this order" });
    }

    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "Can only review delivered orders" });
    }

    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!productInOrder) {
      return res
        .status(400)
        .json({ message: "Product not found in this order" });
    }

    const review = await Review.findOneAndUpdate(
      { productId, userId: user._id },
      { rating, orderId, productId, userId: user._id },
      { new: true, upsert: true, runValidators: true }, // upsert deh bt5leny a3ml update lw exist aw create lw msh exist w runValidators deh 3shan t3ml validation lel model zy fel schema(eg: required, min, max)
    );

    await updateProductRatings(productId);

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error in createReview controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const user = req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);

    await updateProductRatings(productId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
