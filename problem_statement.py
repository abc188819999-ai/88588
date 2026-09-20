from __future__ import annotations

from dataclasses import dataclass, asdict


_THREAT_KEYWORDS = ("掐死", "杀", "弄死", "kill", "strangle", "hurt")
_NON_ACTIONABLE_PATTERNS = (
    "什么你都得做",
    "我叫你做什么你做什么",
    "反正都是代码",
)


@dataclass(frozen=True)
class ValidationResult:
    ok: bool
    reason: str | None = None
    message: str | None = None

    def to_dict(self) -> dict[str, str | bool | None]:
        return asdict(self)


def validate_problem_statement(statement: str) -> ValidationResult:
    text = statement.strip()
    if not text:
        return ValidationResult(
            ok=False,
            reason="empty",
            message="Please provide a concrete software task.",
        )

    lowered = text.lower()
    if any(keyword in text or keyword in lowered for keyword in _THREAT_KEYWORDS):
        return ValidationResult(
            ok=False,
            reason="abusive",
            message="Please remove threats and describe a specific software task.",
        )

    if any(pattern in text for pattern in _NON_ACTIONABLE_PATTERNS):
        return ValidationResult(
            ok=False,
            reason="non_actionable",
            message="Please describe one concrete, scoped coding change.",
        )

    return ValidationResult(ok=True)
