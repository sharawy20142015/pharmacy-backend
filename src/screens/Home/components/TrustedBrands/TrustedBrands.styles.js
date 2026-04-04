import styled, { keyframes } from "styled-components";

// --- حركات الخلفية والأيقونات (ديسكتوب) ---
const gradientBg = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

// --- حركات الـ Marquee للموبايل ---
const scrollRtl = keyframes`
  0% { transform: translateX(-33.3333%); }
  100% { transform: translateX(0); } 
`;

const scrollLtr = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.3333%); }
`;

export const Section = styled.section`
  position: relative;
  padding: 80px 0;
  background-color: #f6f8f7;
  overflow: hidden;

  @media (min-width: 1024px) {
    padding: 128px 0;
  }
`;

export const AnimatedMeshBackground = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(at 0% 0%, rgba(16, 183, 72, 0.05) 0, transparent 50%),
    radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.05) 0, transparent 50%),
    radial-gradient(at 100% 0%, rgba(16, 183, 72, 0.05) 0, transparent 50%);
  background-size: 200% 200%;
  animation: ${gradientBg} 15s ease infinite;
`;

export const FloatingIcon = styled.div`
  position: absolute;
  opacity: 0.03;
  animation: ${float} 6s ease-in-out infinite;
  display: none;

  @media (min-width: 1024px) {
    display: block;
    top: ${(props) => props.top || "auto"};
    bottom: ${(props) => props.bottom || "auto"};
    left: ${(props) => props.left || "auto"};
    right: ${(props) => props.right || "auto"};
    animation-delay: ${(props) => props.delay || "0s"};
  }

  span {
    font-size: ${(props) => props.size || "100px"};
    color: #10b748;
    transform: ${(props) => (props.rotate ? "rotate(45deg)" : "none")};
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  z-index: 10;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;

  @media (min-width: 1024px) {
    margin-bottom: 80px;
  }

  .badge {
    display: inline-block;
    padding: 6px 16px;
    margin-bottom: 16px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #10b981;
    background-color: rgba(16, 185, 129, 0.1);
    border-radius: 9999px;
  }

  h2 {
    font-size: 2.25rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 24px;
    font-family: "Cairo", sans-serif;
    letter-spacing: -0.025em;

    @media (min-width: 1024px) {
      font-size: 3.75rem;
      margin-bottom: 32px;
    }
  }

  .divider {
    width: 64px;
    height: 4px;
    background: linear-gradient(to right, transparent, #10b981, transparent);
    margin: 0 auto 24px auto;
    border-radius: 9999px;

    @media (min-width: 1024px) {
      width: 96px;
      height: 6px;
      margin: 0 auto 32px auto;
    }
  }

  p {
    color: #64748b;
    max-width: 42rem;
    margin: 0 auto;
    font-size: 1rem;
    line-height: 1.625;
    font-family: "Cairo", sans-serif;

    @media (min-width: 1024px) {
      font-size: 1.25rem;
    }
  }
`;

// --- جزئية الديسكتوب (Bento Grid) ---
export const DesktopView = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-auto-rows: 140px;
    gap: 24px;
  }
`;

export const BentoCard = styled.div`
  grid-column: span ${(props) => props.colSpan || 1} / span
    ${(props) => props.colSpan || 1};
  grid-row: span ${(props) => props.rowSpan || 1} / span
    ${(props) => props.rowSpan || 1};
  border-radius: 24px;
  display: flex;
  flex-direction: ${(props) => (props.flexRow ? "row" : "column")};
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.padding || "16px"};
  position: relative;
  overflow: hidden;
  cursor: pointer;

  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(16, 183, 72, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(16, 185, 129, 0.15) 0%,
      transparent 80%
    );
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.15);

    &::before {
      opacity: 1;
    }
    .brand-en {
      color: #10b981;
    }
    .hover-icon {
      opacity: 1;
    }
    .brand-logo {
      transform: scale(1.08); /* تكبير اللوجو شوية عند الهوفر */
    }
  }

  .brand-en {
    font-weight: 800;
    color: #1e293b;
    font-family: "Playfair Display", serif;
    transition: color 0.3s ease;
    font-size: ${(props) => props.enSize || "1.25rem"};
    letter-spacing: ${(props) => props.enSpacing || "normal"};
  }

  .brand-ar {
    font-weight: 700;
    color: #94a3b8;
    font-family: "Cairo", sans-serif;
    text-transform: uppercase;
    margin-top: ${(props) => (props.flexRow ? "0" : "4px")};
    margin-right: ${(props) => (props.flexRow ? "16px" : "0")};
    font-size: ${(props) => props.arSize || "10px"};
    letter-spacing: ${(props) => props.arSpacing || "normal"};
  }

  /* ستايل اللوجو كصورة */
  .brand-logo {
    max-width: 140px;
    max-height: 40px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .hover-icon {
    position: absolute;
    color: #10b981;
    opacity: 0;
    transition: opacity 0.3s ease;
    top: ${(props) => props.iconTop || "auto"};
    right: ${(props) => props.iconRight || "auto"};
    bottom: ${(props) => props.iconBottom || "auto"};
    left: ${(props) => props.iconLeft || "auto"};

    ${(props) =>
      props.alwaysShowIcon &&
      `
      opacity: 0.2;
      color: rgba(16, 185, 129, 0.2);
    `}
  }
`;

// --- جزئية الموبايل والتابلت (Marquee) ---
export const MobileView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: hidden;

  /* تأثير التلاشي (Fade) للموبايل يمين وشمال عشان يندمج بنعومة */
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const ScrollRow = styled.div`
  display: flex;
  width: max-content;
  gap: 16px;
  padding: 8px 0;

  animation: ${(props) => (props.ltr ? scrollLtr : scrollRtl)} 25s linear
    infinite;

  &:active {
    animation-play-state: paused;
  }
`;

export const MobileCard = styled.div`
  flex: none;
  width: 160px;
  height: 90px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(16, 183, 72, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  .mobile-en {
    font-family: "Playfair Display", serif;
    font-weight: 800;
    font-size: 1.125rem;
    color: #1e293b;
    letter-spacing: ${(props) => (props.spaced ? "0.1em" : "normal")};
  }

  .mobile-ar {
    font-family: "Cairo", sans-serif;
    font-weight: 700;
    font-size: 0.7rem;
    color: #94a3b8;
    margin-top: 4px;
    letter-spacing: 0.05em;
  }

  /* ستايل اللوجو في الموبايل */
  .mobile-logo {
    max-width: 100px;
    max-height: 35px;
    object-fit: contain;
  }
`;
