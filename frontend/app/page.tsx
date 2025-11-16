"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ResponseData {
  summary: string;
  key_points: string[];
  quiz: Array<{
    question: string;
    options: string[];
    answer: string;
  }>;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [shownAnswers, setShownAnswers] = useState<Record<number, boolean>>({});
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    setShownAnswers({});
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    // Set loading state to true
    setIsLoading(true);
    
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", file);

      // Make POST request to backend endpoint
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      // Parse JSON response
      const data: ResponseData = await response.json();
      
      // Set the response data to state
      setResponseData(data);
      
    } catch (error) {
      // Error handling
      console.error("Error uploading file:", error);
      alert(`Failed to process the file: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      // Always set loading to false after request completes
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🧠 SmartNotes AI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload your documents and get AI-powered summaries, key points, and quizzes
          </p>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
              ${isDragging 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              }
              hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-700
            `}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.txt,.doc,.docx"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="text-6xl">📄</div>
                <div>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    {file ? file.name : "Drag and drop your file here"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    or click to browse
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Supported formats: PDF, TXT, DOC, DOCX
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-12">
          <Button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            size="lg"
            className="px-8 py-6 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Generating...
              </>
            ) : (
              "Generate Notes"
            )}
          </Button>
        </div>

        {/* Results Section */}
        {responseData && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              📋 Results
            </h2>

            {/* Summary Section */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>A concise overview of your document</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {responseData.summary}
                </p>
              </CardContent>
            </Card>

            {/* Key Points Section */}
            <Card>
              <CardHeader>
                <CardTitle>Key Points</CardTitle>
                <CardDescription>Main takeaways from your document</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {responseData.key_points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quiz Section */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz</CardTitle>
                <CardDescription>Test your understanding</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {responseData.quiz.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <span className="font-medium">Q{index + 1}: {item.question}</span>
                      </AccordionTrigger>
                      {/* ... ADD THIS NEW BLOCK ... */}
<AccordionContent>
  <div className="pt-2 pb-4 px-1 space-y-3">
    {/* This lists the options WITHOUT highlighting */}
    <ul className="space-y-2">
      {item.options.map((option, optIndex) => (
        <li
          key={optIndex}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"
        >
          {option}
        </li>
      ))}
    </ul>

    {/* This is the "Show Answer" button */}
    {!shownAnswers[index] && (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShownAnswers(prev => ({ ...prev, [index]: true }))}
      >
        Show Answer
      </Button>
    )}

    {/* This will ONLY appear after the button is clicked */}
    {shownAnswers[index] && (
      <p className="mt-4 font-bold text-green-600 dark:text-green-400">
        Correct Answer: {item.answer}
      </p>
    )}
  </div>
</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
