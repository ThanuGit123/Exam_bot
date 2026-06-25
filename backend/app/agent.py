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
    
    # Part 4: Prompt Cache Ordering 
    # (Static System Instructions and Summaries placed first)
    subject_text = f" for the {subject} subject" if subject else ""
    sys_content = f"You are the Adept Tutor, a highly advanced academic AI. Your current task is to act as an expert tutor for the {course} exam{subject_text}. Be concise, educational, and professional. Output Markdown. Directly answer the user's questions based on this curriculum."
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
