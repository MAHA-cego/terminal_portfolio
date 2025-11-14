'use client'

import { useState, useRef, useEffect } from "react";

export default function Input({ onSubmit }: { onSubmit: (command: string) => void }) {
  const [input, setInput] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  const [caret, setCaret] = useState<{ top: number; left: number }>({
     top: 0,
    left: 16,
   });

   useEffect(() => {
    textareaRef.current?.focus();
    setFocused(true);
    updateCaretPosition();
   }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    updateCaretPosition();
  }, [input]);

  
  const updateCaretPosition = () => {
    if (!textareaRef.current || !mirrorRef.current) return;

    const textarea = textareaRef.current;
    const mirror = mirrorRef.current;

    const caretIndex = textarea.selectionStart;
    const beforeCaret = textarea.value.slice(0, caretIndex);

    if (beforeCaret.length === 0) {
      const paddingLeft = parseFloat(getComputedStyle(textarea).paddingLeft);
      setCaret({ top: 0, left: paddingLeft});
      return;
    }

    mirror.textContent = beforeCaret;

    const rect = mirror.getBoundingClientRect();

    setCaret({
      left: rect.width,
      top: rect.height - parseFloat(getComputedStyle(textarea).lineHeight),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(input);
      setInput("");
      return
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    updateCaretPosition();
  }

  return (
        <form className="relative w-full" onSubmit={(e) => {
            e.preventDefault();
            onSubmit(input);
            setInput("");
        }}>
          <span className="absolute top-0 left-0">&gt;</span>
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onClick={updateCaretPosition}
              onKeyUp={updateCaretPosition}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="border-none outline-none bg-transparent text-inherit w-full resize-none overflow-hidden pl-4"
              rows={1}
              style={{ caretColor: "transparent" }}
              spellCheck={false}
            />
              <span className="absolute cursor-blink"
              style={{
                top: caret.top + "px",
                left: caret.left + "px",
                opacity: focused ? 1 : 0,
                pointerEvents: "none"
              }}
              >
                _
              </span>
            <div
            ref={mirrorRef}
            className="invisible whitespace-pre-wrap wrap-break-words absolute left-0 top-0 pl-4"
            style={{
              font: "inherit",
              letterSpacing: "inherit",
              whiteSpace: "pre-wrap",
            }}></div>
          </div>
        </form>
  );
}