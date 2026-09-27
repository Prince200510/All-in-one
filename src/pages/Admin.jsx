import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, serverTimestamp, writeBatch } from "firebase/firestore";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, LogOut, Edit, Trash2, Eye, EyeOff, Star, Copy, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState("links");
  const [filterCategory, setFilterCategory] = useState("All");

  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "", description: "", url: "", githubUrl: "", imageUrl: "", imageAlt: "", 
    category: "", tags: "", badge: "", featured: false, published: false, order: 0
  });

  const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u?.uid === ADMIN_UID) {
        fetchAdminData();
      }
    });
    return unsub;
  }, []);

  const fetchAdminData = async () => {
    const linksQ = query(collection(db, "link99_links"), orderBy("order", "asc"));
    const catQ = query(collection(db, "link99_categories"));
    
    const [lSnap, cSnap] = await Promise.all([getDocs(linksQ), getDocs(catQ)]);
    setLinks(lSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setCategories(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred.user.uid !== ADMIN_UID) {
        await signOut(auth);
        setLoginError("Unauthorized UID");
      }
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => signOut(auth);

  const resetForm = () => {
    setFormData({
      title: "", description: "", url: "", githubUrl: "", imageUrl: "", imageAlt: "", 
      category: categories[0]?.name || "", tags: "", badge: "", featured: false, published: false, order: links.length
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, "link99_links", editingId), dataToSave);
      } else {
        await addDoc(collection(db, "link99_links"), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
      }
      resetForm();
      fetchAdminData();
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  const handleEdit = (link) => {
    setFormData({
      ...link,
      tags: (link.tags || []).join(", ")
    });
    setEditingId(link.id);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this link?")) {
      await deleteDoc(doc(db, "link99_links", id));
      fetchAdminData();
    }
  };

  const handleTogglePublish = async (id, current) => {
    await updateDoc(doc(db, "link99_links", id), { published: !current });
    fetchAdminData();
  };

  const handleToggleFeature = async (id, current) => {
    await updateDoc(doc(db, "link99_links", id), { featured: !current });
    fetchAdminData();
  };

  const handleDuplicate = async (link) => {
    const { id, createdAt, updatedAt, ...rest } = link;
    await addDoc(collection(db, "link99_links"), {
      ...rest,
      title: rest.title + " (Copy)",
      published: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    fetchAdminData();
  };

  const saveReorderedLinks = async (newLinks) => {
    setLinks(newLinks);
    try {
      const batch = writeBatch(db);
      newLinks.forEach((l, idx) => {
        batch.update(doc(db, "link99_links", l.id), { order: idx });
      });
      await batch.commit();
    } catch (e) {
      alert("Failed to save order");
    }
  };

  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (idx) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    const newLinks = [...links];
    const [moved] = newLinks.splice(draggedIdx, 1);
    newLinks.splice(idx, 0, moved);
    saveReorderedLinks(newLinks);
    setDraggedIdx(null);
  };

  const moveItem = (idx, direction) => {
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === links.length - 1)) return;
    const newLinks = [...links];
    const temp = newLinks[idx];
    newLinks[idx] = newLinks[idx + direction];
    newLinks[idx + direction] = temp;
    saveReorderedLinks(newLinks);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await addDoc(collection(db, "link99_categories"), { name: newCategory.trim() });
      setNewCategory("");
      fetchAdminData();
    } catch (err) {
      alert("Error adding category: " + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteDoc(doc(db, "link99_categories", id));
      fetchAdminData();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user || user.uid !== ADMIN_UID) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-sm border border-border">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full mb-4 px-4 py-2 border rounded-lg bg-background" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full mb-6 px-4 py-2 border rounded-lg bg-background" />
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium">Login</button>
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-text-muted hover:text-primary">Back to Dashboard</Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-text-muted hover:text-text rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-text-muted hover:text-red-500 transition-colors">
            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex gap-2 mb-6 border-b border-border pb-4">
          <button 
            onClick={() => setActiveTab("links")} 
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'links' ? 'bg-primary text-white' : 'bg-surface text-text hover:bg-slate-100 dark:hover:bg-slate-800 border border-border'}`}
          >
            Manage Links
          </button>
          <button 
            onClick={() => setActiveTab("categories")} 
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'categories' ? 'bg-primary text-white' : 'bg-surface text-text hover:bg-slate-100 dark:hover:bg-slate-800 border border-border'}`}
          >
            Manage Categories
          </button>
        </div>

        {activeTab === "links" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Panel */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Link' : 'Add New Link'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL *</label>
                <input required type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub URL (Optional)</label>
                <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-background text-sm">
                    <option value="" disabled>Select a category...</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-background text-sm" />
              </div>
              
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} className="rounded text-primary" />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded text-primary" />
                  Featured
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">
                  {editingId ? 'Save Changes' : 'Add Link'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Links List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">Manage Links ({links.length})</h2>
              <select 
                value={filterCategory} 
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 border rounded-lg bg-background text-sm font-medium"
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <button onClick={resetForm} className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shrink-0">
              <Plus size={16} /> New Link
            </button>
          </div>
          
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium w-12"></th>
                  <th className="px-4 py-3 font-medium">Link</th>
                  <th className="px-4 py-3 font-medium w-24">Status</th>
                  <th className="px-4 py-3 font-medium w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {links.filter(link => filterCategory === "All" || link.category === filterCategory).map((link) => {
                  const idx = links.findIndex(l => l.id === link.id); // Get original index for moveItem
                  return (
                  <tr 
                    key={link.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                    draggable={filterCategory === "All"}
                    onDragStart={filterCategory === "All" ? () => handleDragStart(idx) : undefined}
                    onDragOver={filterCategory === "All" ? handleDragOver : undefined}
                    onDrop={filterCategory === "All" ? () => handleDrop(idx) : undefined}
                  >
                    <td className={`px-4 py-3 text-text-muted ${filterCategory === "All" ? "cursor-move" : "opacity-30 cursor-not-allowed"}`} title={filterCategory === "All" ? "Drag to reorder" : "Reordering disabled while filtered"}>
                      <GripVertical size={16} className={filterCategory === "All" ? "opacity-50 hover:opacity-100" : ""} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium mb-0.5">{link.title}</div>
                      <div className="text-xs text-text-muted flex items-center gap-2">
                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{link.category}</span>
                        <span className="truncate max-w-[200px]">{link.url}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleTogglePublish(link.id, link.published)} className={link.published ? "text-green-500" : "text-text-muted"} title="Toggle Publish">
                          {link.published ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button onClick={() => handleToggleFeature(link.id, link.featured)} className={link.featured ? "text-amber-500" : "text-text-muted"} title="Toggle Feature">
                          <Star size={16} fill={link.featured ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className={`flex flex-col mr-2 border-r border-border pr-2 ${filterCategory !== "All" && "opacity-30"}`} title={filterCategory !== "All" ? "Reordering disabled while filtered" : ""}>
                          <button onClick={() => moveItem(idx, -1)} disabled={idx === 0 || filterCategory !== "All"} className="p-0.5 text-text-muted hover:text-text disabled:opacity-30"><ArrowUp size={14}/></button>
                          <button onClick={() => moveItem(idx, 1)} disabled={idx === links.length - 1 || filterCategory !== "All"} className="p-0.5 text-text-muted hover:text-text disabled:opacity-30"><ArrowDown size={14}/></button>
                        </div>
                        <button onClick={() => handleDuplicate(link)} className="p-1.5 text-text-muted hover:text-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Duplicate">
                          <Copy size={16} />
                        </button>
                        <button onClick={() => handleEdit(link)} className="p-1.5 text-text-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(link.id)} className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
                {links.filter(link => filterCategory === "All" || link.category === filterCategory).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                      No links found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ) : (
          <div className="max-w-xl">
            <div className="bg-surface rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <p className="text-sm text-text-muted mb-4">Create categories to organize your links. These will appear as selectable tabs on your main dashboard.</p>
              <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                <input required type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Enter new category name..." className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm" />
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">Add Category</button>
              </form>
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between text-sm px-4 py-3 bg-background border border-border rounded-lg shadow-sm">
                    <span className="font-medium">{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-600 p-1 bg-red-50 dark:bg-red-500/10 rounded transition-colors" title="Delete Category">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
                {categories.length === 0 && <div className="text-sm text-center py-8 text-text-muted border border-dashed border-border rounded-lg">No categories created yet.</div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
