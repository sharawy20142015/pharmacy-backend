// src/services/loyaltyService.js
export const loyaltyService = {
  // معدل التحويل (لازم يكون متطابق مع الباك إند)
  POINTS_RATE: 0.01,

  calculateMoney: (points) => {
    return (points * loyaltyService.POINTS_RATE).toFixed(2);
  },

  // دالة لحساب النقاط اللي هيكسبها من أوردر معين
  calculatePotentialEarned: (totalAmount) => {
    return Math.floor(totalAmount);
  },
};
