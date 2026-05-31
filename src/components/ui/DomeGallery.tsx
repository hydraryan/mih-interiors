"use client"

import { useEffect, useMemo, useRef, useCallback, type CSSProperties } from "react"
import { useGesture } from "@use-gesture/react"
import styles from "./DomeGallery.module.css"

type ImageItem = string | { src: string; alt?: string; siteName?: string; location?: string }

type DomeGalleryProps = {
  images?: ImageItem[]
  fit?: number
  fitBasis?: "auto" | "min" | "max" | "width" | "height"
  minRadius?: number
  maxRadius?: number
  padFactor?: number
  overlayBlurColor?: string
  maxVerticalRotationDeg?: number
  dragSensitivity?: number
  enlargeTransitionMs?: number
  segments?: number
  dragDampening?: number
  openedImageWidth?: string
  openedImageHeight?: string
  imageBorderRadius?: string
  openedImageBorderRadius?: string
  grayscale?: boolean
  autoRotateSpeed?: number
}

type ItemDef = {
  src: string
  alt: string
  siteName?: string
  location?: string
  x: number
  y: number
  sizeX: number
  sizeY: number
}

const DEFAULT_IMAGES: ImageItem[] = [
  { src: "/hero_image.jpg", alt: "MIH interior showcase", siteName: "Modern Villa", location: "Chandigarh" },
  { src: "/services-residential.jpg", alt: "MIH residential interior", siteName: "Contemporary Home", location: "Mohali" },
  { src: "/services-commercial.jpg", alt: "MIH commercial interior", siteName: "Corporate Office", location: "Chandigarh" },
  { src: "/services-3d.jpg", alt: "MIH 3D visualization project", siteName: "Luxury Apartment", location: "Panchkula" },
  { src: "/services-construction.jpg", alt: "MIH construction execution", siteName: "Retail Space", location: "Punjab" },
  { src: "/hero_image.jpg", alt: "MIH luxury interior", siteName: "Heritage Bungalow", location: "Chandigarh" },
  { src: "/services-residential.jpg", alt: "MIH modern residential design", siteName: "Family Home", location: "Mohali" },
  { src: "/services-commercial.jpg", alt: "MIH office interior project", siteName: "Tech Startup", location: "Chandigarh" },
  { src: "/services-3d.jpg", alt: "MIH design render", siteName: "Smart Home", location: "Panchkula" },
  { src: "/services-construction.jpg", alt: "MIH site execution", siteName: "Community Center", location: "Punjab" },
  { src: "/hero_image.jpg", alt: "MIH premium living space", siteName: "Penthouse", location: "Chandigarh" },
  { src: "/services-residential.jpg", alt: "MIH curated interior design", siteName: "Boutique Hotel", location: "Mohali" },
]

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360
  return a - 180
}
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`)
  const n = attr == null ? Number.NaN : Number.parseFloat(attr)
  return Number.isFinite(n) ? n : fallback
}

function buildItems(pool: ImageItem[], seg: number): ItemDef[] {
  const xCols = Array.from({ length: seg }, (_, i) => (i - (seg - 1) / 2) * 2)
  const evenYs = [-4, -2, 0, 2, 4]
  const oddYs = [-3, -1, 1, 3, 5]

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }))
  })

  const totalSlots = coords.length
  const normalizedImages = pool.length
    ? pool.map((image) => (typeof image === "string" ? { src: image, alt: "", siteName: "", location: "" } : { src: image.src || "", alt: image.alt || "", siteName: image.siteName || "", location: image.location || "" }))
    : [{ src: "", alt: "", siteName: "", location: "" }]

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length])

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt,
    siteName: usedImages[i].siteName,
    location: usedImages[i].location,
  }))
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2
  const rotateY = unit * (offsetX + (sizeX - 1) / 2)
  const rotateX = unit * (offsetY - (sizeY - 1) / 2)
  return { rotateX, rotateY }
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = "auto",
  minRadius = 600,
  maxRadius = Number.POSITIVE_INFINITY,
  padFactor = 0.25,
  overlayBlurColor = "#120F17",
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = "400px",
  openedImageHeight = "400px",
  imageBorderRadius = "30px",
  openedImageBorderRadius = "30px",
  grayscale = false,
  autoRotateSpeed = 0.05,
}: DomeGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const focusedElRef = useRef<HTMLElement | null>(null)
  const originalTilePositionRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)

  const rotationRef = useRef({ x: 0, y: 0 })
  const startRotRef = useRef({ x: 0, y: 0 })
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const inertiaRAF = useRef<number | null>(null)

  const openingRef = useRef(false)
  const openStartedAtRef = useRef(0)
  const lastDragEndAt = useRef(0)
  const autoRotateRAF = useRef<number | null>(null)

  const lockScroll = useCallback(() => {
    document.body.classList.add("dg-scroll-lock")
  }, [])
  const unlockScroll = useCallback(() => {
    if (rootRef.current?.getAttribute("data-enlarging") === "true") return
    document.body.classList.remove("dg-scroll-lock")
  }, [])

  const items = useMemo(() => buildItems(images, segments), [images, segments])

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`
    }
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect
      const w = Math.max(1, cr.width)
      const h = Math.max(1, cr.height)
      const minDim = Math.min(w, h)
      const maxDim = Math.max(w, h)
      const aspect = w / h

      let basis: number
      switch (fitBasis) {
        case "min":
          basis = minDim
          break
        case "max":
          basis = maxDim
          break
        case "width":
          basis = w
          break
        case "height":
          basis = h
          break
        default:
          basis = aspect >= 1.3 ? w : minDim
      }

      let radius = basis * fit
      const heightGuard = h * 1.35
      radius = Math.min(radius, heightGuard)
      radius = clamp(radius, minRadius, maxRadius)

      const viewerPad = Math.max(8, Math.round(minDim * padFactor))
      root.style.setProperty("--radius", `${Math.round(radius)}px`)
      root.style.setProperty("--viewer-pad", `${viewerPad}px`)
      root.style.setProperty("--overlay-blur-color", overlayBlurColor)
      root.style.setProperty("--tile-radius", imageBorderRadius)
      root.style.setProperty("--enlarge-radius", openedImageBorderRadius)
      root.style.setProperty("--image-filter", grayscale ? "grayscale(1)" : "none")
      applyTransform(rotationRef.current.x, rotationRef.current.y)
    })

    ro.observe(root)
    return () => ro.disconnect()
  }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius, openedImageBorderRadius])

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y)
  }, [])

  useEffect(() => {
    if (!autoRotateSpeed) return
    const step = () => {
      if (!draggingRef.current && !inertiaRAF.current && !openingRef.current) {
        const nextY = wrapAngleSigned(rotationRef.current.y + autoRotateSpeed)
        rotationRef.current = { x: rotationRef.current.x, y: nextY }
        applyTransform(rotationRef.current.x, nextY)
      }
      autoRotateRAF.current = requestAnimationFrame(step)
    }
    autoRotateRAF.current = requestAnimationFrame(step)
    return () => {
      if (autoRotateRAF.current) cancelAnimationFrame(autoRotateRAF.current)
    }
  }, [autoRotateSpeed])

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current)
      inertiaRAF.current = null
    }
  }, [])

  const startInertia = useCallback(
    (vx: number, vy: number) => {
      const MAX_V = 1.4
      let vX = clamp(vx, -MAX_V, MAX_V) * 80
      let vY = clamp(vy, -MAX_V, MAX_V) * 80

      let frames = 0
      const d = clamp(dragDampening ?? 0.6, 0, 1)
      const frictionMul = 0.94 + 0.055 * d
      const stopThreshold = 0.015 - 0.01 * d
      const maxFrames = Math.round(90 + 270 * d)

      const step = () => {
        vX *= frictionMul
        vY *= frictionMul
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null
          return
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null
          return
        }

        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg)
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200)
        rotationRef.current = { x: nextX, y: nextY }
        applyTransform(nextX, nextY)
        inertiaRAF.current = requestAnimationFrame(step)
      }

      stopInertia()
      inertiaRAF.current = requestAnimationFrame(step)
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  )

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return
        stopInertia()
        const evt = event as PointerEvent
        draggingRef.current = true
        movedRef.current = false
        startRotRef.current = { ...rotationRef.current }
        startPosRef.current = { x: evt.clientX, y: evt.clientY }
      },
      onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return

        const evt = event as PointerEvent
        const dxTotal = evt.clientX - startPosRef.current.x
        const dyTotal = evt.clientY - startPosRef.current.y
        if (!movedRef.current && dxTotal * dxTotal + dyTotal * dyTotal > 16) movedRef.current = true

        const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg)
        const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity)
        rotationRef.current = { x: nextX, y: nextY }
        applyTransform(nextX, nextY)

        if (last) {
          draggingRef.current = false
          const [vMagX, vMagY] = velocity
          const [dirX, dirY] = direction
          let vx = vMagX * dirX
          let vy = vMagY * dirY

          if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2)
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2)
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy)
          if (movedRef.current) lastDragEndAt.current = performance.now()
          movedRef.current = false
        }
      },
    },
    { target: mainRef, eventOptions: { passive: true } }
  )

  const openItemFromElement = (el: HTMLElement) => {
    if (openingRef.current) return
    openingRef.current = true
    openStartedAtRef.current = performance.now()
    lockScroll()

    const parent = el.parentElement as HTMLElement
    focusedElRef.current = el
    el.setAttribute("data-focused", "true")

    const offsetX = getDataNumber(parent, "offsetX", 0)
    const offsetY = getDataNumber(parent, "offsetY", 0)
    const sizeX = getDataNumber(parent, "sizeX", 2)
    const sizeY = getDataNumber(parent, "sizeY", 2)

    const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments)
    const parentY = normalizeAngle(parentRot.rotateY)
    const globalY = normalizeAngle(rotationRef.current.y)
    let rotY = -(parentY + globalY) % 360
    if (rotY < -180) rotY += 360
    const rotX = -parentRot.rotateX - rotationRef.current.x
    parent.style.setProperty("--rot-y-delta", `${rotY}deg`)
    parent.style.setProperty("--rot-x-delta", `${rotX}deg`)

    const refDiv = document.createElement("div")
    refDiv.className = styles.itemImage
    refDiv.dataset.dg = "reference"
    refDiv.style.opacity = "0"
    refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`
    parent.appendChild(refDiv)
    void refDiv.offsetHeight

    const tileR = refDiv.getBoundingClientRect()
    const mainR = mainRef.current?.getBoundingClientRect()
    if (!mainR || tileR.width <= 0 || tileR.height <= 0) {
      openingRef.current = false
      focusedElRef.current = null
      refDiv.remove()
      unlockScroll()
      return
    }

    originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height }
    el.style.visibility = "hidden"

    const overlay = document.createElement("div")
    overlay.className = styles.enlarge
    overlay.dataset.dg = "enlarge"
    overlay.style.left = `${tileR.left - mainR.left}px`
    overlay.style.top = `${tileR.top - mainR.top}px`
    overlay.style.width = `${tileR.width}px`
    overlay.style.height = `${tileR.height}px`
    overlay.style.opacity = "1"
    overlay.style.willChange = "transform, opacity"
    overlay.style.transformOrigin = "top left"
    overlay.style.transition = `left ${enlargeTransitionMs}ms ease, top ${enlargeTransitionMs}ms ease, width ${enlargeTransitionMs}ms ease, height ${enlargeTransitionMs}ms ease`

    const rawSrc = parent.dataset.src || (el.querySelector("img") as HTMLImageElement)?.src || ""
    const img = document.createElement("img")
    img.src = rawSrc
    overlay.appendChild(img)

    // Copy the overlay details if they exist to the enlarged view
    const detailsDiv = el.querySelector(`.${styles.imageOverlay}`)
    if (detailsDiv) {
      const clonedDetails = detailsDiv.cloneNode(true) as HTMLElement
      clonedDetails.style.opacity = "1"
      clonedDetails.style.bottom = "24px"
      clonedDetails.style.left = "24px"
      clonedDetails.style.transform = "none"
      // Optional: make the text slightly larger for the expanded view
      const siteName = clonedDetails.querySelector(`.${styles.siteName}`) as HTMLElement
      if (siteName) siteName.style.fontSize = "1.5rem"
      const location = clonedDetails.querySelector(`.${styles.location}`) as HTMLElement
      if (location) location.style.fontSize = "1rem"
      overlay.appendChild(clonedDetails)
    }

    viewerRef.current?.appendChild(overlay)

    let targetWidth = 400
    if (openedImageWidth.endsWith("%")) {
      targetWidth = mainR.width * (Number.parseFloat(openedImageWidth) / 100)
    } else {
      targetWidth = Number.parseFloat(openedImageWidth) || 400
    }

    let targetHeight = 400
    if (openedImageHeight.endsWith("%")) {
      targetHeight = mainR.height * (Number.parseFloat(openedImageHeight) / 100)
    } else {
      targetHeight = Number.parseFloat(openedImageHeight) || 400
    }

    const centeredLeft = (mainR.width - targetWidth) / 2
    const centeredTop = (mainR.height - targetHeight) / 2

    requestAnimationFrame(() => {
      if (!overlay.parentElement) return
      rootRef.current?.setAttribute("data-enlarging", "true")
      overlay.style.left = `${centeredLeft}px`
      overlay.style.top = `${centeredTop}px`
      overlay.style.width = `${targetWidth}px`
      overlay.style.height = `${targetHeight}px`
    })
  }

  const onTileClick = (el: HTMLElement) => {
    if (draggingRef.current || movedRef.current) return
    if (performance.now() - lastDragEndAt.current < 80) return
    if (openingRef.current) return
    openItemFromElement(el)
  }

  useEffect(() => {
    const scrim = scrimRef.current
    if (!scrim) return

    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return

      const el = focusedElRef.current
      if (!el) return
      const parent = el.parentElement as HTMLElement
      const overlay = viewerRef.current?.querySelector('[data-dg="enlarge"]') as HTMLElement | null
      const refDiv = parent.querySelector('[data-dg="reference"]') as HTMLElement | null
      if (!overlay) return

      const originalPos = originalTilePositionRef.current
      if (!originalPos) {
        overlay.remove()
        refDiv?.remove()
        parent.style.setProperty("--rot-y-delta", "0deg")
        parent.style.setProperty("--rot-x-delta", "0deg")
        el.style.visibility = ""
        focusedElRef.current = null
        rootRef.current?.removeAttribute("data-enlarging")
        openingRef.current = false
        unlockScroll()
        return
      }

      const mainRect = mainRef.current?.getBoundingClientRect()
      if (mainRect) {
        overlay.style.left = `${originalPos.left - mainRect.left}px`
        overlay.style.top = `${originalPos.top - mainRect.top}px`
        overlay.style.width = `${originalPos.width}px`
        overlay.style.height = `${originalPos.height}px`
      }

      setTimeout(() => {
        overlay.remove()
        refDiv?.remove()
        parent.style.setProperty("--rot-y-delta", "0deg")
        parent.style.setProperty("--rot-x-delta", "0deg")
        el.style.visibility = ""
        focusedElRef.current = null
        rootRef.current?.removeAttribute("data-enlarging")
        openingRef.current = false
        unlockScroll()
      }, enlargeTransitionMs)
    }

    scrim.addEventListener("click", close)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      scrim.removeEventListener("click", close)
      window.removeEventListener("keydown", onKey)
    }
  }, [unlockScroll, enlargeTransitionMs])

  useEffect(() => {
    return () => {
      document.body.classList.remove("dg-scroll-lock")
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={styles.sphereRoot}
      style={
        {
          ["--segments-x" as string]: segments,
          ["--segments-y" as string]: segments,
          ["--overlay-blur-color" as string]: overlayBlurColor,
          ["--tile-radius" as string]: imageBorderRadius,
          ["--enlarge-radius" as string]: openedImageBorderRadius,
          ["--image-filter" as string]: grayscale ? "grayscale(1)" : "none",
        } as CSSProperties
      }
    >
      <main ref={mainRef} className={styles.sphereMain}>
        <div className={styles.stage}>
          <div ref={sphereRef} className={styles.sphere}>
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className={styles.item}
                data-src={it.src}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                style={
                  {
                    ["--offset-x" as string]: it.x,
                    ["--offset-y" as string]: it.y,
                    ["--item-size-x" as string]: it.sizeX,
                    ["--item-size-y" as string]: it.sizeY,
                  } as CSSProperties
                }
              >
                <div
                  className={styles.itemImage}
                  role="button"
                  tabIndex={0}
                  aria-label={it.alt || "Open image"}
                  onClick={(e) => onTileClick(e.currentTarget)}
                  onPointerUp={(e) => {
                    if (e.pointerType === "touch") onTileClick(e.currentTarget)
                  }}
                >
                  <img src={it.src} draggable={false} alt={it.alt} />
                  {(it.siteName || it.location) && (
                    <div className={styles.imageOverlay}>
                      {it.siteName && <div className={styles.siteName}>{it.siteName}</div>}
                      {it.location && <div className={styles.location}>{it.location}</div>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.overlay} />
        <div className={styles.overlayBlur} />
        <div className={`${styles.edgeFade} ${styles.edgeFadeTop}`} />
        <div className={`${styles.edgeFade} ${styles.edgeFadeBottom}`} />

        <div className={styles.viewer} ref={viewerRef}>
          <div ref={scrimRef} className={styles.scrim} />
          <div ref={frameRef} className={styles.frame} />
        </div>
      </main>
    </div>
  )
}
