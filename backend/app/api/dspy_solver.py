import os
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas import DspyEvolvePromptResponse, DspySolveRequest, DspySolveResponse

try:
    import dspy
except ImportError:  # pragma: no cover - dependency/runtime guard
    dspy = None


router = APIRouter(prefix="/v1/dspy", tags=["dspy"])


if dspy is not None:
    _configured_model: str | None = None

    def _configure_dspy_from_env() -> str | None:
        global _configured_model
        openrouter_api_key = (os.getenv("OPENROUTER_API_KEY") or "").strip()
        openrouter_model = (os.getenv("OPENROUTER_MODEL") or "openai/gpt-4o-mini").strip()
        if not openrouter_api_key:
            return None
        if _configured_model != openrouter_model:
            dspy.configure(
                lm=dspy.LM(
                    f"openrouter/{openrouter_model}",
                    api_key=openrouter_api_key,
                    api_base="https://openrouter.ai/api/v1",
                )
            )
            _configured_model = openrouter_model
        return openrouter_api_key

    class DynamicRequirementSolver(dspy.Signature):
        """Solve the requirement based on the provided context and prompt."""

        training_data = dspy.InputField(desc="JSON context or examples for the task")
        requirement = dspy.InputField(desc="The specific prompt or task to execute")
        answer = dspy.OutputField(desc="The direct result of the requirement")


    class PromptEvolutionSignature(dspy.Signature):
        """Evolve and improve a prompt using provided training context."""

        training_data = dspy.InputField(desc="JSON context or examples for prompt evolution")
        prompt = dspy.InputField(desc="The original prompt to improve")
        updated_prompt = dspy.OutputField(desc="An improved prompt optimized for the task")


    class SimpleSolver(dspy.Module):
        def __init__(self):
            super().__init__()
            # Prefer CoT in DSPy for stronger reasoning quality on dynamic inputs.
            self.predictor = dspy.ChainOfThought(DynamicRequirementSolver)

        def forward(self, prompt: str, training_json: list[dict[str, Any]]) -> str:
            result = self.predictor(
                training_data=str(training_json),
                requirement=prompt,
            )
            return str(result.answer)


    class PromptEvolver(dspy.Module):
        def __init__(self):
            super().__init__()
            self.predictor = dspy.ChainOfThought(PromptEvolutionSignature)

        def forward(self, prompt: str, training_json: list[dict[str, Any]]) -> str:
            result = self.predictor(
                training_data=str(training_json),
                prompt=prompt,
            )
            return str(result.updated_prompt)


    solver = SimpleSolver()
    prompt_evolver = PromptEvolver()
else:
    solver = None
    prompt_evolver = None


@router.post(
    "/solve",
    response_model=DspySolveResponse,
    summary="Solve a requirement using DSPy",
    description=(
        "Runs the provided prompt against DSPy with the given training/context JSON and "
        "returns the generated final answer. Use this endpoint when you want task output "
        "directly from your prompt and examples."
    ),
)
async def solve_requirement(payload: DspySolveRequest):
    if solver is None:
        raise HTTPException(status_code=500, detail="dspy is not installed in backend environment")
    openrouter_api_key = _configure_dspy_from_env()
    if not openrouter_api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY is not set")

    try:
        result = solver(prompt=payload.prompt, training_json=payload.training_json)
        print(result)
        answer = str(result)
        return {"answer": answer}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post(
    "/evolve-prompt",
    response_model=DspyEvolvePromptResponse,
    summary="Improve a prompt using DSPy",
    description=(
        "Refines an existing prompt using the supplied training/context JSON and returns "
        "an optimized prompt. Use this endpoint when you want to improve prompt wording "
        "before running the actual solve flow."
    ),
)
async def evolve_prompt(payload: DspySolveRequest):
    if prompt_evolver is None:
        raise HTTPException(status_code=500, detail="dspy is not installed in backend environment")
    openrouter_api_key = _configure_dspy_from_env()
    if not openrouter_api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY is not set")

    try:
        updated_prompt = prompt_evolver(prompt=payload.prompt, training_json=payload.training_json)
        return {"updated_prompt": str(updated_prompt)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
