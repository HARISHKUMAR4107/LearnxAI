import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, PageHeader, Badge } from '@/components/ui';
import { QUIZ_QUESTIONS } from '@/data/quizData';
import type { ChatMessage, PageId } from '@/types';

interface AITutorProps {
  onNavigate?: (page: PageId) => void;
}

const SUGGESTED_PROMPTS = [
  'Explain polymorphism in Java',
  'What is the difference between ArrayList and LinkedList?',
  'How do I handle exceptions in Java?',
  'Explain how garbage collection works',
  'What are Java Streams?',
];

function generateDemoResponse(userText: string): string {
  const text = userText.toLowerCase();

  // Pattern-based demo responses
  if (text.includes('polymorphism')) {
    return 'Polymorphism in Java allows objects to take many forms. There are two types:\n\n1. **Compile-time polymorphism (Method Overloading)**: Multiple methods with the same name but different parameters within the same class. Java decides which method to call based on the arguments at compile time.\n\n2. **Runtime polymorphism (Method Overriding)**: A subclass provides its own implementation of a method already defined in its parent class. The JVM determines the actual method to call at runtime based on the object type.\n\nExample:\n```java\nAnimal a = new Dog();\na.makeSound(); // Calls Dog.makeSound() at runtime\n```\n\nWould you like a deeper example or practice exercise?';
  }

  if (text.includes('arraylist') || text.includes('linkedlist')) {
    return '**ArrayList vs LinkedList** — both implement the List interface but differ internally:\n\n| Feature | ArrayList | LinkedList |\n|---------|-----------|------------|\n| Internal | Dynamic array | Doubly-linked list |\n| Get(i) | O(1) | O(n) |\n| Add/remove at end | O(1) amortized | O(1) |\n| Add/remove at index | O(n) | O(n) to find + O(1) |\n| Memory | Less overhead | More (node pointers) |\n\n**When to use which?**\n- ArrayList: More reads than inserts/removes (most common case).\n- LinkedList: Frequent inserts/removes at the beginning or middle.\n\nWant to see a code comparison?';
  }

  if (text.includes('exception')) {
    return '**Exception Handling in Java** uses try-catch-finally blocks:\n\n```java\ntry {\n  // Code that might throw\n} catch (IOException e) {\n  // Handle checked exception\n} catch (RuntimeException e) {\n  // Handle unchecked exception\n} finally {\n  // Always runs — cleanup\n}\n```\n\n**Two types:**\n1. **Checked exceptions** (IOException, SQLException) — must be declared with `throws` or caught. The compiler enforces this.\n2. **Unchecked exceptions** (RuntimeException subclasses like NullPointerException, IllegalArgumentException) — not required to be caught.\n\n**Best practices:**\n- Catch specific exceptions, not generic `catch (Exception e)`.\n- Don\'t swallow exceptions (empty catch blocks).\n- Use finally or try-with-resources for cleanup.\n\nWant to learn about custom exceptions?';
  }

  if (text.includes('garbage') || text.includes('gc') || text.includes('memory')) {
    return '**Garbage Collection (GC)** in Java automatically frees memory from objects that are no longer reachable.\n\n**How it works:**\n1. The GC traces from "GC roots" (local variables, static fields, active threads) through object references.\n2. Any object not reachable from a root is eligible for collection.\n3. The JVM runs GC automatically when memory pressure rises.\n\n**Heap regions:**\n- **Young Generation**: New objects. Minor GC is fast and frequent here.\n- **Old Generation**: Long-lived objects promoted from Young Gen. Major GC is less frequent but slower.\n\n**Common GC algorithms:**\n- Serial GC: Single-threaded, good for small apps.\n- G1 GC: Default since Java 9, balances throughput and latency.\n- ZGC: Ultra-low latency (sub-millisecond pauses).\n\n**Tip:** You can hint the JVM with `System.gc()` but it\'s not guaranteed to run. Focus on avoiding memory leaks instead.\n\nWant to learn about memory leak patterns?';
  }

  if (text.includes('stream')) {
    return '**Java Streams** (introduced in Java 8) provide a declarative way to process sequences of elements:\n\n```java\nList<String> names = people.stream()\n  .filter(p -> p.getAge() > 18)\n  .map(Person::getName)\n  .sorted()\n  .collect(Collectors.toList());\n```\n\n**Key concepts:**\n- **Intermediate operations** (lazy): filter, map, sorted, distinct — return a new Stream.\n- **Terminal operations** (eager): collect, forEach, count, reduce — produce a result.\n- **Pipelines**: Multiple intermediate ops chained, executed only when a terminal op is invoked.\n\n**Why use Streams?**\n- Readable and expressive\n- Easy parallelism: `.parallelStream()` for multi-core processing\n- Less boilerplate than manual loops\n\n**Note:** Streams are not data structures — they don\'t store elements. They process data from a source (collection, array, I/O).\n\nWant to see more stream examples?';
  }

  if (text.includes('thread') || text.includes('concurren')) {
    return '**Java Concurrency** enables multiple threads to run simultaneously:\n\n**Creating threads:**\n```java\n// Option 1: Extend Thread\nclass MyThread extends Thread {\n  public void run() { /* task */ }\n}\n\n// Option 2: Implement Runnable (preferred)\nThread t = new Thread(() -> { /* task */ });\nt.start();\n```\n\n**Key concepts:**\n- `synchronized`: Ensures only one thread accesses a block/method at a time.\n- `volatile`: Guarantees visibility of changes across threads.\n- `java.util.concurrent`: Higher-level utilities — ExecutorService, CountDownLatch, ConcurrentHashMap.\n\n**Common pitfalls:**\n- Deadlocks: Two threads waiting on each other\'s locks.\n- Race conditions: Unpredictable results from unsynchronized shared state.\n- Use `concurrent` package instead of manual synchronization when possible.\n\nWant to explore ExecutorService or CompletableFuture?';
  }

  if (text.includes('oop') || text.includes('encapsulation') || text.includes('inheritance') || text.includes('abstraction')) {
    return '**The 4 Pillars of OOP in Java:**\n\n1. **Encapsulation** — Bundle data and methods together; control access with private fields and public getters/setters.\n2. **Inheritance** — A subclass (child) inherits fields and methods from a superclass (parent) using `extends`.\n3. **Polymorphism** — One interface, many forms. Achieved via method overloading (compile-time) and overriding (runtime).\n4. **Abstraction** — Hide implementation details, expose only essentials. Achieved via `abstract` classes and `interface`s.\n\n```java\nabstract class Shape {\n  abstract double area(); // abstraction\n}\nclass Circle extends Shape { // inheritance\n  private double r; // encapsulation\n  double area() { return Math.PI * r * r; } // polymorphism (override)\n}\n```\n\nWhich pillar would you like to explore in depth?';
  }

  // Generic response
  return `That\'s a great question about Java! Here\'s a helpful overview:\n\n"${userText}" is an important topic in Java programming. While this is a **demo response** (no AI API is configured), I can share some general guidance:\n\n- Start by understanding the fundamentals before diving into advanced concepts.\n- Practice with hands-on coding exercises.\n- Review the official Java documentation for authoritative references.\n\nTo get real AI-powered answers, an API key for an LLM service (like OpenAI) would need to be configured in the backend.\n\nTry asking about: polymorphism, exceptions, streams, collections, garbage collection, or threading for more detailed demo answers!`;
}

