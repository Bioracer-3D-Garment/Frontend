import { Dialog, IconButton, Typography } from "@mui/material";
import {
  Close,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
} from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Asset } from "@/types/types";

interface AssetPreviewDialogProps {
  // The list of assets that can be navigated between in the preview.
  assets: Asset[];
  // Index of the currently previewed asset, or null when the dialog is closed.
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
  onDownload: (asset: Asset) => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.25;

function imageUrl(asset: Asset): string {
  return `${process.env.NEXT_PUBLIC_PYTHON_SERVER_URL}/${asset.publicId}`;
}

function clampScale(value: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

export function AssetPreviewDialog({
  assets,
  index,
  onClose,
  onNavigate,
  onDownload,
}: AssetPreviewDialogProps) {
  const isOpen = index !== null;
  const asset = isOpen ? (assets[index] ?? null) : null;
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < assets.length - 1;
  const isImage = asset?.type !== "video";

  // Zoom level and pan offset (in pixels) applied to the previewed image.
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // Removes the currently attached wheel listener, if any.
  const detachWheelRef = useRef<(() => void) | null>(null);
  // Latest `isImage` value, read inside the (long-lived) wheel listener.
  const isImageRef = useRef(isImage);
  useEffect(() => {
    isImageRef.current = isImage;
  }, [isImage]);
  // Active drag-to-pan gesture, or null when not panning.
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Reset zoom/pan on close so the next time the dialog opens it starts fit.
  const handleClose = useCallback(() => {
    resetZoom();
    onClose();
  }, [resetZoom, onClose]);

  // Reset zoom/pan when moving to another asset so each starts fit-to-view.
  const goPrev = useCallback(() => {
    if (index !== null && hasPrev) {
      resetZoom();
      onNavigate(index - 1);
    }
  }, [index, hasPrev, onNavigate, resetZoom]);

  const goNext = useCallback(() => {
    if (index !== null && hasNext) {
      resetZoom();
      onNavigate(index + 1);
    }
  }, [index, hasNext, onNavigate, resetZoom]);

  // Zoom around a focal point (relative to the viewport center) so the pixel
  // under the cursor stays put. When no point is given, zoom around the center.
  const zoomBy = useCallback(
    (delta: number, focalX = 0, focalY = 0) => {
      setScale((prevScale) => {
        const nextScale = clampScale(prevScale + delta);
        if (nextScale === prevScale) return prevScale;
        if (nextScale === 1) {
          setOffset({ x: 0, y: 0 });
          return nextScale;
        }
        setOffset((prevOffset) => {
          const ratio = nextScale / prevScale;
          return {
            x: focalX - ratio * (focalX - prevOffset.x),
            y: focalY - ratio * (focalY - prevOffset.y),
          };
        });
        return nextScale;
      });
    },
    [],
  );

  // Attach the wheel-to-zoom listener via a callback ref so it binds exactly
  // when the viewport node mounts inside MUI's Dialog portal. A native,
  // non-passive listener is required so we can preventDefault and stop the
  // page/dialog from scrolling while zooming (React's onWheel is passive).
  const attachViewport = useCallback(
    (node: HTMLDivElement | null) => {
      detachWheelRef.current?.();
      detachWheelRef.current = null;
      if (!node) return;

      const handleWheel = (e: WheelEvent) => {
        if (!isImageRef.current) return;
        e.preventDefault();
        const rect = node.getBoundingClientRect();
        const focalX = e.clientX - rect.left - rect.width / 2;
        const focalY = e.clientY - rect.top - rect.height / 2;
        // Each notch is a gentle, fixed step regardless of the reported delta
        // (mice report large deltaY; trackpads small) — only direction matters.
        const direction = e.deltaY > 0 ? -1 : 1;
        zoomBy(direction * ZOOM_STEP * 1.5, focalX, focalY);
      };

      node.addEventListener("wheel", handleWheel, { passive: false });
      detachWheelRef.current = () =>
        node.removeEventListener("wheel", handleWheel);
    },
    [zoomBy],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "+" || e.key === "=") zoomBy(ZOOM_STEP);
      if (e.key === "-" || e.key === "_") zoomBy(-ZOOM_STEP);
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, goPrev, goNext, zoomBy, resetZoom]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset({
      x: drag.originX + (e.clientX - drag.startX),
      y: drag.originY + (e.clientY - drag.startY),
    });
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handleDoubleClick = () => {
    if (scale > 1) resetZoom();
    else zoomBy(1);
  };

  if (!asset) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        className: "!bg-neutral-900 !rounded-lg overflow-hidden",
      }}
    >
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="min-w-0">
            <Typography
              variant="subtitle1"
              className="font-extrabold text-white uppercase tracking-wide truncate"
            >
              {asset.clothing}
            </Typography>
            <Typography variant="caption" className="text-gray-400 capitalize">
              {asset.model} · {new Date(asset.date).toLocaleDateString()}
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            {isImage && (
              <>
                <IconButton
                  onClick={() => zoomBy(-ZOOM_STEP)}
                  disabled={scale <= MIN_SCALE}
                  size="small"
                  className="!text-white hover:!bg-white/20 disabled:!text-white/30"
                  aria-label="Zoom out"
                >
                  <ZoomOut fontSize="small" />
                </IconButton>
                <span className="text-xs text-gray-300 w-10 text-center tabular-nums">
                  {Math.round(scale * 100)}%
                </span>
                <IconButton
                  onClick={() => zoomBy(ZOOM_STEP)}
                  disabled={scale >= MAX_SCALE}
                  size="small"
                  className="!text-white hover:!bg-white/20 disabled:!text-white/30"
                  aria-label="Zoom in"
                >
                  <ZoomIn fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={resetZoom}
                  disabled={scale === 1 && offset.x === 0 && offset.y === 0}
                  size="small"
                  className="!text-white hover:!bg-white/20 disabled:!text-white/30"
                  aria-label="Reset zoom"
                >
                  <CenterFocusStrong fontSize="small" />
                </IconButton>
                <span className="mx-1 h-5 w-px bg-white/15" />
              </>
            )}
            <IconButton
              onClick={() => onDownload(asset)}
              size="small"
              className="!text-white hover:!bg-[#e2001a]"
              aria-label="Download asset"
            >
              <Download fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleClose}
              size="small"
              className="!text-white hover:!bg-white/20"
              aria-label="Close preview"
            >
              <Close fontSize="small" />
            </IconButton>
          </div>
        </div>

        <div
          ref={attachViewport}
          className="relative flex items-center justify-center bg-black min-h-[60vh] max-h-[80vh] overflow-hidden touch-none select-none"
        >
          {asset.type === "video" ? (
            <video
              src={asset.secureUrl}
              poster={asset.thumbnail || undefined}
              controls
              autoPlay
              playsInline
              className="max-h-[80vh] max-w-full"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl(asset)}
              alt={`${asset.clothing} ${asset.model}`}
              draggable={false}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onDoubleClick={handleDoubleClick}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transition: isDragging ? "none" : "transform 0.15s ease-out",
                cursor:
                  scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
              className="max-h-[80vh] max-w-full object-contain"
            />
          )}

          {hasPrev && (
            <button
              onClick={goPrev}
              aria-label="Previous asset"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-black/50 text-white hover:bg-[#e2001a] transition-colors"
            >
              <ChevronLeft />
            </button>
          )}
          {hasNext && (
            <button
              onClick={goNext}
              aria-label="Next asset"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-black/50 text-white hover:bg-[#e2001a] transition-colors"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
