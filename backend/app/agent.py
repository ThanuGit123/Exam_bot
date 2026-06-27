import os
from dotenv import load_dotenv
load_dotenv()
from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI

# 1. State Definition
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    summary: str
    plan: str
    reflection: str

# Helper to dynamically route to the correct LLM
def get_llm(model_str: str):
    if model_str == "groq":
        return ChatOpenAI(
            api_key=os.getenv("GROQ_API_KEY", "mock_key"),
            base_url="https://api.groq.com/openai/v1",
            model="llama-3.1-8b-instant",
            streaming=True
        )
    elif model_str == "cerebras":
        return ChatOpenAI(
            api_key=os.getenv("CEREBRAS_API_KEY", "mock_key"),
            base_url="https://api.cerebras.ai/v1",
            model="llama3.1-8b",
            streaming=True
        )
    elif model_str == "mistral":
        return ChatOpenAI(
            api_key=os.getenv("MISTRAL_API_KEY", "mock_key"),
            base_url="https://api.mistral.ai/v1",
            model="mistral-small-latest",
            streaming=True
        )
    else:
        return ChatOpenAI(
            api_key=os.getenv("GROQ_API_KEY", "mock_key"),
            base_url="https://api.groq.com/openai/v1",
            model="llama-3.1-8b-instant",
            streaming=True
        )

# 2. Nodes
async def context_manager_node(state: AgentState, config: RunnableConfig):
    """Part 4: Context Management & Rolling Summary"""
    messages = state.get("messages", [])
    summary = state.get("summary", "")
    
    # If conversation is getting long, we would do a rolling summary here
    # For now, we simulate the context trimmer
    if len(messages) > 10:
        summary = "Older conversation has been summarized."
        
    return {"summary": summary}

async def plan_node(state: AgentState, config: RunnableConfig):
    """Part 5: Plan step"""
    # Placeholder for reasoning logic
    return {"plan": "Proceeding to answer user question."}

async def act_node(state: AgentState, config: RunnableConfig):
    """Part 5: Act step"""
    model_str = config.get("configurable", {}).get("model", "groq")
    course = config.get("configurable", {}).get("course", "General")
    subject = config.get("configurable", {}).get("subject", "")
    llm = get_llm(model_str)
    
    # 1. RAG Retrieval
    context_text = ""
    try:
        from langchain_mistralai import MistralAIEmbeddings
        from langchain_chroma import Chroma
        
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        DB_DIR = os.path.join(BASE_DIR, "chroma_db")
        
        if os.path.exists(DB_DIR):
            embeddings = MistralAIEmbeddings(api_key=os.getenv("MISTRAL_API_KEY"))
            vectorstore = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
            
            search_kwargs = {"k": 3}
            filter_dict = {}
            if course and course != "General":
                filter_dict["course"] = course
            if subject:
                filter_dict["subject"] = subject
            if filter_dict:
                search_kwargs["filter"] = filter_dict
                
            retriever = vectorstore.as_retriever(search_kwargs=search_kwargs)
            user_query = state["messages"][-1].content
            docs = await retriever.ainvoke(user_query)
            if docs:
                context_text = "\n\n".join([doc.page_content for doc in docs])
    except Exception as e:
        print(f"RAG Retrieval Error: {e}")
        pass
    
    # Pull the learning preferences from config
    learning_prefs = config.get("configurable", {}).get("learning_prefs", {})
    
    # Part 4: Prompt Cache Ordering 
    # (Static System Instructions and Summaries placed first)
    subject_text = f" for the {subject} subject" if subject else ""
    sys_content = f"You are the Adept Tutor, a highly advanced academic AI. Your current task is to act as an expert tutor for the {course} exam{subject_text}. Be concise, educational, and professional. Output Markdown. Directly answer the user's questions based on this curriculum."
    
    # Inject preferences dynamically
    if learning_prefs:
        pref_blocks = []
        if learning_prefs.get("pace") == "gentle":
            pref_blocks.append("- Pace (Gentle): Use fewer ideas per turn and confirm understanding before moving on.")
        elif learning_prefs.get("pace") == "fast":
            pref_blocks.append("- Pace (Fast): Cover more material quickly with fewer hand-holds.")
            
        if learning_prefs.get("style") == "example-first":
            pref_blocks.append("- Style (Example-first): Give a worked example first, then explain the principle.")
        elif learning_prefs.get("style") == "concept-first":
            pref_blocks.append("- Style (Concept-first): Explain the idea first, then illustrate with an example.")
        elif learning_prefs.get("style") == "practice-first":
            pref_blocks.append("- Style (Practice-first): Ask the student to try answering a quick question first before you explain.")
            
        if learning_prefs.get("level") == "foundation":
            pref_blocks.append("- Level (Foundation): Use plain language, define terms clearly, and provide heavy scaffolding.")
        elif learning_prefs.get("level") == "advanced":
            pref_blocks.append("- Level (Advanced): Skip the basics, use full academic terminology, and dive deep into complex nuances.")
            
        if pref_blocks:
            sys_content += "\n\nAdapting to the student:\n" + "\n".join(pref_blocks) + "\n(Note: These preferences are the default — stay in them every turn; embody them naturally, do not quote them back.)"
    
    if context_text:
        sys_content += f"\n\nHere is the relevant curriculum context to answer the user's question. Base your answer ONLY on this context. If it's not relevant, use your best knowledge but state it's outside the provided curriculum.\n--- CONTEXT ---\n{context_text}\n--- END CONTEXT ---"

    if state.get("summary"):
        sys_content += f"\n\nContext Summary: {state['summary']}"
        
    system_prompt = SystemMessage(content=sys_content)
    
    messages = [system_prompt] + list(state["messages"])
    
    # If using mock keys, bypass LLM
    api_key = os.getenv(f"{model_str.upper()}_API_KEY", "mock_key")
    if api_key == "mock_key" or api_key.startswith("your_"):
        return {"messages": [AIMessage(content=f"[{model_str.upper()} ENGINE] Simulated streaming response from LangGraph agent. Provide real API key in backend .env to test real LLM streaming.")]}

    # Generate response
    response = await llm.ainvoke(messages)
    return {"messages": [response]}

async def reflect_node(state: AgentState, config: RunnableConfig):
    """Part 5: Reflect / System Scoring step"""
    # Here we would score the user's answer
    # For now, we just pass
    return {"reflection": "Score: 100"}

# 3. Build Graph
builder = StateGraph(AgentState)

builder.add_node("context_manager", context_manager_node)
builder.add_node("plan", plan_node)
builder.add_node("act", act_node)
builder.add_node("reflect", reflect_node)

builder.add_edge(START, "context_manager")
builder.add_edge("context_manager", "plan")
builder.add_edge("plan", "act")
builder.add_edge("act", "reflect")
builder.add_edge("reflect", END)

# Part 5: Checkpointer
checkpointer = MemorySaver()
agent_executor = builder.compile(checkpointer=checkpointer)
