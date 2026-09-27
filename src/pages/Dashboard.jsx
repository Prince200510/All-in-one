import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, LayoutGrid, List, Settings, Crown } from "lucide-react";
import { getPublishedLinks, getCategories } from "../lib/db";
import LinkCard from "../components/LinkCard";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "All";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linksData, catsData] = await Promise.all([
          getPublishedLinks(),
          getCategories()
        ]);
        setLinks(linksData);
        setCategories([{ id: "all", name: "All" }, ...catsData]);
      } catch (err) {
        console.error(err);
        setError("Failed to load tools.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const matchesSearch = 
        link.title.toLowerCase().includes(query.toLowerCase()) || 
        link.description?.toLowerCase().includes(query.toLowerCase()) ||
        link.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || link.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [links, query, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shrink-0">
                <Crown size={20} />
              </div>
              <h1 className="text-xl font-bold tracking-tight mr-2">All-in-one</h1>
              <Link to="/about" className="hidden sm:block px-3 py-1 bg-surface border border-border hover:border-primary text-text-muted hover:text-primary rounded-full text-xs font-semibold transition-all">
                About Me
              </Link>
            </div>
            
            <div className="flex sm:hidden items-center gap-2">
              <Link to="/admin" className="p-2 text-text-muted hover:text-text hover:bg-surface rounded-lg transition-colors">
                <Settings size={20} />
              </Link>
            </div>
          </div>
          
          <div className="w-full sm:flex-1 max-w-xl sm:px-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search tools, notes, and projects..."
                value={query}
                onChange={(e) => setSearchParams(prev => {
                  if (e.target.value) prev.set("q", e.target.value);
                  else prev.delete("q");
                  return prev;
                })}
                className="w-full bg-background border border-border rounded-full py-2 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="flex bg-background rounded-lg p-1 border border-border">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-surface shadow-sm text-text" : "text-text-muted hover:text-text"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-surface shadow-sm text-text" : "text-text-muted hover:text-text"}`}
              >
                <List size={18} />
              </button>
            </div>
            <Link to="/admin" className="p-2 text-text-muted hover:text-text hover:bg-surface rounded-lg transition-colors ml-2">
              <Settings size={20} />
            </Link>
          </div>
        </div>
        
        {/* Categories */}
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto no-scrollbar border-t border-border/50">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSearchParams(prev => {
                  prev.set("category", cat.name);
                  return prev;
                })}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-text text-surface"
                    : "bg-surface border border-border text-text hover:border-text-muted"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse bg-surface rounded-2xl border border-border overflow-hidden h-[300px]">
                <div className="w-full h-40 bg-slate-200 dark:bg-slate-800" />
                <div className="p-5 space-y-4">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-surface border border-border rounded-lg text-text hover:bg-slate-50 transition-colors">
              Try Again
            </button>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-text mb-2">No tools found</h2>
            <p className="text-text-muted">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
            {filteredLinks.map(link => (
              <LinkCard key={link.id} link={link} view={view} query={query} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
