import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../ProductDetailsScreen.styles";
import { QuantitySelector } from "./SharedUI";

const MobileFooter = ({
  handleBuyNow,
  handleCartAction,
  isInCart,
  quantity,
  setQuantity,
}) => {
  return (
    <View style={styles.mobileFooter}>
      <View style={styles.mobileButtonsContainer}>
        <TouchableOpacity
          style={[styles.addCartBtn, styles.mobileBuyNowBtn]}
          onPress={handleBuyNow}
        >
          <MaterialIcons name="flash-on" size={22} color="#fff" />
          <Text style={styles.addCartText}>شراء الآن</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.addCartBtn,
            styles.mobileCartIconBtn,
            isInCart
              ? styles.mobileRemoveFromCartBtn
              : styles.mobileAddToCartBtn,
          ]}
          onPress={handleCartAction}
        >
          <MaterialIcons
            name={isInCart ? "remove-shopping-cart" : "add-shopping-cart"}
            size={22}
            color={isInCart ? "#ef4444" : "#11b67f"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.mobileQtyContainer}>
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </View>
    </View>
  );
};

export default MobileFooter;
