const API_URL = import.meta.env.VITE_API_URL;

export async function executeCode(language, code) {
  try {
    const response = await fetch(`${API_URL}/execute/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        code,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.error || data.stderr,
      };
    }

    return {
      success: true,
      output: data.output || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
