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


if __name__ == "__main__":
    unittest.main()
