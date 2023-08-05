import os
from google.cloud import language_v1

def set_google_application_credentials(file_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = file_path

file_path = "./cred.json"
set_google_application_credentials(file_path)

def sample_classify_text(text_content):
    # (Same as before, no changes needed)

def question_tagging(request):
    # Extract the JSON payload from the request object
    request_json = request.get_json()
    
    # Check if 'question' key exists in the JSON payload
    if "question" not in request_json:
        return {"error": "Question not found in JSON payload"}

    question = request_json["question"]
    category_list = sample_classify_text(question)

    # Return the response in the appropriate format
    return {"response": category_list}
