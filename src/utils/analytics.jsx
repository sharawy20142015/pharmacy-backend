import { Platform } from "react-native";

// 1. دالة حقن سكريبت GTM في الويب
export const initGTM = () => {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    // نتأكد إنه متعملوش حقن قبل كده عشان مانكررش الكود
    if (!document.getElementById("gtm-script")) {
      // -- حقن كود الـ Head --
      const script = document.createElement("script");
      script.id = "gtm-script";
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-M4G7LNHF');
      `;
      document.head.appendChild(script);

      // -- حقن كود الـ Body (noscript) --
      const noscript = document.createElement("noscript");
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M4G7LNHF" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(noscript, document.body.firstChild);

      console.log("✅ GTM Scripts Injected Successfully!");
    }
  }
};

// 2. دالة إرسال الأحداث
export const logGTMEvent = (eventName, eventData = {}) => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
    console.log(`GTM Event Pushed: ${eventName}`, eventData);
  }
};