export function AITutor({ onNavigate }: AITutorProps) {
  const { markTutorChatted, skillProgress, attempts } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'tutor',
      text: "Hi! I'm your AI Tutor. I can help you understand Java concepts, explain code patterns, and guide your learning. What would you like to learn about today?",
      timestamp: Date.now(),
      isDemo: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
      isDemo: false,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    markTutorChatted();

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateDemoResponse(text);
      const tutorMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'tutor',
        text: response,
        timestamp: Date.now(),
        isDemo: true,
      };
      setMessages((prev) => [...prev, tutorMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Suggest questions based on weak concepts
  const weakConceptSuggestions = skillProgress
    .filter((s) => s.mastery < 60)
    .slice(0, 3)
    .map((s) => `Explain ${s.concept.toLowerCase()}`);

  const suggestedQuestions = weakConceptSuggestions.length > 0
    ? [...weakConceptSuggestions, ...SUGGESTED_PROMPTS.slice(0, 2)]
    : SUGGESTED_PROMPTS;

  return (
    <div className="space-y-4">
      <PageHeader
        title="AI Tutor"
        subtitle="Ask questions and get instant explanations"
        icon={<MessageSquare size={22} />}
      />

      {/* Demo notice */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
        <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800">
          <span className="font-semibold">Demo Mode:</span> Responses are simulated locally — no AI API is configured.
          The tutor recognizes key Java topics (OOP, exceptions, streams, concurrency, GC, collections) and provides
          pre-written explanations. To enable real AI responses, connect an LLM API in the backend.
        </p>
      </div>

      {/* Chat container */}
      <Card className="flex flex-col" >
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[500px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-cyan-500'
                  : 'bg-gray-100 border border-gray-200'
              }`}>
                {msg.role === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-indigo-600" />
                )}
              </div>
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-cyan-500 text-white rounded-tr-sm'
                    : 'bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100'
                }`}>
                  <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                </div>
                {msg.isDemo && msg.role === 'tutor' && (
                  <div className="mt-1 ml-1">
                    <Badge color="amber" size="sm">Demo Response</Badge>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-indigo-600" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-50 border border-gray-100">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
              <Sparkles size={12} /> Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any Java concept…"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </Card>

      {attempts.length === 0 && onNavigate && (
        <Card className="p-4 flex items-center justify-between bg-gradient-to-br from-indigo-50 to-cyan-50 border-indigo-100">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Tip:</span> Take an assessment first, and the tutor will suggest questions based on your weak spots.
          </p>
          <button
            onClick={() => onNavigate('assessment')}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 shrink-0"
          >
            Take Assessment →
          </button>
        </Card>
      )}
    </div>
  );
}
