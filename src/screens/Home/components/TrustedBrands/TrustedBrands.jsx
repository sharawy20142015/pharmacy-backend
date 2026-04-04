import React from "react";
import * as S from "./TrustedBrands.styles";

const TrustedBrands = () => {
  // دالة الـ Glow للديسكتوب
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  // داتا الموبايل (مقسمة لصفين)
  const mobileTopRow = [
    { en: "Panadol" },
    { en: "Pfizer" },
    { en: "Roche" },
    { en: "Novartis" },
    { en: "Bayer" },
  ];

  const mobileBottomRow = [
    {
      en: "L'ORÉAL",
      spaced: true,
      imgSrc:
        "https://www.loreal-paris-me.com/-/media/project/loreal/brand-sites/oap/shared/baseline/navigationext/loreal-paris-black-logo.svg",
    },
    { en: "VICHY", spaced: true },
    { en: "GSK" },
    { en: "AstraZeneca" },
    { en: "Sanofi" },
  ];

  // مضاعفة الداتا 3 مرات عشان الحركة المستمرة
  const infiniteTop = [...mobileTopRow, ...mobileTopRow, ...mobileTopRow];
  const infiniteBottom = [
    ...mobileBottomRow,
    ...mobileBottomRow,
    ...mobileBottomRow,
  ];

  return (
    <S.Section>
      <S.AnimatedMeshBackground />

      {/* الأيقونات العائمة (ديسكتوب فقط) */}
      <S.FloatingIcon top="5rem" left="10%" rotate size="120px">
        <span className="material-symbols-outlined">dna</span>
      </S.FloatingIcon>
      <S.FloatingIcon bottom="10rem" right="5%" delay="-2s" size="100px">
        <span className="material-symbols-outlined">add_notes</span>
      </S.FloatingIcon>
      <S.FloatingIcon top="50%" right="15%" delay="-4s" size="150px">
        <span className="material-symbols-outlined">health_metrics</span>
      </S.FloatingIcon>

      <S.ContentWrapper>
        {/* <S.Header>
          <span className="badge">شركاء النجاح</span>
          <h2>نخبة الماركات العالمية</h2>
          <div className="divider"></div>
          <p>
            ننتقي شركاءنا بعناية فائقة لنضمن لك الحصول على أجود المنتجات الطبية
            الأصلية من رواد الصناعة الدوائية والتجميلية حول العالم.
          </p>
        </S.Header> */}

        {/* --- عرض الموبايل والتابلت (شريطين Marquee) --- */}
        <S.MobileView>
          {/* الصف الأول يتحرك يمين (RTL) */}
          <S.ScrollRow rtl>
            {infiniteTop.map((brand, i) => (
              <S.MobileCard key={`top-${i}`}>
                <span className="mobile-en">{brand.en}</span>
              </S.MobileCard>
            ))}
          </S.ScrollRow>

          {/* الصف الثاني يتحرك يسار (LTR) */}
          <S.ScrollRow ltr>
            {infiniteBottom.map((brand, i) => (
              <S.MobileCard key={`bottom-${i}`} spaced={brand.spaced}>
                {/* لو في صورة اعرضها، لو مفيش اعرض التيكست */}
                {brand.imgSrc ? (
                  <img
                    src={brand.imgSrc}
                    alt={brand.en}
                    className="mobile-logo"
                  />
                ) : (
                  <span className="mobile-en">{brand.en}</span>
                )}
              </S.MobileCard>
            ))}
          </S.ScrollRow>
        </S.MobileView>

        {/* --- عرض الديسكتوب (Bento Grid تفاعلي) --- */}
        <S.DesktopView>
          <S.BentoCard
            colSpan={2}
            rowSpan={2}
            padding="32px"
            enSize="3rem"
            enSpacing="-0.05em"
            arSize="0.875rem"
            arSpacing="0.2em"
            onMouseMove={handleMouseMove}
            iconTop="16px"
            iconRight="16px"
          >
            <span className="brand-en">Panadol</span>
            {/* <div className="hover-icon">
              <span className="material-symbols-outlined">verified</span>
            </div> */}
          </S.BentoCard>

          <S.BentoCard
            colSpan={2}
            rowSpan={1}
            padding="24px"
            enSize="1.875rem"
            enSpacing="-0.025em"
            arSize="0.75rem"
            arSpacing="0.1em"
            onMouseMove={handleMouseMove}
          >
            <div style={{ textAlign: "center" }}>
              <span className="brand-en">Pfizer</span>
            </div>
          </S.BentoCard>

          <S.BentoCard
            colSpan={1}
            rowSpan={1}
            padding="16px"
            enSize="1.25rem"
            onMouseMove={handleMouseMove}
          >
            <span className="brand-en">Roche</span>
          </S.BentoCard>

          <S.BentoCard
            colSpan={1}
            rowSpan={1}
            padding="16px"
            enSize="1.25rem"
            onMouseMove={handleMouseMove}
          >
            <span className="brand-en">Novartis</span>
          </S.BentoCard>

          {/* كارت لوريال (باستخدام اللوجو SVG) */}
          <S.BentoCard
            colSpan={2}
            rowSpan={1}
            padding="24px"
            onMouseMove={handleMouseMove}
          >
            <div
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <img
                src="https://www.loreal-paris-me.com/-/media/project/loreal/brand-sites/oap/shared/baseline/navigationext/loreal-paris-black-logo.svg"
                alt="L'ORÉAL"
                className="brand-logo"
              />
            </div>
          </S.BentoCard>

          <S.BentoCard
            colSpan={2}
            rowSpan={2}
            padding="32px"
            enSize="2.25rem"
            enSpacing="-0.05em"
            arSize="0.875rem"
            arSpacing="0.2em"
            alwaysShowIcon
            iconBottom="16px"
            iconLeft="16px"
            onMouseMove={handleMouseMove}
          >
            <span className="brand-en">Bayer</span>
            <div
              className="hover-icon"
              style={{ opacity: 1, color: "rgba(16, 185, 129, 0.2)" }}
            ></div>
          </S.BentoCard>

          <S.BentoCard
            colSpan={2}
            rowSpan={1}
            padding="24px"
            enSize="1.5rem"
            arSize="0.75rem"
            onMouseMove={handleMouseMove}
          >
            <div style={{ textAlign: "center" }}>
              <span className="brand-en">AstraZeneca</span>
            </div>
          </S.BentoCard>

          <S.BentoCard
            colSpan={1}
            rowSpan={1}
            padding="16px"
            enSize="1.25rem"
            enSpacing="0.1em"
            onMouseMove={handleMouseMove}
          >
            <span className="brand-en">VICHY</span>
          </S.BentoCard>

          <S.BentoCard
            colSpan={1}
            rowSpan={1}
            padding="16px"
            enSize="1.25rem"
            onMouseMove={handleMouseMove}
          >
            <span className="brand-en">GSK</span>
          </S.BentoCard>

          <S.BentoCard
            colSpan={2}
            rowSpan={1}
            padding="24px"
            flexRow
            enSize="1.5rem"
            arSize="0.75rem"
            arSpacing="0.1em"
            onMouseMove={handleMouseMove}
          >
            <span className="brand-en">Sanofi</span>
          </S.BentoCard>
        </S.DesktopView>
      </S.ContentWrapper>
    </S.Section>
  );
};

export default TrustedBrands;
