import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Search, Sparkles, LogOut, User } from "lucide-react";
import { getLoginUrl } from "@/const";

interface QuestionsData {
  [key: string]: string[];
}

const categories = [
  { id: "personal", name: "أسئلة شخصية", icon: "👤" },
  { id: "general", name: "أسئلة عامة", icon: "🌍" },
  { id: "religious", name: "أسئلة دينية", icon: "🕌" },
  { id: "cultural", name: "أسئلة ثقافية", icon: "📚" },
  { id: "love", name: "أسئلة عن الحب", icon: "❤️" },
];

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [questionsData, setQuestionsData] = useState<QuestionsData>({});
  const [randomQuestion, setRandomQuestion] = useState<string>("");
  const [showRandomModal, setShowRandomModal] = useState(false);

  useEffect(() => {
    // Load questions data
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => setQuestionsData(data))
      .catch((err) => console.error("Error loading questions:", err));
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/questions/${categoryId}`);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    let results: string[] = [];
    Object.values(questionsData).forEach((questions) => {
      const matches = questions.filter((q) =>
        q.toLowerCase().includes(searchTerm.toLowerCase())
      );
      results = results.concat(matches);
    });

    if (results.length > 0) {
      const randomIdx = Math.floor(Math.random() * results.length);
      setRandomQuestion(results[randomIdx]);
      setShowRandomModal(true);
    }
  };

  const getRandomQuestion = () => {
    let allQuestions: string[] = [];
    Object.values(questionsData).forEach((questions) => {
      allQuestions = allQuestions.concat(questions);
    });

    if (allQuestions.length > 0) {
      const randomIdx = Math.floor(Math.random() * allQuestions.length);
      setRandomQuestion(allQuestions[randomIdx]);
      setShowRandomModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">
              <span className="text-accent">أسئلة</span> <span className="text-secondary">أركان</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="ابحث عن سؤال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-64 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={handleSearch}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Auth Section */}
            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                    <User className="h-4 w-4 text-accent" />
                    <span className="text-sm text-foreground">{user.name || user.email}</span>
                  </div>
                  <Button
                    onClick={() => logout()}
                    variant="outline"
                    className="border-border text-foreground hover:bg-card"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <User className="h-4 w-4 mr-2" />
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-16">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h2 className="text-5xl font-bold mb-4 text-accent">
            أهلاً بك في عالم التفكير العميق
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            استكشف آلاف الأسئلة التي ستغير نظرتك للأشياء وتوسع آفاقك الفكرية
          </p>
          <Button
            onClick={getRandomQuestion}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            سؤال عشوائي من كل الأقسام
          </Button>
        </section>

        {/* Categories Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 transition-all duration-300 hover-lift hover:border-accent"
                >
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-purple opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="text-5xl mb-4">{cat.icon}</div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 group-hover:text-foreground transition-colors">
                      استكشف الأسئلة العميقة
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="rounded-lg border-2 border-border bg-card p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-accent">
            5000 سؤال عميق ومميز
          </h3>
          <p className="text-muted-foreground mb-4">
            موقع أسئلة أركان يحتوي على 5000 سؤال فريد موزعة على 5 أقسام رئيسية، كل سؤال مصاغ بعناية ليكون عميقاً وفلسفياً ويدفعك للتفكير الحقيقي.
          </p>
          <div className="grid grid-cols-5 gap-4 mt-6">
            {categories.map((cat) => (
              <div key={cat.id} className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">1000</div>
                <div className="text-sm text-muted-foreground">{cat.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Random Question Modal */}
      {showRandomModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowRandomModal(false)}
        >
          <div
            className="relative max-w-2xl w-full mx-4 rounded-lg border-2 border-accent bg-card p-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRandomModal(false)}
              className="absolute top-4 right-4 text-accent hover:text-accent/80"
            >
              ✕
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-accent mb-6">سؤالك للتفكير</h3>
              <p className="text-xl text-foreground leading-relaxed mb-8">
                {randomQuestion}
              </p>
              <Button
                onClick={() => setShowRandomModal(false)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                سؤال آخر
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
