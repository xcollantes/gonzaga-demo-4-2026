import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const AppleLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={width} height={height} className={className} fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

export const AmazonLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={width} height={height} className={className} fill="currentColor">
    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" />
  </svg>
);

export const CalixLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width={width} height={height} className={className} fill="currentColor">
    <path d="M22.2,15c0,4-3.2,7.2-7.2,7.2s-7.2-3.2-7.2-7.2s3.2-7.2,7.2-7.2S22.2,11,22.2,15z M33.7,15c0-10.3-8.4-18.7-18.7-18.7 S-3.7,4.7-3.7,15S4.7,33.7,15,33.7S33.7,25.3,33.7,15z M15,27.8c-7.1,0-12.8-5.7-12.8-12.8S7.9,2.2,15,2.2s12.8,5.7,12.8,12.8 S22.1,27.8,15,27.8z" />
    <path d="M45.1,9.5h3.5v1.6c0.9-1.2,2.3-1.9,3.9-1.9c3,0,5.4,2.4,5.4,6.1v8.6h-3.5v-8.1c0-1.8-1.1-3.1-2.9-3.1 c-1.8,0-2.9,1.3-2.9,3.1v8.1h-3.5V9.5z" />
    <path d="M72.2,18.6h-9.8c0.4,1.6,1.8,2.5,3.7,2.5c1.3,0,2.4-0.5,3.2-1.5l2.1,1.8c-1.3,1.6-3.2,2.5-5.5,2.5c-4.2,0-7.1-2.8-7.1-6.9 c0-4.1,2.8-7,6.8-7c3.9,0,6.6,2.8,6.6,7C72.3,17.6,72.3,18.1,72.2,18.6z M62.4,15.8h6.3c-0.3-1.7-1.6-2.7-3.1-2.7 C64,13.1,62.7,14,62.4,15.8z" />
    <path d="M80.4,20.8h-0.1v3.1h-3.5V3.8h3.5v7.2h0.1c1.1-1.1,2.5-1.7,4.1-1.7c4,0,6.4,3.1,6.4,6.9s-2.4,6.9-6.4,6.9 C82.9,22.9,81.4,22.1,80.4,20.8z M87.2,16.1c0-2.2-1.4-3.9-3.5-3.9c-2.1,0-3.5,1.7-3.5,3.9c0,2.2,1.4,3.9,3.5,3.9 C85.8,20,87.2,18.3,87.2,16.1z" />
  </svg>
);

export const CitiGroupLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width={width} height={height} className={className} fill="currentColor">
    <path d="M36.8,13.2c0-3.4,2.7-6.1,6.1-6.1h14.2c3.4,0,6.1,2.7,6.1,6.1v3.6c0,3.4-2.7,6.1-6.1,6.1H42.9c-3.4,0-6.1-2.7-6.1-6.1 V13.2z M50,22.9c5.5,0,10-4.5,10-10S55.5,3,50,3s-10,4.5-10,10S44.5,22.9,50,22.9z M50,19.9c-3.9,0-7-3.1-7-7s3.1-7,7-7 s7,3.1,7,7S53.9,19.9,50,19.9z" />
  </svg>
);

export const BankOfAmericaLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width={width} height={height} className={className} fill="currentColor">
    <path d="M15,3L3,15l12,12l12-12L15,3z M15,21l-6-6l6-6l6,6L15,21z" />
    <path d="M40,15c0,6.6-5.4,12-12,12h32c6.6,0,12-5.4,12-12s-5.4-12-12-12H28C34.6,3,40,8.4,40,15z M60,15c0,3.9-3.1,7-7,7 s-7-3.1-7-7s3.1-7,7-7S60,11.1,60,15z" />
    <path d="M80,3h7c3.9,0,7,3.1,7,7v10c0,3.9-3.1,7-7,7h-7c-3.9,0-7-3.1-7-7V10C73,6.1,76.1,3,80,3z M80,21h7V10h-7V21z" />
  </svg>
);

export const WellsFargoLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width={width} height={height} className={className} fill="currentColor">
    <path d="M50,2C35.1,2,23,9.4,23,18.5S35.1,35,50,35s27-7.4,27-16.5S64.9,2,50,2z M50,29.5c-9.7,0-17.5-4.9-17.5-11 s7.8-11,17.5-11s17.5,4.9,17.5,11S59.7,29.5,50,29.5z" />
    <path d="M38,18.5c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2s-0.9-2-2-2H40C38.9,16.5,38,17.4,38,18.5z" />
  </svg>
);

export const NorthrupGrummanLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width={width} height={height} className={className} fill="currentColor">
    <path d="M50,3c-11,0-20,8.1-20,18s9,18,20,18s20-8.1,20-18S61,3,50,3z M50,33c-7.2,0-13-5.4-13-12s5.8-12,13-12s13,5.4,13,12 S57.2,33,50,33z" />
    <path d="M29,12l-9,3l9,3V12z M71,12v6l9-3L71,12z" />
  </svg>
);

export const DeutscheBankLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width={width} height={height} className={className} fill="currentColor">
    <path d="M50,3L20,15l30,12l30-12L50,3z M50,21L30,15l20-8l20,8L50,21z" />
  </svg>
);

export const JPMorganChaseLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width={width} height={height} className={className} fill="currentColor">
    <path d="M12,3v24h12V15h12V3H12z M24,21h-6v-6h6V21z" />
    <path d="M42,3v24h12V15h12V3H42z M54,21h-6v-6h6V21z" />
    <path d="M72,3v24h16V3H72z M82,21h-4v-6h4V21z M82,9h-4V7h4V9z" />
  </svg>
);

export const SamsungLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width={width} height={height} className={className} fill="currentColor">
    <path d="M19.5,3C10.4,3,3,10.4,3,19.5S10.4,36,19.5,36S36,28.6,36,19.5S28.6,3,19.5,3z M19.5,30c-5.8,0-10.5-4.7-10.5-10.5 S13.7,9,19.5,9S30,13.7,30,19.5S25.3,30,19.5,30z" />
    <path d="M80.5,3C71.4,3,64,10.4,64,19.5S71.4,36,80.5,36S97,28.6,97,19.5S89.6,3,80.5,3z M80.5,30C74.7,30,70,25.3,70,19.5 S74.7,9,80.5,9S91,13.7,91,19.5S86.3,30,80.5,30z" />
    <path d="M50,3c-9.1,0-16.5,7.4-16.5,16.5S40.9,36,50,36s16.5-7.4,16.5-16.5S59.1,3,50,3z M50,30c-5.8,0-10.5-4.7-10.5-10.5 S44.2,9,50,9s10.5,4.7,10.5,10.5S55.8,30,50,30z" />
  </svg>
);

export const GoldmanSachsLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width={width} height={height} className={className} fill="currentColor">
    <path d="M17.5,3L3,17.5L17.5,32L32,17.5L17.5,3z M17.5,24l-6.5-6.5l6.5-6.5l6.5,6.5L17.5,24z" />
    <path d="M50,3L35.5,17.5L50,32l14.5-14.5L50,3z M50,24l-6.5-6.5l6.5-6.5l6.5,6.5L50,24z" />
    <path d="M82.5,3L68,17.5L82.5,32L97,17.5L82.5,3z M82.5,24L76,17.5l6.5-6.5l6.5,6.5L82.5,24z" />
  </svg>
);

export const SpotifyLogo: React.FC<LogoProps> = ({ className, width = 24, height = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" width={width} height={height} className={className} fill="currentColor">
    <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z" />
  </svg>
);