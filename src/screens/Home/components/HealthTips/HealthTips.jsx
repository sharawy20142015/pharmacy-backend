import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./HealthTips.styles";
import { COLORS } from "../../../../theme/colors";
const articles = [
  {
    id: 1,
    tag: "WELLNESS",
    tagColor: COLORS.primary,
    title: "5 Ways to Boost Your Immune System",
    desc: "Discover the best vitamins and daily habits to keep you healthy...",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkRJdl1juvo-svEYYqYf1-RvrliO1BCNAPPO1Hm_hO4yFkttc0v35Knxv97CwyslfjwLHaggG8-Yp46VdDtMzZmsuw4bXw-2TMb1zy4Bml5Iok2-3HFsoXbLpPWcyArBI0502KS7Q5o2wORRaQh4L7nYEJz-PidOVXDuTueed8r4gxDABMEdxVNpE50DgT32IxKDPfxuZn6mXGWft2_zT2krCdzO30VEHEnezYb7aUVblQreZQD9IW3qcbbmrb6bgpYPIci6Ptmg",
  },
  {
    id: 2,
    tag: "SKINCARE",
    tagColor: COLORS.secondary,
    title: "The Ultimate Morning Routine",
    desc: "Our dermatologists share the perfect sequence for applying your skincare...",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvPOPeKlg3lQ01jiYrkBXApEobpOscOF24-4XnISlq_M_r1BzMbFjRkqUOuugmEcLW3e_e9JF78Dr4IBqtqPJlj0_PGEwdqvlETAL3ewxCW6o6RlMC5kpTQWWyLFPdnUUH5rG1f6BGzng7jCqoD81C8fmieQyziJxdnfy91pda3jwyCXJtwVYkmjP11zQS-D0Md91YZ8B1eq20aOIkABpj0H6xpMrVpi1cp-WuBBu2jCuPuinafUpTnJsX9VYsxRD7CmJdQQQlDg",
  },
  {
    id: 3,
    tag: "TECHNOLOGY",
    tagColor: COLORS.accentGold,
    title: "Monitoring Your Heart at Home",
    desc: "Learn how modern medical devices can help you track your blood pressure...",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ5aM2POgYerDeUCGK5qcAs2W6PKPaEfU-G-7iww0O0H4-ZPcC9JylUHis34hitrKNBZ5g6FFVV6r-El-zYyfd8oHp55wzUKUDtZVpLmmjfq1kE-A_cAL796PsrobmdYSWbn9xWROxkDj1xnM57THTP-WKXM7NHll3wR9oOCW5CotqEMxmQrcVmpWck10wSnG4PF27TvxXfFa6_GZFyuJ_1VhgfQDVH4vgZThu1zFaMjMA40pOiLH49Jag3ZIb1AaBa0spHso1KA",
  },
];

const HealthTips = () => {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.indicator} />
          <Text style={styles.title}>Health Tips & Blog</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Read All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {articles.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image
              source={{ uri: item.img }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.content}>
              <Text style={[styles.tag, { color: item.tagColor }]}>
                {item.tag}
              </Text>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.desc}
              </Text>
              <TouchableOpacity style={styles.readMore}>
                <Text style={[styles.readMoreText, { color: item.tagColor }]}>
                  Read More
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={14}
                  color={item.tagColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HealthTips;
