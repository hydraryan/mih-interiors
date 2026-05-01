"use client";

import { ChevronRight, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
import * as Color from "color-bits";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────
const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback: string = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;
  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const el = document.createElement("div");
      el.style.color = cssColor;
      document.body.appendChild(el);
      const computed = window.getComputedStyle(el).color;
      if (document.body.contains(el)) {
        el.remove();
      }
      return Color.formatRGBA(Color.parse(computed));
    }
    return Color.formatRGBA(Color.parse(cssColor));
  } catch {
    return fallback;
  }
};

const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);
  useEffect(() => {
    function check() {
      setValue(window.matchMedia(query).matches);
    }
    check();
    const mq = window.matchMedia(query);
    mq.addEventListener("change", check);
    window.addEventListener("resize", check);
    return () => {
      mq.removeEventListener("change", check);
      window.removeEventListener("resize", check);
    };
  }, [query]);
  return value;
}

// ─── FlickeringGrid (self-contained) ────────────────────
interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, w, h);
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = w;
      maskCanvas.height = h;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px "Outfit", sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, w / (2 * dpr), h / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const sw = squareSize * dpr;
          const sh = squareSize * dpr;
          const maskData = maskCtx.getImageData(x, y, sw, sh).data;
          const hasText = maskData.some((v, idx) => idx % 4 === 0 && v > 0);
          const opacity = squares[i * rows + j];
          const finalOpacity = hasText ? Math.min(1, opacity * 5 + 0.7) : opacity;
          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, sw, sh);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const cols = Math.ceil(w / (squareSize + gridGap));
      const rows = Math.ceil(h / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, dt: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * dt) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateSize = () => {
      const nw = width || container.clientWidth;
      const nh = height || container.clientHeight;
      setCanvasSize({ width: nw, height: nh });
      gridParams = setupCanvas(canvas, nw, nh);
    };
    updateSize();

    let last = 0;
    const animate = (time: number) => {
      if (!isInView) return;
      const dt = (time - last) / 1000;
      last = time;
      updateSquares(gridParams.squares, dt);
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr);
      animId = requestAnimationFrame(animate);
    };

    const ro = new ResizeObserver(() => updateSize());
    ro.observe(container);
    const io = new IntersectionObserver(([e]) => setIsInView(e.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    if (isInView) animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={`h-full w-full ${className ?? ""}`} {...props}>
      <canvas ref={canvasRef} className="pointer-events-none" style={{ width: canvasSize.width, height: canvasSize.height }} />
    </div>
  );
};

const JustdialIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);

// ─── Component ──────────────────────────────────────────
export default function Footer() {
  const tablet = useMediaQuery("(max-width: 1024px)");

  const footerColumns = [
    {
      title: "Quick Links",
      links: [
        { id: 1, label: "About Us", href: "/about" },
        { id: 2, label: "Services", href: "/services" },
        { id: 3, label: "Portfolio", href: "/projects" },
        { id: 4, label: "Blogs", href: "/blogs" },
        { id: 5, label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { id: 6, label: "Residential Interiors", href: "/services/residential-interiors" },
        { id: 7, label: "Commercial Design", href: "/services/commercial-interiors" },
        { id: 8, label: "Construction & Architecture", href: "/services/construction-architecture" },
      ],
    },
    {
      title: "Resources",
      links: [
        { id: 10, label: "Design Gallery", href: "/projects" },
        { id: 11, label: "Blog Articles", href: "/blogs" },
        { id: 12, label: "Privacy Policy", href: "/privacy-policy" },
        { id: 13, label: "Terms of Service", href: "/terms-of-service" },
      ],
    },
  ];

  return (
    <footer id="footer" className="w-full bg-cream-100 pb-0 overflow-hidden">
      {/* Top divider */}
      <div className="max-w-350 mx-auto px-6 md:px-12">
        <div className="w-full h-px bg-charcoal-900/8" />
      </div>

      {/* ── Main Footer Content ── */}
      <div className="max-w-350 mx-auto px-6 md:px-12 pt-12 pb-6 md:pt-16 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <img 
                src="/logo.png" 
                alt="MIH Interiors" 
                className="h-10 w-auto object-contain opacity-90"
              />
            </Link>
            <p className="font-body text-charcoal-900/45 text-sm leading-relaxed mb-6 max-w-xs">
              Transforming spaces into timeless experiences. Premium interior design across Chandigarh, Punjab & North India.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-8">
              <a 
                href="https://maps.app.goo.gl/nh54NTND4Jgn8wRG6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-start gap-3 font-body text-sm text-charcoal-900/50 hover:text-amber-600 transition-colors"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-amber-500" />
                SCO 12, Phase 11, Mohali, Chandigarh 160062
              </a>
              <a href="tel:+919888545403" className="group flex items-center gap-3 font-body text-sm text-charcoal-900/50 hover:text-amber-600 transition-colors">
                <Phone size={15} className="shrink-0 text-amber-500" />
                +91 98885 45403
              </a>
              <a href="mailto:miharchitect@gmail.com" className="group flex items-center gap-3 font-body text-sm text-charcoal-900/50 hover:text-amber-600 transition-colors">
                <Mail size={15} className="shrink-0 text-amber-500" />
                miharchitect@gmail.com
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: <InstagramIcon />, href: "https://www.instagram.com/mihinteriors/", label: "Instagram" },
                { icon: <FacebookIcon />, href: "https://www.facebook.com/profile.php?id=100088721091794", label: "Facebook" },
                { icon: <JustdialIcon />, href: "https://www.justdial.com/Chandigarh/Mih-Architects-and-Interiors-Main-Market-Chandigarh-Sector-17a/0172PX172-X172-241024174522-K6P7_BZDET", label: "Justdial" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-charcoal-900/4 hover:bg-amber-500 flex items-center justify-center text-charcoal-900/40 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-12">
              {footerColumns.map((column, colIdx) => (
                <div key={colIdx}>
                  <h4 className="font-body text-[10px] text-charcoal-900/30 uppercase tracking-[0.3em] font-bold mb-5">
                    {column.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {column.links.map((link) => (
                      <li key={link.id}>
                        <Link 
                          href={link.href} 
                          className="group inline-flex items-center gap-2 font-body text-sm text-charcoal-900/55 hover:text-amber-600 transition-colors duration-300"
                        >
                          {link.label}
                          <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright Bar ── */}
      <div className="max-w-350 mx-auto px-6 md:px-12 pb-4 flex flex-col md:flex-row justify-between items-center text-xs font-body text-charcoal-900/30 border-t border-charcoal-900/5 pt-5">
        <p>© {new Date().getFullYear()} MIH Interiors. All rights reserved.</p>
        <div className="flex gap-6 mt-2 md:mt-0">
          <Link href="/privacy-policy" className="hover:text-amber-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-amber-600 transition-colors">Terms of Service</Link>
        </div>
      </div>

      {/* ── Flickering Grid Banner ── */}
      <div className="w-full h-32 md:h-40 relative mt-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-cream-100 to-transparent z-10 h-8" />
        <div className="absolute inset-0 overflow-hidden">
          <FlickeringGrid
            text={tablet ? "MIH" : "MIH INTERIORS"}
            fontSize={tablet ? 60 : 110}
            fontWeight={900}
            className="h-full w-full opacity-90"
            squareSize={3}
            gridGap={tablet ? 2 : 2}
            color="#B47A40"
            maxOpacity={0.8}
            flickerChance={0.25}
          />
        </div>
      </div>
    </footer>
  );
}
