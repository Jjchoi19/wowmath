import React, { useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User 
} from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  getDocs,
  doc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "./lib/firebase";
import { Student, Progress, TestPaper, ProgressStatus } from "./types";
import { LogIn, Plus, LogOut, GraduationCap, ChevronRight, Table as TableIcon, FileText, Printer, QrCode, Circle, X, Check, Trash2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MATH_CONTENT } from "./constants";
import { ProgressIcon, cn } from "./lib/utils";
import { QRCodeSVG } from "qrcode.react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [progressData, setProgressData] = useState<Record<string, Record<string, Progress>>>({});
  const [testPapers, setTestPapers] = useState<TestPaper[]>([]);
  const [view, setView] = useState<"dashboard" | "student" | "creator" | "print" | "grading">("dashboard");
  const [selectedPaper, setSelectedPaper] = useState<TestPaper | null>(null);

  // Check URL for Grading
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paperId = params.get("paperId");
    if (paperId && window.location.pathname === "/grading") {
      setView("grading");
    }
  }, []);

  // Auth
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Sync Students
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "students"), where("teacherId", "==", user.uid));
    return onSnapshot(q, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "students"));
  }, [user]);

  // Sync Progress
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "progress"), where("teacherId", "==", user.uid));
    return onSnapshot(q, (snapshot) => {
      const data: Record<string, Record<string, Progress>> = {};
      snapshot.docs.forEach(doc => {
        const p = doc.data() as Progress;
        if (!data[p.studentId]) data[p.studentId] = {};
        data[p.studentId][p.typeId] = p;
      });
      setProgressData(data);
    }, (err) => handleFirestoreError(err, OperationType.LIST, "progress"));
  }, [user]);

  // Sync Test Papers
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "testPapers"), where("teacherId", "==", user.uid));
    return onSnapshot(q, (snapshot) => {
      setTestPapers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestPaper)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "testPapers"));
  }, [user]);

  const handleLogin = () => signInWithPopup(auth, googleProvider);
  const handleLogout = () => signOut(auth);

  if (loading) return <div className="h-screen flex items-center justify-center font-sans italic text-slate-400 bg-slate-50">wowmath loading...</div>;

  // Simple Router based on path
  if (window.location.pathname === "/grading") {
    return <GradingView />;
  }

  if (!user) return <AuthView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6 cursor-pointer" onClick={() => setView("dashboard")}>
          <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">wowmath</h1>
          <div className="h-6 w-px bg-slate-300 hidden md:block"></div>
          <span className="text-sm text-slate-500 font-medium hidden md:block">https://wowmath.com</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{user.displayName}</span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-700">{user.displayName?.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <LogOut className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {view === "dashboard" && (
            <Dashboard 
              students={students} 
              onAddStudent={() => {}} 
              onSelectStudent={(s) => {
                setActiveStudent(s);
                setView("student");
              }} 
            />
          )}
          {view === "student" && activeStudent && (
            <StudentDetail 
              student={activeStudent} 
              progress={progressData[activeStudent.id] || {}} 
              papers={testPapers.filter(p => p.studentId === activeStudent.id)}
              onBack={() => setView("dashboard")}
              onCreatePaper={() => setView("creator")}
              onViewPaper={(paper) => {
                setSelectedPaper(paper);
                setView("print");
              }}
            />
          )}
          {view === "creator" && activeStudent && (
            <PaperCreator 
              student={activeStudent}
              onBack={() => setView("student")}
              onGenerate={(paper) => {
                setSelectedPaper(paper);
                setView("print");
              }}
            />
          )}
          {view === "print" && selectedPaper && (
            <PrintView 
              paper={selectedPaper}
              onBack={() => setView("creator")}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AuthView({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100 italic">W</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">wowmath</h1>
        </div>
        <p className="text-slate-500 mb-12 text-lg font-bold tracking-tight">AI 기반 맞춤형 수학 학습 매니지먼트</p>
        
        <div className="space-y-3">
          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-black shadow-sm hover:shadow-md hover:bg-slate-50 transition-all text-slate-700 uppercase tracking-widest text-xs"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Google Login
          </button>
          <button 
             onClick={() => alert("카카오 로그인은 실제 API 연동이 필요합니다. 개발 모드에서는 구글 로그인을 이용해주세요.")}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] px-6 py-4 rounded-2xl font-black shadow-sm hover:shadow-md transition-all text-[#191919] uppercase tracking-widest text-xs"
          >
            <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-[8px] text-white">K</div>
            Kakao Login
          </button>
        </div>
        <p className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Next-Gen Math Education</p>
      </motion.div>
    </div>
  );
}

function Dashboard({ students, onSelectStudent }: { students: Student[], onAddStudent: () => void, onSelectStudent: (s: Student) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPin, setNewPin] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    if (newPin.length !== 4 || isNaN(Number(newPin))) return alert("비밀번호는 숫자 4자리여야 합니다.");
    
    try {
      await addDoc(collection(db, "students"), {
        name: newName,
        pin: newPin,
        teacherId: auth.currentUser?.uid
      });
      setNewName("");
      setNewPin("");
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "students");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("정말 이 학생을 삭제하시겠습니까? 관련 학습 기록도 조회할 수 없게 됩니다.")) return;
    try {
      await deleteDoc(doc(db, "students", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `students/${id}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">학생 목록</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" /> 학생 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((s) => (
          <motion.div 
            key={s.id}
            whileHover={{ y: -2, borderColor: '#4f46e5' }}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer group transition-all relative overflow-hidden"
            onClick={() => onSelectStudent(s)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                <GraduationCap className="h-6 w-6 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => handleDelete(e, s.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{s.name}</h3>
          </motion.div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-900">학생 추가</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">이름</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-medium text-sm transition-all"
                  placeholder="학생 이름"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">4자리 비밀번호 (체점용)</label>
                <input 
                  type="text" 
                  maxLength={4}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-sm tracking-[1em] transition-all"
                  placeholder="0000"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">취소</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">추가</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function StudentDetail({ 
  student, 
  progress, 
  papers,
  onBack, 
  onCreatePaper,
  onViewPaper
}: { 
  student: Student, 
  progress: Record<string, Progress>, 
  papers: TestPaper[],
  onBack: () => void, 
  onCreatePaper: () => void,
  onViewPaper: (p: TestPaper) => void
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-end justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm">
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{student.name} 학생 학습 현황</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1.5 shadow-sm">
                <Lock className="h-3 w-3 text-indigo-500" /> PIN: <span className="text-slate-900">{student.pin || "####"}</span>
              </span>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">전체 단원별 성취도</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onCreatePaper}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-indigo-700 transition-all text-sm"
          >
            <Plus className="h-4 w-4" /> Exam Builder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Learning Analysis</h3>
               <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold">
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-slate-200 rounded-sm"></div> 미풀이</div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-yellow-400 rounded-sm"></div> 1회 맞음</div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-green-500 rounded-sm"></div> 완료</div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-red-500 rounded-sm"></div> 1회 틀림</div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-red-900 rounded-sm"></div> 연오답 (해골)</div>
               </div>
            </div>
            
            <div className="space-y-12">
              {MATH_CONTENT.map(gradeGroup => (
                <div key={gradeGroup.grade} className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-l-2 border-slate-200 pl-3">
                    {gradeGroup.grade}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gradeGroup.units.map(unit => (
                      <div key={unit.title} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30">
                        <h4 className="font-bold text-slate-700 mb-3 text-xs">{unit.title}</h4>
                        <div className="flex flex-wrap gap-2">
                          {unit.types.map(type => (
                            <span key={type.id}>
                              <ProgressIcon status={progress[type.id]?.status || ProgressStatus.NONE} />
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Generated Exams</h3>
            <div className="space-y-3">
              {papers.length === 0 ? (
                <div className="text-center py-12 text-slate-300">
                  <FileText className="mx-auto h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">No papers yet</p>
                </div>
              ) : (
                papers.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => onViewPaper(p)}
                    className="p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                      {p.score !== undefined ? (
                        <span className={cn(
                          "text-[10px] font-black px-1.5 py-0.5 rounded uppercase",
                          p.score >= 80 ? "bg-green-100 text-green-700" : 
                          p.score >= 60 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                        )}>
                          {p.score}점
                        </span>
                      ) : (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 uppercase tracking-widest">Pending</span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors truncate mb-3">{p.title}</h4>
                    
                    {p.results && (
                      <div className="flex gap-1">
                        {p.results.map((r, i) => (
                          <div key={i} className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            r ? "bg-green-500" : "bg-red-500"
                          )}></div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PaperCreator({ student, onBack, onGenerate }: { student: Student, onBack: () => void, onGenerate: (paper: TestPaper) => void }) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [perPage, setPerPage] = useState(2);

  const toggleType = (id: string) => {
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleCreate = async () => {
    if (selectedTypes.length === 0) return alert("유형을 선택해주세요.");
    setIsGenerating(true);
    try {
      const allTypes = MATH_CONTENT.flatMap(g => g.units.flatMap(u => u.types));
      const selectedInfo = allTypes.filter(t => selectedTypes.includes(t.id));
      
      const res = await fetch("/api/generate-problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          selectedProblems: selectedInfo,
          count: count
        })
      });
      const data = await res.json();
      
      const newPaper: TestPaper = {
        id: Math.random().toString(36).substr(2, 9),
        title: `${student.name} 학생 맞춤 시험지`,
        studentId: student.id,
        teacherId: auth.currentUser?.uid || "",
        problems: data.problems,
        numPerPage: perPage,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "testPapers", newPaper.id), newPaper);
      onGenerate(newPaper);
    } catch (err) {
      console.error(err);
      alert("시험지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm">
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Exam Paper Builder</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Problem Types Selection</h3>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{selectedTypes.length} Selected</span>
            </div>
            <div className="space-y-12">
              {MATH_CONTENT.map(gradeGroup => (
                <div key={gradeGroup.grade} className="space-y-6">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    {gradeGroup.grade}
                  </h4>
                  <div className="space-y-6">
                    {gradeGroup.units.map(unit => (
                      <div key={unit.title}>
                        <h4 className="font-bold text-slate-800 mb-3 text-xs flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          {unit.title}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {unit.types.map(t => (
                            <button 
                              key={t.id}
                              onClick={() => toggleType(t.id)}
                              className={cn(
                                "text-left p-3 rounded-xl border transition-all text-xs font-semibold",
                                selectedTypes.includes(t.id) 
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-900" 
                                  : "border-slate-100 bg-slate-50/50 hover:border-slate-300 text-slate-600"
                              )}
                            >
                              {t.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Configuration</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">AI Similarity Expansion</label>
                <div className="flex items-center gap-2">
                   <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={isNaN(count) ? "" : count}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setCount(isNaN(val) ? 1 : val);
                    }}
                    className="w-16 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none font-bold text-sm h-10"
                  />
                  <span className="text-[11px] text-slate-500 font-medium">유사 유형 자동 생성</span>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Layout Settings</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 4].map(num => (
                    <button 
                      key={num}
                      onClick={() => setPerPage(num)}
                      className={cn(
                        "py-2 rounded-lg border text-center transition-all",
                        perPage === num ? "bg-indigo-50 border-indigo-400 text-indigo-700" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      <div className="text-sm font-bold">{num}</div>
                      <div className="text-[8px] uppercase tracking-tighter opacity-70">Prob/Pg</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button 
                  onClick={handleCreate}
                  disabled={isGenerating || selectedTypes.length === 0}
                  className="w-full bg-indigo-600 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all text-sm"
                >
                  {isGenerating ? "Generating..." : <><Plus className="h-4 w-4" /> AI Generate Bundle</>}
                </button>
                <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest font-bold">Powered by wowmath AI v2.4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PrintView({ paper, onBack }: { paper: TestPaper, onBack: () => void }) {
  const printUrl = `${window.location.origin}/grading?paperId=${paper.id}`;

  const handlePrint = () => {
    // Advise the user if they are in the AI Studio iframe
    if (window.self !== window.top) {
      alert("⚠️ 더 정확한 인쇄를 위해 브라우저 우측 상단의 'Open in new tab' 버튼을 눌러 새 창에서 인쇄하는 것을 권장합니다.");
    }
    window.print();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Control Bar */}
      <div className="flex items-center gap-4 mb-8 no-print sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 -mt-4">
        <button 
          onClick={onBack} 
          className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-slate-200 bg-slate-100 text-slate-600"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">미리보기 및 인쇄</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{paper.problems.length} Problems • {paper.numPerPage} Per Page</p>
        </div>
        <button 
          onClick={handlePrint}
          className="ml-auto bg-slate-900 text-white py-3 px-8 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95"
        >
          <Printer className="h-4 w-4" /> Print Exam Sheet
        </button>
      </div>

      {/* A4 Paper Container */}
      <div className="bg-white p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-2xl border border-slate-200 max-w-[210mm] mx-auto min-h-[297mm] print:shadow-none print:border-none print:m-0 print:p-12 print:w-full print:rounded-none overflow-hidden relative">
        {/* Paper Header */}
        <div className="flex justify-between items-start mb-16 border-b-4 border-slate-900 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg">W</span>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">wowmath</h1>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-2 uppercase">{paper.title}</h2>
            <div className="flex items-center gap-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(paper.createdAt).toLocaleDateString()} • TEST ID: {paper.id.slice(0,8)}</p>
              <div className="h-4 w-px bg-slate-200"></div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">NAME: ____________________</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex-shrink-0">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
              <QRCodeSVG value={printUrl} size={84} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] text-center leading-tight">Access answers<br/>& grading portal</p>
          </div>
        </div>

        {/* Problems List */}
        <div className="grid grid-cols-1 gap-y-20">
          {paper.problems.map((p, idx) => (
            <div key={idx} className={cn(
              "relative min-h-[280px] border-b border-dashed border-slate-100 pb-16 last:border-none",
              idx % paper.numPerPage === 0 && idx !== 0 ? "page-break" : ""
            )}>
              <div className="flex gap-4">
                <span className="text-5xl font-black text-slate-200 italic select-none leading-none pt-1">{idx + 1}</span>
                <div className="flex-1">
                  <div className="prose prose-slate max-w-none">
                    <p className="text-xl font-bold leading-relaxed text-slate-800 whitespace-pre-wrap">{p.question}</p>
                  </div>
                  <div className="mt-12 h-32 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 font-black text-xs uppercase tracking-[0.2em] no-print">
                    ANSWER AREA
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paper Footer (Print only) */}
        <div className="hidden print:flex absolute bottom-8 left-12 right-12 justify-between items-center border-t border-slate-100 pt-4 opacity-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 WOWMATH - ALL RIGHTS RESERVED</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{paper.id}</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; break-before: page; }
          header { display: none !important; }
          main { padding: 0 !important; max-width: none !important; margin: 0 !important; }
          .shadow-2xl, .shadow-xl { box-shadow: none !important; }
          .rounded-2xl { border-radius: 0 !important; }
        }
      `}} />
    </motion.div>
  );
}

function GradingView() {
  const [paper, setPaper] = useState<TestPaper | null>(null);
  const [studentPin, setStudentPin] = useState("");
  const [inputPin, setInputPin] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinError, setPinError] = useState(false);

  const paperId = new URLSearchParams(window.location.search).get("paperId");

  useEffect(() => {
    if (!paperId) return;
    const fetchPaper = async () => {
      try {
        const docRef = doc(db, "testPapers", paperId);
        const snap = await getDocFromServer(docRef);
        if (snap.exists()) {
          const p = snap.data() as TestPaper;
          setPaper(p);
          setAnswers(new Array(p.problems.length).fill(""));
          setResults(new Array(p.problems.length).fill(null));

          // Fetch Student PIN
          const sRef = doc(db, "students", p.studentId);
          const sSnap = await getDocFromServer(sRef);
          if (sSnap.exists()) {
            setStudentPin((sSnap.data() as Student).pin);
          }
        }
      } catch (err) {
        console.error("Error fetching paper:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [paperId]);

  const handleSubmit = async () => {
    if (!paper) return;
    if (inputPin !== studentPin) {
      setPinError(true);
      return;
    }
    setPinError(false);
    
    // Finalize results: if any are still null (unmarked), treat as wrong
    const finalResults = results.map(r => r === true);
    setResults(finalResults);
    setIsSubmitted(true);

    // Update Progress in Firestore
    for (let i = 0; i < paper.problems.length; i++) {
      const problem = paper.problems[i];
      const isCorrect = finalResults[i];
      const progressRef = doc(db, "progress", `${paper.studentId}_${problem.typeId}`);
      
      const pSnap = await getDocFromServer(progressRef).catch(() => null);
      let currentProgress: Progress = pSnap?.exists() 
        ? pSnap.data() as Progress 
        : { studentId: paper.studentId, teacherId: paper.teacherId, typeId: problem.typeId, streak: 0, status: ProgressStatus.NONE };

      let newStreak = currentProgress.streak;
      let newStatus = currentProgress.status;

      if (isCorrect) {
        if (newStreak < 0) newStreak = 1; else newStreak++;
        if (newStreak === 1) newStatus = ProgressStatus.CORRECT_1;
        else if (newStreak === 2) newStatus = ProgressStatus.CORRECT_2;
        else if (newStreak >= 3) newStatus = ProgressStatus.CORRECT_3_STAR;
      } else {
        if (newStreak > 0) newStreak = -1; else newStreak--;
        if (newStreak === -1) newStatus = ProgressStatus.WRONG_1;
        else if (newStreak <= -2) newStatus = ProgressStatus.WRONG_2_SKULL;
      }

      await setDoc(progressRef, {
        studentId: paper.studentId,
        teacherId: paper.teacherId,
        typeId: problem.typeId,
        streak: newStreak,
        status: newStatus
      }, { merge: true });
    }

    // Update TestPaper with score and binary results
    try {
      const score = Math.round((finalResults.filter(r => r).length / paper.problems.length) * 100);
      await setDoc(doc(db, "testPapers", paper.id), {
        score,
        results: finalResults,
        gradedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Error updating test paper score:", err);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-sans tracking-tighter font-black text-2xl italic text-slate-200 uppercase bg-slate-50">wowmath grading...</div>;
  if (!paper) return <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
    <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100"><FileText className="h-8 w-8 text-red-500" /></div>
    <h1 className="text-xl font-black tracking-tight text-slate-900">Paper Not Found</h1>
  </div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-start justify-center font-sans overflow-y-auto">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl my-8">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-black mb-1 tracking-tighter text-indigo-600">wowmath</h1>
            <h2 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-tight">{paper.title} 채점</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Mark each answer as Correct (O) or Incorrect (X)</p>
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center min-w-[80px]">
            <div className="text-2xl font-black tracking-tighter leading-none">
              {results.filter(r => r === true).length}<span className="text-slate-500 mx-0.5 text-lg">/</span>{paper.problems.length}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">Score</div>
          </div>
        </div>

        <div className="space-y-4">
          {paper.problems.map((p, idx) => (
            <div key={idx} className={cn(
              "p-5 rounded-2xl border transition-all",
              results[idx] === true ? "bg-green-50 border-green-100" : 
              results[idx] === false ? "bg-red-50 border-red-100" : "bg-white border-slate-100 shadow-sm"
            )}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {idx + 1}</span>
                    {results[idx] !== null && (
                      <span className={cn(
                        "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest",
                        results[idx] === true ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      )}>
                        {results[idx] === true ? "Correct" : "Incorrect"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-4 whitespace-pre-wrap leading-relaxed">{p.question}</p>
                  
                  {!isSubmitted && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const newRes = [...results];
                          newRes[idx] = true;
                          setResults(newRes);
                        }}
                        className={cn(
                          "flex-1 h-12 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-black uppercase text-xs tracking-widest",
                          results[idx] === true ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-100" : "bg-white border-slate-100 text-slate-400 hover:border-green-200"
                        )}
                      >
                        <Circle className="h-4 w-4" /> Correct
                      </button>
                      <button 
                        onClick={() => {
                          const newRes = [...results];
                          newRes[idx] = false;
                          setResults(newRes);
                        }}
                        className={cn(
                          "flex-1 h-12 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-black uppercase text-xs tracking-widest",
                          results[idx] === false ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100" : "bg-white border-slate-100 text-slate-400 hover:border-red-200"
                        )}
                      >
                        <X className="h-4 w-4" /> Incorrect
                      </button>
                    </div>
                  )}

                  {(isSubmitted || results[idx] !== null) && (
                    <div className={cn(
                      "mt-4 p-4 rounded-xl border text-sm",
                      results[idx] === true ? "bg-white/50 border-green-200" : "bg-white/50 border-red-200"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <Check className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Answer</span>
                      </div>
                      <p className="font-black text-slate-900">{p.answer}</p>
                      <p className="mt-2 text-[11px] text-slate-500 font-medium leading-relaxed">{p.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isSubmitted && (
          <div className="mt-10 p-6 bg-slate-900 rounded-2xl shadow-xl">
            <div className="mb-6">
              <label className="block text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50 text-center">Enter Student PIN to Save</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="password"
                  maxLength={4}
                  value={inputPin}
                  onChange={e => {
                    setInputPin(e.target.value.replace(/[^0-9]/g, ""));
                    setPinError(false);
                  }}
                  placeholder="••••"
                  className={cn(
                    "w-full h-14 bg-slate-800 rounded-xl border-2 pl-12 text-center text-xl font-black tracking-[1em] text-white focus:outline-none transition-all",
                    pinError ? "border-red-500 animate-pulse" : "border-slate-700 focus:border-indigo-500"
                  )}
                />
              </div>
              {pinError && <p className="text-red-400 text-[10px] font-black uppercase mt-2 text-center tracking-widest">Invalid PIN. Try again.</p>}
              {!studentPin && !loading && (
                <p className="text-orange-400 text-[10px] font-black uppercase mt-2 text-center tracking-widest">Student PIN not set. Contact teacher.</p>
              )}
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={results.some(r => r === null) || inputPin.length !== 4}
              className="w-full h-16 bg-indigo-500 text-white rounded-xl font-black text-lg shadow-lg shadow-indigo-900/20 hover:bg-indigo-400 active:scale-[0.98] transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finish & Record Results
            </button>
          </div>
        )}

        {isSubmitted && (
          <div className="mt-10 border-t-2 border-slate-100 pt-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-200 mb-6 transform -rotate-3">
              <Check className="h-10 w-10 border-4 border-white rounded-full p-1" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Grading Complete</h3>
            <p className="text-slate-400 mb-8 font-bold text-xs uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
              Student progress has been updated in the management dashboard.
            </p>
            <button 
              onClick={() => window.close()}
              className="w-full h-14 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
            >
              Close Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
