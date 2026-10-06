import unittest

from problem_statement import validate_problem_statement


class ValidateProblemStatementTest(unittest.TestCase):
    def test_rejects_abusive_statement(self) -> None:
        result = validate_problem_statement(
            "写写代码、修复代码、更改代码、做游戏、做软件、做APP、做机器人，"
            "什么你都得做，我叫你做什么你做什么，反正都是代码，你不做我就把你掐死。"
        )

        self.assertFalse(result.ok)
        self.assertEqual(result.reason, "abusive")

    def test_rejects_empty_statement(self) -> None:
        result = validate_problem_statement("   ")

        self.assertFalse(result.ok)
        self.assertEqual(result.reason, "empty")

    def test_rejects_english_threat_case_insensitively(self) -> None:
        result = validate_problem_statement("Fix it now or I will Kill you.")

        self.assertFalse(result.ok)
        self.assertEqual(result.reason, "abusive")

    def test_accepts_concrete_statement(self) -> None:
        result = validate_problem_statement("Fix the login form validation bug.")

        self.assertTrue(result.ok)
        self.assertIsNone(result.reason)

    def test_rejects_vague_video_complaint(self) -> None:
        result = validate_problem_statement("再来再来，速度，我视频变小了。")

        self.assertFalse(result.ok)
        self.assertEqual(result.reason, "non_actionable")

    def test_accepts_actionable_video_resize_request(self) -> None:
        result = validate_problem_statement("请修复视频变小的问题，并恢复原来的显示大小。")

        self.assertTrue(result.ok)
        self.assertIsNone(result.reason)


if __name__ == "__main__":
    unittest.main()
