import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, PageHeader, Badge } from '@/components/ui';
import type { ChatMessage, PageId } from '@/types';

interface AITutorProps {
  onNavigate?: (page: PageId) => void;
}

const SUGGESTED_PROMPTS = [
  'How do Java interfaces support polymorphism?',
  'How should I handle errors in a Spring Boot REST API?',
  'How do React props and state work?',
  'How does a REST API connect a frontend to a database?',
  'What is the difference between supervised and unsupervised learning?',
  'How do neural networks learn from data?',
];

async function generateGeminiResponse(text: string, history: ChatMessage[]): Promise<string> {
  const response = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: text,
      history: history
        .filter((message) => message.id !== 'welcome' && !message.isDemo)
        .slice(-12)
        .map((message) => ({
          role: message.role === 'tutor' ? 'model' : 'user',
          text: message.text,
        })),
    }),
  });
  const result: { text?: string; error?: string } = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Unable to get a response from Gemini.');
  }
  if (!result.text) {
    throw new Error('Gemini returned an empty response. Please try asking again.');
  }
  return result.text;
}

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
  return `I can't provide a reliable subject-specific sample for "${userText}" while Gemini is unavailable. The built-in sample answers cover a few Java topics; please try again when Gemini is available for an answer about any subject.`;
}

export function AITutor({ onNavigate }: AITutorProps) {
  const { markTutorChatted, skillProgress, attempts } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'tutor',
      text: "Hi! I'm your AI Tutor. I can help explain concepts across any subject, answer questions, and guide your learning. What would you like to learn about today?",
      timestamp: Date.now(),
      isDemo: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState('');
  const [failedQuestion, setFailedQuestion] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text: trimmedText,
      timestamp: Date.now(),
      isDemo: false,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setApiError('');
    setFailedQuestion('');
    markTutorChatted();

    try {
      const response = await generateGeminiResponse(trimmedText, messages);
      setMessages((prev) => [...prev, {
        id: `msg_${Date.now() + 1}`,
        role: 'tutor',
        text: response,
        timestamp: Date.now(),
        isDemo: false,
      }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gemini is unavailable. Please try again.';
      setApiError(message);
      setFailedQuestion(trimmedText);
    } finally {
      setIsTyping(false);
    }
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

  const suggestedQuestions = [
    ...weakConceptSuggestions.slice(0, 1),
    ...SUGGESTED_PROMPTS,
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="AI Tutor"
        subtitle="Ask questions and get instant explanations"
        icon={<MessageSquare size={22} />}
      />

      <div className={`flex items-start gap-2 p-3 rounded-xl border ${
        apiError ? 'bg-amber-50 border-amber-100' : 'bg-indigo-50 border-indigo-100'
      }`}>
        <Info size={16} className={`mt-0.5 shrink-0 ${apiError ? 'text-amber-600' : 'text-indigo-600'}`} />
        <div className={`text-xs ${apiError ? 'text-amber-800' : 'text-indigo-800'}`}>
          <p role={apiError ? 'alert' : undefined}>
          {apiError || 'Powered by Gemini.'}
          </p>
          {apiError && failedQuestion && (
            <button
              type="button"
              onClick={() => {
                setMessages((prev) => [...prev, {
                  id: `demo_${Date.now()}`,
                  role: 'tutor',
                  text: generateDemoResponse(failedQuestion),
                  timestamp: Date.now(),
                  isDemo: true,
                }]);
                setApiError('');
                setFailedQuestion('');
              }}
              className="mt-2 font-semibold underline"
            >
              Show a sample answer instead
            </button>
          )}
        </div>
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
              placeholder="Ask Gemini"
              maxLength={4000}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
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
