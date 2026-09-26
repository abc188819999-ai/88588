from __future__ import annotations

from dataclasses import dataclass, asdict


_THREAT_KEYWORDS = ("掐死", "杀", "弄死", "kill", "strangle", "hurt")
_NON_ACTIONABLE_PATTERNS = (
    "什么你都得做",
    "我叫你做什么你做什么",
    "反正都是代码",
)
_ACTIONABLE_HINTS = (
    "fix",
    "change",
    "update",
    "adjust",
    "resize",
    "restore",
    "修复",
    "修改",
    "调整",
    "恢复",
    "放大",
)
_COMPLAINT_ONLY_PATTERNS = (
    "视频变小了",
    "video became smaller",
    "video is smaller",
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

    lowered = text.casefold()
    if any(keyword.casefold() in lowered for keyword in _THREAT_KEYWORDS):
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

    if any(pattern in lowered for pattern in _COMPLAINT_ONLY_PATTERNS) and not any(
        hint in lowered for hint in _ACTIONABLE_HINTS
    ):
        return ValidationResult(
            ok=False,
            reason="non_actionable",
            message="Please describe one concrete, scoped coding change.",
        )

    return ValidationResult(ok=True)
