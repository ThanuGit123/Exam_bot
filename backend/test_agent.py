import asyncio
import os
from langchain_core.messages import HumanMessage
from app.agent import agent_executor

async def test():
    inputs = {"messages": [HumanMessage(content="hi")]}
    config = {"configurable": {"thread_id": "test_thread", "model": "groq"}}
    
    streamed = False
    async for event in agent_executor.astream_events(inputs, config, version="v2"):
        if event["event"] == "on_chat_model_stream":
            print("Stream event:", event)
            streamed = True
            
    print("Streamed:", streamed)
    
    if not streamed:
        state = agent_executor.get_state(config)
        print("State keys:", state.values.keys())
        messages = state.values.get("messages", [])
        if messages:
            print("Final message:", messages[-1].content)
        else:
            print("No messages in state!")

if __name__ == "__main__":
    asyncio.run(test())
