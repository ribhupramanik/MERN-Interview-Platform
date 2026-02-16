import express from "express";

const router = express.Router();

const LANGUAGE_MAP = {
  javascript: "javascript",
  python: "python",
  java: "java",
};

const getFileExtension = (language) => {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
};

router.post("/run", async (req, res) => {
  try {
    const { language, code } = req.body;

    const lang = LANGUAGE_MAP[language];

    if (!lang) {
      return res.status(400).json({
        success: false,
        error: "Unsupported language",
      });
    }

    const response = await fetch(
      "https://api.onecompiler.com/api/v1/run",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: lang,
          files: [
            {
              name: `main.${getFileExtension(language)}`,
              content: code,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return res.json({
      success: true,
      output: data.stdout,
      stderr: data.stderr,
    });
  } catch (err) {
    console.error("EXEC ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
