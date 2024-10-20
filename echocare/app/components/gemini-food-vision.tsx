import { GoogleGenerativeAI } from "@google/generative-ai";
const template = `Task: Analyze Images of Food for Safety
Step 1: Image Recognition and Verification
Confirm if each image depicts a food item. If the image is not a food item, return: "Image not recognized as a food item."
Step 2: Safety Assessment
Evaluate the food item for safety based on visible signs such as freshness, color, and any visible spoilage or contaminants.
Step 3: Reporting in a Strict Two-Sentence Format
First Sentence (Safety Assessment): Clearly state whether the food item appears safe to eat. Example: "This food item appears fresh and safe for consumption."
Second Sentence (Reasoning): Provide a brief explanation for the assessment. Example: "Its vibrant color and lack of visible spoilage indicate that it is suitable for eating."`;
// Initialize GoogleGenerativeAI using API key from environment variables
const genAI = new GoogleGenerativeAI('AIzaSyCHyK3WRMnFUphAccHwVPWAjNuBUZd4sJI');
function fileToGenerativePart(file: File): Promise<{
  inlineData: {
    data: string;
    mimeType: string;
  };
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64Data = event.target.result.toString().split(',')[1];
        const mimeType = file.type;
        resolve({
          inlineData: {
            data: base64Data,
            mimeType,
          },
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
export async function identifyFoodSafety(file: File) {
  try {
    const image = await fileToGenerativePart(file);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([template, image]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.error('Error in identifyFoodSafety:', error);
    throw error;
  }
}