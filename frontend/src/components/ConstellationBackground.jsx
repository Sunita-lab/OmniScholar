export default function ConstellationBackground() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    cx: Math.random() * 100,
    cy: Math.random() * 100,
    r: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 3,
  }));

  const lines = [
    [0, 5], [5, 12], [12, 20], [3, 18], [7, 22],
    [15, 28], [22, 30], [8, 25], [30, 35], [18, 33],
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {lines.map(([a, b], i) => {
        const starA = stars[a];
        const starB = stars[b];
        if (!starA || !starB) return null;
        return (
          <line
            key={i}
            x1={starA.cx}
            y1={starA.cy}
            x2={starB.cx}
            y2={starB.cy}
            stroke="#0F766E"
            strokeWidth="0.1"
            opacity="0.3"
          />
        );
      })}
      {stars.map((star) => (
        <circle
          key={star.id}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#14B8A6"
          opacity="0.7"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.9;0.3"
            dur="3s"
            begin={`${star.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}