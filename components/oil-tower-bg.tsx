export function OilTowerBg() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 1200 800"
      >
        {/* Oil Derrick 1 - left */}
        <g opacity="0.07" fill="none" stroke="#888" strokeWidth="2">
          {/* Tower frame */}
          <line x1="120" y1="800" x2="160" y2="350" />
          <line x1="220" y1="800" x2="180" y2="350" />
          {/* Cross braces */}
          <line x1="130" y1="700" x2="210" y2="650" />
          <line x1="210" y1="700" x2="130" y2="650" />
          <line x1="140" y1="600" x2="200" y2="550" />
          <line x1="200" y1="600" x2="140" y2="550" />
          <line x1="148" y1="500" x2="192" y2="450" />
          <line x1="192" y1="500" x2="148" y2="450" />
          {/* Top */}
          <line x1="170" y1="350" x2="170" y2="300" />
          <rect x="162" y="290" width="16" height="16" />
          {/* Pump arm */}
          <line x1="170" y1="310" x2="80" y2="330" />
          <circle cx="80" cy="330" r="8" />
          {/* Base platform */}
          <line x1="100" y1="800" x2="240" y2="800" />
          <line x1="110" y1="790" x2="230" y2="790" />
        </g>

        {/* Oil Derrick 2 - center-right, larger */}
        <g opacity="0.05" fill="none" stroke="#777" strokeWidth="2.5">
          <line x1="750" y1="800" x2="810" y2="280" />
          <line x1="900" y1="800" x2="840" y2="280" />
          {/* Cross braces */}
          <line x1="765" y1="720" x2="885" y2="660" />
          <line x1="885" y1="720" x2="765" y2="660" />
          <line x1="778" y1="600" x2="872" y2="540" />
          <line x1="872" y1="600" x2="778" y2="540" />
          <line x1="790" y1="480" x2="860" y2="420" />
          <line x1="860" y1="480" x2="790" y2="420" />
          <line x1="800" y1="380" x2="850" y2="330" />
          <line x1="850" y1="380" x2="800" y2="330" />
          {/* Top */}
          <line x1="825" y1="280" x2="825" y2="220" />
          <rect x="815" y="205" width="20" height="20" />
          {/* Pump arm */}
          <line x1="825" y1="225" x2="720" y2="250" />
          <circle cx="720" cy="250" r="10" />
          {/* Base */}
          <line x1="720" y1="800" x2="930" y2="800" />
        </g>

        {/* Oil Derrick 3 - far right, small */}
        <g opacity="0.04" fill="none" stroke="#666" strokeWidth="1.5">
          <line x1="1050" y1="800" x2="1075" y2="480" />
          <line x1="1130" y1="800" x2="1105" y2="480" />
          <line x1="1060" y1="720" x2="1120" y2="680" />
          <line x1="1120" y1="720" x2="1060" y2="680" />
          <line x1="1068" y1="620" x2="1112" y2="580" />
          <line x1="1112" y1="620" x2="1068" y2="580" />
          <line x1="1090" y1="480" x2="1090" y2="440" />
          <rect x="1083" y="430" width="14" height="14" />
          <line x1="1090" y1="445" x2="1030" y2="460" />
          <circle cx="1030" cy="460" r="6" />
        </g>

        {/* Pump jack - left foreground */}
        <g opacity="0.06" fill="none" stroke="#888" strokeWidth="2">
          {/* Base */}
          <rect x="320" y="740" width="80" height="60" rx="0" />
          {/* Support */}
          <line x1="360" y1="740" x2="360" y2="690" />
          {/* Walking beam */}
          <line x1="300" y1="690" x2="420" y2="685" />
          {/* Horse head */}
          <path d="M 300 690 Q 290 680 295 670" />
          <line x1="295" y1="670" x2="295" y2="750" />
          {/* Counter weight */}
          <circle cx="420" cy="700" r="15" />
          {/* Crank */}
          <line x1="400" y1="740" x2="420" y2="700" />
        </g>

        {/* Pipeline - bottom */}
        <g opacity="0.04" stroke="#777" strokeWidth="3" fill="none">
          <line x1="0" y1="770" x2="500" y2="770" />
          <line x1="500" y1="770" x2="520" y2="760" />
          <line x1="520" y1="760" x2="700" y2="760" />
          <line x1="700" y1="760" x2="720" y2="770" />
          <line x1="720" y1="770" x2="1200" y2="770" />
        </g>

        {/* Small oil drops scattered */}
        <circle cx="500" cy="650" r="4" fill="#555" opacity="0.05" />
        <circle cx="620" cy="700" r="3" fill="#555" opacity="0.04" />
        <circle cx="950" cy="680" r="5" fill="#555" opacity="0.03" />
        <circle cx="200" cy="750" r="3" fill="#555" opacity="0.04" />

        {/* Ground line */}
        <line x1="0" y1="800" x2="1200" y2="800" stroke="#333" strokeWidth="2" opacity="0.1" />
      </svg>
    </div>
  )
}
