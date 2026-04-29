from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import json

from app.core.config import GEMINI_API_KEY
from app.core.ai_prompts import BATTLE_DIRECTOR_PROMPT

router = APIRouter()

# Khởi tạo Gemini với API Key của bạn
genai.configure(api_key=GEMINI_API_KEY)

# Định nghĩa cấu trúc dữ liệu Frontend gửi lên
class SimulationRequest(BaseModel):
    map_description: str
    current_grid_state: dict
    start_ms: int
    end_ms: int
    is_regenerate: bool = False

@router.post("/generate-timeline")
async def generate_timeline(req: SimulationRequest):
    try:
        # 1. Thay thế các biến động vào System Prompt
        system_prompt = BATTLE_DIRECTOR_PROMPT.replace("**MAP_DESCRIPTION_AND_EFFECTS**", req.map_description)
        system_prompt = system_prompt.replace("[CURRENT_GRID_STATE]", json.dumps(req.current_grid_state, indent=2))
        system_prompt = system_prompt.replace("[START_MS]", str(req.start_ms))
        system_prompt = system_prompt.replace("[END_MS]", str(req.end_ms))

        # 2. Cấu hình Model sử dụng mã Gemini 3.1 Pro mới nhất
        model = genai.GenerativeModel('gemini-3.1-pro-preview')

        # 3. Thiết lập User Message tùy theo trường hợp
        if req.is_regenerate:
            user_msg = "Regenerate the previous chunk. Make the actions more dynamic, brutal, and strictly follow the objective physics and personality traits. Do not repeat the exact same sequence. Output valid JSON only."
        else:
            user_msg = f"The previous chunk is approved. Generate the timeline for the NEXT 15 seconds (from millisecond {req.start_ms} to {req.end_ms}) based on the updated CURRENT_GRID_STATE. Continue the narrative seamlessly. Output valid JSON only."

        # 4. Gửi yêu cầu cho Gemini 3.1 Pro
        response = model.generate_content([system_prompt, user_msg])
        response_text = response.text

        # 5. Dọn dẹp JSON rác (vì AI đôi khi trả về kèm theo markdown ```json)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        # Trả về JSON chuẩn cho Frontend
        return json.loads(response_text)

    except Exception as e:
        print("LỖI AI:", str(e))
        raise HTTPException(status_code=500, detail=str(e))