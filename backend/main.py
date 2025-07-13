from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Local AI Interaction API")

class QueryRequest(BaseModel):
    prompt: str
    model_name: str = "default"

@app.post("/api/query")
async def process_query(request: QueryRequest):
    # 后续将集成LangChain处理模型调用
    return {
        "response": f"Processed query for model {request.model_name}: {request.prompt}",
        "status": "success"
    }

@app.get("/api/models")
async def list_models():
    # 后续将从配置文件或数据库加载模型列表
    return {
        "models": ["default", "llama2", "mistral"],
        "status": "success"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
