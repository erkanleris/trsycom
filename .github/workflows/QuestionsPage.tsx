import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Search } from "lucide-react";

interface QuestionsData {
  [key: string]: string[];
}

const categoryNames: { [key: string]: string } = {
  personal: "أسئلة شخصية",
  general: "أسئلة عامة",
  religious: "أسئلة دينية",
  cultural: "أسئلة ثقافية",
  love: "أسئلة عن الحب",
};

const ITEMS_PER_PAGE = 12;

export default function QuestionsPage({ params }: { params: { category: string } }) {
  const [, navigate] = useLocation();
  const category = params.category;
  const [questionsData, setQuestionsData] = useState<QuestionsData>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [randomQuestion, setRandomQuestion] = useState<string>("");
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Load questions data
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => {
        setQuestionsData(data);
        setFilteredQuestions(data[category] || []);
      })
      .catch((err) => console.error("Error loading questions:", err));
  }, [category]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredQuestions(questionsData[category] || []);
      setCurrentPage(1);
      return;
    }

    const results = (questionsData[category] || []).filter((q) =>
      q.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(results);
    setCurrentPage(1);
  };

  const getRandomQuestion = () => {
    const questions = questionsData[category] || [];
    if (questions.length > 0) {
      const randomIdx = Math.floor(Math.random() * questions.length);
      setRandomQuestion(questions[randomIdx]);
      setShowRandomModal(true);
    }
  };

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(startIdx, endIdx);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-accent hover:text-accent/80"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            العودة للرئيسية
          </Button>
          <h1 className="text-2xl font-bold text-accent">
            {categoryNames[category] || category}
          </h1>
          <Button
            onClick={getRandomQuestion}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            سؤال عشوائي
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Search Bar */}
        <div className="mb-8 flex gap-2">
          <Input
            type="text"
            placeholder="ابحث عن سؤال في هذا القسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleSearch}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentQuestions.map((question, idx) => (
            <div
              key={idx}
              className="group cursor-pointer rounded-lg border-2 border-border bg-card p-6 transition-all duration-300 hover-lift hover:border-accent"
              onClick={() => {
                setRandomQuestion(question);
                setShowRandomModal(true);
              }}
            >
              <p className="text-foreground group-hover:text-accent transition-colors line-clamp-4">
                {question}
              </p>
              <div className="mt-4 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                اضغط لقراءة السؤال كاملاً
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                variant={currentPage === page ? "default" : "outline"}
                className={
                  currentPage === page
                    ? "bg-accent text-accent-foreground"
                    : "border-border text-foreground hover:bg-card"
                }
              >
                {page}
              </Button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              لم نجد أسئلة تطابق بحثك
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setFilteredQuestions(questionsData[category] || []);
                setCurrentPage(1);
              }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              إعادة تعيين البحث
            </Button>
          </div>
        )}
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
              className="absolute top-4 right-4 text-accent hover:text-accent/80 text-2xl"
            >
              ✕
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-accent mb-6">السؤال</h3>
              <p className="text-xl text-foreground leading-relaxed mb-8">
                {randomQuestion}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    getRandomQuestion();
                  }}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  سؤال آخر
                </Button>
                <Button
                  onClick={() => setShowRandomModal(false)}
                  variant="outline"
                  className="border-border text-foreground hover:bg-card"
                >
                  إغلاق
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
