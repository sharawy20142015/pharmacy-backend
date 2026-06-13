// src/screens/Home/components/SearchBar/SearchBar.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
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

  // 2. اختيار منتج من القائمة (مغلف بـ useCallback لحمايته)
  const handleSelectSuggestion = useCallback(
    (item) => {
      setSuggestions([]);
      setText(item.name);
      navigation.navigate("ProductDetails", { productId: item.id });
    },
    [navigation],
  );

  // 3. البحث عند الضغط على Enter (مغلف بـ useCallback لحمايته)
  const handleFullSearch = useCallback(() => {
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
  }, [text, route.name, navigation, onSearch]);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.searchContainer}>
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

      {/* قائمة الاقتراحات المنسدلة */}
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

// 🚀 التعديل الجوهري: تغليف السيرش بار بـ React.memo لمنع أي تأثير ريندر خارجي عليه أثناء فتح الكيبورد
export default React.memo(SearchBar);
