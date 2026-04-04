import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./SearchBar.styles";
import { COLORS } from "../../../../theme/colors";
import apiClient from "../../../../services/apiClient";

const SearchBar = ({ onSearch, initialValue = "" }) => {
  const [text, setText] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  // 1. جلب الاقتراحات مع Debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (text.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await apiClient.get("/products/suggestions", {
          params: { query: text },
        });
        setSuggestions(response.data);
      } catch (err) {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [text]);

  // 2. اختيار منتج من القائمة
  const handleSelectSuggestion = (item) => {
    setSuggestions([]);
    setText(item.name);
    navigation.navigate("ProductDetails", { productId: item.id });
  };

  // 3. البحث عند الضغط على Enter
  const handleFullSearch = () => {
    setSuggestions([]);
    if (text.trim() === "") return;

    if (route.name !== "StoreMain") {
      navigation.navigate("Store", {
        screen: "StoreMain",
        params: { search: text },
      });
    } else if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      {/* صندوق البحث بالشكل الجديد */}
      <View style={styles.searchContainer}>
        {/* أيقونة البحث الجديدة */}
        <MaterialIcons
          name="search"
          size={24}
          color={COLORS.slate400}
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.input}
          placeholder="Search for medicines..."
          placeholderTextColor={COLORS.slate400}
          value={text}
          onChangeText={setText}
          returnKeyType="search"
          onSubmitEditing={handleFullSearch}
          autoCapitalize="none"
        />

        {text.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              setText("");
              setSuggestions([]);
              if (onSearch) onSearch("");
            }}
          >
            <MaterialIcons name="close" size={18} color={COLORS.slate500} />
          </TouchableOpacity>
        )}
      </View>

      {/* قائمة الاقتراحات المنسدلة بتصميم أنضف */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.suggestionItem,
                  // عشان نشيل الخط من آخر عنصر
                  index === suggestions.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => handleSelectSuggestion(item)}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <MaterialIcons name="history" size={18} color="#10b77f" />
                </View>

                <Text style={styles.suggestionText}>{item.name}</Text>

                <MaterialIcons
                  name="north-west"
                  size={16}
                  color={COLORS.slate300}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default SearchBar;
