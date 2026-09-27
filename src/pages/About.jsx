import { Link } from "react-router-dom";
import { ArrowLeft, Mail, GraduationCap, Briefcase, Trophy, Code2, Database, Github, Award, CheckCircle2, LayoutTemplate, Zap, FileCode2 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      
      <header className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-surface/50 backdrop-blur-xl border border-border rounded-full hover:bg-surface text-text-muted hover:text-primary transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Dashboard</span>
        </Link>
        <a href="mailto:princemaurya8879@gmail.com" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-blue-500 text-white rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 font-semibold text-sm">
          <Mail size={16} /> Let's Talk
        </a>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 space-y-6">
        
        {/* Bento Grid Layer 1 */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Hero Card */}
          <div className="lg:col-span-2 bg-surface/40 backdrop-blur-xl border border-border p-8 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight relative z-10">
              I build <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">infrastructure,</span><br/>not just apps.
            </h1>
            <p className="text-lg text-text-muted leading-relaxed max-w-2xl mb-8 relative z-10">
              Hi, I'm <strong className="text-text">Prince Maurya</strong> — a Computer Engineering student (9.74 CGPA). I take things apart to understand why they work, then build them my own way.
            </p>
            <div className="flex flex-wrap gap-3 relative z-10">
              <div className="px-4 py-2 bg-background/50 border border-border rounded-full text-sm font-medium flex items-center gap-2 shadow-sm backdrop-blur-sm"><Database size={16} className="text-primary"/> CrownDB Creator</div>
              <div className="px-4 py-2 bg-background/50 border border-border rounded-full text-sm font-medium flex items-center gap-2 shadow-sm backdrop-blur-sm"><Trophy size={16} className="text-amber-500"/> NeoFuture 1st Place</div>
              <div className="px-4 py-2 bg-background/50 border border-border rounded-full text-sm font-medium flex items-center gap-2 shadow-sm backdrop-blur-sm"><Award size={16} className="text-blue-500"/> Published Researcher</div>
            </div>
          </div>

          {/* GitHub Stats Card */}
          <div className="bg-surface/40 backdrop-blur-xl border border-border p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 group-hover:scale-110 group-hover:opacity-10 dark:group-hover:opacity-20 transition-all duration-700 pointer-events-none">
              <Github size={120} />
            </div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10"><Code2 className="text-primary"/> Coding Profile</h3>
            <div className="space-y-4 relative z-10">
              <div>
                <div className="text-3xl font-black text-text">859+</div>
                <div className="text-sm font-medium text-text-muted uppercase tracking-wider">GitHub Contributions</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <div className="text-2xl font-black text-text">40+</div>
                  <div className="text-xs font-medium text-text-muted uppercase">Repos</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-text">400+</div>
                  <div className="text-xs font-medium text-text-muted uppercase">LeetCode</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CrownDB Masterpiece Card */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-[1px] rounded-3xl relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-500" />
          <div className="bg-surface/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[22px] relative z-10 grid lg:grid-cols-2 gap-8 items-center border border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider mb-4">
                <Zap size={14} /> Flagship Project
              </div>
              <h2 className="text-3xl font-black mb-4 text-slate-100">CrownDB Engine</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                A file-based relational database engine built entirely from scratch in <strong>C++17</strong>. Not a wrapper around SQLite—an actual implementation of the storage and query layers with a custom binary format (`.tbl`).
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-3 items-center text-sm font-medium text-slate-300"><CheckCircle2 size={18} className="text-primary"/> Hand-written SQL parser & execution</li>
                <li className="flex gap-3 items-center text-sm font-medium text-slate-300"><CheckCircle2 size={18} className="text-primary"/> Full CRUD, Filtering, Projection, Aggregates</li>
                <li className="flex gap-3 items-center text-sm font-medium text-slate-300"><CheckCircle2 size={18} className="text-primary"/> Embeddable C++ API (Crowndb.h)</li>
              </ul>
              <a href="https://github.com/Prince200510/Crown-DB" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-sm font-bold hover:scale-105 transition-transform shadow-lg">
                <Github size={18}/> View Source Code
              </a>
            </div>
            <div className="bg-[#0f111a] rounded-xl p-6 border border-white/10 font-mono text-sm text-blue-300 shadow-2xl relative overflow-hidden group-hover:border-primary/30 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
              <div className="text-slate-500 mb-2">// CrownDB SQL Execution</div>
              <div><span className="text-pink-500">CREATE</span> <span className="text-emerald-400">TABLE</span> users (</div>
              <div className="pl-4">id INT <span className="text-orange-400">PRIMARY KEY</span>,</div>
              <div className="pl-4">name VARCHAR(50),</div>
              <div className="pl-4">created_at TIMESTAMP</div>
              <div>);</div>
              <br/>
              <div className="text-slate-500 mb-2">// Executed successfully in 12ms.</div>
              <div><span className="text-pink-500">SELECT</span> <span className="text-purple-400">COUNT</span>(*) <span className="text-pink-500">FROM</span> users;</div>
            </div>
          </div>
        </div>

        {/* Three Column Bento */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Experience */}
          <div className="bg-surface/40 backdrop-blur-xl border border-border p-8 rounded-3xl group hover:border-primary/30 transition-colors">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase className="text-primary"/> Experience</h3>
            <div className="space-y-6">
              <div className="relative pl-5 border-l-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                <div className="absolute w-2.5 h-2.5 bg-primary rounded-full -left-[5.5px] top-1.5" />
                <h4 className="font-bold">Full Stack Intern</h4>
                <p className="text-xs text-primary font-bold mb-2">Advait Techserve · 2025</p>
                <p className="text-xs text-text-muted leading-relaxed">Built backend features and integrated frontend UI in an Agile team; handled API integration & debugging.</p>
              </div>
              <div className="relative pl-5 border-l-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                <div className="absolute w-2.5 h-2.5 bg-primary rounded-full -left-[5.5px] top-1.5" />
                <h4 className="font-bold">Frontend Intern</h4>
                <p className="text-xs text-primary font-bold mb-2">Collonmade · 2024</p>
                <p className="text-xs text-text-muted leading-relaxed">Built scalable React.js dashboards for video-transcription; integrated Flask REST APIs optimally.</p>
              </div>
              <div className="relative pl-5 border-l-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                <div className="absolute w-2.5 h-2.5 bg-primary rounded-full -left-[5.5px] top-1.5" />
                <h4 className="font-bold">AR/VR Intern</h4>
                <p className="text-xs text-primary font-bold mb-2">IOFT · 2023</p>
                <p className="text-xs text-text-muted leading-relaxed">Built interactive VR environments with Unity3D, physics, and C# scripting.</p>
              </div>
            </div>
          </div>

          {/* Education & Achievements */}
          <div className="bg-surface/40 backdrop-blur-xl border border-border p-8 rounded-3xl flex flex-col gap-8 group hover:border-primary/30 transition-colors">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><GraduationCap className="text-primary"/> Education</h3>
              <div className="bg-background/50 border border-border p-4 rounded-2xl mb-3 hover:bg-background transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm">B.E. Computer Engineering</h4>
                  <span className="text-xs font-black text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded">9.74 CGPA</span>
                </div>
                <p className="text-xs text-text-muted">Thakur College of Engineering (2024-27)</p>
              </div>
              <div className="bg-background/50 border border-border p-4 rounded-2xl hover:bg-background transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm">Diploma in CE</h4>
                  <span className="text-xs font-black text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded">88.80%</span>
                </div>
                <p className="text-xs text-text-muted">Thakur Polytechnic, MSBTE (2021-24)</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="text-amber-500"/> Top Awards</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><span className="text-amber-500"><Trophy size={16}/></span> <strong>1st Place</strong> — NeoFuture Hackathon</li>
                <li className="flex items-center gap-3"><span className="text-amber-500"><Trophy size={16}/></span> <strong>1st Place</strong> — Edith AI Agent Hackathon</li>
                <li className="flex items-center gap-3"><span className="text-slate-400"><Award size={16}/></span> <strong>1st Runner-Up</strong> — Spectrum FinTech</li>
              </ul>
            </div>
          </div>

          {/* Featured Projects */}
          <div className="bg-surface/40 backdrop-blur-xl border border-border p-8 rounded-3xl group hover:border-primary/30 transition-colors">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><LayoutTemplate className="text-primary"/> Featured Work</h3>
            <div className="space-y-4">
              <div className="bg-background/50 border border-border p-4 rounded-2xl hover:border-primary/50 transition-colors">
                <h4 className="font-bold mb-1 text-sm flex items-center gap-2"><FileCode2 size={16} className="text-primary"/> Shoplifting Detection AI</h4>
                <p className="text-xs text-text-muted mb-3">YOLOv8-Pose feeding an ST-GCN to classify shoplifting from skeleton sequences in real-time.</p>
                <div className="flex gap-2"><span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">PyTorch</span><span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">YOLOv8</span></div>
              </div>
              <div className="bg-background/50 border border-border p-4 rounded-2xl hover:border-primary/50 transition-colors">
                <h4 className="font-bold mb-1 text-sm flex items-center gap-2"><FileCode2 size={16} className="text-primary"/> CrownKit CLI</h4>
                <p className="text-xs text-text-muted mb-3">Open-source npm CLI that scaffolds production-ready Web3 dApp boilerplates in one command.</p>
                <div className="flex gap-2"><span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Node.js</span><span className="text-[10px] uppercase font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">Web3</span></div>
              </div>
              <div className="bg-background/50 border border-border p-4 rounded-2xl hover:border-primary/50 transition-colors">
                <h4 className="font-bold mb-1 text-sm flex items-center gap-2"><FileCode2 size={16} className="text-primary"/> Job Genius</h4>
                <p className="text-xs text-text-muted">AI-powered platform for job recommendations and career guidance using intelligent automation.</p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
