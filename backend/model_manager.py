from langchain.llms import LlamaCpp
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
import os

class ModelManager:
    def __init__(self):
        self.models = {
            "default": "./models/llama-2-7b-chat.gguf",
            "llama2": "./models/llama-2-7b-chat.gguf",
            "mistral": "./models/mistral-7b-instruct-v0.1.gguf"
        }
        self.current_model = None
        self.callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])

    def load_model(self, model_name: str = "default"):
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")

        model_path = self.models[model_name]
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file {model_path} not found")

        # 配置模型参数
        self.current_model = LlamaCpp(
            model_path=model_path,
            callback_manager=self.callback_manager,
            verbose=True,
            n_ctx=2048,
            temperature=0.7,
            max_tokens=512,
            top_p=1
        )
        return self.current_model

    def generate_response(self, prompt: str, model_name: str = "default"):
        if not self.current_model or self.models.get(model_name) != self.models.get(self.current_model.model_path):
            self.load_model(model_name)

        return self.current_model(prompt)

# 单例模式实例化
model_manager = ModelManager()
