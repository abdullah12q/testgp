import { User } from "../models/user.model.js";
import { isValidPhoneNumber } from "libphonenumber-js";

function validatePhoneNumber(phoneNumber) {
  let trimmedPhoneNumber = phoneNumber.startsWith("+2")
    ? phoneNumber.slice(2)
    : phoneNumber;

  if (
    !isValidPhoneNumber(phoneNumber, "EG") ||
    trimmedPhoneNumber.length !== 11
  ) {
    return false;
  }
  return true;
}

export async function addAddress(req, res) {
  try {
    const { label, fullName, streetAddress, city, phoneNumber, isDefault } =
      req.body;

    if (!label || !fullName || !streetAddress || !city || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Missing required address fields" });
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const user = req.user;

    if (isDefault) {
      user.addresses.forEach((address) => (address.isDefault = false));
    }

    user.addresses.push({
      label,
      fullName,
      streetAddress,
      city,
      phoneNumber,
      isDefault: isDefault || false,
    });

    await user.save();

    res.status(201).json({ message: "Address added successfully" });
  } catch (error) {
    console.error("Error in addAddress controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAddresses(req, res) {
  try {
    const user = req.user;

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Error in getAddresses controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateAddress(req, res) {
  try {
    const { label, fullName, streetAddress, city, phoneNumber, isDefault } =
      req.body;

    if (!label || !fullName || !streetAddress || !city || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Missing required address fields" });
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const { addressId } = req.params;

    const user = req.user;
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (isDefault) {
      user.addresses.forEach((address) => (address.isDefault = false));
    }

    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.error("Error in updateAddress controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const user = req.user;

    user.addresses.pull(addressId);
    await user.save();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAddress controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addToWishlist(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error("Error in addToWishlist controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getWishlist(req, res) {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in getWishlist controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;

    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product not found in wishlist" });
    }

    user.wishlist.pull(productId);
    await user.save();

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error in removeFromWishlist controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePushToken(req, res) {
  try {
    const { pushToken } = req.body;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { pushToken });

    res.status(200).json({ message: "Token updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating token" });
  }
}
