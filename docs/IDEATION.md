# Ideation Document: Adaptive Exam-Prep Tutor

## Concept Overview
A highly adaptive, AI-driven practice and mock-test platform tailored for major Indian competitive exams (JEE, NEET, UPSC, GATE). The platform scales personalized 1-on-1 tutoring by offering adaptive practice questions categorized by difficulty, grading them turn-by-turn, and generating comprehensive weak-topic reports at the end of each session.

## Core Value Proposition
- **For Students:** Personalized practice that identifies and targets weak areas, mimicking the experience of a dedicated private tutor but at a fraction of the cost.
- **For Coaching Centers (B2B):** A highly scalable solution to provide 1-on-1 mock testing and adaptive practice for thousands of students, offering a significant competitive advantage.
- **Fundability:** The test-prep market in India is massive and highly monetizable. Coaching centers and students are willing to pay for tools that demonstrably improve exam ranks.

## Core Mechanics (Re-skinned from Mock-Interview Module)
The architecture heavily reuses the logic from a mock-interview agent (~95% code reuse).

- **`record_answer_grade` (formerly `record_round_grade`):** 
  - The system presents a question.
  - The student inputs their answer (multiple choice, numerical, or short text depending on the exam).
  - The AI grades the answer instantly, providing reasoning and hints.
- **Adaptive Difficulty Engine:** 
  - If a student answers correctly, the next question in that topic increases in difficulty.
  - If a student answers incorrectly, the system explains the concept and the next question drops in difficulty or tests a foundational sub-topic.
- **Turn-by-turn Interaction:** The session feels like a chat with a tutor. Instead of "interview rounds", it's "practice rounds".
- **Post-Session Analytics (Weak-Topic Report):** 
  - Upon completing a set, the system aggregates the grades.
  - It generates a detailed report highlighting specific weak sub-topics (e.g., "Rotational Mechanics" in Physics, or "Organic Nomenclature" in Chemistry).
  - Suggests targeted study materials or specific question types to focus on next.

## Target Exams & Nuances
1. **JEE (Joint Entrance Examination - Engineering):** Requires complex multi-step problem solving. The tutor must understand the steps to reach a mathematical or physics solution.
2. **NEET (National Eligibility cum Entrance Test - Medical):** High volume of biology facts and chemistry concepts. The tutor focuses on recall speed and accuracy.
3. **UPSC (Civil Services):** Analytical and essay-type questions for Mains, objective for Prelims. The AI can be trained to evaluate essay structure and historical accuracy.
4. **GATE (Graduate Aptitude Test in Engineering):** Deep technical and conceptual understanding of engineering subjects.

## Presentation & User Flow (Reference: Mock-Interview Bot)
To maintain a realistic, proven, and high-converting user experience, the Exambot will directly adopt the presentation flow of the previous mock-interview bot:
1. **Landing Page:** A premium hero section explaining the value proposition (adaptive learning, specific exam focus) with a clear call-to-action to start practicing.
2. **Login/Signup Page:** A secure authentication page to track individual student progress, topic proficiencies, and history over time.
3. **Chat Area (The Core Interface):** A clean, distraction-free conversational UI where the actual practice happens. The bot presents questions, the student inputs answers, and the bot provides instant feedback. This area will be enhanced with LaTeX support to properly display complex mathematical and scientific equations.

## Proposed Features for MVP
1. **Exam Selection & Subject Focus:** User selects their target exam and specific subject/chapter for the session.
2. **Interactive Chat Interface:** A clean, distraction-free chat UI where questions are presented one by one. Math/Chemical equations rendered beautifully using LaTeX.
3. **Real-time Grading & Feedback:** Immediate explanation of the correct answer and the underlying concept if the student is wrong.
4. **Dynamic Difficulty Adjustment:** The core engine tracking the user's proficiency rating per topic.
5. **Session Summary Dashboard:** A visual breakdown of accuracy, time taken per question, and topics to revise.

## Technical Implementation Path
- **Reuse Existing Code:** Clone the mock-interview repository.
- **Rename Entities:** Refactor `record_round_grade` -> `record_answer_grade`. Refactor `Interview` -> `PracticeSession`.
- **Update Prompts:** Change the system prompts from acting as an "Interviewer" to acting as an "Exam Tutor". Provide it with knowledge about exam syllabus.
- **Frontend Adjustments:** Add LaTeX support for equations and update the UI to look more like a testing environment rather than a corporate interview.
