import confetti from "canvas-confetti"

export function fireConfetti(opts?: { origin?: { x: number; y: number }; scalar?: number }) {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: opts?.origin ?? { y: 0.6 },
    colors: ["#2BBDBD", "#E8836A", "#F59E0B", "#10B981", "#EC4899"],
    scalar: opts?.scalar ?? 1,
  })
}

export function fireSchoolPride() {
  const end = Date.now() + 1500
  const colors = ["#2BBDBD", "#E8836A"]
  ;(function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export function fireStars() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    shapes: ["star"],
    colors: ["#F59E0B", "#FCD34D", "#FBBF24"],
    scalar: 1.2,
  })
}
