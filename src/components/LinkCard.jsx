import { ExternalLink, Copy, Check, Github } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export default function LinkCard({ link, view, query }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const isList = view === 'list';

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group block bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/30",
        isList ? "flex items-center p-4 gap-5" : "flex flex-col"
      )}
    >
      <div className={cn(
        "relative bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0",
        isList ? "w-24 h-24 rounded-xl" : "aspect-[2/1] w-full"
      )}>
        {link.imageUrl && !imgError ? (
          <img
            src={link.imageUrl}
            alt={link.imageAlt || link.title}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <span className={cn("font-medium", isList ? "text-2xl" : "text-sm")}>{link.title.charAt(0)}</span>
          </div>
        )}
        
        {!isList && (
          <div className="absolute top-3 left-3 flex gap-2">
            {link.badge && (
              <span className="px-2 py-1 rounded-md bg-white/90 dark:bg-black/90 backdrop-blur-sm text-xs font-semibold shadow-sm">
                {link.badge}
              </span>
            )}
            {link.featured && (
              <span className="px-2 py-1 rounded-md bg-primary/90 text-white backdrop-blur-sm text-xs font-semibold shadow-sm">
                Featured
              </span>
            )}
          </div>
        )}
      </div>

      <div className={cn("flex flex-col flex-1", !isList && "p-5")}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg text-text group-hover:text-primary transition-colors line-clamp-1">
                <HighlightText text={link.title} highlight={query} />
              </h3>
              {isList && (
                <div className="flex gap-2 shrink-0 hidden sm:flex">
                  {link.badge && <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">{link.badge}</span>}
                  {link.featured && <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold">Featured</span>}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-primary mt-1 inline-block">
              {link.category}
            </span>
          </div>
          <div className="flex shrink-0">
            {link.githubUrl && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(link.githubUrl, '_blank');
                }}
                className="p-2 -mr-1 text-primary hover:text-primary-hover hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="View on GitHub"
              >
                <Github size={16} />
              </button>
            )}
            <button
              onClick={handleCopy}
              className="p-2 -mr-2 text-text-muted hover:text-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Copy link"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        
        <p className="text-sm text-text-muted line-clamp-2 mb-3 flex-1">
          <HighlightText text={link.description} highlight={query} />
        </p>

        <div className="flex items-center gap-2 mt-auto text-xs text-text-muted">
          <span className="truncate">
            <HighlightText text={new URL(link.url).hostname} highlight={query} />
          </span>
          <ExternalLink size={12} className="opacity-50" />
        </div>
      </div>
    </a>
  );
}

const HighlightText = ({ text, highlight }) => {
  if (!highlight || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? 
          <span key={i} className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 rounded-sm px-0.5">{part}</span> : 
          part
      )}
    </>
  );
};
