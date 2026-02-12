"use client"

import type { RegenmonType } from "@/hooks/use-regenmon"

interface RegenmonSpriteProps {
  type: RegenmonType
  size?: number
  className?: string
}

/**
 * Pixel art oil drop sprite drawn as SVG.
 * Based on the reference: teardrop body, square pixel eyes, small pixel mouth with teeth,
 * brown/gold stick legs, tiny arm bumps on sides, dotted shadow below.
 */
export function RegenmonSprite({ type, size = 160, className = "" }: RegenmonSpriteProps) {
  const colors = TYPE_COLORS[type]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Regenmon tipo ${type}`}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Shadow */}
      <ellipse cx="32" cy="68" rx="16" ry="3" fill="#333" opacity="0.5" />

      {/* Legs */}
      <rect x="24" y="54" width="3" height="10" fill="#8B6914" />
      <rect x="37" y="54" width="3" height="10" fill="#8B6914" />
      {/* Feet */}
      <rect x="22" y="62" width="7" height="3" fill="#6B4F10" />
      <rect x="35" y="62" width="7" height="3" fill="#6B4F10" />

      {/* Body - teardrop shape built from rects for pixel look */}
      {/* Tip of drop */}
      <rect x="30" y="4" width="4" height="4" fill={colors.body} />
      <rect x="28" y="8" width="8" height="4" fill={colors.body} />
      <rect x="26" y="12" width="12" height="4" fill={colors.body} />
      <rect x="24" y="16" width="16" height="4" fill={colors.body} />
      <rect x="22" y="20" width="20" height="4" fill={colors.body} />
      <rect x="20" y="24" width="24" height="4" fill={colors.body} />
      <rect x="18" y="28" width="28" height="4" fill={colors.body} />
      <rect x="16" y="32" width="32" height="4" fill={colors.body} />
      <rect x="15" y="36" width="34" height="4" fill={colors.body} />
      <rect x="14" y="40" width="36" height="4" fill={colors.body} />
      <rect x="15" y="44" width="34" height="4" fill={colors.body} />
      <rect x="16" y="48" width="32" height="4" fill={colors.body} />
      <rect x="18" y="52" width="28" height="4" fill={colors.body} />
      <rect x="22" y="56" width="20" height="2" fill={colors.body} />

      {/* Highlight / oil sheen on left side */}
      <rect x="18" y="28" width="4" height="12" fill={colors.highlight} opacity="0.7" />
      <rect x="16" y="34" width="4" height="10" fill={colors.highlight} opacity="0.5" />

      {/* Highlight on bottom right */}
      <rect x="40" y="44" width="6" height="6" fill={colors.highlight} opacity="0.5" />
      <rect x="42" y="40" width="4" height="4" fill={colors.highlight} opacity="0.4" />

      {/* Arms - small bumps */}
      <rect x="12" y="38" width="4" height="3" fill={colors.body} />
      <rect x="10" y="39" width="3" height="4" fill="#8B6914" />
      <rect x="48" y="38" width="4" height="3" fill={colors.body} />
      <rect x="51" y="39" width="3" height="4" fill="#8B6914" />

      {/* Eyes - square white pixels */}
      {type === "black" ? (
        <>
          {/* Sunglasses */}
          <rect x="20" y="32" width="10" height="6" fill="#1a1a1a" />
          <rect x="34" y="32" width="10" height="6" fill="#1a1a1a" />
          {/* Bridge */}
          <rect x="30" y="33" width="4" height="3" fill="#1a1a1a" />
          {/* Lens shine */}
          <rect x="22" y="33" width="2" height="2" fill="#444" />
          <rect x="36" y="33" width="2" height="2" fill="#444" />
          {/* Frame top */}
          <rect x="19" y="31" width="12" height="2" fill="#2a2a2a" />
          <rect x="33" y="31" width="12" height="2" fill="#2a2a2a" />
        </>
      ) : type === "brown" ? (
        <>
          {/* Study glasses - round frames */}
          <rect x="21" y="31" width="8" height="8" fill="none" stroke="#3a3a3a" strokeWidth="2" />
          <rect x="35" y="31" width="8" height="8" fill="none" stroke="#3a3a3a" strokeWidth="2" />
          {/* Bridge */}
          <rect x="29" y="33" width="6" height="2" fill="#3a3a3a" />
          {/* Eyes behind glasses */}
          <rect x="23" y="33" width="4" height="4" fill="white" />
          <rect x="37" y="33" width="4" height="4" fill="white" />
          {/* Pupils */}
          <rect x="25" y="34" width="2" height="2" fill="#111" />
          <rect x="39" y="34" width="2" height="2" fill="#111" />
        </>
      ) : (
        <>
          {/* Normal eyes */}
          <rect x="23" y="32" width="5" height="6" fill="white" />
          <rect x="36" y="32" width="5" height="6" fill="white" />
          {/* Pupils */}
          <rect x="25" y="34" width="2" height="2" fill="#111" />
          <rect x="38" y="34" width="2" height="2" fill="#111" />
        </>
      )}

      {/* Mouth */}
      {type === "black" ? (
        <>
          {/* Smirk / mischievous grin */}
          <rect x="27" y="42" width="12" height="3" fill="#1a0a0a" />
          <rect x="30" y="43" width="6" height="2" fill="white" />
          {/* Smirk corner up on right */}
          <rect x="39" y="41" width="2" height="2" fill="#1a0a0a" />
        </>
      ) : (
        <>
          {/* Normal smile */}
          <rect x="28" y="42" width="8" height="3" fill="#1a0a0a" />
          <rect x="30" y="43" width="4" height="2" fill="white" />
        </>
      )}

      {/* Accessories per type */}
      {type === "green" && (
        <>
          {/* Baseball cap - backwards */}
          <rect x="22" y="10" width="20" height="4" fill="#cc2222" />
          <rect x="24" y="8" width="16" height="4" fill="#cc2222" />
          <rect x="26" y="6" width="12" height="4" fill="#cc2222" />
          {/* Cap brim going backwards */}
          <rect x="38" y="12" width="8" height="3" fill="#aa1111" />
          <rect x="40" y="14" width="6" height="2" fill="#aa1111" />
          {/* Cap button on top */}
          <rect x="31" y="5" width="2" height="2" fill="#dd3333" />
        </>
      )}
    </svg>
  )
}

const TYPE_COLORS: Record<RegenmonType, { body: string; highlight: string }> = {
  green: {
    body: "#2d5a27",
    highlight: "#4a8c3f",
  },
  brown: {
    body: "#5c3a1e",
    highlight: "#8B6914",
  },
  black: {
    body: "#1a1a1a",
    highlight: "#8B6914",
  },
}
